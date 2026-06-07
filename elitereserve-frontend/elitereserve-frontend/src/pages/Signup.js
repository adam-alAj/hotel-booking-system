import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    role: 'CUSTOMER',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { register } = useAuth();
  const navigate = useNavigate();

  //const calculatePasswordStrength = (password) => {
  //  let strength = 0;
  //  if (password.length >= 8) strength += 25;
  //  if (password.match(/[a-z]+/)) strength += 25;
  //  if (password.match(/[A-Z]+/)) strength += 25;
  // if (password.match(/[0-9]+/)) strength += 25;
  // return Math.min(strength, 100);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });


  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return '#dc2626';
    if (passwordStrength <= 50) return '#f59e0b';
    if (passwordStrength <= 75) return '#10b981';
    return '#1e3a8a';
  };

  const getStrengthText = () => {
    if (passwordStrength <= 25) return 'Weak';
    if (passwordStrength <= 50) return 'Fair';
    if (passwordStrength <= 75) return 'Good';
    return 'Strong';
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.firstName || !formData.lastName) {
      setError('First name and last name are required');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }


    if (passwordStrength < 50) {
      setError('Please choose a stronger password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (validateForm()) return;

    setLoading(true);

    try {
      const roles = [formData.role];

      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        roles: roles,
      });

      // Redirect based on role
      if (formData.role === 'HOTEL_MANAGER') {
        window.location.href = '/manager-hotels';
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Side - Hero Image */}
      <div className="auth-hero">
        <div className="hero-logo">
          <div className="logooo">
            <span className="logo-el">elite</span>
            <span className="logo-res">reserve</span>
          </div>
        </div>

        <div className="hero-content">
          <h1>Travel Refined.<br />Access the world's most guarded addresses.</h1>
          <p>Experience unparalleled luxury and personalized service at the world's most exclusive properties.</p>

          <div className="hero-features">
            <div className="feature">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                  <path d="M12 6v6l4.5 2.7.75-1.23-3.75-2.22V6H12z" />
                </svg>
              </div>
              <div className="feature-text">Elite Concierge<br />Active 24/7</div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <div className="feature-text">Curated Collection<br />World-Class Stays</div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
              </div>
              <div className="feature-text">VIP Access<br />Exclusive Benefits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="auth-form-container">
        <div className="auth-form-wrapper">
          <h2>Create an account</h2>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hello@example.com"
                required
              />
            </div>

            {/* Role Selection */}
            <div className="form-group">
              <label>Account Type</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={{
                  padding: '0.9rem 1rem',
                  border: '1.5px solid #e5e7eb',
                  borderRadius: '14px',
                  fontSize: '0.95rem',
                  background: '#f9fafb',
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                <option value="CUSTOMER">Customer - Book hotels</option>
                <option value="HOTEL_MANAGER">Hotel Manager - Manage properties</option>
              </select>
              <small style={{ color: '#6c757d', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                {formData.role === 'HOTEL_MANAGER'
                  ? 'You will be able to create and manage hotels after registration'
                  : 'You can browse and book hotels as a customer'}
              </small>
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div
                      className="strength-fill"
                      style={{
                        width: `${passwordStrength}%`,
                        background: getStrengthColor()
                      }}
                    />
                  </div>
                  <span className="strength-text" style={{ color: getStrengthColor() }}>
                    {getStrengthText()}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading && <span className="loading-spinner"></span>}
              {loading ? 'Please wait...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Section */}
          <div className="auth-footer">
            <div className="footer-logo">
              <span className="logo-elite">elite</span>
              <span className="logo-reserve">reserve</span>
            </div>
            <div className="footer-text">
              Curating the world's finest accommodations for discerning travelers since 2026.
            </div>
            <div className="footer-linkssss">
              <a href="#">About Us</a>
              <a href="#">Luxury Collection</a>
              <a href="#">Concierge Service</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
            <div className="copyright">
              © 2026 EliteReserve. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;