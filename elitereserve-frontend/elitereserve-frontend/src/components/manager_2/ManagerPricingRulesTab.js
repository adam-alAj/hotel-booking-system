import React, { useState } from 'react';
import { managerAPI } from '../../services/apiManager';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const RULE_TYPES = [
    'EARLY_BIRD',
    'LAST_MINUTE',
    'LONG_STAY',
    'WEEKEND',
    'SEASONAL',
    'HOLIDAY',
    'OCCUPANCY_BASED',
    'LENGTH_OF_STAY'
];

const PricingRulesTab = ({ hotelId, rules, roomTypes, onRefresh }) => {
    const [showModal, setShowModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [editRule, setEditRule] = useState(null);
    const [assignRule, setAssignRule] = useState(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
    const [deletingId, setDeletingId] = useState(null);

    const emptyForm = {
        ruleName: '',
        description: '',
        adjustmentPercent: '',
        ruleType: '',
        minDaysBeforeCheckin: '',
        maxDaysBeforeCheckin: '',
        minStayDays: '',
        validFrom: '',
        validTo: '',
        applicableDays: [],
        priority: '0',
        active: true,
    };
    const [form, setForm] = useState(emptyForm);

    const openCreate = () => {
        setEditRule(null);
        setForm(emptyForm);
        setError('');
        setShowModal(true);
    };

    const openEdit = (rule) => {
        setEditRule(rule);
        setForm({
            ruleName: rule.ruleName || '',
            description: rule.description || '',
            adjustmentPercent: rule.adjustmentPercent ?? '',
            ruleType: rule.ruleType || '',
            minDaysBeforeCheckin: rule.minDaysBeforeCheckin ?? '',
            maxDaysBeforeCheckin: rule.maxDaysBeforeCheckin ?? '',
            minStayDays: rule.minStayDays ?? '',
            validFrom: rule.validFrom || '',
            validTo: rule.validTo || '',
            applicableDays: rule.applicableDays || [],
            priority: rule.priority ?? '0',
            active: rule.active ?? true,
        });
        setError('');
        setShowModal(true);
    };

    const openAssign = (rule) => {
        setAssignRule(rule);
        const current = (rule.applicableRoomTypes || []).map(rt => rt.id || rt);
        setSelectedRoomTypes(current);
        setShowAssignModal(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const toggleDay = (day) => {
        setForm(prev => ({
            ...prev,
            applicableDays: prev.applicableDays.includes(day)
                ? prev.applicableDays.filter(d => d !== day)
                : [...prev.applicableDays, day],
        }));
    };

    const toggleRoomType = (id) => {
        setSelectedRoomTypes(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const buildPayload = () => {
        const payload = {
            ruleName: form.ruleName,
            ruleType: form.ruleType,
            adjustmentPercent: form.adjustmentPercent !== '' ? parseFloat(form.adjustmentPercent) : 0,
            priority: parseInt(form.priority, 10) || 0,
            active: form.active,
        };

        // Optional fields
        if (form.description) payload.description = form.description;
        if (form.minDaysBeforeCheckin !== '') payload.minDaysBeforeCheckin = parseInt(form.minDaysBeforeCheckin, 10);
        if (form.maxDaysBeforeCheckin !== '') payload.maxDaysBeforeCheckin = parseInt(form.maxDaysBeforeCheckin, 10);
        if (form.minStayDays !== '') payload.minStayDays = parseInt(form.minStayDays, 10);
        if (form.validFrom) payload.validFrom = form.validFrom;
        if (form.validTo) payload.validTo = form.validTo;
        if (form.applicableDays.length > 0) payload.applicableDays = form.applicableDays;

        return payload;
    };

    const handleSubmit = async () => {
        if (!form.ruleName.trim()) {
            setError('Rule name is required.');
            return;
        }
        if (form.adjustmentPercent === '') {
            setError('Adjustment % is required.');
            return;
        }
        if (!form.ruleType) {
            setError('Rule type is required.');
            return;
        }

        setSaving(true);
        setError('');

        try {
            if (editRule) {
                await managerAPI.patchPricingRule(editRule.id, buildPayload());
            } else {
                await managerAPI.createPricingRule(hotelId, buildPayload());
            }
            setShowModal(false);
            onRefresh();
        } catch (err) {
            console.error('Save rule error:', err);
            setError(err.response?.data?.message || 'Failed to save rule.');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (ruleId, ruleName) => {
        if (!window.confirm(`Delete pricing rule "${ruleName}"? This cannot be undone.`)) return;

        setDeletingId(ruleId);
        try {
            await managerAPI.deletePricingRule(ruleId);
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete rule.');
        } finally {
            setDeletingId(null);
        }
    };

    const handleAssign = async () => {
        setSaving(true);
        try {
            await managerAPI.assignRuleToRoomTypes(assignRule.id, selectedRoomTypes);
            setShowAssignModal(false);
            onRefresh();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to assign room types.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="tab-container">
            <div className="tab-header">
                <h2>Pricing Rules ({rules.length})</h2>
                <button className="btn-primary" onClick={openCreate}>+ Add Rule</button>
            </div>

            {rules.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                            <line x1="7" y1="7" x2="7.01" y2="7"/>
                        </svg>
                    </div>
                    <h3>No Pricing Rules</h3>
                    <p>Add dynamic pricing rules like early bird discounts, weekend surcharges, etc.</p>
                    <button className="btn-primary" onClick={openCreate}>Create First Rule</button>
                </div>
            ) : (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Adjustment</th>
                            <th>Priority</th>
                            <th>Valid Period</th>
                            <th>Status</th>
                            <th>Actions</th></tr>
                        </thead>
                        <tbody>
                        {rules.map(rule => (
                            <tr key={rule.id}>
                                <td style={{ fontWeight: 600 }}>{rule.ruleName}</td>
                                <td>
                                        <span style={{
                                            background: '#e2e8f0',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            fontWeight: 500
                                        }}>
                                            {rule.ruleType || '—'}
                                        </span>
                                </td>
                                <td>
                                        <span style={{
                                            fontWeight: 700,
                                            color: rule.adjustmentPercent > 0 ? '#dc2626' : '#16a34a',
                                        }}>
                                            {rule.adjustmentPercent > 0 ? '+' : ''}{rule.adjustmentPercent}%
                                        </span>
                                </td>
                                <td>{rule.priority ?? 0}</td>
                                <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                                    {rule.validFrom && rule.validTo
                                        ? `${rule.validFrom} → ${rule.validTo}`
                                        : rule.validFrom || rule.validTo || 'Always'}
                                </td>
                                <td>
                                        <span className={`status-badge ${rule.active ? 'badge-available' : 'badge-deactivated'}`}>
                                            {rule.active ? 'Active' : 'Inactive'}
                                        </span>
                                </td>
                                <td className="actions-cell">
                                    <button className="btn-icon-edit" onClick={() => openEdit(rule)}>Edit</button>
                                    <button
                                        className="btn-icon-edit"
                                        style={{ background: '#f0fdf4', color: '#16a34a' }}
                                        onClick={() => openAssign(rule)}
                                    >
                                        Assign
                                    </button>
                                    <button
                                        className="btn-icon-delete"
                                        onClick={() => handleDelete(rule.id, rule.ruleName)}
                                        disabled={deletingId === rule.id}
                                    >
                                        {deletingId === rule.id ? '...' : 'Delete'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                )}

            {/* Create / Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-container modal-large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editRule ? 'Edit Pricing Rule' : 'Create Pricing Rule'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            {error && (
                                <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1rem', color: '#991b1b', fontSize: '0.88rem' }}>
                                    {error}
                                </div>
                            )}
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Rule Name *</label>
                                    <input name="ruleName" value={form.ruleName} onChange={handleChange} placeholder="e.g. Early Bird Discount" />
                                </div>
                                <div className="form-group">
                                    <label>Rule Type *</label>
                                    <select name="ruleType" value={form.ruleType} onChange={handleChange}>
                                        <option value="">Select rule type...</option>
                                        {RULE_TYPES.map(type => (
                                            <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Adjustment % *</label>
                                    <input type="number" name="adjustmentPercent" value={form.adjustmentPercent} onChange={handleChange} step="0.1" placeholder="e.g. -15 or +20" />
                                    <small>Negative = discount, Positive = surcharge</small>
                                </div>
                                <div className="form-group">
                                    <label>Priority</label>
                                    <input type="number" name="priority" value={form.priority} onChange={handleChange} min="0" />
                                    <small>Higher priority rules are applied first.</small>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <input name="description" value={form.description} onChange={handleChange} placeholder="Optional description" />
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Valid From</label>
                                    <input type="date" name="validFrom" value={form.validFrom} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Valid To</label>
                                    <input type="date" name="validTo" value={form.validTo} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Min Days Before Check-in</label>
                                    <input type="number" name="minDaysBeforeCheckin" value={form.minDaysBeforeCheckin} onChange={handleChange} min="0" />
                                </div>
                                <div className="form-group">
                                    <label>Max Days Before Check-in</label>
                                    <input type="number" name="maxDaysBeforeCheckin" value={form.maxDaysBeforeCheckin} onChange={handleChange} min="0" />
                                </div>
                            </div>
                            <div className="form-row-2">
                                <div className="form-group">
                                    <label>Min Stay (nights)</label>
                                    <input type="number" name="minStayDays" value={form.minStayDays} onChange={handleChange} min="1" />
                                </div>
                                <div className="form-group">
                                    <label>Active</label>
                                    <label className="checkbox-label" style={{ marginTop: '1.5rem' }}>
                                        <input type="checkbox" name="active" checked={form.active} onChange={handleChange} />
                                        Rule is Active
                                    </label>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Applicable Days (leave empty for all days)</label>
                                <div className="checkbox-grid">
                                    {DAYS.map(d => (
                                        <label key={d} className="checkbox-label">
                                            <input type="checkbox" checked={form.applicableDays.includes(d)} onChange={() => toggleDay(d)} />
                                            {d.charAt(0) + d.slice(1).toLowerCase()}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
                                {saving ? 'Saving…' : editRule ? 'Save Changes' : 'Create Rule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Room Types Modal */}
            {showAssignModal && assignRule && (
                <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
                    <div className="modal-container" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Assign Room Types — {assignRule.ruleName}</h3>
                            <button className="modal-close" onClick={() => setShowAssignModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 0 }}>
                                Select which room types this rule applies to. Leave all unchecked to apply to all room types.
                            </p>
                            {roomTypes.length === 0 ? (
                                <p style={{ color: '#64748b' }}>No room types available.</p>
                            ) : (
                                <div className="checkbox-grid" style={{ maxHeight: 'none' }}>
                                    {roomTypes.map(rt => (
                                        <label key={rt.id} className="checkbox-label">
                                            <input type="checkbox" checked={selectedRoomTypes.includes(rt.id)} onChange={() => toggleRoomType(rt.id)} />
                                            {rt.roomTypeName}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleAssign} disabled={saving}>
                                {saving ? 'Saving…' : 'Save Assignment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingRulesTab;