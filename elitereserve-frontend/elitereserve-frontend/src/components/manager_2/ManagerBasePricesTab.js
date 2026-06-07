import React, { useState } from 'react';
import { managerAPI } from '../../services/apiManager';

const Icons = {
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
    Dollar: () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
    ),
    Close: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
    )
};

const fmt = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const BasePricesTab = ({ hotelId, basePrices, roomTypes, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [editPrice, setEditPrice] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const emptyForm = {
        roomTypeId: '',
        pricePerNight: '',
        startDate: '',
        endDate: '',
        seasonName: '',
        isActive: true,
    };
    const [form, setForm] = useState(emptyForm);

    const openCreate = () => {
        setEditPrice(null);
        setForm({ ...emptyForm, isActive: true });
        setError('');
        setShowModal(true);
    };

    const openEdit = (bp) => {
        setEditPrice(bp);
        setForm({
            roomTypeId: bp.roomTypeId || '',
            pricePerNight: bp.basePrice ?? bp.pricePerNight ?? '',
            startDate: bp.effectiveDate || bp.startDate || '',
            endDate: bp.endDate || '',
            seasonName: bp.seasonName || '',
            isActive: bp.active !== undefined ? bp.active : true,
        });
        setError('');
        setShowModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = async () => {
        if (!form.pricePerNight) { setError('Price per night is required.'); return; }
        if (!form.startDate) { setError('Start date is required.'); return; }
        if (!form.endDate) { setError('End date is required.'); return; }
        if (new Date(form.endDate) < new Date(form.startDate)) {
            setError('End date must be after start date.');
            return;
        }

        setSaving(true);
        setError('');

        const payload = {
            pricePerNight: parseFloat(form.pricePerNight),
            startDate: form.startDate,
            endDate: form.endDate,
            seasonName: form.seasonName || null,
            isActive: form.isActive,
        };

        try {
            if (editPrice) {
                await managerAPI.updateBasePrice(editPrice.id, payload);
            } else {
                if (!form.roomTypeId) { setError('Please select a room type.'); setSaving(false); return; }
                await managerAPI.setBasePrice(hotelId, form.roomTypeId, payload);
            }
            setShowModal(false);
            onRefresh();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to save base price.';
            setError(msg);
        } finally {
            setSaving(false);
        }
    };

    const grouped = roomTypes.map(rt => ({
        roomType: rt,
        prices: basePrices.filter(bp => bp.roomTypeId === rt.id || bp.roomType?.id === rt.id),
    })).filter(g => g.prices.length > 0);

    const ungroupedPrices = basePrices.filter(bp => {
        const rtId = bp.roomTypeId || bp.roomType?.id;
        return !roomTypes.find(rt => rt.id === rtId);
    });

    return (
        <div className="tab-container">
            <div className="tab-header">
                <h2>Base Prices ({basePrices.length})</h2>
                <button className="btn-primary" onClick={openCreate}>
                    <Icons.Plus />
                    Set Base Price
                </button>
            </div>

            {basePrices.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                        </svg>
                    </div>
                    <h3>No Base Prices Configured</h3>
                    <p>Set seasonal base prices for your room types. If no base price is set, the room type's default price will be used.</p>
                    <button className="btn-primary" onClick={openCreate}>
                        <Icons.Plus />
                        Set First Base Price
                    </button>
                </div>
            ) : (
                <>
                    {grouped.map(({ roomType, prices }) => (
                        <div key={roomType.id} style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ background: '#eff6ff', color: '#2563eb', borderRadius: 99, padding: '0.2rem 0.75rem', fontSize: '0.82rem', fontWeight: 700 }}>
                                    {roomType.roomTypeName}
                                </span>
                                <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
                                    {prices.length} price period{prices.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <div className="data-table-container">
                                <table className="data-table">
                                    <thead>
                                    <tr>
                                        <th>Season</th>
                                        <th>Price / Night</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {prices.map(bp => {
                                        const now = new Date();
                                        const start = new Date(bp.effectiveDate || bp.startDate);
                                        const end = new Date(bp.endDate);
                                        const isActive = now >= start && now <= end && bp.active !== false;
                                        const isUpcoming = now < start;
                                        const isExpired = now > end;

                                        return (
                                            <tr key={bp.id}>
                                                <td>{bp.seasonName ? <span style={{ fontWeight: 600 }}>{bp.seasonName}</span> : <span style={{ color: '#94a3b8' }}>—</span>}</td>
                                                <td style={{ fontWeight: 700, color: '#2563eb', fontSize: '1rem' }}>
                                                    ${parseFloat(bp.basePrice ?? bp.pricePerNight ?? 0).toFixed(2)}
                                                </td>
                                                <td>{fmt(bp.effectiveDate || bp.startDate)}</td>
                                                <td>{fmt(bp.endDate)}</td>
                                                <td>
                                                    {isActive ? (
                                                        <span className="status-badge badge-available">Active</span>
                                                    ) : isUpcoming ? (
                                                        <span className="status-badge badge-pending">Upcoming</span>
                                                    ) : isExpired ? (
                                                        <span className="status-badge badge-expired">Expired</span>
                                                    ) : (
                                                        <span className="status-badge badge-deactivated">Inactive</span>
                                                    )}
                                                </td>
                                                <td className="actions-cell">
                                                    <button className="btn-icon-edit" onClick={() => openEdit(bp)}>
                                                        <Icons.Edit />
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}

                    {ungroupedPrices.length > 0 && (
                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th>Room Type</th>
                                    <th>Season</th>
                                    <th>Price / Night</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {ungroupedPrices.map(bp => (
                                    <tr key={bp.id}>
                                        <td>{bp.roomTypeName || bp.roomType?.roomTypeName || '—'}</td>
                                        <td>{bp.seasonName || '—'}</td>
                                        <td style={{ fontWeight: 700, color: '#2563eb' }}>
                                            ${parseFloat(bp.basePrice ?? bp.pricePerNight ?? 0).toFixed(2)}
                                        </td>
                                        <td>{fmt(bp.effectiveDate || bp.startDate)}</td>
                                        <td>{fmt(bp.endDate)}</td>
                                        <td className="actions-cell">
                                            <button className="btn-icon-edit" onClick={() => openEdit(bp)}>
                                                <Icons.Edit />
                                                Edit
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editPrice ? 'Edit Base Price' : 'Set Base Price'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1rem', color: '#991b1b', fontSize: '0.88rem' }}>
                                    {error}
                                </div>
                            )}

                            {!editPrice && (
                                <div className="form-group">
                                    <label>Room Type *</label>
                                    <select name="roomTypeId" value={form.roomTypeId} onChange={handleChange}>
                                        <option value="">Select a room type…</option>
                                        {roomTypes.map(rt => (
                                            <option key={rt.id} value={rt.id}>{rt.roomTypeName}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {editPrice && (
                                <div className="form-group">
                                    <label>Room Type</label>
                                    <input value={editPrice.roomTypeName || roomTypes.find(rt => rt.id === editPrice.roomTypeId)?.roomTypeName || '—'} disabled />
                                </div>
                            )}

                            <div className="form-group">
                                <label>Price Per Night ($) *</label>
                                <input type="number" name="pricePerNight" value={form.pricePerNight} onChange={handleChange} min={0} step="0.01" placeholder="e.g. 199.99" />
                            </div>

                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Start Date *</label>
                                    <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>End Date *</label>
                                    <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Season Name</label>
                                <input name="seasonName" value={form.seasonName} onChange={handleChange} placeholder="e.g. Summer 2025, High Season…" />
                                <small>Optional label to identify this pricing period.</small>
                            </div>

                            {editPrice && (
                                <div className="form-group">
                                    <label className="checkbox-label">
                                        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                                        Active (uncheck to deactivate without deleting)
                                    </label>
                                </div>
                            )}

                            <p className="form-note">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14" style={{display:'inline',verticalAlign:'middle',marginRight:'4px'}}><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                This overrides the room type's default price for the selected date range. Prices automatically expire after the end date.
                            </p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                                {saving ? 'Saving…' : editPrice ? 'Update Price' : 'Set Price'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BasePricesTab;