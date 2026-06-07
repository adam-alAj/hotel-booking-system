import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HotelCard from '../components/customer/HotelCard';
import { hotelAPI } from '../services/customerApi';
import './css/SearchResults.css';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchMetadata, setSearchMetadata] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get('name') || '';
  const city = queryParams.get('city') || '';
  const minRating = queryParams.get('minRating') || '';
  const maxRating = queryParams.get('maxRating') || '';

  useEffect(() => {
    setPage(0);
    performSearch(0);
  }, [location.search]);

  const performSearch = async (pageNum) => {
    try {
      setLoading(true);
      setError('');

      const searchRequest = {
        name: name || null,
        city: city || null,
        minRating: minRating ? parseFloat(minRating) : null,
        maxRating: maxRating ? parseFloat(maxRating) : null,
        isActive: true,
        page: pageNum,
        size: 9,
        sortBy: 'averageRating',
        sortDirection: 'desc'
      };

      const response = await hotelAPI.searchHotels(searchRequest);

      setHotels(response.data.content);
      setTotalPages(response.data.totalPages);
      setSearchMetadata(response.data.searchMetadata);
      setPage(response.data.pageNumber);
    } catch (err) {
      setError('Failed to search hotels. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    performSearch(newPage);
  };

  const clearFilters = () => {
    navigate('/search');
  };

  const hasActiveFilters = name || city || minRating || maxRating;

  return (
      <div className="csearch-results-page">
        <div className="csearch-header-section">
          <div className="csearch-header-content">
            <h1>Search Results</h1>

            {hasActiveFilters && (
                <div className="cactive-filters">
                  <span className="cfilters-label">Active Filters:</span>
                  {name && <span className="cfilter-tag">Name: "{name}"</span>}
                  {city && <span className="cfilter-tag">City: {city}</span>}
                  {minRating && <span className="cfilter-tag">Min Rating: {minRating}+</span>}
                  {maxRating && <span className="cfilter-tag">Max Rating: {maxRating}</span>}
                  <button onClick={clearFilters} className="cclear-filters-btn">Clear All</button>
                </div>
            )}

            {searchMetadata && (
                <p className="cresults-count">
                  Found {searchMetadata.totalResults} hotel{searchMetadata.totalResults !== 1 ? 's' : ''}
                </p>
            )}
          </div>
        </div>

        <div className="csearch-results-content">
          {loading ? (
              <div className="cloading">Searching hotels...</div>
          ) : error ? (
              <div className="cerror">{error}</div>
          ) : hotels.length === 0 ? (
              <div className="cno-results">
                <div className="cno-results-icon">🏨</div>
                <h3>No hotels found</h3>
                <p>Try adjusting your search criteria</p>
                <button onClick={clearFilters} className="creset-search-btn">
                  View All Hotels
                </button>
              </div>
          ) : (
              <>
                <div className="chotels-grid">
                  {hotels.map(hotel => (
                      <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
                </div>

                {totalPages > 1 && (
                    <div className="cpagination">
                      <button
                          onClick={() => handlePageChange(page - 1)}
                          disabled={page === 0}
                          className="cpage-btn"
                      >
                        Previous
                      </button>
                      <span className="cpage-info">
                  Page {page + 1} of {totalPages}
                </span>
                      <button
                          onClick={() => handlePageChange(page + 1)}
                          disabled={page >= totalPages - 1}
                          className="cpage-btn"
                      >
                        Next
                      </button>
                    </div>
                )}
              </>
          )}
        </div>
      </div>
  );
};

export default SearchResults;