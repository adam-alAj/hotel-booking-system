import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import {
  Search,
  Filter,
  Trash2,
  Star,
  MapPin,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader,
  Upload,
  MoreVertical,
  CheckCircle2,
  MinusCircle
} from 'lucide-react';
import { getHotels, deleteHotel } from '../../api/hotelApi';
import './HotelInventory.css';

/**
 * UTILITY: Custom Star Rating Component
 * Shows filled stars proportional to the score
 */
const StarRating = ({ rating, size = 14 }) => {
  const fullStars = Math.floor(rating);
  return (
    <div className="star-rail">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={`star-icon ${i < fullStars ? 'star-filled' : 'star-empty'}`}
        />
      ))}
    </div>
  );
};


/**
 * SUB-COMPONENT: Filter Dropdown
 */
const FilterDropdown = ({ isOpen, onClose, onApply, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters);

  const handleReset = () => {
    const resetFilters = { status: 'all', minRating: 0, location: '' };
    setFilters(resetFilters);
    onApply(resetFilters);
    onClose();
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="filter-overlay" onClick={onClose}></div>
      <div className="filter-panel">
        <div className="filter-panel-header">
          <h3 className="filter-panel-title">Refine Search</h3>
          <button onClick={onClose} className="filter-close-button"><X size={18} /></button>
        </div>

        <div className="filter-panel-content">
          <div className="filter-section">
            <label className="filter-label">Status</label>
            <div className="filter-status-buttons">
              {['all', 'active', 'disabled'].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilters({ ...filters, status: s })}
                  className={`filter-status-button ${filters.status === s ? 'filter-status-button-active' : ''}`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-rating-header">
              <label className="filter-label">Min Rating</label>
              <span className="filter-rating-value">{filters.minRating.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
              className="filter-slider"
            />
          </div>
        </div>

        <div className="filter-panel-footer">
          <button onClick={handleReset} className="filter-button filter-button-reset">Reset</button>
          <button onClick={handleApply} className="filter-button filter-button-apply">Apply</button>
        </div>
      </div>
    </>
  );
};

/**
 * SUB-COMPONENT: Delete Confirmation Modal
 */
const DeleteConfirmationModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="delete-modal-overlay" onClick={onCancel} />
      <div className="delete-modal-content">
        <div className="delete-modal-icon-container">
          <AlertTriangle size={28} className="delete-modal-icon" />
        </div>
        <h2 className="delete-modal-title">Delete Hotel?</h2>
        <p className="delete-modal-message">
          This action is permanent and cannot be undone. The hotel and all its data will be removed.
        </p>
        <div className="delete-modal-buttons">
          <button onClick={onCancel} className="delete-modal-button delete-modal-button-cancel">Cancel</button>
          <button onClick={onConfirm} className="delete-modal-button delete-modal-button-confirm">Delete</button>
        </div>
      </div>
    </>
  );
};

/**
 * SUB-COMPONENT: Error Modal
 */
const ErrorModal = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="error-modal-overlay" onClick={onClose} />
      <div className="error-modal-content">
        <div className="error-modal-icon-container">
          <AlertTriangle size={28} className="error-modal-icon" />
        </div>
        <h2 className="error-modal-title">Action Failed</h2>
        <p className="error-modal-message">{message}</p>
        <div className="error-modal-buttons">
          <button onClick={onClose} className="error-modal-button error-modal-button-close">Close</button>
        </div>
      </div>
    </>
  );
};

