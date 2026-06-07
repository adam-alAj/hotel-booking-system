import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingAPI } from '../services/customerApi';
import ExtensionModal from '../components/customer/ExtensionModal';
import PaymentModal from '../components/customer/PaymentModal';
import './css/MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);
  const [extendingBooking, setExtendingBooking] = useState(null);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [payingBooking, setPayingBooking] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getMyHistory();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setCancellingId(bookingId);
    try {
      await bookingAPI.cancelBooking(bookingId);
      await fetchBookings();
    } catch (err) {
      alert('Failed to cancel booking: ' + (err.response?.data?.message || 'Unknown error'));
    } finally {
      setCancellingId(null);
    }
  };

  const handleExtend = (booking) => {
    setExtendingBooking(booking);
    setShowExtensionModal(true);
  };

  const handleExtensionSuccess = async () => {
    setShowExtensionModal(false);
    setExtendingBooking(null);
    await fetchBookings();
  };

  const handlePayNow = (booking) => {
    setPayingBooking(booking);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async () => {
    setShowPaymentModal(false);
    setPayingBooking(null);
    await fetchBookings(); // Refresh bookings to update status from PENDING to CONFIRMED
  };

  const getStatusStyle = (status) => {
    const styles = {
      CONFIRMED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: 'rgba(16, 185, 129, 0.3)' },
      PENDING: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: 'rgba(245, 158, 11, 0.3)' },
      CANCELLED: { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: 'rgba(239, 68, 68, 0.3)' },
      COMPLETED: { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', border: 'rgba(59, 130, 246, 0.3)' },
      EXPIRED: { bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af', border: 'rgba(107, 114, 128, 0.3)' },
    };
    return styles[status] || { bg: 'rgba(255,255,255,0.1)', color: '#ffffff', border: 'rgba(255,255,255,0.2)' };
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="c-my-bookings-page">
        <div className="c-bookings-container">
          <div className="c-loading-state">
            <div className="c-spinner"></div>
            <p>Loading your bookings...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="c-my-bookings-page">
        <div className="c-bookings-container">
          <div className="c-error-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <p>{error}</p>
            <button onClick={fetchBookings} className="c-retry-btn">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="c-my-bookings-page">
      <div className="c-bookings-container">
        {/* Header */}
        <div className="c-page-header">
          <div className="c-header-cont">
            <h1>My Bookings</h1>
            <p>Manage your reservations and travel plans</p>
          </div>
          <Link to="/" className="c-browse-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Browse Hotels
          </Link>
        </div>
        
        {bookings.length === 0 ? (
          <div className="c-no-bookings">
            <div className="c-empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4"/>
              </svg>
            </div>
            <h3>No bookings yet</h3>
            <p>Start your journey by exploring our curated collection of luxury hotels.</p>
            <Link to="/" className="c-cta-btn">Discover Stays</Link>
          </div>
        ) : (
          <div className="c-bookings-list">
            {bookings.map(booking => {
              const statusStyle = getStatusStyle(booking.status);
              const isExtendable = booking.status === 'CONFIRMED';
              const isPending = booking.status === 'PENDING';
              const today = new Date();
              const checkInDate = new Date(booking.checkInDate);
              const isPastCheckIn = checkInDate < today;
              
              return (
                <div key={booking.id} className="c-booking-card">
                  {/* Card Header */}
                  <div className="c-booking-card-header">
                    <div className="c-hotel-info">
                      <h3>{booking.hotelName}</h3>
                      <span className="c-room-type">{booking.roomTypeName} • {booking.capacity}</span>
                    </div>
                    <div 
                      className="c-status-badge"
                      style={{ 
                        background: statusStyle.bg,
                        color: statusStyle.color,
                        borderColor: statusStyle.border
                      }}
                    >
                      <span className="c-status-dot" style={{ background: statusStyle.color }}></span>
                      {booking.status}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="c-booking-timeline">
                    <div className="c-timeline-item">
                      <div className="c-timeline-icon c-check-in">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
                        </svg>
                      </div>
                      <div className="c-timeline-content">
                        <span className="c-timeline-label">Check-in</span>
                        <span className="c-timeline-date">{formatDate(booking.checkInDate)}</span>
                      </div>
                    </div>

                    <div className="c-timeline-divider">
                      <div className="c-nights-badge">
                        <span>{booking.nights}</span>
                        <small>nights</small>
                      </div>
                    </div>

                    <div className="c-timeline-item">
                      <div className="c-timeline-icon c-check-out">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z"/>
                        </svg>
                      </div>
                      <div className="c-timeline-content">
                        <span className="c-timeline-label">Check-out</span>
                        <span className="c-timeline-date">{formatDate(booking.checkOutDate)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="c-booking-details">
                    <div className="c-detail-box">
                      <span className="c-detail-label">Room Number</span>
                      <span className="c-detail-value">{booking.roomNumber || 'TBD'}</span>
                    </div>
                    <div className="c-detail-box c-price-box">
                      <span className="c-detail-label">Total Price</span>
                      <span className="c-detail-value c-price">${booking.quotedPrice?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions - Show different buttons based on status */}
                  {(booking.status === 'CONFIRMED' || booking.status === 'PENDING') && (
                    <div className="c-booking-actions">
                      {/* Pay Now button for PENDING bookings */}
                      {isPending && (
                        <button 
                          className="c-pay-nowwwww-btn"
                          onClick={() => handlePayNow(booking)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Pay Now
                        </button>
                      )}
                      
                      {/* Extend button for CONFIRMED bookings (not past check-in) */}
                      {isExtendable && !isPastCheckIn && (
                        <button 
                          className="c-extend-btn"
                          onClick={() => handleExtend(booking)}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                            <polyline points="17 21 17 13 7 13 7 21"/>
                            <polyline points="7 3 7 8 15 8"/>
                          </svg>
                          Extend Stay
                        </button>
                      )}
                      
                      {/* Cancel button for both PENDING and CONFIRMED */}
                      <button 
                        className="c-cancel-btn"
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                      >
                        {cancellingId === booking.id ? (
                          <>
                            <div className="c-btn-spinner"></div>
                            Cancelling...
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                            Cancel Booking
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Extension Modal */}
      {showExtensionModal && extendingBooking && (
        <ExtensionModal
          booking={extendingBooking}
          onClose={() => {
            setShowExtensionModal(false);
            setExtendingBooking(null);
          }}
          onSuccess={handleExtensionSuccess}
        />
      )}

      {/* Payment Modal for PENDING bookings */}
      {showPaymentModal && payingBooking && (
        <PaymentModal
          booking={payingBooking}
          amount={payingBooking.quotedPrice}
          onClose={() => {
            setShowPaymentModal(false);
            setPayingBooking(null);
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default MyBookings;