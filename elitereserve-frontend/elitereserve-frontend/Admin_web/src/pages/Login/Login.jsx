import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Hotel, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Hotel size={32} />
          </div>
          <h1>Welcome Back</h1>
          <p>Login to EliteReserve Admin Control Panel</p>
        </div>

        {error && (
          <div className="login-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input
                id="email"
                type="email"
                placeholder="admin@elitereserve.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-footer">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="loader"></span> : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>&copy; 2026 EliteReserve. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
