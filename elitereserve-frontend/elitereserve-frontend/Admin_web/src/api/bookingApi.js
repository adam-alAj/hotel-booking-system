import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConfig';

/**
 * Booking API Service
 * Maps to com.hackops.hotel_booking_system.booking.BookingController
 */

// Fields from BookingResponse.java
// id, hotelId, hotelName, userId, guestName, guestEmail, status[Enum], checkInDate, checkOutDate, quotedPrice, totalPaid, roomNo

export const getBookingsByHotel = async (hotelId) => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.BY_HOTEL(hotelId));
  return response.data; // List<BookingResponse>
};

export const getBookingById = async (id) => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.BY_ID(id));
  return response.data; // BookingResponse
};

export const cancelBooking = async (id) => {
  const response = await axiosInstance.patch(ENDPOINTS.BOOKINGS.CANCEL(id));
  return response.data; // BookingResponse
};

export const getUserByBooking = async (id) => {
  const response = await axiosInstance.get(ENDPOINTS.BOOKINGS.BY_USER(id));
  return response.data; // UserResponse
};
