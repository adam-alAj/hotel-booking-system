import React, { useState, useEffect } from 'react';
import { managerAPI, amenitiesAPI } from '../../services/apiManager';
import { getImageUrl } from '../../utils/imageUrl';

const FALLBACK_AMENITIES = [
    'WIFI', 'AIR_CONDITIONING', 'TV', 'MINI_BAR', 'ROOM_SERVICE',
    'SWIMMING_POOL_ACCESS', 'GYM_ACCESS', 'BREAKFAST_INCLUDED',
    'PARKING', 'PET_FRIENDLY', 'LAUNDRY_SERVICE', 'SPA_ACCESS',
    'BALCONY', 'SEA_VIEW', 'KITCHENETTE', 'NON_SMOKING', 'DISABLED_ACCESS'
];

const formatAmenityDisplay = (amenity) => {
    if (!amenity) return '';
    return amenity.toLowerCase().replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

// SVG Icons replacing emojis
const Icons = {
    Bed: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 20V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12M2 20h20M4 20v-4h16v4M8 12h8v4H8v-4z"/>
        </svg>
    ),
    Users: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
    ),
    Dollar: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
    ),
    Plus: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
    ),
    Edit: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 3l4 4L7 21H3v-4L17 3z"/>
        </svg>
    ),
    Cancel: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    )
};

