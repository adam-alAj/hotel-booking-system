import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { managerAPI } from '../../services/apiManager';

// Import tabs
import ManagerRoomsTab from './ManagerRoomsTab';
import ManagerRoomTypesTab from './ManagerRoomTypesTab';
import ManagerBookingsTab from './ManagerBookingsTab';
import ManagerPricingRulesTab from './ManagerPricingRulesTab';
import ManagerBasePricesTab from './ManagerBasePricesTab';

import './ManagerDashboard.css';

const ManagerDashboard = () => {
    const navigate = useNavigate();
    const { hotelId } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('rooms');

    // Data states
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [pricingRules, setPricingRules] = useState([]);
    const [basePrices, setBasePrices] = useState([]);

    // Fetch hotel details and all data
    useEffect(() => {
        if (hotelId && hotelId !== 'new') {
            fetchHotelData();
        }
    }, [hotelId]);

    const fetchHotelData = async () => {
        try {
            setLoading(true);

            // Fetch all hotels and find the selected one
            const hotelsRes = await managerAPI.getMyHotels();
            const foundHotel = hotelsRes.data.find(h => h.id === parseInt(hotelId));

            if (foundHotel) {
                setHotel(foundHotel);
            } else {
                setError('Hotel not found');
                setLoading(false);
                return;
            }

            // Fetch all data in parallel
            const [roomsRes, roomTypesRes, bookingsRes, rulesRes, pricesRes] = await Promise.all([
                managerAPI.getHotelRooms(hotelId).catch(() => ({ data: [] })),
                managerAPI.getHotelRoomTypes(hotelId).catch(() => ({ data: [] })),
                managerAPI.getMyHotelBookings(hotelId).catch(() => ({ data: [] })),
                managerAPI.getHotelPricingRules(hotelId).catch(() => ({ data: [] })),
                managerAPI.getHotelBasePrices(hotelId).catch(() => ({ data: [] })),
            ]);

            setRooms(roomsRes.data || []);
            setRoomTypes(roomTypesRes.data || []);
            setBookings(bookingsRes.data || []);
            setPricingRules(rulesRes.data || []);
            setBasePrices(pricesRes.data || []);
        } catch (err) {
            console.error('Error fetching hotel data:', err);
            setError('Failed to load hotel data');
        } finally {
            setLoading(false);
        }
    };

    const refreshAllData = async () => {
        if (!hotelId || hotelId === 'new') return;

        try {
            const [roomsRes, roomTypesRes, bookingsRes, rulesRes, pricesRes] = await Promise.all([
                managerAPI.getHotelRooms(hotelId).catch(() => ({ data: [] })),
                managerAPI.getHotelRoomTypes(hotelId).catch(() => ({ data: [] })),
                managerAPI.getMyHotelBookings(hotelId).catch(() => ({ data: [] })),
                managerAPI.getHotelPricingRules(hotelId).catch(() => ({ data: [] })),
                managerAPI.getHotelBasePrices(hotelId).catch(() => ({ data: [] })),
            ]);

            setRooms(roomsRes.data || []);
            setRoomTypes(roomTypesRes.data || []);
            setBookings(bookingsRes.data || []);
            setPricingRules(rulesRes.data || []);
            setBasePrices(pricesRes.data || []);
        } catch (err) {
            console.error('Error refreshing data:', err);
        }
    };

    const handleBackToHotels = () => {
        navigate('/manager-hotels');
    };

    const handleCreateHotel = async (e) => {
        e.preventDefault();
        // This will be implemented in the create hotel form
        // For now, just navigate back
        navigate('/manager-hotels');
    };

    const tabs = [
        { id: 'rooms', label: 'Rooms', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M3 21h18M3 7v14M21 7v14M6 11h4M6 15h4M14 11h4M14 15h4M10 21V7l2-4 2 4v14"/></svg> },
        { id: 'roomtypes', label: 'Room Types', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M2 20V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12M2 20h20M4 20v-4h16v4M8 12h8v4H8v-4z"/></svg> },
        { id: 'bookings', label: 'Bookings', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
        { id: 'pricing', label: 'Pricing Rules', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> },
        { id: 'baseprices', label: 'Base Prices', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
    ];

    // Create New Hotel View
    if (hotelId === 'new') {
        return (
            <div className="manager-dashboard">
                <header className="dashboard-header">
                    <div className="header-top">
                        <button className="back-btn" onClick={handleBackToHotels}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="19" y1="12" x2="5" y2="12"/>
                                <polyline points="12 19 5 12 12 5"/>
                            </svg>
                            Back to My Hotels
                        </button>
                    </div>
                    <div className="hotel-info-header">
                        <h1>Create New Hotel</h1>
                        <p>Fill in the details to add a new property to your portfolio.</p>
                    </div>
                </header>

                <main className="manager-content">
                    <div className="create-hotel-container">
                        <div className="create-hotel-form">
                            <h2>Add New Hotel</h2>
                            <p>Enter the details of your new hotel property.</p>

                            <form onSubmit={handleCreateHotel}>
                                <div className="form-group">
                                    <label>Hotel Name *</label>
                                    <input type="text" placeholder="e.g., Grand Plaza Hotel" required />
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>City *</label>
                                        <input type="text" placeholder="e.g., New York" required />
                                    </div>
                                    <div className="form-group">
                                        <label>Address *</label>
                                        <input type="text" placeholder="Full address" required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea rows="3" placeholder="Describe your hotel..." />
                                </div>
                                <div className="form-group">
                                    <label>Hotel Image</label>
                                    <input type="file" accept="image/*" />
                                    <small>Upload a main image for your hotel (JPEG, PNG, WebP)</small>
                                </div>
                                <div className="form-row-2">
                                    <div className="form-group">
                                        <label>Rating (0-10)</label>
                                        <input type="number" min="0" max="10" step="0.1" placeholder="8.5" />
                                    </div>
                                    <div className="form-group">
                                        <label className="checkbox-label">
                                            <input type="checkbox" defaultChecked={true} />
                                            Active (show on website)
                                        </label>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn-secondary" onClick={handleBackToHotels}>Cancel</button>
                                    <button type="submit" className="btn-primary">Create Hotel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </main>

            </div>
        );
    }

    // Loading State
    if (loading) {
        return (
            <div className="manager-loading">
                <div className="spinner"></div>
                <p>Loading hotel data...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="manager-error">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <h3>Error Loading Hotel</h3>
                <p>{error}</p>
                <button className="retry-btn" onClick={fetchHotelData}>Try Again</button>
                <button className="back-btn" onClick={handleBackToHotels}>Back to My Hotels</button>
            </div>
        );
    }

    // Hotel Not Found
    if (!hotel) {
        return (
            <div className="manager-error">
                <h3>Hotel Not Found</h3>
                <button className="back-btn" onClick={handleBackToHotels}>Back to My Hotels</button>
            </div>
        );
    }

    // Main Dashboard View
    return (
        <div className="manager-dashboard">
            <header className="dashboard-header">
                <div className="header-top">
                    <button className="back-btn" onClick={handleBackToHotels}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="19" y1="12" x2="5" y2="12"/>
                            <polyline points="12 19 5 12 12 5"/>
                        </svg>
                        Back to My Hotels
                    </button>
                </div>

                <div className="hotel-info-header">
                    <h1>{hotel.name}</h1>
                    <p>{hotel.address}, {hotel.city}</p>
                    <div className="hotel-stats">
                        <span className="stat-badge">
                            <strong>{rooms.length}</strong> Rooms
                        </span>
                        <span className="stat-badge">
                            <strong>{roomTypes.length}</strong> Room Types
                        </span>
                        <span className="stat-badge">
                            <strong>{bookings.length}</strong> Bookings
                        </span>
                        <span className={`status-badge ${hotel.isActive ? 'badge-available' : 'badge-deactivated'}`}>
                            {hotel.isActive ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </div>
            </header>

            <nav className="manager-tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </nav>

            <main className="manager-content">
                {activeTab === 'rooms' && (
                    <ManagerRoomsTab
                        hotelId={hotel.id}
                        rooms={rooms}
                        roomTypes={roomTypes}
                        onRefresh={refreshAllData}
                    />
                )}
                {activeTab === 'roomtypes' && (
                    <ManagerRoomTypesTab
                        hotelId={hotel.id}
                        roomTypes={roomTypes}
                        onRefresh={refreshAllData}
                    />
                )}
                {activeTab === 'bookings' && (
                    <ManagerBookingsTab
                        hotelId={hotel.id}
                        bookings={bookings}
                        roomTypes={roomTypes}
                        onRefresh={refreshAllData}
                    />
                )}
                {activeTab === 'pricing' && (
                    <ManagerPricingRulesTab
                        hotelId={hotel.id}
                        rules={pricingRules}
                        roomTypes={roomTypes}
                        onRefresh={refreshAllData}
                    />
                )}
                {activeTab === 'baseprices' && (
                    <ManagerBasePricesTab
                        hotelId={hotel.id}
                        basePrices={basePrices}
                        roomTypes={roomTypes}
                        onRefresh={refreshAllData}
                    />
                )}
            </main>

            {/* Theme Toggle Button */}

        </div>
    );
};

export default ManagerDashboard;