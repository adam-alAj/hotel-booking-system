import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Table/Table';
import {
  Search,
  UserPlus,
  Loader2,
  AlertTriangle,
  Trash2,
  ChevronDown
} from 'lucide-react';
import { getUsers, deleteUser } from '../../api/userApi';
import CreateAccountModal from './CreateAccountModal';
import './UserManagement.css';

/**
 * UserManagement Component
 * Comprehensive portal for managing administrative and platform accounts.
 * Provides real-time filtering, search, deletion, and account creation workflows.
 */
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search term - 300ms delay to optimize API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  /**
   * Fetches user list with current search, filter, and page context.
   */
  const fetchUsers = useCallback(async (page = 0) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(page, pagination.size, debouncedSearch, selectedRole);
      setUsers(data.content || []);
      setPagination({
        ...pagination,
        page: data.number,
        totalElements: data.totalElements,
        totalPages: data.totalPages
      });
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Could not retrieve user list. Check your administrative permissions.');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, selectedRole, pagination.size]);

  useEffect(() => {
    fetchUsers(0);
  }, [fetchUsers]);

  /**
   * Handles hard deletion of user accounts.
   * Prompts for confirmation before final execution.
   */
  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete user ID: ${id}? This action is permanent.`)) {
      try {
        await deleteUser(id);
        fetchUsers(pagination.page);
      } catch (err) {
        alert('Action failed: Cannot delete this user.');
      }
    }
  };

  const roleConfig = {
    ADMIN: { color: '#8b5cf6', bg: '#ede9fe', label: 'Admin' },
    HOTEL_MANAGER: { color: '#f59e0b', bg: '#fef3c7', label: 'Hotel Manager' },
    CUSTOMER: { color: '#10b981', bg: '#d1fae5', label: 'Customer' },
  };

  /**
   * Generates display initials for user avatars.
   */
  const getInitials = (user) => {
    const f = user.firstName?.[0] || '';
    const l = user.lastName?.[0] || '';
    return (f + l).toUpperCase() || user.email[0].toUpperCase();
  };

  // Table Configuration: Defines columns and row rendering logic.
  const columns = [
    {
      header: 'ID',
      accessor: 'id',
      render: (id) => <span className="user-id-pill">#{id}</span>
    },
    {
      header: 'Full Name',
      accessor: 'firstName',
      render: (_, row) => (
        <div className="user-profile-cell">
          <div className="user-avatar" style={{ background: roleConfig[row.roles?.[0]?.replace('ROLE_', '')]?.bg, color: roleConfig[row.roles?.[0]?.replace('ROLE_', '')]?.color }}>
            {getInitials(row)}
          </div>
          <span className="user-name-bold">{row.firstName} {row.lastName}</span>
        </div>
      )
    },
    {
      header: 'Email Address',
      accessor: 'email',
      render: (email) => <span className="email-link">{email}</span>
    },
    {
      header: 'Roles',
      accessor: 'roles',
      render: (roles) => (
        <div className="roles-stack">
          {roles?.map((role, i) => {
            const roleKey = role.replace('ROLE_', '');
            return (
              <span key={i} className={`role-badge role-badge--${roleKey.toLowerCase()}`}>
                {roleConfig[roleKey]?.label || roleKey}
              </span>
            );
          })}
        </div>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id) => (
        <div className="action-buttons-cell">
          {/* Change 2: Edit icon button removed from Actions column */}
          <button className="action-btn action-btn--delete" title="Delete user" onClick={() => handleDelete(id)}>
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <Layout title="User Accounts">
      <div className="toolbar-premium">
        <div className="toolbar-left">
          <div className="search-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="role-filter-wrapper">
            <select
              className="role-select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Administrator</option>
              <option value="HOTEL_MANAGER">Hotel Manager</option>
              <option value="CUSTOMER">Customer</option>
            </select>
            <ChevronDown className="select-icon" size={16} />
          </div>
        </div>

        <div className="toolbar-right">
          <button className="create-btn-premium" onClick={() => setIsModalOpen(true)}>
            <UserPlus size={18} />
            <span>Create Account</span>
          </button>
        </div>
      </div>

      {error ? (
        <div className="error-state-inline">
          <AlertTriangle size={24} color="#ef4444" />
          <p>{error}</p>
          <button onClick={() => fetchUsers(pagination.page)}>Retry</button>
        </div>
      ) : (
        <div className="users-table-wrapper">
          <Table
            columns={columns}
            data={users}
            loading={loading}
            pagination={pagination}
            onPageChange={fetchUsers}
          />
        </div>
      )}

      {/* Account Creation Flow */}
      <CreateAccountModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => fetchUsers(0)} 
      />
    </Layout>
  );
};

export default UserManagement;
