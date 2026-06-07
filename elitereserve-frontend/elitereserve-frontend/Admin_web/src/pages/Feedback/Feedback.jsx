import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Table/Table';
import { 
  MessageSquare, 
  Search, 
  PieChart, 
  Trash2, 
  AlertTriangle,
  Star,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
  Minus,
  X,
  TrendingUp,
  MessageCircle
} from 'lucide-react';
import { getFeedbacks, getFeedbackStats, deleteFeedback } from '../../api/feedbackApi';
import { format } from 'date-fns';
import './Feedback.css';

/**
 * Feedback Page Component
 * Refactored to include real-time search, stats breakdown modal, and live API integration.
 */
const Feedback = () => {
  // State for feedback records and stats
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search and Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Modal logic
  const [showStatsModal, setShowStatsModal] = useState(false);

  // Debounce search input to avoid excessive renders or API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // 300ms debounce as requested

    return () => clearTimeout(handler);
  }, [searchTerm]);

  /**
   * Fetch feedback data from the backend
   * Uses real API endpoints from FeedbackController
   */
  const fetchData = useCallback(async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both feedbacks and stats in parallel for efficiency
      const [feedbackData, statsData] = await Promise.all([
        getFeedbacks(page, pagination.size),
        getFeedbackStats()
      ]);
      
      setFeedbacks(feedbackData.content || []);
      setStats(statsData);
      setPagination({
        ...pagination,
        page: feedbackData.pageNumber,
        totalElements: feedbackData.totalElements,
        totalPages: feedbackData.totalPages
      });
    } catch (err) {
      console.error('Failed to fetch feedback data:', err);
      setError('Connection to feedback service failed. Please verify the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [pagination.size]);

  useEffect(() => {
    fetchData(0);
  }, [fetchData]);

  /**
   * Filter feedbacks based on debounced search term
   * Filters by both message content (comment) and category
   */
  const filteredFeedbacks = useMemo(() => {
    if (!debouncedSearch) return feedbacks;
    
    const term = debouncedSearch.toLowerCase();
    return feedbacks.filter(item => 
      (item.comment && item.comment.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term)) ||
      (item.customerName && item.customerName.toLowerCase().includes(term))
    );
  }, [feedbacks, debouncedSearch]);

  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to permanently delete feedback #${id}?`)) {
      try {
        await deleteFeedback(id);
        fetchData(pagination.page);
      } catch (err) {
        alert('Failed to delete feedback. You may not have sufficient permissions.');
      }
    }
  };

  // Helper to render stars for rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 10; i++) {
      stars.push(
        <Star 
          key={i} 
          size={12} 
          fill={i <= rating ? "var(--color-warning)" : "none"} 
          color={i <= rating ? "var(--color-warning)" : "#cbd5e1"} 
          strokeWidth={i <= rating ? 0 : 2}
        />
      );
    }
    return <div className="rating-stars">{stars} <span className="rating-num">{rating}/10</span></div>;
  };

  const columns = [
    { 
      header: 'ID', 
      accessor: 'id',
      render: (id) => <span className="id-badge">#{id}</span>
    },
    { 
      header: 'Customer', 
      accessor: 'customerName',
      render: (name, row) => (
        <div className="customer-info">
          <span className="customer-name">{name || 'Anonymous'}</span>
          <span className="customer-id">UID: {row.customerId}</span>
        </div>
      )
    },
    { 
      header: 'Feedback Details', 
      accessor: 'comment',
      render: (comment, row) => (
        <div className="feedback-content-cell">
           <div className="category-row">
             <span className={`category-tag cat-${row.category?.toLowerCase()}`}>
               {row.category?.replace(/_/g, ' ') || 'GENERAL'}
             </span>
             <span className="created-at">
               <Calendar size={12} />
               {row.createdAt ? format(new Date(row.createdAt), 'MMM dd, yyyy HH:mm') : 'N/A'}
             </span>
           </div>
           <p className="feedback-preview">{comment}</p>
        </div>
      )
    },
    { 
      header: 'Rating', 
      accessor: 'rating',
      render: (rating) => renderRating(rating)
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id) => (
        <div className="row-actions">
          <button className="action-icon-btn delete" title="Delete Entry" onClick={(e) => { e.stopPropagation(); handleDelete(id); }}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout title="EliteReserve Feedback Manager">
      {/* Top Stat Cards Section */}
      <div className="feedback-stats-grid">
        <div className="stat-card premium">
          <div className="card-header">
            <div className="icon-box purple">
              <MessageSquare size={24} />
            </div>
          </div>
          <div className="card-body">
            <h3>{stats?.totalFeedbacks?.toLocaleString() || '0'}</h3>
            <p>Total Messages</p>
          </div>
        </div>

        <div className="stat-card premium">
          <div className="card-header">
            <div className="icon-box gold">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="card-body">
            <h3>{stats?.averageRating?.toFixed(1) || '0.0'}</h3>
            <p>Avg Sentiment Score</p>
          </div>
        </div>

        <div className="stat-card premium">
          <div className="card-header">
            <div className="icon-box green">
              <CheckCircle2 size={24} />
            </div>
          </div>
          <div className="card-body">
            <h3>84%</h3>
            <p>Resolving Rate</p>
          </div>
        </div>
      </div>

      {/* Search and Action Bar */}
      <div className="search-row-container">
        <div className="search-bar-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search by message, name, or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm('')}>
              <X size={16} />
            </button>
          )}
        </div>
        <div className="action-buttons">
          <button className="stats-breakdown-btn" onClick={() => setShowStatsModal(true)}>
            <PieChart size={18} />
            <span>Stats Breakdown</span>
          </button>
        </div>
      </div>

      {/* Main Feedback Table */}
      <div className="feedback-content-main">
        {error ? (
          <div className="error-state">
            <div className="error-icon"><AlertTriangle size={48} /></div>
            <h2>Data Fetching Error</h2>
            <p>{error}</p>
            <button onClick={() => fetchData(0)} className="retry-btn">Try Reconnecting</button>
          </div>
        ) : filteredFeedbacks.length === 0 && !loading ? (
          <div className="empty-state">
            <div className="empty-icon"><MessageCircle size={48} /></div>
            <h2>No Records Found</h2>
            <p>{searchTerm ? `No results match "${searchTerm}"` : "No feedback entries have been submitted yet."}</p>
            {searchTerm && <button onClick={() => setSearchTerm('')} className="clear-filter-btn">Clear Search</button>}
          </div>
        ) : (
          <div className="table-wrapper-refined">
            <Table 
              columns={columns} 
              data={filteredFeedbacks} 
              loading={loading}
              pagination={pagination}
              onPageChange={fetchData}
            />
          </div>
        )}
      </div>

      {/* Stats Breakdown Modal Overlay */}
      {showStatsModal && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="title-group">
                <PieChart size={20} />
                <h2>Category Distribution & Metrics</h2>
              </div>
              <button className="close-btn" onClick={() => setShowStatsModal(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              {stats?.byCategory ? (
                <div className="category-stats-list">
                  <div className="stats-header-row">
                    <span>Category</span>
                    <span>Count</span>
                    <span>Avg Score</span>
                    <span>Distribution</span>
                  </div>
                  {Object.entries(stats.byCategory).map(([cat, data]) => {
                    const percentage = (data.count / stats.totalFeedbacks) * 100;
                    return (
                      <div key={cat} className="category-stat-item">
                        <div className="cat-name">{cat.replace(/_/g, ' ')}</div>
                        <div className="cat-count">{data.count}</div>
                        <div className="cat-score">
                          <Star size={14} fill="var(--color-warning)" color="var(--color-warning)" />
                          <span>{data.averageRating?.toFixed(1) || '0.0'}</span>
                        </div>
                        <div className="cat-progress">
                          <div className="progress-bar-bg">
                            <div 
                              className="progress-bar-fill" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="percent-label">{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-stats-msg">No category data available.</div>
              )}
            </div>

            <div className="modal-footer">
              <button className="primary-btn" onClick={() => setShowStatsModal(false)}>Close View</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Feedback;
