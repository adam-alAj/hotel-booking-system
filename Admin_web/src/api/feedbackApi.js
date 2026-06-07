import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConfig';

/**
 * Feedback API Service
 * Maps to com.hackops.hotel_booking_system.feedback.FeedbackController
 */

// Fields from FeedbackResponse.java
// id, message, category, customerId, customerName, createdAt, isResolved, urgency

export const getFeedbacks = async (page = 0, size = 10) => {
  const response = await axiosInstance.get(ENDPOINTS.FEEDBACKS.BASE, {
    params: { page, size }
  });
  return response.data; // FeedbackPaginatedResponse
};

export const getFeedbackStats = async () => {
  const response = await axiosInstance.get(ENDPOINTS.FEEDBACKS.STATISTICS);
  return response.data; // FeedbackStatisticsResponse
};

export const deleteFeedback = async (id) => {
  const response = await axiosInstance.delete(ENDPOINTS.FEEDBACKS.DELETE(id));
  return response.data;
};
