/*
 * Navbar Redesigned Header
 * Changes: Removed GlobalSearch | Upgraded PageTitle component
 * Title treatment: Bold Inter typography with a subtitle and page-specific icon.
 * Accent color: Primary-to-Tertiary Gradient (#0058be to #6b38d4).
 */

import React from 'react';
import { 
  Bell, 
  User, 
  ChevronDown, 
  LayoutDashboard, 
  Users, 
  Hotel, 
  CalendarCheck, 
  CreditCard, 
  Star, 
  MessageSquare, 
  ShieldCheck 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const PAGE_METADATA = {
  'Dashboard Overview': { 
    subtitle: 'Real-time platform metrics and system health', 
    icon: <LayoutDashboard size={24} /> 
  },
  'User Management': { 
    subtitle: 'Control access and monitor administrative roles', 
    icon: <Users size={24} /> 
  },
  'Hotel Management': { 
    subtitle: 'Inventory oversight and property inventory', 
    icon: <Hotel size={24} /> 
  },
  'Global Bookings': { 
    subtitle: 'Central reservation registry and stay monitoring', 
    icon: <CalendarCheck size={24} /> 
  },
  'Finance & Payments': { 
    subtitle: 'Revenue settlement and financial audit trail', 
    icon: <CreditCard size={24} /> 
  },
  'Ratings & Reviews': { 
    subtitle: 'Guest sentiment analysis and review moderation', 
    icon: <Star size={24} /> 
  },
  'Customer Feedback': { 
    subtitle: 'Direct user engagement and support messages', 
    icon: <MessageSquare size={24} /> 
  },
  'Active Sessions': { 
    subtitle: 'Live infrastructure monitoring and security logs', 
    icon: <ShieldCheck size={24} /> 
  },
};

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const metadata = PAGE_METADATA[title] || { 
    subtitle: 'Platform Management System', 
    icon: <LayoutDashboard size={24} /> 
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="page-header-editorial">
          <div className="page-icon-box">
            {metadata.icon}
          </div>
          <div className="title-stack">
            <h1 className="page-title">{title}</h1>
            <p className="page-subtitle">{metadata.subtitle}</p>
          </div>
        </div>
      </div>
      
      <div className="navbar-right">
        <div className="navbar-actions">
          <button className="icon-btn-refined">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          
          <div className="admin-profile-pill">
            <div className="admin-avatar-glow">
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="admin-info-stack">
              <span className="admin-name">{user?.email || 'Administrator'}</span>
              <span className="admin-role-badge">PLATFORM ADMIN</span>
            </div>
            <ChevronDown size={14} className="profile-chevron" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
