import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Table/Table';
import {
  CalendarCheck,
  Download,
  X,
  MapPin,
  AlertTriangle,
  Hotel
} from 'lucide-react';
import { getBookingsByHotel, cancelBooking } from '../../api/bookingApi';
import { getHotels } from '../../api/hotelApi';
import { format } from 'date-fns';
import './Bookings.css';

const Bookings = () => {
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initial load: Fetch all available hotels to populate the selector
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const hotelData = await getHotels(0, 100); // Fetch a reasonable number of hotels
        setHotels(hotelData.content || []);
      } catch (err) {
        console.error('Failed to fetch hotels for bookings selector:', err);
      }
    };
    fetchInitialData();
  }, []);

  const fetchBookings = async (hotelId) => {
    if (!hotelId) return;
    setLoading(true);
    setError(null);
    try {
      // Fields from BookingResponse.java: id, guestName, guestEmail, status, checkInDate, checkOutDate, quotedPrice, roomNo
      const data = await getBookingsByHotel(hotelId);
      setBookings(data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setError('Could not retrieve bookings for this hotel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedHotel) {
      fetchBookings(selectedHotel);
    }
  }, [selectedHotel]);

  const handleCancelAction = async (id) => {
    if (window.confirm(`Cancel booking #${id}? This action follows platform refund policy.`)) {
      try {
        await cancelBooking(id);
        fetchBookings(selectedHotel);
      } catch (err) {
        alert('Action failed: Cannot cancel an already active or past stay.');
      }
    }
  };

  const handleExportCSV = () => {
    // Check if there are bookings to export
    if (!bookings || bookings.length === 0) {
      alert('No bookings to export');
      return;
    }

    // Get the selected hotel name
    const selectedHotelName = hotels.find(h => h.id === selectedHotel)?.name || 'Unknown';

    // Create CSV header row
    const headers = ['Booking ID', 'Customer Name', 'Customer Email', 'Schedule Start', 'Schedule End', 'Room', 'Status'];

    // Create CSV data rows
    const rows = bookings.map(booking => [
      booking.id,
      booking.guestName,
      booking.guestEmail,
      format(new Date(booking.checkInDate), 'yyyy-MM-dd'),
      format(new Date(booking.checkOutDate), 'yyyy-MM-dd'),
      booking.roomNo || 'TBD',
      booking.status || 'PENDING'
    ]);

    // Combine headers and rows
    const allRows = [headers, ...rows];

    // Convert to CSV format with proper escaping
    const csvContent = allRows
      .map(row =>
        row
          .map(cell => {
            // Escape quotes and wrap in quotes if contains comma, quotes, or newline
            const cellStr = String(cell);
            if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
              return `"${cellStr.replace(/"/g, '""')}"`;
            }
            return cellStr;
          })
          .join(',')
      )
      .join('\n');

    // Create filename with hotel name and today's date
    const today = format(new Date(), 'yyyy-MM-dd');
    const filename = `bookings-${selectedHotelName}-${today}.csv`;

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      header: 'Booking ID',
      accessor: 'id',
      render: (id) => <span className="booking-id-badge">BK-{id}</span>
    },
    {
      header: 'Customer',
      accessor: 'guestName',
      render: (name, row) => (
        <div className="customer-info">
          <div className="customer-name">{name}</div>
          <div className="customer-email">{row.guestEmail}</div>
        </div>
      )
    },
    {
      header: 'Schedule',
      accessor: 'checkInDate',
      render: (_, row) => (
        <div className="schedule-container">
          <span className="schedule-date">{format(new Date(row.checkInDate), 'MMM d')}</span>
          <span className="schedule-arrow">→</span>
          <span className="schedule-date">{format(new Date(row.checkOutDate), 'MMM d')}</span>
        </div>
      )
    },
    {
      header: 'Room',
      accessor: 'roomNo',
      render: (room) => <span className="room-badge">{room || 'TBD'}</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (status) => (
        <span className={`status-badge status-${status?.toLowerCase() || 'pending'}`}>
          <span className="status-dot"></span>
          {status || 'PENDING'}
        </span>
      )
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (id) => (
        <button
          className="action-cancel-btn"
          title="Cancel Booking"
          onClick={() => handleCancelAction(id)}
        >
          <X size={16} />
        </button>
      )
    }
  ];

  return (
    <Layout title="Global Reservations">
      <div className="bookings-toolbar">
        <div className="toolbar-section">
          <label className="filter-label">
            <Hotel size={16} />
            Filter by Hotel
          </label>
          <select
            className="hotel-dropdown"
            onChange={(e) => setSelectedHotel(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Select a property...</option>
            {hotels.map(h => (
              <option key={h.id} value={h.id}>{h.name} - {h.city}</option>
            ))}
          </select>
        </div>

        <button
          className="export-csv-btn"
          onClick={handleExportCSV}
          disabled={!selectedHotel || bookings.length === 0}
        >
          <Download size={16} />
          Export CSV
        </button>
      </div>

      {!selectedHotel ? (
        <div className="empty-state-selector">
          <CalendarCheck size={64} opacity={0.1} />
          <h3>No Property Selected</h3>
          <p>Please select a hotel from the dropdown above to view its live reservations.</p>
        </div>
      ) : error ? (
        <div className="error-state-inline">
          <AlertTriangle size={24} color="#ef4444" />
          <p>{error}</p>
          <button onClick={() => fetchBookings(selectedHotel)}>Retry</button>
        </div>
      ) : (
        <div className="table-container-elevated">
          <Table
            columns={columns}
            data={bookings}
            loading={loading}
          />
        </div>
      )}
    </Layout>
  );
};

export default Bookings;