const RoomTypesTab = ({ hotelId, roomTypes = [], onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editType, setEditType] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [failedImages, setFailedImages] = useState({});

    const [allAmenities, setAllAmenities] = useState(FALLBACK_AMENITIES);
    const [loadingAmenities, setLoadingAmenities] = useState(false);

    const [form, setForm] = useState({
        roomTypeName: '',
        capacity: '',
        basePrice: '',
        amenities: []
    });

    const [createForm, setCreateForm] = useState({
        roomTypeName: '',
        capacity: '',
        basePrice: '',
        amenities: []
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchAmenities();
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, []);

    const fetchAmenities = async () => {
        try {
            setLoadingAmenities(true);
            const response = await amenitiesAPI.getAllAmenities();
            if (response.data && response.data.length > 0) {
                setAllAmenities(response.data);
            }
        } catch (err) {
            console.error('Failed to fetch amenities, using fallback');
        } finally {
            setLoadingAmenities(false);
        }
    };

    const openEdit = (rt) => {
        setEditType(rt);
        setForm({
            roomTypeName: rt.roomTypeName || '',
            capacity: rt.capacity || '',
            basePrice: rt.basePrice || '',
            amenities: rt.amenities || []
        });
        setError('');
        setShowModal(true);
    };

    const openCreate = () => {
        setCreateForm({
            roomTypeName: '',
            capacity: '',
            basePrice: '',
            amenities: []
        });
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImageFile(null);
        setImagePreview(null);
        setError('');
        setShowCreateModal(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleAmenityEdit = (amenity) => {
        setForm((prev) => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    const handleCreateChange = (e) => {
        const { name, value } = e.target;
        setCreateForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleAmenityCreate = (amenity) => {
        setCreateForm((prev) => {
            const amenities = prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity];
            return { ...prev, amenities };
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleEditSubmit = async () => {
        if (!form.roomTypeName.trim()) {
            setError('Room type name is required.');
            return;
        }
        setSaving(true);
        setError('');

        const updateData = {
            roomTypeName: form.roomTypeName,
            capacity: form.capacity,
            basePrice: form.basePrice ? parseFloat(form.basePrice) : undefined,
            amenities: form.amenities
        };

        try {
            await managerAPI.patchRoomType(editType.id, updateData);
            setShowModal(false);
            onRefresh();
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.response?.data?.error || err.message;
            setError(backendMessage || 'Failed to update room type.');
        } finally {
            setSaving(false);
        }
    };

    const handleCreateSubmit = async () => {
        if (!createForm.roomTypeName.trim()) {
            setError('Room type name is required.');
            return;
        }
        if (!imageFile) {
            setError('Please upload an image for the room type.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            const fd = new FormData();
            fd.append('file', imageFile);
            fd.append('hotelId', hotelId);
            fd.append('roomTypeName', createForm.roomTypeName);
            fd.append('capacity', createForm.capacity);
            fd.append('basePrice', createForm.basePrice ? parseFloat(createForm.basePrice) : undefined);

            if (createForm.amenities && createForm.amenities.length > 0) {
                createForm.amenities.forEach(amenity => {
                    fd.append('amenities', amenity);
                });
            }

            await managerAPI.createRoomType(fd);
            setShowCreateModal(false);
            onRefresh();
        } catch (err) {
            console.error('Create room type error:', err);
            setError(err.response?.data?.message || 'Failed to create room type.');
        } finally {
            setSaving(false);
        }
    };

    const handleImageError = (roomTypeId) => {
        setFailedImages(prev => ({ ...prev, [roomTypeId]: true }));
    };

    const capacityLabels = {
        SINGLE: 'Single (1 guest)',
        DOUBLE: 'Double (2 guests)',
        TWIN: 'Twin (2 guests)',
        TRIPLE: 'Triple (3 guests)',
        QUAD: 'Quad (4 guests)',
        FAMILY: 'Family (5 guests)',
        SUITE: 'Suite (2 guests)',
        PRESIDENTIAL: 'Presidential (2 guests)'
    };

    return (
        <div className="tab-container">
            <div className="tab-header">
                <div>
                    <h2>Room Types</h2>
                    <p className="tab-description">Manage room categories, amenities, and pricing</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    <Icons.Plus />
                    Add Room Type
                </button>
            </div>

            {roomTypes.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                            <path d="M2 20V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12M2 20h20M4 20v-4h16v4M8 12h8v4H8v-4z"/>
                        </svg>
                    </div>
                    <h3>No Room Types Yet</h3>
                    <p>Create room categories like Deluxe, Suite, Standard, etc.</p>
                    <button className="btn-primary" onClick={openCreate}>
                        <Icons.Plus />
                        Create First Room Type
                    </button>
                </div>
            ) : (
                <div className="room-types-grid">
                    {roomTypes.map((rt) => {
                        const imageUrl = getImageUrl(rt.imageUrl);
                        const imageFailed = failedImages[rt.id];
                        const amenitiesList = rt.amenities || [];

                        return (
                            <div key={rt.id} className="room-type-card">
                                <div className="room-type-card-image">
                                    {rt.imageUrl && !imageFailed ? (
                                        <img src={imageUrl} alt={rt.roomTypeName} onError={() => handleImageError(rt.id)} />
                                    ) : (
                                        <div className="room-type-card-placeholder">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="40" height="40">
                                                <path d="M2 20V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12M2 20h20M4 20v-4h16v4M8 12h8v4H8v-4z"/>
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <div className="room-type-card-content">
                                    <div className="room-type-card-header">
                                        <h3>{rt.roomTypeName}</h3>
                                        <div className="room-type-card-price">
                                            <Icons.Dollar />
                                            {parseFloat(rt.basePrice).toFixed(2)}<span>/night</span>
                                        </div>
                                    </div>
                                    <div className="room-type-card-capacity">
                                        <Icons.Users />
                                        <span>{capacityLabels[rt.capacity] || rt.capacity}</span>
                                    </div>

                                    {/* IMPROVED AMENITIES DISPLAY - SHOWS ALL AMENITIES */}
                                    <div className="room-type-card-amenities">
                                        {amenitiesList.length === 0 ? (
                                            <span className="amenity-tag" style={{ opacity: 0.5 }}>No amenities listed</span>
                                        ) : (
                                            amenitiesList.map((amenity) => (
                                                <span key={amenity} className="amenity-tag" title={formatAmenityDisplay(amenity)}>
                                                    {formatAmenityDisplay(amenity)}
                                                </span>
                                            ))
                                        )}
                                    </div>

                                    <div className="room-type-card-actions">
                                        <button className="btn-icon-edit" onClick={() => openEdit(rt)}>
                                            <Icons.Edit />
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-container modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Edit Room Type</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="error-box">{error}</div>}
                            <div className="form-group">
                                <label>Room Type Name *</label>
                                <input type="text" name="roomTypeName" value={form.roomTypeName} onChange={handleEditChange} placeholder="e.g. Deluxe Suite" />
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Capacity</label>
                                    <select name="capacity" value={form.capacity} onChange={handleEditChange}>
                                        <option value="">Select capacity...</option>
                                        {Object.entries(capacityLabels).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Base Price / Night ($)</label>
                                    <input type="number" name="basePrice" value={form.basePrice} onChange={handleEditChange} min="0" step="0.01" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Amenities</label>
                                {loadingAmenities ? (
                                    <div className="loading-text">Loading amenities...</div>
                                ) : (
                                    <div className="amenities-grid">
                                        {allAmenities.map((a) => (
                                            <label key={a} className="checkbox-label">
                                                <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenityEdit(a)} />
                                                {formatAmenityDisplay(a)}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <p className="form-note">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                To change the image, please delete and recreate this room type.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleEditSubmit} disabled={saving}>
                                {saving ? 'Saving…' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-container modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create Room Type</h3>
                            <button className="modal-close" onClick={() => setShowCreateModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="error-box">{error}</div>}
                            <div className="form-group">
                                <label>Room Type Image *</label>
                                <input type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif" onChange={handleImageChange} required />
                                {imagePreview && (
                                    <div className="image-preview">
                                        <img src={imagePreview} alt="preview" />
                                    </div>
                                )}
                                <small>Upload a representative image for this room type</small>
                            </div>
                            <div className="form-group">
                                <label>Room Type Name *</label>
                                <input type="text" name="roomTypeName" value={createForm.roomTypeName} onChange={handleCreateChange} placeholder="e.g. Deluxe Suite" required />
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Capacity</label>
                                    <select name="capacity" value={createForm.capacity} onChange={handleCreateChange}>
                                        <option value="">Select capacity...</option>
                                        {Object.entries(capacityLabels).map(([key, label]) => (
                                            <option key={key} value={key}>{label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Base Price / Night ($)</label>
                                    <input type="number" name="basePrice" value={createForm.basePrice} onChange={handleCreateChange} min="0" step="0.01" placeholder="0.00" />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Amenities</label>
                                {loadingAmenities ? (
                                    <div className="loading-text">Loading amenities...</div>
                                ) : (
                                    <div className="amenities-grid">
                                        {allAmenities.map((a) => (
                                            <label key={a} className="checkbox-label">
                                                <input type="checkbox" checked={createForm.amenities.includes(a)} onChange={() => toggleAmenityCreate(a)} />
                                                {formatAmenityDisplay(a)}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleCreateSubmit} disabled={saving}>
                                {saving ? 'Creating…' : 'Create Room Type'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomTypesTab;