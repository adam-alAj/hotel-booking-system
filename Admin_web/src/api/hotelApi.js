import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConfig';

/**
 * Hotel API Service
 * Maps to com.hackops.hotel_booking_system.catalog.HotelController
 */

// Fields from: HotelResponse.java
// id, name, city, address, description, imageUrl, averageRating, totalReviews, ratingBadge, ratingWarning, isActive

export const getHotels = async (page = 0, size = 10, sortBy = 'id') => {
  const response = await axiosInstance.get(ENDPOINTS.HOTELS.BASE, {
    params: { page, size, sortBy }
  });
  return response.data; // PaginatedHotelResponse
};

export const getHotelById = async (id) => {
  const response = await axiosInstance.get(ENDPOINTS.HOTELS.BY_ID(id));
  return response.data; // HotelResponse
};

export const createHotel = async (formData) => {
  // Uses MultipartFile for image
  const response = await axiosInstance.post(ENDPOINTS.HOTELS.BASE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data; // HotelResponse
};

export const updateHotel = async (id, formData) => {
  // Uses MultipartFile for image
  const response = await axiosInstance.put(ENDPOINTS.HOTELS.BY_ID(id), formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data; // HotelResponse
};

export const deleteHotel = async (id) => {
  const response = await axiosInstance.delete(ENDPOINTS.HOTELS.BY_ID(id));
  return response.data;
};

export const getRoomTypesByHotel = async (hotelId) => {
  const response = await axiosInstance.get(ENDPOINTS.ROOM_TYPES.BY_HOTEL(hotelId));
  return response.data; // List<RoomTypeResponse>
};
