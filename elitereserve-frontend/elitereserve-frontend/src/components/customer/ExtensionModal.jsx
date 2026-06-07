import React, { useState } from 'react';
import { bookingAPI, paymentAPI } from '../../services/customerApi';
import './css/ExtensionModal.css';

const ExtensionModal = ({ booking, onClose, onSuccess }) => {
  const [newCheckOutDate, setNewCheckOutDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extension, setExtension] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');

  const minDate = booking.checkOutDate;

  const handleRequestExtension = async (e) => {
    e.preventDefault();
    
    if (!newCheckOutDate) {
      setError('Please select a new check-out date');
      return;
    }

    if (new Date(newCheckOutDate) <= new Date(minDate)) {
      setError('New check-out date must be after current check-out date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await bookingAPI.requestExtension(booking.id, {
        newCheckOutDate: newCheckOutDate
      });
      
      setExtension(response.data);
      setShowPayment(true);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request extension');
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Payment with extensionId
      const paymentData = {
        bookingId: booking.id,
        extensionId: extension.id,
        method: paymentMethod
      };
      
      await paymentAPI.createPayment(paymentData);
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateExtraNights = () => {
    if (!newCheckOutDate) return 0;
    const current = new Date(booking.checkOutDate);
    const newDate = new Date(newCheckOutDate);
    const diffTime = Math.abs(newDate - current);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateExtraCost = () => {
    const extraNights = calculateExtraNights();
    const nightlyRate = booking.quotedPrice / booking.nights;
    return nightlyRate * extraNights;
  };

  return (
    <div className="c-extension-overlay" onClick={onClose}>
      <div className="c-extension-modal" onClick={e => e.stopPropagation()}>
        <button className="c-close-btn" onClick={onClose}>×</button>

        {!showPayment ? (
          // Step 1: Request Extension
          <>
            <div className="c-modal-header">
              <h2>Extend Your Stay</h2>
              <p>Extend your stay at {booking.hotelName}</p>
            </div>

            <div className="c-modal-body">
              <div className="c-current-booking">
                <div className="c-info-row">
                  <span>Current Check-out:</span>
                  <strong>{formatDate(booking.checkOutDate)}</strong>
                </div>
                <div className="c-info-row">
                  <span>Current Total:</span>
                  <strong>${booking.quotedPrice?.toFixed(2)}</strong>
                </div>
              </div>

              <form onSubmit={handleRequestExtension} className="c-extension-form">
                <div className="c-form-group">
                  <label>New Check-out Date</label>
                  <input
                    type="date"
                    value={newCheckOutDate}
                    min={minDate}
                    onChange={(e) => setNewCheckOutDate(e.target.value)}
                    required
                  />
                </div>

                {newCheckOutDate && (
                  <div className="c-price-breakdown">
                    <h4>Extension Cost</h4>
                    <div className="c-price-row">
                      <span>Extra Nights:</span>
                      <span>{calculateExtraNights()} nights</span>
                    </div>
                    <div className="c-price-row">
                      <span>Additional Cost:</span>
                      <span className="c-price">${calculateExtraCost().toFixed(2)}</span>
                    </div>
                    <div className="c-price-row c-total">
                      <span>New Total:</span>
                      <span>${(booking.quotedPrice + calculateExtraCost()).toFixed(2)}</span>
                    </div>
                  </div>
                )}

                {error && <div className="c-error-message">{error}</div>}

                <button type="submit" className="c-submit-btn" disabled={loading}>
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </form>
            </div>
          </>
        ) : (
          // Step 2: Payment for Extension
          <>
            <div className="c-modal-header">
              <h2>Complete Extension Payment</h2>
              <p>Pay for your extended stay</p>
            </div>

            <div className="c-modal-body">
              <div className="c-extension-summary">
                <div className="c-summary-row">
                  <span>Extended by:</span>
                  <strong>{extension?.extendedNights} nights</strong>
                </div>
                <div className="c-summary-row">
                  <span>Additional cost:</span>
                  <strong className="c-price">${extension?.additionalCost?.toFixed(2)}</strong>
                </div>
                <div className="c-summary-row">
                  <span>New check-out:</span>
                  <strong>{formatDate(extension?.newCheckOut)}</strong>
                </div>
              </div>

              <div className="c-payment-methods">
                <h4>Select Payment Method</h4>
                <div className="c-method-options">
                  <button 
                    className={`c-method-btn ${paymentMethod === 'CREDIT_CARD' ? 'c-active' : ''}`}
                    onClick={() => setPaymentMethod('CREDIT_CARD')}
                  >
                    💳 Credit Card
                  </button>
                  <button 
                    className={`c-method-btn ${paymentMethod === 'PAYPAL' ? 'c-active' : ''}`}
                    onClick={() => setPaymentMethod('PAYPAL')}
                  >
                    PayPal
                  </button>
                  <button 
                    className={`c-method-btn ${paymentMethod === 'BANK_TRANSFER' ? 'c-active' : ''}`}
                    onClick={() => setPaymentMethod('BANK_TRANSFER')}
                  >
                    🏦 Bank Transfer
                  </button>
                </div>
              </div>

              {error && <div className="c-error-message">{error}</div>}

              <button 
                onClick={handlePayment} 
                className="c-pay-btn"
                disabled={loading}
              >
                {loading ? 'Processing Payment...' : `Pay $${extension?.additionalCost?.toFixed(2)}`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ExtensionModal;