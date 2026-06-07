import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ManagerNavbar.css';

const ManagerNavbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  // Apply theme when it changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getUserInitial = () => {
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'M';
  };

  const getAvatarColor = () => {
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16'];
    const name = user?.firstName || user?.email || 'Manager';
    return colors[name.charCodeAt(0) % colors.length];
  };

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
      <nav className="manager-navbar">
        <div className="manager-navbar-container">
          <Link to="/manager-hotels" className="manager-navbar-logo">
            <span className="logo-elite">elite</span>
            <span className="logo-reserve">reserve</span>
            <span className="logo-manager">Manager Portal</span>
          </Link>

          <div className="manager-navbar-menu">
            <Link to="/manager-hotels" className="manager-navbar-link">My Hotels</Link>

            {/* Theme Toggle Button */}
            <button className="theme-toggle-navbar" onClick={toggleTheme} title={isDark ? 'Light Mode' : 'Dark Mode'}>
              {isDark ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </svg>
              ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
              )}
            </button>

            <div className="manager-navbar-user">
              <div className="manager-user-avatar" style={{ backgroundColor: getAvatarColor() }}>
                {getUserInitial()}
              </div>
              <span className="manager-navbar-welcome">
              {user?.firstName || user?.email?.split('@')[0]}
            </span>
            </div>

            <button onClick={handleLogout} className="manager-logout-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
  );
};

export default ManagerNavbar;