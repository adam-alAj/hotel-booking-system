import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor 
let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(callback) {
    refreshSubscribers.push(callback);
}
function onTokenRefreshed(newToken) {
    refreshSubscribers.forEach((cb) => cb(newToken));
    refreshSubscribers = [];
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    subscribeTokenRefresh((newToken) => {
                        if (newToken) {
                            originalRequest.headers.Authorization = `Bearer ${newToken}`;
                            resolve(api(originalRequest));
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
                return api(originalRequest);
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
// AUTH API (ONLY)
// ===================================================================
export const authAPI = {
    login: (email, password) => api.post('/api/auth/login', { email, password }),
    register: (userData) => api.post('/api/auth/register', userData),
    logout: () => api.post('/api/auth/logout', { refreshToken: localStorage.getItem('refreshToken') }),
    getCurrentUser: () => api.get('/api/users/me'),
    refreshToken: (refreshToken) => axios.post(`${API_BASE_URL}/api/auth/refresh`, { refreshToken }),
};

export default api;