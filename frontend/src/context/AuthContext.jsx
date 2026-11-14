import { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../features/auth/authService';
import storage from '../utils/storage';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());
  const [loading, setLoading] = useState(true);

  // Initialize and verify profile on load if token is stored
  const initAuth = useCallback(async () => {
    const storedToken = storage.getToken();
    if (!storedToken) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }

    try {
      const data = await authService.getProfile();
      if (data?.user) {
        setUser(data.user);
        storage.setUser(data.user);
      }
    } catch (err) {
      console.error('Failed to load user profile on startup:', err);
      // If unauthorized, storage will be cleaned up by interceptor
      storage.clear();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    if (data?.token) {
      storage.setToken(data.token);
      setToken(data.token);

      // Fetch user profile immediately with new token
      try {
        const profileData = await authService.getProfile();
        if (profileData?.user) {
          setUser(profileData.user);
          storage.setUser(profileData.user);
        }
      } catch (profileErr) {
        console.error('Error fetching profile after login:', profileErr);
      }
    }
    return data;
  };

  const register = async (userData) => {
    return await authService.register(userData);
  };

  const logout = () => {
    storage.clear();
    setToken(null);
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const data = await authService.getProfile();
      if (data?.user) {
        setUser(data.user);
        storage.setUser(data.user);
      }
      return data?.user;
    } catch (err) {
      console.error('Error refreshing profile:', err);
      return null;
    }
  };

  const updateCurrentUser = (updatedUser) => {
    setUser(updatedUser);
    storage.setUser(updatedUser);
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    isAdmin: user?.role === 'admin',
    loading,
    login,
    register,
    logout,
    refreshProfile,
    updateCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

