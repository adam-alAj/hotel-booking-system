import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './css/Navbar.css';
import AiChatWidget from '../ai/AiChatWidget';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    city: '',
    minRating: '',
    maxRating: ''
  });
  const firstInputRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchFilters.name.trim()) params.append('name', searchFilters.name.trim());
    if (searchFilters.city.trim()) params.append('city', searchFilters.city.trim());
    if (searchFilters.minRating) params.append('minRating', searchFilters.minRating);
    if (searchFilters.maxRating) params.append('maxRating', searchFilters.maxRating);
    navigate(`/search?${params.toString()}`);
    setShowSearch(false);
    setSearchFilters({ name: '', city: '', minRating: '', maxRating: '' });
  };

  const openSearch = () => setShowSearch(true);
  const closeSearch = useCallback(() => setShowSearch(false), []);

  // Keyboard: Esc closes modal
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape' && showSearch) closeSearch();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [showSearch, closeSearch]);

  // Auto-focus first input on open
  useEffect(() => {
    if (showSearch && firstInputRef.current) {
      setTimeout(() => firstInputRef.current.focus(), 100);
    }
  }, [showSearch]);

  // Lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = showSearch ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [showSearch]);

  const getUserInitial = () => {
    if (user?.firstName) return user.firstName.charAt(0).toUpperCase();
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return 'U';
  };

  const getAvatarColor = () => {
    const colors = ['#1e3a8a','#3730a3','#581c87','#701a75','#819f12','#5b0cc2','#b40950','#047857'];
    const name = user?.firstName || user?.email || 'User';
    return colors[name.charCodeAt(0) % colors.length];
  };

  return (
    <>
      <nav className="cnavbar">
        <div className="cnavbar-container">
          <Link to="/" className="cnavbar-logo">
            <span className="celite">elite</span>
            <span className="clogo-reserve">reserve</span>
          </Link>

          <div className="cnavbar-menu">
            <Link to="/" className="cnavbar-link">Home</Link>

            {/* Redesigned Search Pill Trigger */}
            <button onClick={openSearch} className="csearch-trigger" title="Search Hotels">
              <span className="csearch-trigger-glow"></span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
              </svg>
              <span className="csearch-trigger-text">Find a hotel</span>
              <kbd className="csearch-trigger-kbd">⌘K</kbd>
            </button>

            {isAuthenticated ? (
              <>
                <div className="cnavbar-user">
                  <div className="cuser-avatar" style={{ backgroundColor: getAvatarColor() }}>
                    {getUserInitial()}
                  </div>
                  <span className="cnavbar-welcome">
                    {user?.firstName || user?.email?.split('@')[0]}
                  </span>
                </div>
                <Link to="/bookings" className="cnavbar-link">My Bookings</Link>
                <button onClick={handleLogout} className="cnavbar-button">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="cnavbar-link">Login</Link>
                <Link to="/login?register=true" className="cnavbar-button">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Search Modal Overlay */}
      <div className={`csearch-overlay ${showSearch ? 'csearch-overlay--open' : ''}`} onClick={closeSearch}>
        <div className={`csearch-modal ${showSearch ? 'csearch-modal--open' : ''}`} onClick={e => e.stopPropagation()}>
          
          {/* Modal Header */}
          <div className="csearch-modal-header">
            <div>
              <h2 className="csearch-modal-title">Find Your Perfect Hotel</h2>
              <p className="csearch-modal-subtitle">Search across our curated collection of luxury stays</p>
            </div>
            <button onClick={closeSearch} className="csearch-modal-close" aria-label="Close search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Modal Form */}
          <form onSubmit={handleSearchSubmit} className="csearch-modal-form">
            <div className="csearch-modal-row">
              <div className="csearch-modal-field">
                <label htmlFor="search-name">Hotel Name</label>
                <div className="csearch-input-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  <input
                    ref={firstInputRef}
                    id="search-name"
                    type="text"
                    name="name"
                    value={searchFilters.name}
                    onChange={handleSearchChange}
                    placeholder="Search by hotel name..."
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="csearch-modal-field">
                <label htmlFor="search-city">City</label>
                <div className="csearch-input-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <input
                    id="search-city"
                    type="text"
                    name="city"
                    value={searchFilters.city}
                    onChange={handleSearchChange}
                    placeholder="Search by city..."
                    autoComplete="off"
                  />
                </div>
              </div>
            </div>

            <div className="csearch-modal-row">
              <div className="csearch-modal-field">
                <label htmlFor="search-min">Min Rating</label>
                <div className="csearch-input-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <select id="search-min" name="minRating" value={searchFilters.minRating} onChange={handleSearchChange}>
                    <option value="">Any</option>
                    {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>
              </div>

              <div className="csearch-modal-field">
                <label htmlFor="search-max">Max Rating</label>
                <div className="csearch-input-wrap">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <select id="search-max" name="maxRating" value={searchFilters.maxRating} onChange={handleSearchChange}>
                    <option value="">Any</option>
                    {[5,6,7,8,9,10].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="csearch-modal-actions">
              <button
                type="button"
                onClick={() => setSearchFilters({ name: '', city: '', minRating: '', maxRating: '' })}
                className="csearch-btn-clear"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                </svg>
                Clear All
              </button>
              <button type="submit" className="csearch-btn-submit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.3-4.3"/>
                </svg>
                Search Hotels
              </button>
            </div>
          </form>
        </div>
      </div>

      <AiChatWidget token={localStorage.getItem('accessToken')} />
    </>
  );
};

export default Navbar;
