import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConfig';

/**
 * Admin Monitoring API Service
 * Maps to com.hackops.hotel_booking_system.admin.AdminController
 */

// Fields from: ActiveSessionsResponse
// activeSessions[int], timestamp[String]

export const getActiveSessions = async () => {
  const response = await axiosInstance.get(ENDPOINTS.ADMIN.ACTIVE_SESSIONS);
  return response.data; // ActiveSessionsResponse
};