const HotelInventory = () => {
  // ============ State Management ============
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state - backend pagination tracking
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', minRating: 0, location: '' });

  // UI state
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [showDeleteErrorModal, setShowDeleteErrorModal] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  // ============ Determine if filtering is active ============
  const hasActiveFilters = searchTerm.trim() !== '' || filters.status !== 'all' || filters.minRating > 0;

  // ============ API Fetch - Triggered when page or filters change ============
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const data = await getHotels(currentPage, pageSize);
        setHotels(data.content || []);
        setTotalElements(data.totalElements || 0);
        setTotalPages(data.totalPages || 0);
        setError(null);
      } catch (err) {
        setError('Failed to load hotels.');
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [currentPage, pageSize]); // Fetch when page or size changes

  // ============ Apply Filters and Search (client-side) ============
  useEffect(() => {
    let result = hotels;

    // Apply search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        h => h.name?.toLowerCase().includes(lowerSearch) ||
          h.city?.toLowerCase().includes(lowerSearch)
      );
    }

    // Apply status filter
    if (filters.status === 'active') {
      result = result.filter(h => h.isActive);
    } else if (filters.status === 'disabled') {
      result = result.filter(h => !h.isActive);
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter(h => (h.averageRating || 0) >= filters.minRating);
    }

    setFilteredHotels(result);
  }, [hotels, searchTerm, filters]); // Reapply filters when hotels or filters change

  // ============ Pagination Calculations ============
  const safeTotal = hasActiveFilters ? filteredHotels.length : totalElements;
  const displayedTotal = hasActiveFilters ? filteredHotels.length : totalElements;
  const startItem = displayedTotal === 0 ? 0 : (currentPage * pageSize) + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, displayedTotal);
  const displayTotalPages = hasActiveFilters
    ? Math.ceil(filteredHotels.length / pageSize)
    : totalPages;

  // Get current page data
  let currentPageData;
  if (hasActiveFilters) {
    // For filtered results, paginate locally
    const pageStart = currentPage * pageSize;
    const pageEnd = pageStart + pageSize;
    currentPageData = filteredHotels.slice(pageStart, pageEnd);
  } else {
    // For unfiltered results, use backend-paginated data
    currentPageData = hotels;
  }

  // ============ Handler: Search ============
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page
  };

  // ============ Handler: Apply Filters ============
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(0); // Reset to first page
    setShowFilterDropdown(false);
  };

  // ============ Handler: Delete ============
  const handleDelete = (id) => {
    setDeleteTargetId(id);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteHotel(deleteTargetId);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
      // Refetch current page
      if (hasActiveFilters) {
        // If filters are active, current data will be recomputed
        setCurrentPage(0);
      } else {
        // If no filters, refetch from API
        setCurrentPage(0);
      }
    } catch (err) {
      const failureMessage = err.response?.data?.message || err.message || 'An unexpected error occurred.';
      setDeleteErrorMessage(failureMessage);
      setShowDeleteErrorModal(true);
      setShowDeleteModal(false);
      setDeleteTargetId(null);
    }
  };

  // ============ Handler: Pagination Controls ============
  const goToPage = (pageNum) => {
    if (pageNum >= 0 && pageNum < displayTotalPages) {
      setCurrentPage(pageNum);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < displayTotalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Layout title="Hotel Inventory">
      <div className="p-4">
        {/* Unified Horizontal Toolbar */}
        <div className="toolbar-container">
          <div className="search-input-wrapper">
            <Search className="search-input-icon" />
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search properties..."
              className="search-input"
            />
          </div>
          <div className="relative">
            <button onClick={() => setShowFilterDropdown(!showFilterDropdown)} className={`refine-button ${filters.status !== 'all' || filters.minRating > 0 ? 'refine-button-active' : ''}`}>
              <Filter size={16} /> <span>Refine</span>
              {(filters.status !== 'all' || filters.minRating > 0) && <span className="refine-badge"></span>}
            </button>
            <FilterDropdown isOpen={showFilterDropdown} onClose={() => setShowFilterDropdown(false)} onApply={handleApplyFilters} currentFilters={filters} />
          </div>
        </div>

        {/* Compact Table */}
        <div className="table-container">
          <table className="table-element">
            <thead className="table-header-row">
              <tr>
                <th className="table-header-cell">Hotel</th>
                <th className="table-header-cell">Guest Rating</th>
                <th className="table-header-cell">Admin Status</th>
                <th className="table-header-cell text-center">Controls</th>
              </tr>
            </thead>
            <tbody>
              {currentPageData.map((hotel) => (
                <tr key={hotel.id} className="table-body-row">
                  <td className="table-cell">
                    <div className="hotel-name-cell">
                      <span className="hotel-name-text">{hotel.name || 'Untitled Hotel'}</span>
                      <span className="hotel-city-text">{hotel.city || '—'}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="rating-container">
                      <StarRating rating={hotel.averageRating || 0} />
                      <span className="rating-badge">
                        {(hotel.averageRating || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="table-cell">
                    {hotel.isActive ? (
                      <span className="status-badge status-active pulse-ring-active">
                        <div className="status-dot status-dot-active" /> ACTIVE
                      </span>
                    ) : (
                      <span className="status-badge status-disabled">
                        <div className="status-dot status-dot-disabled" /> DISABLED
                      </span>
                    )}
                  </td>
                  <td className="table-cell">
                    <div className="action-buttons-container">
                      <button onClick={() => handleDelete(hotel.id)} className="action-button delete-button" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Unified Pagination Footer */}
          {displayTotalPages > 0 && (
            <div className="pagination-footer">
              <p className="pagination-info">
                Showing <span className="pagination-info-number">{startItem}</span> to <span className="pagination-info-number">{endItem}</span> of <span className="pagination-info-total">{safeTotal}</span>
              </p>
              <div className="pagination-controls">
                <button
                  disabled={currentPage === 0}
                  onClick={goToPreviousPage}
                  className="pagination-button"
                  title="Previous page"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="pagination-page-numbers">
                  {[...Array(displayTotalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i)}
                      className={`pagination-page-button ${currentPage === i ? 'pagination-page-button-active' : ''}`}
                      title={`Go to page ${i + 1}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage >= displayTotalPages - 1}
                  onClick={goToNextPage}
                  className="pagination-button"
                  title="Next page"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal isOpen={showDeleteModal} onConfirm={handleConfirmDelete} onCancel={() => { setShowDeleteModal(false); setDeleteTargetId(null); }} />
      <ErrorModal isOpen={showDeleteErrorModal} message={deleteErrorMessage} onClose={() => setShowDeleteErrorModal(false)} deleteError={true} />
    </Layout>
  );
};

export default HotelInventory;
