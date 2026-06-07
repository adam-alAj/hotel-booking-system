import React, { useState, useEffect, useRef } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Table/Table';
import {
  Search,
  Filter,
  Download,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { getAllPayments, deletePayment } from '../../api/paymentApi';
import './Payments.css';

const STATUS_OPTIONS = ['ALL', 'COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'];

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Search ──────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = useRef(null);

  // ── Status Filter ────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterWrapperRef = useRef(null);

  // ── Report ───────────────────────────────────────────
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportError, setReportError] = useState('');

  // ── Fetch ────────────────────────────────────────────
  const fetchPayments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllPayments();
      setPayments(data || []);
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      setError('Could not access financial records. Check administrative permissions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  // ── Debounce search input ─────────────────────────────
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(value), 300);
  };

  // ── Close dropdown on click outside ──────────────────
  useEffect(() => {
    const handler = (e) => {
      if (filterWrapperRef.current && !filterWrapperRef.current.contains(e.target)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Filtered data: status first, then search ──────────
  const filteredPayments = payments
    .filter(p => statusFilter === 'ALL' || p.status === statusFilter)
    .filter(p => {
      if (!debouncedSearch.trim()) return true;
      const term = debouncedSearch.toLowerCase();
      const txId = `tx-${p.id}`;
      const refId = `bk-#${p.bookingId ?? 'n/a'}`;
      return txId.includes(term) || refId.includes(term);
    });

  const isFiltering = debouncedSearch.trim() !== '' || statusFilter !== 'ALL';
  const noResults = isFiltering && filteredPayments.length === 0 && payments.length > 0;

  // ── Delete ────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (window.confirm(`Delete payment record #${id}? This will remove financial audit trail.`)) {
      try {
        await deletePayment(id);
        fetchPayments();
      } catch (err) {
        alert('Action failed: Cannot delete active transaction record.');
      }
    }
  };

  // ── Status filter select ──────────────────────────────
  const handleSelectStatus = (status) => {
    setStatusFilter(status);
    setShowFilterDropdown(false);
  };

  // ── CSV Report ────────────────────────────────────────
  const escapeCSV = (val) => {
    const s = String(val ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s;
  };

  const handleGenerateReport = () => {
    if (payments.length === 0) {
      setReportError('No transactions available to report');
      return;
    }
    setReportError('');
    setIsGenerating(true);

    setTimeout(() => {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const filename = `finance-report-${yyyy}-${mm}.csv`;

      const headers = ['Transaction ID', 'Booking Reference', 'Amount', 'Payment Method', 'Status'];
      const rows = payments.map(p => [
        `TX-${p.id}`,
        `BK-#${p.bookingId ?? 'N/A'}`,
        p.amount?.toFixed(2) ?? '0.00',
        p.method ?? 'CREDIT_CARD',
        p.status ?? 'UNKNOWN',
      ]);

      const csv = [headers, ...rows].map(r => r.map(escapeCSV).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsGenerating(false);
    }, 1000);
  };

  // ── Columns ───────────────────────────────────────────
  const columns = [
    {
      header: 'Transaction ID',
      accessor: 'id',
      render: (id) => <code className="id-badge">TX-{id}</code>
    },
    {
      header: 'Reference',
      accessor: 'bookingId',
      render: (id) => <span className="ref-id">BK-#{id || 'N/A'}</span>
    },
    {
      header: 'Amount',
      accessor: 'amount',
      render: (amount) => (
        <span className="payment-amount">
          ${amount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
        </span>
      )
    },
    {
      header: 'Method',
      accessor: 'method',
      render: (method) => (
        <div className="payment-method">
          <CreditCard size={14} />
          <span>{method || 'CREDIT_CARD'}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => (
        <span className={`status-pill pill-${status?.toLowerCase() || 'success'}`}>
          {status || 'COMPLETED'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id) => (
        <div className="row-actions">
          <button className="icon-btn delete" title="Delete Payment Record" onClick={() => handleDelete(id)}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout title="Finance & Settlement">

      {/* ── Revenue Hero ── */}
      <div className="finance-header-editorial">
        <div className="revenue-summary-stack">
          <div className="revenue-card">
            <div className="rev-icon income">
              <ArrowUpRight size={20} />
            </div>
            <div className="rev-data">
              <span className="rev-label">Settled Revenue</span>
              <h3 className="rev-value">
                ${payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
              </h3>
            </div>
          </div>
        </div>

        <div className="finance-actions">
          <div className="report-btn-wrapper">
            <button
              className="secondary-btn"
              onClick={handleGenerateReport}
              disabled={isGenerating}
            >
              <Download size={18} />
              <span>{isGenerating ? 'Generating...' : 'Generate Monthly Report'}</span>
            </button>
            {reportError && <span className="report-error-msg">{reportError}</span>}
          </div>
        </div>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="page-actions-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by transaction or booking ID..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="action-buttons">
          <div className="filter-btn-wrapper" ref={filterWrapperRef}>
            <button
              className={`secondary-btn${statusFilter !== 'ALL' ? ' filter-active' : ''}`}
              onClick={() => setShowFilterDropdown(prev => !prev)}
            >
              <Filter size={18} />
              <span>
                {statusFilter !== 'ALL' ? `Filter Status: ${statusFilter}` : 'Filter Status'}
              </span>
              <ChevronDown
                size={14}
                className={`filter-chevron${showFilterDropdown ? ' filter-chevron-open' : ''}`}
              />
            </button>

            {showFilterDropdown && (
              <div className="filter-status-dropdown">
                {STATUS_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    className={`filter-status-option${statusFilter === opt ? ' filter-status-option-active' : ''}`}
                    onClick={() => handleSelectStatus(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Table area ── */}
      {error ? (
        <div className="error-state-inline">
          <AlertTriangle size={24} color="#ef4444" />
          <p>{error}</p>
          <button onClick={() => fetchPayments()}>Retry</button>
        </div>
      ) : (
        <div className="table-container-elevated">
          {noResults ? (
            <div className="table-search-empty">
              No transactions found for your search.
            </div>
          ) : (
            <Table
              columns={columns}
              data={filteredPayments}
              loading={loading}
            />
          )}
        </div>
      )}

    </Layout>
  );
};

export default Payments;
