import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

// Create a dedicated axios instance for manager API calls
const apiManager = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach JWT token
apiManager.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor — auto-refresh on 401
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}
function onTokenRefreshed(newToken) {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
}

apiManager.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((newToken) => {
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            resolve(apiManager(originalRequest));
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
                return apiManager(originalRequest);
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
// MANAGER API ENDPOINTS
// ===================================================================

export const managerAPI = {
    // Hotels
    getMyHotels: () => apiManager.get('/api/v1/hotels/my-hotels'),
    createHotel: (formData) =>
        apiManager.post('/api/v1/hotels', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    updateHotel: (hotelId, formData) =>
        apiManager.put(`/api/v1/hotels/${hotelId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    deleteHotel: (hotelId) => apiManager.delete(`/api/v1/hotels/${hotelId}`),

    // Bookings for a specific hotel
    getMyHotelBookings: (hotelId) =>
        apiManager.get(`/api/v1/bookings/my-hotel-bookings?hotelId=${hotelId}`),

    // Rooms
    getHotelRooms: (hotelId) => apiManager.get(`/api/v1/rooms/hotel/${hotelId}/rooms`),
    createRoom: (roomData) => apiManager.post('/api/v1/rooms', roomData),
    patchRoom: (roomId, roomData) => apiManager.patch(`/api/v1/rooms/${roomId}`, roomData),
    deleteRoom: (roomId) => apiManager.delete(`/api/v1/rooms/${roomId}`),

    // Room Types
    getHotelRoomTypes: (hotelId) => apiManager.get(`/api/v1/room-types/hotel/${hotelId}`),
    createRoomType: (formData) =>
        apiManager.post('/api/v1/room-types', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    patchRoomType: (id, data) => apiManager.patch(`/api/v1/room-types/${id}`, data),
    deleteRoomType: (id) => apiManager.delete(`/api/v1/room-types/${id}`),

    // Pricing Rules
    getHotelPricingRules: (hotelId) =>
        apiManager.get(`/api/v1/hotel-pricing/hotels/${hotelId}/rules`),
    createPricingRule: (hotelId, ruleData) =>
        apiManager.post(`/api/v1/hotel-pricing/hotels/${hotelId}/rules`, ruleData),
    patchPricingRule: (ruleId, ruleData) =>
        apiManager.patch(`/api/v1/hotel-pricing/rules/${ruleId}`, ruleData),
    deletePricingRule: (ruleId) => apiManager.delete(`/api/v1/hotel-pricing/rules/${ruleId}`),
    assignRuleToRoomTypes: (ruleId, roomTypeIds) =>
        apiManager.post(`/api/v1/hotel-pricing/rules/${ruleId}/assign-to-room-types`, roomTypeIds),

    // Base Prices
    getHotelBasePrices: (hotelId) =>
        apiManager.get(`/api/v1/hotel-pricing/hotels/${hotelId}/room-types/base-prices`),
    setBasePrice: (hotelId, roomTypeId, priceData) =>
        apiManager.post(
            `/api/v1/hotel-pricing/hotels/${hotelId}/room-types/${roomTypeId}/base-price`,
            priceData
        ),
    patchBasePrice: (basePriceId, priceData) =>
        apiManager.patch(`/api/v1/hotel-pricing/base-prices/${basePriceId}`, priceData),
    updateBasePrice: (basePriceId, priceData) =>
        apiManager.patch(`/api/v1/hotel-pricing/base-prices/${basePriceId}`, priceData),
    deleteBasePrice: (basePriceId) =>
        apiManager.delete(`/api/v1/hotel-pricing/base-prices/${basePriceId}`),
};

// Amenities API (used by Room Types)
export const amenitiesAPI = {
    getAllAmenities: () => apiManager.get('/api/v1/room-types/amenities'),
};

// Room API (for room deletion and other room operations)
export const roomAPI = {
    deleteRoom: (roomId) => apiManager.delete(`/api/v1/rooms/${roomId}`),
    getRoomsByHotelId: (hotelId) => apiManager.get(`/api/v1/rooms/hotel/${hotelId}`),
    getRoomsByType: (roomTypeId) => apiManager.get(`/api/v1/rooms/type/${roomTypeId}`),
    getRoomStatus: (roomId) => apiManager.get(`/api/v1/rooms/${roomId}/status`),
    createRoom: (roomData) => apiManager.post('/api/v1/rooms', roomData),
    patchRoom: (roomId, roomData) => apiManager.patch(`/api/v1/rooms/${roomId}`, roomData),
};

export default apiManager;