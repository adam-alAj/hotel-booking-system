import React, { useState } from 'react';
import { managerAPI, roomAPI } from '../../services/apiManager';

const ROOM_STATUSES = ['AVAILABLE', 'MAINTENANCE', 'DEACTIVATED'];

const statusClass = (s) => {
    if (!s) return '';
    const map = {
        AVAILABLE: 'badge-available',
        MAINTENANCE: 'badge-maintenance',
        DEACTIVATED: 'badge-deactivated',
    };
    return map[s] || '';
};

const statusIcon = (s) => {
    if (!s) return <span className="status-dot available"></span>;
    const map = {
        AVAILABLE: <span className="status-dot available"></span>,
        MAINTENANCE: <span className="status-dot maintenance"></span>,
        DEACTIVATED: <span className="status-dot deactivated"></span>,
    };
    return map[s] || <span className="status-dot"></span>;
};

const RoomsTab = ({ hotelId, rooms, roomTypes, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [editRoom, setEditRoom] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [showEditRoomTypeModal, setShowEditRoomTypeModal] = useState(false);
    const [selectedRoomForType, setSelectedRoomForType] = useState(null);
    const [newRoomTypeId, setNewRoomTypeId] = useState('');

    const emptyForm = { roomNumber: '', roomTypeId: '', roomStatus: 'AVAILABLE' };
    const [form, setForm] = useState(emptyForm);

    const openCreate = () => {
        setEditRoom(null);
        setForm(emptyForm);
        setError('');
        setShowModal(true);
    };

    const openEdit = (room) => {
        setEditRoom(room);
        setForm({
            roomNumber: room.roomNumber || '',
            roomTypeId: room.roomType?.id || room.roomTypeId || '',
            roomStatus: room.roomStatus || 'AVAILABLE',
        });
        setError('');
        setShowModal(true);
    };

    const openEditRoomType = (room) => {
        setSelectedRoomForType(room);
        setNewRoomTypeId(room.roomType?.id || room.roomTypeId || '');
        setError('');
        setShowEditRoomTypeModal(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!form.roomNumber.trim()) {
            setError('Room number is required.');
            return;
        }
        if (!form.roomTypeId) {
            setError('Please select a room type.');
            return;
        }

        setSaving(true);
        setError('');
        try {
            if (editRoom) {
                await managerAPI.patchRoom(editRoom.id, {
                    roomNumber: form.roomNumber,
                    roomStatus: form.roomStatus,
                    roomTypeId: parseInt(form.roomTypeId, 10),
                });
            } else {
                await managerAPI.createRoom({
                    roomNumber: form.roomNumber,
                    roomTypeId: parseInt(form.roomTypeId, 10),
                    roomStatus: form.roomStatus,
                    hotelId: hotelId,
                });
            }
            setShowModal(false);
            onRefresh();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save room. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateRoomType = async () => {
        if (!newRoomTypeId) {
            setError('Please select a room type');
            return;
        }

        setSaving(true);
        setError('');
        try {
            await managerAPI.patchRoom(selectedRoomForType.id, {
                roomTypeId: parseInt(newRoomTypeId, 10),
                roomStatus: selectedRoomForType.roomStatus,
            });
            setShowEditRoomTypeModal(false);
            onRefresh();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update room type.');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteRoom = async (roomId, roomNumber) => {
        if (!window.confirm(`Are you sure you want to delete Room ${roomNumber}? This cannot be undone.`)) return;

        setDeletingId(roomId);
        try {
            await roomAPI.deleteRoom(roomId);
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete room. Make sure it has no active bookings.');
        } finally {
            setDeletingId(null);
        }
    };

    const getRoomTypeName = (room) => {
        if (room.roomType?.roomTypeName) return room.roomType.roomTypeName;
        if (room.roomTypeName) return room.roomTypeName;
        const foundType = roomTypes.find((rt) => rt.id === (room.roomTypeId || room.roomType?.id));
        return foundType?.roomTypeName || '—';
    };

    const getRoomCountByStatus = (status) => {
        return rooms.filter(room => room.roomStatus === status).length;
    };

    return (
        <div className="tab-container">
            <div className="tab-header">
                <div>
                    <h2>Room Management</h2>
                    <p className="tab-description">Manage physical rooms, their types and availability status</p>
                </div>
                <button className="btn-primary" onClick={openCreate}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Add New Room
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-row-mini">
                <div className="stat-card-mini">
                    <span className="stat-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                            <path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M10 21V7l2-4 2 4v14"/>
                        </svg>
                    </span>
                    <div>
                        <span className="stat-value-mini">{rooms.length}</span>
                        <span className="stat-label-mini">Total Rooms</span>
                    </div>
                </div>
                <div className="stat-card-mini success">
                    <span className="stat-icon"><span className="status-dot available"></span></span>
                    <div>
                        <span className="stat-value-mini">{getRoomCountByStatus('AVAILABLE')}</span>
                        <span className="stat-label-mini">Available</span>
                    </div>
                </div>
                <div className="stat-card-mini warning">
                    <span className="stat-icon"><span className="status-dot maintenance"></span></span>
                    <div>
                        <span className="stat-value-mini">{getRoomCountByStatus('MAINTENANCE')}</span>
                        <span className="stat-label-mini">Maintenance</span>
                    </div>
                </div>
                <div className="stat-card-mini danger">
                    <span className="stat-icon"><span className="status-dot deactivated"></span></span>
                    <div>
                        <span className="stat-value-mini">{getRoomCountByStatus('DEACTIVATED')}</span>
                        <span className="stat-label-mini">Deactivated</span>
                    </div>
                </div>
            </div>

            {rooms.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                            <path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M10 21V7l2-4 2 4v14"/>
                        </svg>
                    </div>
                    <h3>No Rooms Yet</h3>
                    <p>Add physical rooms to this hotel to start accepting bookings.</p>
                    <button className="btn-primary" onClick={openCreate}>Add Your First Room</button>
                </div>
            ) : (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Room #</th>
                            <th>Room Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rooms.map((room) => (
                            <tr key={room.id}>
                                <td className="room-number-cell">
                                    <span className="room-number-badge">#{room.roomNumber}</span>
                                </td>
                                <td className="room-type-cell">
                                    <span className="room-type-badge">{getRoomTypeName(room)}</span>
                                </td>
                                <td>
                                        <span className={`status-badge ${statusClass(room.roomStatus)}`}>
                                            {statusIcon(room.roomStatus)} {room.roomStatus}
                                        </span>
                                </td>
                                <td className="actions-cell">
                                    <button className="btn-icon-edit" onClick={() => openEdit(room)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17 3l4 4L7 21H3v-4L17 3z"/>
                                        </svg>
                                        Edit
                                    </button>
                                    <button className="btn-icon-change" onClick={() => openEditRoomType(room)}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                                        </svg>
                                        Change Type
                                    </button>
                                    <button className="btn-icon-delete" onClick={() => handleDeleteRoom(room.id, room.roomNumber)} disabled={deletingId === room.id}>
                                        {deletingId === room.id ? (
                                            <div className="btn-spinner-small"></div>
                                        ) : (
                                            <>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                                    <line x1="14" y1="11" x2="14" y2="17"/>
                                                </svg>
                                                Delete
                                            </>
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Create/Edit Room Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editRoom ? 'Edit Room' : 'Add New Room'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="error-box">{error}</div>}
                            <div className="form-group">
                                <label>Room Number *</label>
                                <input
                                    name="roomNumber"
                                    value={form.roomNumber}
                                    onChange={handleChange}
                                    placeholder="e.g., 101, 202, 304"
                                    disabled={!!editRoom}
                                />
                                <small>Unique identifier for this room (cannot be changed after creation)</small>
                            </div>
                            {!editRoom && (
                                <div className="form-group">
                                    <label>Room Type *</label>
                                    <select name="roomTypeId" value={form.roomTypeId} onChange={handleChange}>
                                        <option value="">Select room type...</option>
                                        {roomTypes.map((rt) => (
                                            <option key={rt.id} value={rt.id}>{rt.roomTypeName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="form-group">
                                <label>Status</label>
                                <select name="roomStatus" value={form.roomStatus} onChange={handleChange}>
                                    {ROOM_STATUSES.map((s) => (
                                        <option key={s} value={s}>
                                            {s === 'AVAILABLE' ? '● Available' : s === 'MAINTENANCE' ? '● Maintenance' : '● Deactivated'}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                                {saving ? 'Saving...' : editRoom ? 'Save Changes' : 'Add Room'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Change Room Type Modal */}
            {showEditRoomTypeModal && selectedRoomForType && (
                <div className="modal-overlay" onClick={() => setShowEditRoomTypeModal(false)}>
                    <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Change Room Type - Room {selectedRoomForType.roomNumber}</h3>
                            <button className="modal-close" onClick={() => setShowEditRoomTypeModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {error && <div className="error-box">{error}</div>}
                            <div className="form-group">
                                <label>Current Room Type</label>
                                <input type="text" value={getRoomTypeName(selectedRoomForType)} disabled style={{ background: 'var(--bg-primary)' }} />
                            </div>
                            <div className="form-group">
                                <label>New Room Type</label>
                                <select value={newRoomTypeId} onChange={(e) => setNewRoomTypeId(e.target.value)}>
                                    <option value="">Select room type...</option>
                                    {roomTypes.map((rt) => (
                                        <option key={rt.id} value={rt.id}>{rt.roomTypeName}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="form-note">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                Changing room type will update the room's category. The room number and status remain the same.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowEditRoomTypeModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleUpdateRoomType} disabled={saving}>
                                {saving ? 'Updating...' : 'Update Room Type'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomsTab;