import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await login(formData.email, formData.password);

      // After login, get user from localStorage
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const roles = user.roles || [];

        // Redirect based on role
        if (roles.includes('HOTEL_MANAGER') || roles.includes('ADMIN')) {
          window.location.href = '/manager-hotels';
        } else {
          window.location.href = '/';
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
          err.response?.data?.message ||
          'Authentication failed. Please try again.'
      );
      setLoading(false);
    }
  };

  return (
      <div className="auth-page">
        {/* Left Side Hero */}
        <div className="auth-hero">
          <div className="hero-logo">
            <div className="logooo">
              <span className="logo-el">elite</span>
              <span className="logo-res">reserve</span>
            </div>
          </div>

          <div className="hero-content">
            <h1>
              Travel Refined.
              <br />
              Access the world's most guarded addresses.
            </h1>

            <p>
              Experience unparalleled luxury and personalized
              service at the world's most exclusive properties.
            </p>

            <div className="hero-features">
              <div className="feature">
                <div className="feature-icon">
                  <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                    <path d="M12 6v6l4.5 2.7.75-1.23-3.75-2.22V6H12z" />
                  </svg>
                </div>
                <div className="feature-text">
                  Elite Concierge
                  <br />
                  Active 24/7
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                  >
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <div className="feature-text">
                  Curated Collection
                  <br />
                  World-Class Stays
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">
                  <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                  >
                    <circle cx="12" cy="8" r="7" />
                    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                  </svg>
                </div>
                <div className="feature-text">
                  VIP Access
                  <br />
                  Exclusive Benefits
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="auth-form-container">
          <div className="auth-form-wrapper">
            <h2>Welcome to Elite Reserve</h2>

            <p>
              Don't have an account?{' '}
              <Link to="/signup">Sign up</Link>
            </p>

            {error && (
                <div className="error-message">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="auth-form">
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
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) =>
                          setRememberMe(e.target.checked)
                      }
                  />
                  <span>Remember me</span>
                </label>

                <Link
                    to="/forgot-password"
                    className="forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                  type="submit"
                  className="auth-button"
                  disabled={loading}
              >
                {loading && (
                    <span className="loading-spinner"></span>
                )}
                {loading ? 'Please wait...' : 'Sign In'}
              </button>
            </form>

            {/* Footer */}
            <div className="auth-footer">
              <div className="footer-logo">
                <span className="logo-elite">elite</span>
                <span className="logo-reserve">reserve</span>
              </div>

              <div className="footer-text">
                Curating the world's finest accommodations for
                discerning travelers since 2026.
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

export default Login;