import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {  bookingAPI ,paymentAPI } from '../../services/customerApi';
import './css/PaymentModal.css';

const PaymentModal = ({ booking, amount, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('CREDIT_CARD');
  const [formData, setFormData] = useState({ 
    name: '', 
    number: '', 
    date: '', 
    cvv: '', 
    email: '' 
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});

  // Validation functions
  const validateCreditCard = () => {
    const nameValid = formData.name.trim().length >= 2;
    const cardNumberValid = formData.number.replace(/\s/g, '').length === 16;
    const dateFormatValid = /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.date);
    let dateNotExpired = false;
    if (dateFormatValid) {
      const [, mm, yy] = formData.date.match(/^(\d{2})\/(\d{2})$/);
      dateNotExpired = new Date(2000 + parseInt(yy), parseInt(mm)) > new Date();
    }
    const cvvValid = /^[0-9]{3}$/.test(formData.cvv);
    
    return nameValid && cardNumberValid && dateFormatValid && dateNotExpired && cvvValid;
  };

  const validatePayPal = () => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    return emailValid;
  };

  const validateBankTransfer = () => {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
    return emailValid;
  };

  const isFormValid = useMemo(() => {
    switch (method) {
      case 'CREDIT_CARD':
        return validateCreditCard();
      case 'PAYPAL':
        return validatePayPal();
      case 'BANK_TRANSFER':
        return validateBankTransfer();
      default:
        return false;
    }
  }, [method, formData]);

  const handlePay = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Please fill in all required fields correctly');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      const paymentData = {
        bookingId: booking.id,
        method: method
      };

      console.log('Sending payment request:', paymentData);
      console.log('Booking object:', booking);
      console.log('Booking status:', booking.status);
      
      const response = await paymentAPI.createPayment(paymentData);
      console.log('Payment response:', response);
      
      if (response && response.data) {
        // Refresh bookings data
        if (onSuccess) {
          await onSuccess();
        }
        
        // SHOW SUCCESS WINDOW
        setShowSuccess(true);
        setLoading(false);
        
        // Close and navigate after 2 seconds
        setTimeout(() => {
          onClose();
          navigate('/bookings');
        }, 2000);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (err) {
      console.error('Payment error details:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      
      let errorMsg = 'Payment failed. Please try again.';
      
      // Handle specific error cases
      if (err.response?.status === 500) {
        // Try to refresh booking and retry once on 500 error
        console.log('Attempting to refresh booking and retry...');
        try {
          // Refresh the booking data first
          if (onSuccess) {
            await onSuccess();
          }
          
          // Retry the payment with fresh booking data
          console.log('Retrying payment...');
          const retryResponse = await paymentAPI.createPayment({
            bookingId: booking.id,
            method: method
          });
          
          if (retryResponse && retryResponse.data) {
            setShowSuccess(true);
            setLoading(false);
            setTimeout(() => {
              onClose();
              navigate('/bookings');
            }, 2000);
            return;
          }
        } catch (retryErr) {
          console.error('Retry also failed:', retryErr);
          errorMsg = 'Payment failed. Your booking may already be processing. Please check your bookings page.';
        }
      } else if (err.response?.data) {
        errorMsg = err.response.data.message || err.response.data.error || errorMsg;
      } else if (err.request) {
        errorMsg = 'No response from server. Please check your connection.';
      } else {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field) => {
    if (!touched[field]) return '';
    
    switch (field) {
      case 'name':
        return formData.name.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'number':
        return formData.number.replace(/\s/g, '').length !== 16 ? 'Card number must be 16 digits' : '';
      case 'date':
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(formData.date)) return 'Use format MM/YY';
        const [, mm, yy] = formData.date.match(/^(\d{2})\/(\d{2})$/);
        const now = new Date();
        const expiry = new Date(2000 + parseInt(yy), parseInt(mm));
        if (expiry <= now) return 'Card has expired';
        return '';
      case 'cvv':
        return !/^[0-9]{3}$/.test(formData.cvv) ? 'CVV must be 3 digits' : '';
      case 'email':
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Enter a valid email address' : '';
      default:
        return '';
    }
  };

  return (
    <div className="c-payment-overlay" onClick={showSuccess ? undefined : onClose}>
      {/* SUCCESS OVERLAY - RENDERED OUTSIDE MODAL */}
      {showSuccess && (
        <div className="c-success-overlay">
          <div className="c-success-card">
            <div className="c-success-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2>Payment Successful!</h2>
            <p>Your booking has been confirmed.</p>
            <p className="c-redirect-text">Redirecting to My Bookings...</p>
          </div>
        </div>
      )}

      <div className="c-payment-modal" onClick={e => e.stopPropagation()}>
        <button className="c-close-x" onClick={onClose}>×</button>

        {/* Left Sidebar */}
        <div className="c-modal-left">
          <div className="c-brand-header">
            <h2>elite<span>reserve</span></h2>
          </div>

          <div className="c-payment-methods-title">Payment Method</div>

          <div className="c-method-stack">
            <button 
              type="button"
              className={`c-method-row ${method === 'CREDIT_CARD' ? 'c-active' : ''}`} 
              onClick={() => {
                if (!loading && !showSuccess) {
                  setMethod('CREDIT_CARD');
                  setError('');
                }
              }}
            >
              <div className="c-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="5" width="20" height="14" rx="3" fill="currentColor"/>
                  <path d="M2 10H22" stroke="white" strokeWidth="2"/>
                  <circle cx="7" cy="15" r="1" fill="white"/>
                  <circle cx="10" cy="15" r="1" fill="white"/>
                </svg>
              </div>
              <span>Credit Card</span>
            </button>

            <button 
              type="button"
              className={`c-method-row ${method === 'PAYPAL' ? 'c-active' : ''}`} 
              onClick={() => {
                if (!loading && !showSuccess) {
                  setMethod('PAYPAL');
                  setError('');
                }
              }}
            >
              <div className="c-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7.5 19.5H4.5L6 9H9C11.5 9 13 7.5 13.5 5.5C14 3.5 12.5 2 10 2H5L2.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.5 14H14C16.5 14 18.5 12.5 19 10C19.5 7.5 18 6 15.5 6H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16.5 19.5H19.5L20.5 13H17.5C15 13 13 14.5 12.5 16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span>PayPal</span>
            </button>

            <button 
              type="button"
              className={`c-method-row ${method === 'BANK_TRANSFER' ? 'c-active' : ''}`} 
              onClick={() => {
                if (!loading && !showSuccess) {
                  setMethod('BANK_TRANSFER');
                  setError('');
                }
              }}
            >
              <div className="c-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M4 18h16M5 18v-8M9 18v-8M15 18v-8M19 18v-8M2 10l10-7 10 7"/>
                </svg>
              </div>
              <span>Bank Transfer</span>
            </button>
          </div>

          <div className="c-order-summary-box">
            <h4>Order Total</h4>
            <div className="c-order-total">
              <span>Total amount</span>
              <span>${amount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="c-modal-right">
          <div className="c-right-header">
            <h3>{method === 'CREDIT_CARD' ? 'Card Details' : method === 'PAYPAL' ? 'PayPal Account' : 'Bank Details'}</h3>
            <p>Secure {method === 'CREDIT_CARD' ? 'card' : method === 'PAYPAL' ? 'PayPal' : 'bank'} payment processing</p>
          </div>

          <div className="c-scrollable-content">
            {error && (
              <div className="c-error-banner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}

            {method === 'CREDIT_CARD' && (
              <div className="c-card-display">
                <div className="c-card-chip"></div>
                <div className="c-card-number-display">
                  {formData.number || '•••• •••• •••• ••••'}
                </div>
                <div className="c-card-details-display">
                  <div>
                    <span>Cardholder</span>
                    <strong>{formData.name || 'YOUR NAME'}</strong>
                  </div>
                  <div>
                    <span>Expires</span>
                    <strong>{formData.date || 'MM/YY'}</strong>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handlePay} className="c-payment-form" noValidate>
              {method === 'CREDIT_CARD' ? (
                <>
                  <div className="c-input-group">
                    <label>Cardholder Name</label>
                    <input 
                      type="text" 
                      placeholder="John Doe" 
                      value={formData.name}
                      required 
                      disabled={loading}
                      onChange={e => handleFieldChange('name', e.target.value.replace(/[^a-zA-Z\s]/g, ''))}
                      onBlur={() => handleBlur('name')}
                      className={touched.name && getFieldError('name') ? 'c-error' : ''}
                    />
                    {touched.name && getFieldError('name') && (
                      <span className="c-field-error">{getFieldError('name')}</span>
                    )}
                  </div>
                  <div className="c-input-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000" 
                      value={formData.number}
                      maxLength="19"
                      disabled={loading}
                      onChange={e => {
                        let value = e.target.value.replace(/[^\d]/g, '');
                        if (value.length > 16) value = value.slice(0, 16);
                        value = value.replace(/(\d{4})/g, '$1 ').trim();
                        handleFieldChange('number', value);
                      }}
                      onBlur={() => handleBlur('number')}
                      className={touched.number && getFieldError('number') ? 'c-error' : ''}
                      required 
                    />
                    {touched.number && getFieldError('number') && (
                      <span className="c-field-error">{getFieldError('number')}</span>
                    )}
                  </div>
                  <div className="c-form-row">
                    <div className="c-input-group">
                      <label>Expiry Date</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY" 
                        value={formData.date}
                        maxLength="5"
                        disabled={loading}
                        onChange={e => {
                          let value = e.target.value.replace(/[^\d]/g, '');
                          if (value.length >= 2) {
                            let month = parseInt(value.slice(0, 2), 10);
                            if (month > 12) month = 12;
                            if (month < 1 && value.slice(0, 2) !== '0' && value.slice(0, 2) !== '00') month = 1;
                            value = String(month).padStart(2, '0') + '/' + value.slice(2, 4);
                          }
                          handleFieldChange('date', value);
                        }}
                        onBlur={() => handleBlur('date')}
                        className={touched.date && getFieldError('date') ? 'c-error' : ''}
                        required 
                      />
                      {touched.date && getFieldError('date') && (
                        <span className="c-field-error">{getFieldError('date')}</span>
                      )}
                    </div>
                    <div className="c-input-group">
                      <label>CVV</label>
                      <input 
                        type="password" 
                        placeholder="•••" 
                        value={formData.cvv}
                        maxLength="3" 
                        required 
                        disabled={loading}
                        onChange={e => handleFieldChange('cvv', e.target.value.replace(/[^\d]/g, ''))}
                        onBlur={() => handleBlur('cvv')}
                        className={touched.cvv && getFieldError('cvv') ? 'c-error' : ''}
                      />
                      {touched.cvv && getFieldError('cvv') && (
                        <span className="c-field-error">{getFieldError('cvv')}</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="c-input-group">
                  <label>{method === 'PAYPAL' ? 'PayPal Email' : 'Bank Account Email'}</label>
                  <input 
                    type="email" 
                    placeholder={method === 'PAYPAL' ? 'you@paypal.com' : 'you@bank.com'}
                    value={formData.email}
                    required 
                    disabled={loading}
                    onChange={e => handleFieldChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className={touched.email && getFieldError('email') ? 'c-error' : ''}
                  />
                  {touched.email && getFieldError('email') && (
                    <span className="c-field-error">{getFieldError('email')}</span>
                  )}
                </div>
              )}

              <button 
                type="submit" 
                className="c-pay-btn" 
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="c-spinning">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M9 12l2 2 4-4"/>
                    </svg>
                    Pay ${amount?.toFixed(2)}
                  </>
                )}
              </button>

              <div className="c-security-footer">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>256-bit SSL encrypted payment</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;