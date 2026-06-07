import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConfig';

/**
 * Payment API Service
 * Maps to com.hackops.hotel_booking_system.payment.PaymentController
 */

// Fields from PaymentResponse.java
// id, amount, method, status, bookingId

export const getAllPayments = async () => {
  const response = await axiosInstance.get(ENDPOINTS.PAYMENTS.BASE);
  return response.data; // List<PaymentResponse>
};

export const deletePayment = async (id) => {
  const response = await axiosInstance.delete(ENDPOINTS.PAYMENTS.BY_ID(id));
  return response.data;
};
