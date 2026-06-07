import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();

    // Listen for logout events from API interceptor
    const handleLogoutEvent = () => {
      setUser(null);
      setIsAuthenticated(false);
    };

    window.addEventListener('auth:logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth:logout', handleLogoutEvent);
    };
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
      setLoading(false);
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await authAPI.getCurrentUser();
      console.log('Auth check - User data:', response.data);
      console.log('Auth check - User roles:', response.data.roles);
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await authAPI.login(email, password);
    const { accessToken, refreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    const userRes = await authAPI.getCurrentUser();
    setUser(userRes.data);
    setIsAuthenticated(true);

    return response.data;
  };

  const register = async (userData) => {
    const response = await authAPI.register(userData);
    const { accessToken, refreshToken } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    const userRes = await authAPI.getCurrentUser();
    setUser(userRes.data);
    setIsAuthenticated(true);

    return response.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated,
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};