import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import './Table.css';

const Table = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onRowClick
}) => {
  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner"></div>
        <p>Fetching records...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>No records found.</p>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i} style={{ width: col.width }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} onClick={() => onRowClick && onRowClick(row)}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="table-pagination">
          <div className="pagination-info">
            Showing <strong>{pagination.totalElements === 0 ? 0 : pagination.page * pagination.size + 1}</strong> to <strong>{Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)}</strong> of <strong>{pagination.totalElements}</strong> results
          </div>
          <div className="pagination-controls">
            <button
              disabled={pagination.page === 0}
              onClick={() => onPageChange(pagination.page - 1)}
              className="page-btn"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Show all page numbers */}
            <div className="page-numbers">
              {Array.from({ length: pagination.totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-num ${pagination.page === i ? 'active' : ''}`}
                  onClick={() => onPageChange(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={pagination.page === pagination.totalPages - 1}
              onClick={() => onPageChange(pagination.page + 1)}
              className="page-btn"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
