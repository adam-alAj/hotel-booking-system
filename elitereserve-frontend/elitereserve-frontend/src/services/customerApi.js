import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const customerApi = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
customerApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for token refresh
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}

function onTokenRefreshed(newToken) {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
}

customerApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((newToken) => {
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            resolve(customerApi(originalRequest));
                        } else {
                            reject(error);
                        }
                    });
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');
                const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', newRefreshToken);
                onTokenRefreshed(accessToken);
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return customerApi(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                onTokenRefreshed(null);
                refreshSubscribers = [];
                window.dispatchEvent(new CustomEvent('auth:logout'));
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

// ===================================================================
// AUTH API
// ===================================================================
export const authAPI = {
    login: (email, password) => customerApi.post('/api/auth/login', { email, password }),
    register: (userData) => customerApi.post('/api/auth/register', userData),
    logout: () => customerApi.post('/api/auth/logout', { refreshToken: localStorage.getItem('refreshToken') }),
    getCurrentUser: () => customerApi.get('/api/users/me'),
};

// ===================================================================
// HOTEL API
// ===================================================================
export const hotelAPI = {
    getAllHotels: (page = 0, size = 8) => customerApi.get(`/api/v1/hotels?page=${page}&size=${size}`),
    getHotelById: (id) => customerApi.get(`/api/v1/hotels/${id}`),
    searchHotels: (searchRequest) => customerApi.post('/api/v1/hotels/search', searchRequest),
};

// ===================================================================
// ROOM TYPE API
// ===================================================================
export const roomTypeAPI = {
    getRoomTypesByHotel: (hotelId) => customerApi.get(`/api/v1/room-types/hotel/${hotelId}`),
    getRoomTypeById: (id) => customerApi.get(`/api/v1/room-types/${id}`),
};

// ===================================================================
// BOOKING API
// ===================================================================
export const bookingAPI = {
    createBooking: (bookingData) => customerApi.post('/api/v1/bookings', bookingData),
    cancelBooking: (id) => customerApi.patch(`/api/v1/bookings/${id}/cancel`),
    getMyHistory: () => customerApi.get('/api/v1/bookings/my-history'),
    calculatePrice: (hotelId, roomTypeId, checkIn, checkOut) =>
        customerApi.get(`/api/v1/hotel-pricing/calculate?hotelId=${hotelId}&roomTypeId=${roomTypeId}&checkIn=${checkIn}&checkOut=${checkOut}`),
    requestExtension: (bookingId, extensionData) =>
        customerApi.patch(`/api/v1/bookings/${bookingId}/request-extension`, extensionData),
    confirmExtensionPayment: (extId) =>
        customerApi.patch(`/api/v1/bookings/extensions/${extId}/confirm-payment`),
};

// ===================================================================
// PAYMENT API
// ===================================================================
export const paymentAPI = {
    createPayment: (paymentData) => customerApi.post('/api/v1/payments', paymentData),
};

// ===================================================================
// FEEDBACK API
// ===================================================================
export const feedbackAPI = {
    createFeedback: (data) => customerApi.post('/api/v1/feedbacks', data),
    getAllFeedbacks: (page = 0, size = 6) => customerApi.get('/api/v1/feedbacks', { params: { page, size } }),
};

export default customerApi;