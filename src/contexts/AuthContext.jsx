import { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth';
import axiosInstance from '../api/axios';

const extractToken = (data) => {
  if (data.token) return data.token;
  if (data.access_token) return data.access_token;
  if (data.data?.token) return data.data.token;
  if (data.data?.access_token) return data.data.access_token;
  return null;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const queryClient = useQueryClient();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    onError: (err) => {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        authService.logout();
      }
    },
  });

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: (data) => {
      const token = extractToken(data);
      console.log('onSuccess - token:', token);
      if (token) {
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
      }
      setIsAuthenticated(true);
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    queryClient.clear();
    window.location.href = '/login';
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    isLoginLoading: loginMutation.isPending,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
