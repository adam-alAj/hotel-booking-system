import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import { 
  Users, 
  Hotel, 
  CalendarCheck, 
  Activity, 
  TrendingUp, 
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';
import { getUsers } from '../../api/userApi';
import { getHotels } from '../../api/hotelApi';
import { getAllPayments } from '../../api/paymentApi';
import { getActiveSessions } from '../../api/adminApi';
import './Dashboard.css';

/**
 * Dashboard Component
 * Displays real-time platform metrics and system health intelligence.
 * Includes fixed 'View Logs' navigation to the Live Infrastructure monitoring page.
 */
const Dashboard = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeHotels: 0,
    successBookings: 0,
    activeSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        // Fetch data in parallel for speed
        const [userData, hotelData, paymentData, sessionData] = await Promise.all([
          getUsers(0, 1),
          getHotels(0, 1),
          getAllPayments(),
          getActiveSessions()
        ]);

        // Counting COMPLETED sessions as proxy for successful transactions
        const confirmedBookingsCount = paymentData.filter(p => p.status === 'COMPLETED').length;

        setMetrics({
          totalUsers: userData.totalElements || 0,
          activeHotels: hotelData.totalElements || 0,
          successBookings: confirmedBookingsCount || 0,
          activeSessions: sessionData.activeSessions || 0
        });
      } catch (err) {
        console.error('Failed to fetch dashboard metrics:', err);
        setError('Failed to load system metrics. Please check connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const handleViewLogs = () => {
    // Navigates to the /sessions route which contains the real-time node monitoring and audit logs
    navigate('/sessions');
  };

  const stats = [
    { label: 'Total Users', value: metrics.totalUsers, icon: Users, color: '#6366f1' },
    { label: 'Active Hotels', value: metrics.activeHotels, icon: Hotel, color: '#8b5cf6' },
    { label: 'Success Bookings', value: metrics.successBookings, icon: CalendarCheck, color: '#10b981' },
    { label: 'Live Sessions', value: metrics.activeSessions, icon: Activity, color: '#f59e0b' },
  ];

  if (loading) {
    return (
      <Layout title="Dashboard Overview">
        <div className="loading-state-full">
          <Loader2 className="animate-spin" size={48} color="var(--color-primary)" />
          <p>Syncing with EliteReserve Infrastructure...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard Overview">
        <div className="error-alert-box">
          <ShieldCheck size={48} color="#ef4444" />
          <h3>System Sync Error</h3>
          <p>{error}</p>
          <button className="primary-btn" onClick={() => window.location.reload()}>Retry Sync</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard Overview">
      <div className="dashboard-grid">
        {stats.map((stat, index) => (
          <div className="stat-card-premium" key={index}>
            <div className="stat-icon-wrapper" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <div className="stat-value-group">
                <h2 className="stat-value">{stat.value.toLocaleString()}</h2>
              </div>
            </div>
            <div className="stat-chart-spark">
              <TrendingUp size={48} opacity={0.1} color={stat.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-row">
        <div className="activity-panel-elevated">
          <div className="panel-header-editorial">
            <div className="header-meta">
              <h2>System Intelligence</h2>
              <p>Predictive analysis and real-time operations overview.</p>
            </div>
            <button 
              className="ghost-btn" 
              onClick={handleViewLogs}
              title="Navigate to Monitoring Logs"
            >
              <span>View Logs</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
          
          <div className="intelligence-grid">
            <div className="intel-item-modern">
              <div className="intel-icon-wrapper">
                <Activity size={20} />
              </div>
              <div className="intel-info">
                <h4>Payment Gateway</h4>
                <div className="status-badge-group">
                  <span className="status-badge stable">
                    <div className="status-indicator-dot active"></div>
                    Stable
                  </span>
                  <span className="latency-value">42ms latency</span>
                </div>
              </div>
            </div>

            <div className="intel-item-modern">
              <div className="intel-icon-wrapper">
                <Hotel size={20} />
              </div>
              <div className="intel-info">
                <h4>Hotel Inventory</h4>
                <div className="status-badge-group">
                  <span className="status-badge realtime">
                    <div className="status-indicator-dot active"></div>
                    Real-time
                  </span>
                  <span className="latency-value">15s sync frequency</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="security-panel-glass">
          <div className="security-icon-shield">
            <ShieldCheck size={32} />
          </div>
          <h3>Platform Security</h3>
          <p>SSL Encryption active · All administrative actions are being logged for audit.</p>
          <div className="security-badges">
            <div className="badge-glass">
              <Zap size={14} color="#10b981" />
              <span>Encrypted</span>
            </div>
            <div className="badge-glass">
              <Users size={14} color="#3b82f6" />
              <span>Multi-Role</span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
