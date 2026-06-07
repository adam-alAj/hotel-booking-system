import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Loader2, AlertCircle, Shield } from 'lucide-react';
import { createUser } from '../../api/userApi';
import './CreateAccountModal.css';

/**
 * CreateAccountModal Component
 * Handles the creation of new administrative and customer accounts.
 * Provides client-side validation and direct API integration.
 */
const CreateAccountModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState(null);

  // Focus management: Autofocus first field on open
  useEffect(() => {
    if (isOpen) {
      const firstInput = document.getElementById('fullName');
      if (firstInput) firstInput.focus();
      
      // Reset state on open
      setFormData({ fullName: '', email: '', password: '', role: 'CUSTOMER' });
      setErrors({});
      setApiError(null);
    }
  }, [isOpen]);

  // Escape key listener for closing modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    else if (!formData.fullName.trim().includes(' ')) newErrors.fullName = 'Please enter both first and last name';

    if (!formData.email) newErrors.email = 'Email Address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/^[a-zA-Z0-9]{8,}$/.test(formData.password)) newErrors.password = 'Alphanumeric only, min 8 chars';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setApiError(null);

    try {
      // Split Full Name into First and Last Name for Backend DTO
      const names = formData.fullName.trim().split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ');

      const payload = {
        email: formData.email,
        password: formData.password,
        firstName: firstName,
        lastName: lastName,
        roles: [formData.role] // Backend expects a Set/Array of Strings/Enums
      };

      await createUser(payload);
      onSuccess(); // Refresh table
      onClose();   // Close modal
    } catch (err) {
      console.error('Create User Error:', err);
      const msg = err.response?.data?.message || 'Failed to create account. Email might be in use.';
      setApiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Portal render to root body to avoid z-index/transform issues
  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div 
        className="modal-panel" 
        role="dialog" 
        aria-modal="true" 
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div className="header-title-group">
            <Shield className="header-icon" size={20} />
            <h2 id="modal-title">Create New Account</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close logs panel">
            <X size={20} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          {apiError && (
            <div className="modal-error-banner">
              <AlertCircle size={16} />
              <span>{apiError}</span>
            </div>
          )}

          <div className="form-field">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="e.g. John Doe"
              className={errors.fullName ? 'input-error' : ''}
              value={formData.fullName}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.fullName && <span className="field-error-msg">{errors.fullName}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              className={errors.email ? 'input-error' : ''}
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && <span className="field-error-msg">{errors.email}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="password">Security Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="At least 8 characters"
              className={errors.password ? 'input-error' : ''}
              value={formData.password}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.password && <span className="field-error-msg">{errors.password}</span>}
          </div>

          <div className="form-field">
            <label htmlFor="role">Assign Administrative Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="HOTEL_MANAGER">Hotel Manager</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <div className="modal-form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  <span>Creating Account...</span>
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default CreateAccountModal;
