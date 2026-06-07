import React, { useState } from 'react';
import { bookingAPI } from '../../services/customerApi';
import PaymentModal from './PaymentModal';
import './css/BookingModal.css';

const BookingModal = ({ hotel, roomType, searchParams, onClose, onBookingSuccess }) => {
  const [bookingData, setBookingData] = useState({
    checkInDate: searchParams.checkIn || '',
    checkOutDate: searchParams.checkOut || '',
  });

  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState(null);
  const [error, setError] = useState('');
  const [bookingCreated, setBookingCreated] = useState(false);

  const nights = bookingData.checkInDate && bookingData.checkOutDate
    ? Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))
    : 0;

  const handleChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    
    if (nights <= 0) {
      setError('Please select valid dates');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      // Create the booking - backend calculates the REAL price
      const res = await bookingAPI.createBooking({
        hotelId: hotel.id,
        roomTypeId: roomType.id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
      });

      const newBooking = res.data;
      setCreatedBooking(newBooking);
      setBookingCreated(true); // Show the price in the modal now
      
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to create booking');
      setLoading(false);
    }
  };

  const handleContinueToPayment = () => {
    setShowPayment(true);
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMinCheckOut = () => {
    if (bookingData.checkInDate) {
      const nextDay = new Date(bookingData.checkInDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split('T')[0];
    }
    return getTodayDate();
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handlePaymentSuccess = async () => {
    setShowPayment(false);
    setCreatedBooking(null);
    setBookingCreated(false);
    if (onBookingSuccess) {
      await onBookingSuccess();
    }
    onClose();
  };

  // If payment modal is open, show it
  if (showPayment && createdBooking) {
    return (
      <PaymentModal
        booking={createdBooking}
        amount={createdBooking.quotedPrice}
        onClose={() => {
          setShowPayment(false);
        }}
        onSuccess={handlePaymentSuccess}
      />
    );
  }

  return (
    <div className="c-booking-overlay" onClick={onClose}>
      <div className="c-booking-modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="c-booking-header">
          <div className="c-booking-header-content">
            <h2>{bookingCreated ? 'Booking Created!' : 'Complete your booking'}</h2>
            <p>{hotel?.name || 'Hotel'} • {roomType?.roomTypeName || 'Room'}</p>
          </div>
          <button className="c-close-btn" onClick={onClose}>×</button>
        </div>

        {/* Body */}
        <div className="c-booking-body">

          {/* Left - Form or Success View */}
          <div className="c-booking-form-section">
            {error && (
              <div className="c-error-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {!bookingCreated ? (
              <>
                <h3 className="c-section-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Select your dates
                </h3>

                <form onSubmit={handleCreateBooking} className="c-booking-form">
                  <div className="c-form-row">
                    <div className="c-form-group">
                      <label>Check-in date</label>
                      <input 
                        type="date" 
                        name="checkInDate" 
                        value={bookingData.checkInDate} 
                        onChange={handleChange} 
                        min={getTodayDate()}
                        onKeyDown={e => e.preventDefault()}
                        onClick={e => e.target.showPicker()}
                        placeholder="Select check-in date"
                        data-placeholder={!bookingData.checkInDate ? 'Select check-in date' : ''}
                        className={!bookingData.checkInDate ? 'c-date-empty' : ''}
                        required 
                      />
                    </div>
                    <div className="c-form-group">
                      <label>Check-out date</label>
                      <input 
                        type="date" 
                        name="checkOutDate" 
                        value={bookingData.checkOutDate} 
                        onChange={handleChange} 
                        min={getMinCheckOut()} 
                        onKeyDown={e => e.preventDefault()}
                        onClick={e => e.target.showPicker()}
                        placeholder="Select check-out date"
                        data-placeholder={!bookingData.checkOutDate ? 'Select check-out date' : ''}
                        className={!bookingData.checkOutDate ? 'c-date-empty' : ''}
                        required 
                      />
                    </div>
                  </div>

                  {nights > 0 && (
                    <div className="c-date-summary">
                      <span>📅 {formatDate(bookingData.checkInDate)} → {formatDate(bookingData.checkOutDate)}</span>
                      <span>  ({nights} {nights === 1 ? 'night' : 'nights'})</span>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="c-confirm-btn" 
                    disabled={loading || nights <= 0}
                  >
                    {loading ? 'Creating your booking...' : 'Create Booking'}
                  </button>

                  <div className="c-trust-section">
                    <div className="c-trust-badges">
                      <div className="c-trust-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                          <polyline points="9 12 11 14 15 10"/>
                        </svg>
                        <span>Free cancellation within 48 hours</span>
                      </div>
                      <div className="c-trust-item">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <span>Secure payment processing</span>
                      </div>
                    </div>
                  </div>
                </form>
              </>
            ) : (
              <div className="c-success-section">
                <div className="c-success-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                </div>
                <h3>Booking Created Successfully!</h3>
                <p>Your booking has been reserved. Please complete payment to confirm.</p>
                
                <div className="c-price-highlight">
                  <span>Total Amount</span>
                  <strong>${createdBooking?.quotedPrice?.toFixed(2)}</strong>
                </div>

                <button 
                  onClick={handleContinueToPayment}
                  className="c-pay-now-btn"
                >
                  Continue to Payment • ${createdBooking?.quotedPrice?.toFixed(2)}
                </button>
              </div>
            )}
          </div>

          {/* Right - Summary */}
          <div className="c-booking-summary">
            <div className="c-summary-header">
              <h3>{bookingCreated ? 'Booking Details' : 'Booking summary'}</h3>
            </div>

            <div className="c-room-preview">
              <div className="c-room-preview-info">
                <strong>{roomType?.roomTypeName || 'Room'}</strong>
              <span>
                 * Up to {(() => {
                            const map = { SINGLE: 1, DOUBLE: 2, TWIN: 2, TRIPLE: 3, FAMILY: 4 };
                            const count = map[roomType?.capacity];

                           if (!count) return 'N/A guests';
                               return count === 1 ? '1 guest' : `${count} guests`;
                                    })()}
              </span>
                <span className="c-base-rate">* Base rate: ${roomType?.basePrice?.toFixed(2) || '0'}/night</span>
              </div>
            </div>

            {nights > 0 && (
              <div className="c-booking-dates">
                <div className="c-date-item">
                  <span>Check-in:</span>
                  <strong>{formatDate(bookingData.checkInDate)}</strong>
                </div>
                <div className="c-date-item">
                  <span>Check-out:</span>
                  <strong>{formatDate(bookingData.checkOutDate)}</strong>
                </div>
                <div className="c-date-item">
                  <span>Nights:</span>
                  <strong>{nights} nights</strong>
                </div>
              </div>
            )}

            {bookingCreated && createdBooking && (
              <div className="c-final-price-box">
                <div className="c-price-line c-total">
                  <span>$ Total to pay after calculation</span>
                  <span>${createdBooking.quotedPrice?.toFixed(2)}</span>
                </div>
                <div className="c-price-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 16v-4M12 8h.01"/>
                  </svg>
                  <span>This matches the price in "My Bookings"</span>
                </div>
              </div>
            )}

            <div className="c-security-note">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>Your payment is secure and encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;