/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [authed, setAuthed] = useState(false);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authService.getCurrentUser,
    retry: false,
    staleTime: 1000 * 60 * 5,
    enabled: authed,
    onSuccess: () => {
      setAuthed(true);
    },
    onError: () => {
      setAuthed(false);
    },
  });

  const isAuthenticated = !!user;
  const isVerifying = isLoading;

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authService.login(email, password),
    onSuccess: () => {
      setAuthed(true);
      queryClient.resetQueries({ queryKey: ['currentUser'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      setAuthed(false);
      queryClient.clear();
      window.location.href = '/login';
    },
    onError: () => {
      setAuthed(false);
      queryClient.clear();
      window.location.href = '/login';
    },
  });

  const value = useMemo(() => ({
    user: user?.data?.teacher,
    isAuthenticated,
    isVerifying,
    isLoading,
    error,
    login: loginMutation.mutate,
    loginError: loginMutation.error,
    isLoginLoading: loginMutation.isPending,
    logout: () => logoutMutation.mutate(),
  }), [user, isAuthenticated, isVerifying, isLoading, error, loginMutation, logoutMutation]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
