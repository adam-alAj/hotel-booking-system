import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Table/Table';
import { 
  Star, 
  Search, 
  Filter, 
  Trash2, 
  ArrowUpDown, 
  Hotel,
  AlertTriangle,
  Loader2,
  MessageCircle,
  ChevronDown,
  Building2
} from 'lucide-react';
import { getRatingsByHotel, deleteRating, getRatingSummary } from '../../api/ratingApi';
import { getHotels } from '../../api/hotelApi';
import './Ratings.css';

const StarRating = ({ rating }) => (
  <div className="stars-wrapper">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? '#f59e0b' : 'none'}
        color={i < rating ? '#f59e0b' : '#cbd5e0'}
      />
    ))}
    <span className="rating-num">({rating?.toFixed(1) || '0.0'})</span>
  </div>
);

const getAccentClass = (rating) => {
  if (rating >= 8) return 'review-card accent-green';
  if (rating < 5) return 'review-card accent-red';
  return 'review-card';
};

const Ratings = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const hotelData = await getHotels(0, 100);
        setHotels(hotelData.content || []);
      } catch (err) {
        console.error('Failed to fetch hotels for ratings:', err);
      }
    };
    fetchInitialData();
  }, []);

  const fetchData = async (hotelId) => {
    if (!hotelId) return;
    setLoading(true);
    setError(null);
    try {
      const [ratingsData, summaryData] = await Promise.all([
        getRatingsByHotel(hotelId),
        getRatingSummary(hotelId)
      ]);
      setRatings(ratingsData || []);
      setSummary(summaryData);
    } catch (err) {
      console.error('Failed to fetch ratings:', err);
      setError('Could not retrieve hotel reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedHotel) {
      fetchData(selectedHotel);
    }
  }, [selectedHotel]);

  const handleDelete = async (id) => {
    if (window.confirm(`Permanently remove review #${id}?`)) {
      try {
        await deleteRating(id);
        fetchData(selectedHotel);
      } catch (err) {
        alert('Action failed: Cannot delete this review record.');
      }
    }
  };

  return (
    <Layout title="Ratings & Community Feedback">
      <div className="ratings-page-wrapper">

        {/* ── Selector Panel ── */}
        <div className="selector-panel">
          <label className="selector-label" htmlFor="hotel-select">
            <Hotel size={15} className="selector-label-icon" />
            <span>Select Hotel</span>
          </label>

          <div className="select-control-wrapper">
            <select
              id="hotel-select"
              className="hotel-select-dropdown"
              onChange={(e) => setSelectedHotel(e.target.value)}
              defaultValue=""
            >
              <option value="" disabled>Choose a property to moderate reviews…</option>
              {hotels.map(h => (
                <option key={h.id} value={h.id}>{h.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="select-chevron" aria-hidden="true" />
          </div>

          {summary && (
            <div className="rating-summary-strip">
              <div className="summary-item">
                <Star size={13} fill="#f59e0b" color="#f59e0b" />
                <span>Avg: <strong>{summary.averageRating?.toFixed(1)}</strong></span>
              </div>
              <div className="summary-divider" />
              <div className="summary-item">
                <MessageCircle size={13} />
                <span>Total: <strong>{summary.totalReviews}</strong></span>
              </div>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        {!selectedHotel ? (
          <div className="empty-state-card">
            <div className="empty-state-icon-wrap">
              <Building2 size={28} className="empty-state-icon" />
            </div>
            <h3 className="empty-state-title">No Property Selected</h3>
            <p className="empty-state-subtitle">
              Please select a hotel from the dropdown above to view and manage guest ratings and reviews.
            </p>
          </div>
        ) : error ? (
          <div className="error-state-inline">
            <AlertTriangle size={24} color="#ef4444" />
            <p>{error}</p>
            <button onClick={() => fetchData(selectedHotel)}>Retry</button>
          </div>
        ) : loading ? (
          <div className="loading-state">
            <Loader2 size={28} className="spinner" />
            <p>Loading reviews…</p>
          </div>
        ) : ratings.length === 0 ? (
          <div className="empty-state-card">
            <div className="empty-state-icon-wrap">
              <Star size={28} className="empty-state-icon" />
            </div>
            <h3 className="empty-state-title">No Reviews Yet</h3>
            <p className="empty-state-subtitle">
              This property has no guest reviews to display. Check back later.
            </p>
          </div>
        ) : (
          <div className="reviews-list">
            {ratings.map((r) => (
              <div key={r.id} className={getAccentClass(r.rating)}>
                <div className="review-card-header">
                  <span className="review-reviewer">{r.userName || 'Guest User'}</span>
                  {r.date && <span className="review-date">{r.date}</span>}
                </div>
                <StarRating rating={r.rating} />
                <p className="review-comment">{r.comment || 'No comment provided.'}</p>
                <div className="review-card-footer">
                  <button
                    className="icon-btn delete"
                    title="Delete Review"
                    onClick={() => handleDelete(r.id)}
                  >
                    <Trash2 size={15} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Ratings;