import React, { useState } from 'react';

const Icons = {
    Search: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
    )
};

const STATUS_FILTERS = ['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED', 'COMPLETED', 'REFUNDED'];

const badgeClass = (status) => {
    const map = { CONFIRMED: 'badge-confirmed', PENDING: 'badge-pending', CANCELLED: 'badge-cancelled', COMPLETED: 'badge-completed', REFUNDED: 'badge-refunded', EXPIRED: 'badge-expired' };
    return map[status] || '';
};

const fmt = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const BookingsTab = ({ hotelId, bookings, roomTypes, onRefresh }) => {
    const [filter, setFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const counts = STATUS_FILTERS.reduce((acc, s) => {
        acc[s] = s === 'ALL' ? bookings.length : bookings.filter(b => b.status === s).length;
        return acc;
    }, {});

    const revenue = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').reduce((sum, b) => sum + (b.totalPrice || b.quotedPrice || 0), 0);

    const filtered = bookings.filter(b => {
        const matchStatus = filter === 'ALL' || b.status === filter;
        const q = searchQuery.toLowerCase().trim();
        const matchSearch = !q || (b.customerName || '').toLowerCase().includes(q) || (b.customerEmail || '').toLowerCase().includes(q) ||
            (b.guestName || '').toLowerCase().includes(q) || (b.guestEmail || '').toLowerCase().includes(q) ||
            (b.roomNumber || '').toLowerCase().includes(q) || (b.roomTypeName || '').toLowerCase().includes(q) || String(b.id).includes(q);
        return matchStatus && matchSearch;
    });

    return (
        <div className="tab-container">
            <div className="tab-header">
                <div><h2>Bookings Management</h2><p className="tab-description">View and manage all reservations for this hotel</p></div>
                <div className="search-wrapper"><Icons.Search /><input type="text" className="search-input" placeholder="Search by guest name, email, room #..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
            </div>

            <div className="stats-row">
                <div className="stat-card"><div className="stat-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M18 20V10M12 20V4M6 20v-6"/></svg></div><div><span className="stat-value">{bookings.length}</span><span className="stat-label">Total Bookings</span></div></div>
                <div className="stat-card"><div className="stat-icon success"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div><div><span className="stat-value">{counts['CONFIRMED'] || 0}</span><span className="stat-label">Confirmed</span></div></div>
                <div className="stat-card"><div className="stat-icon warning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div><div><span className="stat-value">{counts['PENDING'] || 0}</span><span className="stat-label">Pending</span></div></div>
                <div className="stat-card"><div className="stat-icon revenue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div><div><span className="stat-value revenue">${revenue.toFixed(2)}</span><span className="stat-label">Total Revenue</span></div></div>
            </div>

            <div className="filter-tabs">{STATUS_FILTERS.map(s => (<button key={s} className={`filter-btn ${filter === s ? 'active' : ''}`} onClick={() => setFilter(s)}>{s}<span className="filter-count">{counts[s] || 0}</span></button>))}</div>

            {filtered.length === 0 ? (
                <div className="empty-state"><div className="empty-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div><h3>No Bookings Found</h3><p>{searchQuery || filter !== 'ALL' ? 'Try adjusting your search or filters.' : 'No bookings have been made for this hotel yet.'}</p></div>
            ) : (
                <div className="data-table-container">
                    <table className="data-table">
                        <thead><tr><th>Booking ID</th><th>Guest Name</th><th>Email</th><th>Room #</th><th>Room Type</th><th>Check-In</th><th>Check-Out</th><th>Nights</th><th>Total Amount</th><th>Status</th><th>Booked Date</th></tr></thead>
                        <tbody>
                        {filtered.map(booking => {
                            const nights = booking.nights || (booking.checkInDate && booking.checkOutDate ? Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24)) : '—');
                            return (
                                <tr key={booking.id}>
                                    <td className="booking-id">#{booking.id}</td>
                                    <td className="guest-name">{booking.customerName || booking.guestName || '—'}</td>
                                    <td className="guest-email">{booking.customerEmail || booking.guestEmail || '—'}</td>
                                    <td className="room-number-cell">{booking.roomNumber && booking.roomNumber !== 'TBD' ? <span className="room-number-badge">#{booking.roomNumber}</span> : <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>—</span>}</td>
                                    <td className="room-type">{booking.roomTypeName || '—'}</td>
                                    <td className="date">{fmt(booking.checkInDate)}</td>
                                    <td className="date">{fmt(booking.checkOutDate)}</td>
                                    <td className="nights">{nights}</td>
                                    <td className="amount">${(booking.totalPrice || booking.quotedPrice || 0).toFixed(2)}</td>
                                    <td><span className={`status-badge ${badgeClass(booking.status)}`}>{booking.status}</span></td>
                                    <td className="booked-date">{fmt(booking.createdAt)}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingsTab;