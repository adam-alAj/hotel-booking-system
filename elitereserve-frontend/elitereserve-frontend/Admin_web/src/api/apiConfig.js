export const API_BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id) => `/api/users/${id}`,
  },
  HOTELS: {
    BASE: '/api/v1/hotels',
    BY_ID: (id) => `/api/v1/hotels/${id}`,
    SEARCH: '/api/v1/hotels/search',
  },
  ROOMS: {
    BY_HOTEL: (hotelId) => `/api/v1/rooms/hotel/${hotelId}`,
    STATUS: (id) => `/api/v1/rooms/${id}/status`,
    UPDATE: (id) => `/api/v1/rooms/${id}`,
  },
  ROOM_TYPES: {
    BASE: '/api/v1/room-types',
    BY_HOTEL: (hotelId) => `/api/v1/room-types/hotel/${hotelId}`,
    BY_ID: (id) => `/api/v1/room-types/${id}`,
  },
  BOOKINGS: {
    BASE: '/api/v1/bookings',
    BY_ID: (id) => `/api/v1/bookings/${id}`,
    BY_USER: (id) => `/api/v1/bookings/${id}/user`,
    BY_HOTEL: (hotelId) => `/api/v1/bookings/hotel/${hotelId}/all`,
    CANCEL: (id) => `/api/v1/bookings/${id}/cancel`,
  },
  PAYMENTS: {
    BASE: '/api/v1/payments',
    BY_ID: (id) => `/api/v1/payments/${id}`,
  },
  RATINGS: {
    BY_HOTEL: (hotelId) => `/api/v1/ratings/hotel/${hotelId}`,
    SUMMARY: (hotelId) => `/api/v1/ratings/hotel/${hotelId}/summary`,
    ADMIN_DELETE: (id) => `/api/v1/ratings/admin/${id}`,
  },
  FEEDBACKS: {
    BASE: '/api/v1/feedbacks',
    STATISTICS: '/api/v1/feedbacks/statistics',
    CATEGORY: (cat) => `/api/v1/feedbacks/category/${cat}`,
    DELETE: (id) => `/api/v1/feedbacks/${id}`,
  },
  ADMIN: {
    ACTIVE_SESSIONS: '/api/v1/admin/active-sessions',
  }
};
