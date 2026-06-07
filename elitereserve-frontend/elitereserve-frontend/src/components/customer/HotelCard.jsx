import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../utils/imageUrl';
import './css/HotelCard.css';

const HotelCard = ({ hotel }) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const normalizedRating = (rating || 8.5) / 2;
    const fullStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
            <svg key={i} className="cstar cfilled" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
            <svg key={i} className="cstar chalf" viewBox="0 0 24 24">
              <defs>
                <linearGradient id={`chalf-${hotel.id}-${i}`}>
                  <stop offset="50%" stopColor="#ffc107"/>
                  <stop offset="50%" stopColor="rgba(255,255,255,0.2)"/>
                </linearGradient>
              </defs>
              <path fill={`url(#chalf-${hotel.id}-${i})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        );
      } else {
        stars.push(
            <svg key={i} className="cstar cempty" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        );
      }
    }
    return stars;
  };

  const getBadgeStyle = (badge) => {
    if (!badge) return { bg: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)', color: '#ffffff' };
    const lowerBadge = badge.toLowerCase();
    if (lowerBadge.includes('luxury') || lowerBadge.includes('5 star'))
      return { bg: 'linear-gradient(135deg, #9333ea 0%, #6366f1 100%)', color: '#ffffff' };
    if (lowerBadge.includes('boutique'))
      return { bg: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#ffffff' };
    if (lowerBadge.includes('resort'))
      return { bg: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)', color: '#ffffff' };
    if (lowerBadge.includes('excellent'))
      return { bg: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)', color: '#ffffff' };
    if (lowerBadge.includes('very good'))
      return { bg: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)', color: '#ffffff' };
    if (lowerBadge.includes('good'))
      return { bg: 'linear-gradient(135deg, #ca8a04 0%, #eab308 100%)', color: '#ffffff' };
    return { bg: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)', color: '#ffffff' };
  };

  const badgeStyle = getBadgeStyle(hotel.ratingBadge);

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    console.log('Wishlist toggled for hotel:', hotel.id, isWishlisted ? 'removed' : 'added');
  };

  const getHotelType = () => {
    const rating = hotel.averageRating || 8.5;
    if (rating >= 9) return 'Luxury Resort';
    if (rating >= 8) return 'Premium Hotel';
    if (rating >= 7) return 'Boutique Stay';
    return 'Comfort Hotel';
  };

  return (
      <div
          className="chotel-card"
          onClick={() => navigate(`/hotel/${hotel.id}`)}
      >
        <div className="chotel-image-container">
          <img
              src={getImageUrl(hotel.imageUrl) || '/placeholder-hotel.jpg'}
              alt={hotel.name}
              className="chotel-img"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
              }}
          />
          <div className="cimage-overlay"></div>

          <button
              className={`cwishlist-btn ${isWishlisted ? 'cactive' : ''}`}
              onClick={handleWishlistClick}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
                viewBox="0 0 24 24"
                fill={isWishlisted ? "#ef4444" : "none"}
                stroke={isWishlisted ? "#ef4444" : "white"}
                strokeWidth="2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>

          {hotel.ratingBadge && (
              <div
                  className="crating-badge"
                  style={{
                    background: badgeStyle.bg,
                    color: badgeStyle.color,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
                  }}
              >
                {hotel.ratingBadge}
              </div>
          )}
        </div>

        <div className="chotel-content">
          <div className="chotel-header">
            <div className="chotel-meta">
            <span className="chotel-location">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {hotel.city || 'Luxury Destination'}
            </span>
              <span className="chotel-typi">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
                {hotel.type || getHotelType()}
            </span>
            </div>
            <h4 className="chotel-naami">{hotel.name}</h4>
          </div>

          <div className="chotel-rating">
            <div className="cstars">{renderStars(hotel.averageRating || 8.5)}</div>
            <span className="crating-score">{hotel.averageRating?.toFixed(1) || '8.5'}</span>
            <span className="creview-count">({hotel.totalReviews || 128} reviews)</span>
          </div>

          <p className="chotel-desci">
            {hotel.description || 'Experience unparalleled luxury and comfort in this exquisite property featuring world-class amenities, breathtaking views, and exceptional personalized service.'}
          </p>

          <div className="chotel-footer">
            <button className="cview-details-btn">
            <span>
              Discover Experience
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
            </button>
          </div>
        </div>
      </div>
  );
};

export default HotelCard;