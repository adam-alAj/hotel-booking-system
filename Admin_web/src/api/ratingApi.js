import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConfig';

/**
 * Rating API Service
 * Maps to com.hackops.hotel_booking_system.rating.RatingController
 */

// Fields from RatingResponse.java
// id, hotelId, hotelName, userId, userName, rating, comment, createdAt

export const getRatingsByHotel = async (hotelId) => {
  const response = await axiosInstance.get(ENDPOINTS.RATINGS.BY_HOTEL(hotelId));
  return response.data; // List<RatingResponse>
};

export const getRatingSummary = async (hotelId) => {
  const response = await axiosInstance.get(ENDPOINTS.RATINGS.SUMMARY(hotelId));
  return response.data; // HotelRatingSummaryResponse
};

export const deleteRating = async (id) => {
  const response = await axiosInstance.delete(ENDPOINTS.RATINGS.ADMIN_DELETE(id));
  return response.data;
};
