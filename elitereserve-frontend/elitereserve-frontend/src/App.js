import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Customer Components (from components/customer/)
import CustomerNavbar from './components/customer/Navbar';
import CustomerFooter from './components/customer/Footer';

// Customer Pages (from pages/)
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import HotelDetail from './pages/HotelDetail';
import MyBookings from './pages/MyBookings';
import SearchResults from './pages/SearchResults';

// Manager Components (from components/manager_2/)
import ManagerNavbar from './components/manager_2/ManagerNavbar';
import ManagerFooter from './components/manager_2/ManagerFooter';
import ManagerHotels from './components/manager_2/ManagerHotels';
import ManagerDashboard from './components/manager_2/ManagerDashboard';

import AIAssistant from './pages/AIAssistant';


import './App.css';

// Helper function to check if user is manager
const checkIsManager = (user) => {
    if (!user?.roles) return false;
    return user.roles.includes('HOTEL_MANAGER') || user.roles.includes('ADMIN');
};

// ============================================================
// CUSTOMER LAYOUT
// ============================================================

const CustomerLayout = () => (
    <>
        <CustomerNavbar />
        <main className="main-content-wrapper">
            <Outlet />
        </main>
        <CustomerFooter />
    </>
);

// ============================================================
// MANAGER LAYOUT
// ============================================================
const ManagerLayout = () => (
    <>
        <ManagerNavbar />
        <main className="manager-main-content">
            <Outlet />
        </main>
        <ManagerFooter />
    </>
);

// ============================================================
// MANAGER GUARD - Only managers can access these routes
// ============================================================
const ManagerGuard = () => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner-large"></div>
                <p>Loading manager portal...</p>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const isManager = checkIsManager(user);
    if (!isManager) return <Navigate to="/" replace />;

    return <ManagerLayout />;
};

// ============================================================
// CUSTOMER GUARD - Only customers can access these routes
// ============================================================
const CustomerGuard = () => {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner-large"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    const isManager = checkIsManager(user);
    if (isManager) return <Navigate to="/manager-hotels" replace />;

    return <CustomerLayout />;
};

// ============================================================
// PUBLIC ROUTE - Redirects to appropriate dashboard if already logged in
// ============================================================
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner-large"></div>
                <p>Loading...</p>
            </div>
        );
    }

    if (isAuthenticated) {
        const isManager = checkIsManager(user);
        if (isManager) {
            return <Navigate to="/manager-hotels" replace />;
        } else {
            return <Navigate to="/" replace />;
        }
    }

    return children;
};

// ============================================================
// MAIN APP
// ============================================================
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="app">
                    <Routes>
                        {/* Public Routes - Login & Signup */}
                        <Route path="/login" element={
                            <PublicRoute><Login /></PublicRoute>
                        } />
                        <Route path="/signup" element={
                            <PublicRoute><Signup /></PublicRoute>
                        } />

                        {/* Customer Routes - Protected */}
                        <Route element={<CustomerGuard />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/hotel/:id" element={<HotelDetail />} />
                            <Route path="/bookings" element={<MyBookings />} />
                            <Route path="/search" element={<SearchResults />} />
                            <Route path="/ai" element={<AIAssistant />} />
                        </Route>

                        {/* Manager Routes - Protected */}
                        <Route element={<ManagerGuard />}>
                            <Route path="/manager-hotels" element={<ManagerHotels />} />
                            <Route path="/manager-dashboard/:hotelId" element={<ManagerDashboard />} />
                        </Route>

                        {/* Catch all - redirect to login */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;