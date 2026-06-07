import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../../services/customerApi';
import './css/FeedbackSection.css';

const FeedbackCard = ({ feedback, index }) => {
  const renderStars = (rating) => {
    const stars = [];
    const normalizedRating = rating / 2;

    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(normalizedRating)) {
        stars.push(
          <svg key={i} viewBox="0 0 24 24" className="star filled">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      } else if (i === Math.ceil(normalizedRating) && normalizedRating % 1 !== 0) {
        stars.push(
          <svg key={i} viewBox="0 0 24 24" className="star half">
            <defs>
              <linearGradient id={`half-${feedback.id}-${i}`}>
                <stop offset="50%" stopColor="#f59e0b"/>
                <stop offset="50%" stopColor="#e5e7eb"/>
              </linearGradient>
            </defs>
            <path fill={`url(#half-${feedback.id}-${i})`} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      } else {
        stars.push(
          <svg key={i} viewBox="0 0 24 24" className="star empty">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        );
      }
    }
    return stars;
  };

  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const getAvatarGradient = (name) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradients[Math.abs(hash) % gradients.length];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const categoryColors = {
    SERVICE: '#6b7280',
    CLEANLINESS: '#6b7280',
    AMENITIES: '#6b7280',
    LOCATION: '#6b7280',
    FOOD: '#6b7280',
    PRICES: '#6b7280',
    GENERAL: '#6b7280'
  };

  return (
    <div className="feedback-card-modern" style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="card-glow"></div>
      <div className="card-content">
        <div className="feedback-header-modern">
          <div className="avatar-ring">
            <div 
              className="feedback-avatar-modern"
              style={{ background: getAvatarGradient(feedback.customerName) }}
            >
              {getInitials(feedback.customerName)}
            </div>
          </div>
          <div className="feedback-meta-modern">
            <h4 className="customer-name-modern">{feedback.customerName}</h4>
            <span className="feedback-date-modern">{formatDate(feedback.createdAt)}</span>
          </div>
          <span 
            className="feedback-category-modern"
            style={{ 
              background: `${categoryColors[feedback.category]}15`,
              color: categoryColors[feedback.category],
              borderColor: `${categoryColors[feedback.category]}30`
            }}
          >
            {feedback.category}
          </span>
        </div>

        <div className="feedback-rating-modern">
          <div className="stars-container-modern">
            {renderStars(feedback.rating)}
          </div>
          <span className="rating-badge">{feedback.rating}</span>
        </div>

        <div className="feedback-comment-modern">
          <svg className="quote-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
          <p>{feedback.comment}</p>
        </div>
      </div>
    </div>
  );
};

const FeedbackForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    category: 'GENERAL',
    rating: 8,
    comment: ''
  });
  const [focusedField, setFocusedField] = useState(null);

  const categories = [
    { value: 'SERVICE', label: 'Service', icon: '' },
    { value: 'AMENITIES', label: 'Amenities', icon: '' },
    { value: 'PRICES', label: 'Prices', icon: '' },
    { value: 'GENERAL', label: 'General', icon: '' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ category: 'GENERAL', rating: 8, comment: '' });
  };

  return (
    <form className="feedback-form-modern" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="form-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
          </svg>
        </div>
        <div>
          <h3>Share Your Experience</h3>
          <p>Your feedback helps us improve</p>
        </div>
      </div>

      <div className="form-body">
        <div className={`form-group-modern ${focusedField === 'category' ? 'focused' : ''}`}>
          <label>Category</label>
          <div className="category-chips">
            {categories.map(cat => (
              <button
                key={cat.value}
                type="button"
                className={`category-chip ${formData.category === cat.value ? 'active' : ''}`}
                onClick={() => setFormData({...formData, category: cat.value})}
              >
                <span className="chip-icon">{cat.icon}</span>
                <span className="chip-label">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`form-group-modern ${focusedField === 'rating' ? 'focused' : ''}`}>
          <label>How would you rate your experience?</label>
          <div className="rating-input-modern">
            <input
              type="range"
              min="1"
              max="10"
              value={formData.rating}
              onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
              onFocus={() => setFocusedField('rating')}
              onBlur={() => setFocusedField(null)}
              className="rating-slider-modern"
            />
            <div className="rating-display">
              <span className="rating-number-modern">{formData.rating}</span>
              <span className="rating-label">/ 10</span>
              <div className="rating-emoji">
                {formData.rating >= 9 ? '🤩' : formData.rating >= 7 ? '😊' : formData.rating >= 5 ? '😐' : formData.rating >= 3 ? '😕' : '😞'}
              </div>
            </div>
          </div>
        </div>

        <div className={`form-group-modern ${focusedField === 'comment' ? 'focused' : ''}`}>
          <label>Tell us more</label>
          <div className="textarea-wrapper">
            <textarea
              value={formData.comment}
              onChange={(e) => setFormData({...formData, comment: e.target.value})}
              onFocus={() => setFocusedField('comment')}
              onBlur={() => setFocusedField(null)}
              placeholder="What did you like? What can we improve?"
              rows="4"
              required
              maxLength="2000"
            />
            <span className="char-count-modern">{formData.comment.length}/2000</span>
          </div>
        </div>
      </div>

      <button type="submit" className="submit-feedback-btn-modern" disabled={loading}>
        {loading ? (
          <>
            <div className="spinner-modern"></div>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span>Submit Feedback</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </>
        )}
      </button>
    </form>
  );
};

const FeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchFeedbacks();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('accessToken');
    setIsAuthenticated(!!token);
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackAPI.getAllFeedbacks(0, 6);
      setFeedbacks(response.data.content || []);
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err);
      setError('Failed to load feedbacks');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitFeedback = async (formData) => {
    if (!isAuthenticated) {
      setError('Please login to submit feedback');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await feedbackAPI.createFeedback(formData);
      setSuccessMessage('Thank you for your feedback!');
      await fetchFeedbacks();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      console.error('Failed to submit feedback:', err);
      setError(err.response?.data?.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="feedback-section-modern">
      <div className="feedback-container">
        <div className="section-header-modern">
          <div className="header-badge">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <span>Guest Stories</span>
          </div>
          <h2>What Our Guests Say</h2>
          <p>Real experiences from real travelers</p>
        </div>

        {/* FEEDBACK CARDS - MOVED TO TOP */}
        {loading ? (
          <div className="loading-state-modern">
            <div className="spinner-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <p>Loading stories...</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="empty-state-modern">
            <div className="empty-illustration">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
              </svg>
            </div>
            <h3>No stories yet</h3>
            <p>Be the first to share your experience with us!</p>
          </div>
        ) : (
          <div className="feedback-grid-modern">
            {feedbacks.map((feedback, index) => (
              <FeedbackCard key={feedback.id} feedback={feedback} index={index} />
            ))}
          </div>
        )}

        {/* FEEDBACK FORM - MOVED TO BOTTOM */}
        {isAuthenticated ? (
          <div className="feedback-form-wrapper">
            {error && (
              <div className="alert-modern alert-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {error}
              </div>
            )}
            {successMessage && (
              <div className="alert-modern alert-success">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                {successMessage}
              </div>
            )}
            <FeedbackForm onSubmit={handleSubmitFeedback} loading={submitting} />
          </div>
        ) : (
          <div className="login-prompt-modern">
            <div className="login-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
              </svg>
            </div>
            <h3>Join the Conversation</h3>
            <p>Sign in to share your experience and see what others are saying</p>
            <a href="/login" className="login-btn-modern">Sign In to Share</a>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeedbackSection;