import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Hotel, 
  CalendarCheck, 
  CreditCard, 
  Star, 
  MessageSquare, 
  ShieldCheck, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'User Management', path: '/users', icon: <Users size={20} /> },
    { name: 'Hotel Management', path: '/hotels', icon: <Hotel size={20} /> },
    { name: 'Global Bookings', path: '/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Finance & Payments', path: '/payments', icon: <CreditCard size={20} /> },
    { name: 'Ratings & Reviews', path: '/ratings', icon: <Star size={20} /> },
    { name: 'Customer Feedback', path: '/feedback', icon: <MessageSquare size={20} /> },
    { name: 'Active Sessions', path: '/sessions', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">ER</div>
        <div className="logo-text">
          <span className="logo-brand">EliteReserve</span>
          <span className="logo-tagline">Admin Control</span>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.name}</span>
            <ChevronRight className="nav-arrow" size={14} />
          </NavLink>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
