import axiosInstance from './axiosInstance';
import { ENDPOINTS } from './apiConfig';

/**
 * User API Service
 * Maps to com.hackops.hotel_booking_system.user.UserController
 */

// Fields from: UserResponse.java
// id, email, firstName, lastName, roles[SET<Role>]

export const getUsers = async (page = 0, size = 10, search = '', role = '') => {
  const params = { page, size };
  if (search) params.search = search;
  if (role) params.role = role;
  
  const response = await axiosInstance.get(ENDPOINTS.USERS.BASE, { params });
  return response.data; // Page<UserResponse>
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(ENDPOINTS.USERS.BY_ID(id));
  return response.data; // UserResponse
};

export const createUser = async (userData) => {
  const response = await axiosInstance.post(ENDPOINTS.USERS.BASE, userData);
  return response.data; // UserResponse
};

export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(ENDPOINTS.USERS.BY_ID(id), userData);
  return response.data; // UserResponse
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(ENDPOINTS.USERS.BY_ID(id));
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/api/users/me');
  return response.data; // UserResponse
};
