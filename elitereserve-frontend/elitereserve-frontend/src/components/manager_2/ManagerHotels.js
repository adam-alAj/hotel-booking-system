import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { managerAPI } from '../../services/apiManager';
import { getImageUrl } from '../../utils/imageUrl';
import './ManagerHotels.css';

const ManagerHotels = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingHotel, setEditingHotel] = useState(null);
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [editError, setEditError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [editImagePreview, setEditImagePreview] = useState(null);
    const [newHotel, setNewHotel] = useState({
        name: '',
        city: '',
        address: '',
        description: '',
        rating: 8.5,
        isActive: true,
        imageFile: null
    });
    const [editHotel, setEditHotel] = useState({
        name: '',
        city: '',
        address: '',
        description: '',
        rating: 8.5,
        isActive: true,
        imageFile: null
    });

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const response = await managerAPI.getMyHotels();
            setHotels(response.data || []);
        } catch (err) {
            console.error('Failed to fetch hotels:', err);
            setError('Failed to load your hotels. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleManageHotel = (hotelId) => {
        navigate(`/manager-dashboard/${hotelId}`);
    };

    const handleDeleteHotel = async (hotelId, hotelName) => {
        if (!window.confirm(`Are you sure you want to delete "${hotelName}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingId(hotelId);
        try {
            await managerAPI.deleteHotel(hotelId);
            fetchHotels();
        } catch (err) {
            console.error('Failed to delete hotel:', err);
            const errorMessage = err.response?.data?.message || 'Failed to delete hotel. Please try again.';
            alert(errorMessage);
        } finally {
            setDeletingId(null);
        }
    };

    const handleAddHotel = () => {
        setShowCreateModal(true);
        setNewHotel({
            name: '',
            city: '',
            address: '',
            description: '',
            rating: 8.5,
            isActive: true,
            imageFile: null
        });
        setImagePreview(null);
        setCreateError('');
    };

    const handleEditHotel = (hotel) => {
        setEditingHotel(hotel);
        setEditHotel({
            name: hotel.name || '',
            city: hotel.city || '',
            address: hotel.address || '',
            description: hotel.description || '',
            rating: hotel.averageRating || 8.5,
            isActive: hotel.isActive !== undefined ? hotel.isActive : true,
            imageFile: null
        });
        // Set existing image preview
        if (hotel.imageUrl) {
            setEditImagePreview(getImageUrl(hotel.imageUrl));
        } else {
            setEditImagePreview(null);
        }
        setEditError('');
        setShowEditModal(true);
    };

    const handleCreateChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewHotel(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleEditChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditHotel(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleCreateImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewHotel(prev => ({
                ...prev,
                imageFile: file
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditHotel(prev => ({
                ...prev,
                imageFile: file
            }));
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();

        if (!newHotel.name.trim()) {
            setCreateError('Hotel name is required');
            return;
        }
        if (!newHotel.city.trim()) {
            setCreateError('City is required');
            return;
        }
        if (!newHotel.address.trim()) {
            setCreateError('Address is required');
            return;
        }
        if (!newHotel.imageFile) {
            setCreateError('Hotel image is required');
            return;
        }

        setCreating(true);
        setCreateError('');

        try {
            const formData = new FormData();
            formData.append('file', newHotel.imageFile);
            formData.append('name', newHotel.name);
            formData.append('city', newHotel.city);
            formData.append('address', newHotel.address);
            formData.append('description', newHotel.description || '');
            formData.append('rating', newHotel.rating);
            formData.append('isActive', newHotel.isActive);

            await managerAPI.createHotel(formData);
            setShowCreateModal(false);
            fetchHotels();
        } catch (err) {
            console.error('Failed to create hotel:', err);
            setCreateError(err.response?.data?.message || 'Failed to create hotel. Please try again.');
        } finally {
            setCreating(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!editHotel.name.trim()) {
            setEditError('Hotel name is required');
            return;
        }
        if (!editHotel.city.trim()) {
            setEditError('City is required');
            return;
        }
        if (!editHotel.address.trim()) {
            setEditError('Address is required');
            return;
        }

        setUpdating(true);
        setEditError('');

        try {
            const formData = new FormData();

            // Only append file if a new one was selected
            if (editHotel.imageFile) {
                formData.append('file', editHotel.imageFile);
            }

            formData.append('name', editHotel.name);
            formData.append('city', editHotel.city);
            formData.append('address', editHotel.address);
            formData.append('description', editHotel.description || '');
            formData.append('rating', editHotel.rating);
            formData.append('isActive', editHotel.isActive);

            await managerAPI.updateHotel(editingHotel.id, formData);
            setShowEditModal(false);
            fetchHotels();
        } catch (err) {
            console.error('Failed to update hotel:', err);
            setEditError(err.response?.data?.message || 'Failed to update hotel. Please try again.');
        } finally {
            setUpdating(false);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating / 2);
        for (let i = 0; i < 5; i++) {
            stars.push(
                <svg key={i} className={`star ${i < fullStars ? 'filled' : ''}`} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <div className="manager-hotels-loading">
                <div className="spinner"></div>
                <p>Loading your hotels...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="manager-hotels-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Error Loading Hotels</h3>
                <p>{error}</p>
                <button className="retry-btn" onClick={fetchHotels}>Try Again</button>
            </div>
        );
    }

    return (
        <div className="manager-hotels-page">
            {/* ═══════════════════════════════════════════════════════════
                HERO SECTION — Premium layered design with mesh gradient,
                floating geometric shapes, and glassmorphic stat cards
               ═══════════════════════════════════════════════════════════ */}
            <section className="hero-premium">
                {/* Decorative floating shapes */}
                <div className="hero-shapes" aria-hidden="true">
                    <div className="hero-shape hero-shape-1"></div>
                    <div className="hero-shape hero-shape-2"></div>
                    <div className="hero-shape hero-shape-3"></div>
                    <div className="hero-grid-overlay"></div>
                </div>

                <div className="hero-inner">
                    {/* Text content */}
                    <div className="hero-text">
                        <span className="hero-eyebrow">Manager Portal</span>
                        <h1 className="hero-title">My Hotels</h1>
                        <p className="hero-subtitle">
                            Manage your properties, track bookings, and optimize your hotel performance
                        </p>
                        <button className="hero-cta" onClick={handleAddHotel}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19"/>
                                <line x1="5" y1="12" x2="19" y2="12"/>
                            </svg>
                            <span>Add New Hotel</span>
                        </button>
                    </div>

                    {/* Stat cards — glassmorphic */}
                    <div className="hero-stats">
                        <div className="hero-stat-card">
                            <div className="hero-stat-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M10 21V7l2-4 2 4v14"/>
                                </svg>
                            </div>
                            <div className="hero-stat-value">{hotels.length}</div>
                            <div className="hero-stat-label">Total Properties</div>
                        </div>
                        <div className="hero-stat-card">
                            <div className="hero-stat-icon active">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                                    <polyline points="22 4 12 14.01 9 11.01"/>
                                </svg>
                            </div>
                            <div className="hero-stat-value">{hotels.filter(h => h.isActive).length}</div>
                            <div className="hero-stat-label">Active Hotels</div>
                        </div>
                    </div>
                </div>
            </section>

            {hotels.length === 0 ? (
                <div className="no-hotels">
                    <div className="no-hotels-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M10 21V7l2-4 2 4v14"/>
                        </svg>
                    </div>
                    <h3>No Hotels Yet</h3>
                    <p>Click the button above to create your first property and start managing your hotel portfolio.</p>
                    <button className="add-hotel-btn" onClick={handleAddHotel}>
                        + Add Your First Hotel
                    </button>
                </div>
            ) : (
                <div className="hotels-grid-enhanced">
                    {hotels.map(hotel => (
                        <div key={hotel.id} className="hotel-card-enhanced">
                            <div className="hotel-card-image">
                                <img
                                    src={getImageUrl(hotel.imageUrl) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                    alt={hotel.name}
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                                    }}
                                />
                                <div className={`hotel-status ${hotel.isActive ? 'active' : 'inactive'}`}>
                                    {hotel.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                            <div className="hotel-card-content">
                                <div className="hotel-card-header">
                                    <h3>{hotel.name}</h3>
                                    <div className="hotel-location">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                            <circle cx="12" cy="10" r="3"/>
                                        </svg>
                                        {hotel.city}
                                    </div>
                                </div>
                                <div className="hotel-rating">
                                    <div className="stars">{renderStars(hotel.averageRating || 0)}</div>
                                    <span className="rating-score">{hotel.averageRating?.toFixed(1) || 'New'}</span>
                                    <span className="review-count">({hotel.totalReviews || 0} reviews)</span>
                                </div>
                                <p className="hotel-description">
                                    {hotel.description || 'Experience luxury and comfort in this exquisite property featuring world-class amenities.'}
                                </p>
                                <div className="hotel-card-actions">
                                    <button className="manage-btn-enhanced" onClick={() => handleManageHotel(hotel.id)}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                                            <circle cx="12" cy="12" r="3"/>
                                        </svg>
                                        Manage Hotel
                                    </button>
                                    <button className="edit-btn-enhanced" onClick={() => handleEditHotel(hotel)}>
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 3l4 4L7 21H3v-4L17 3z"/>
                                        </svg>
                                        Edit
                                    </button>
                                    <button className="delete-btn-enhanced" onClick={() => handleDeleteHotel(hotel.id, hotel.name)} disabled={deletingId === hotel.id}>
                                        {deletingId === hotel.id ? (
                                            <div className="btn-spinner-small"></div>
                                        ) : (
                                            <>
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                                </svg>
                                                Delete
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Hotel Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create New Hotel</h3>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {createError && (
                                <div className="error-box">
                                    {createError}
                                </div>
                            )}

                            <form onSubmit={handleCreateSubmit}>
                                <div className="form-group">
                                    <label>Hotel Name *</label>
                                    <input type="text" name="name" value={newHotel.name} onChange={handleCreateChange} placeholder="e.g., Grand Plaza Hotel" required />
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input type="text" name="city" value={newHotel.city} onChange={handleCreateChange} placeholder="e.g., New York" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Address *</label>
                                        <input type="text" name="address" value={newHotel.address} onChange={handleCreateChange} placeholder="Full address" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={newHotel.description} onChange={handleCreateChange} rows="3" placeholder="Describe your hotel..." />
                                </div>

                                <div className="form-group">
                                    <label>Hotel Image *</label>
                                    <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" onChange={handleCreateImageChange} />
                                    {imagePreview && (
                                        <div className="image-preview">
                                            <img src={imagePreview} alt="Preview" />
                                        </div>
                                    )}
                                    <small>Upload a main image for your hotel (JPEG, PNG, WebP)</small>
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Rating (0-10)</label>
                                        <input type="number" name="rating" value={newHotel.rating} onChange={handleCreateChange} min="0" max="10" step="0.1" />
                                    </div>
                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="isActive" checked={newHotel.isActive} onChange={handleCreateChange} />
                                            Active (show on website)
                                        </label>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={creating}>
                                        {creating ? 'Creating...' : 'Create Hotel'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Hotel Modal */}
            {showEditModal && editingHotel && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Hotel: {editingHotel.name}</h3>
                            <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {editError && (
                                <div className="error-box">
                                    {editError}
                                </div>
                            )}

                            <form onSubmit={handleEditSubmit}>
                                <div className="form-group">
                                    <label>Hotel Name *</label>
                                    <input type="text" name="name" value={editHotel.name} onChange={handleEditChange} placeholder="e.g., Grand Plaza Hotel" required />
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input type="text" name="city" value={editHotel.city} onChange={handleEditChange} placeholder="e.g., New York" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Address *</label>
                                        <input type="text" name="address" value={editHotel.address} onChange={handleEditChange} placeholder="Full address" required />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="description" value={editHotel.description} onChange={handleEditChange} rows="3" placeholder="Describe your hotel..." />
                                </div>

                                <div className="form-group">
                                    <label>Hotel Image</label>
                                    <input type="file" accept="image/jpeg,image/png,image/webp,image/jpg" onChange={handleEditImageChange} />
                                    {editImagePreview && (
                                        <div className="image-preview">
                                            <img src={editImagePreview} alt="Current preview" />
                                            <small style={{ display: 'block', marginTop: '0.5rem', color: '#64748b' }}>
                                                Current image shown. Select a new file to replace it.
                                            </small>
                                        </div>
                                    )}
                                    <small>Leave empty to keep current image, or upload a new one (JPEG, PNG, WebP)</small>
                                </div>

                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Rating (0-10)</label>
                                        <input type="number" name="rating" value={editHotel.rating} onChange={handleEditChange} min="0" max="10" step="0.1" />
                                    </div>
                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input type="checkbox" name="isActive" checked={editHotel.isActive} onChange={handleEditChange} />
                                            Active (show on website)
                                        </label>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                                    <button type="submit" className="btn-primary" disabled={updating}>
                                        {updating ? 'Updating...' : 'Update Hotel'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerHotels;