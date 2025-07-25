import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import apiClient from '../lib/axios';
import { User, LoginData, SignupData, ForgotPasswordData } from '../types/auth';

export const useAuth = () => {
  return useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await apiClient.get('/users/me');
      return response.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'You have successfully signed in.',
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Sign in failed',
        message: error instanceof Error ? error.message : 'Please check your credentials and try again.',
      });
    },
  });
};

export const useSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await apiClient.post('/users/add', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      addToast({
        type: 'success',
        title: 'Account created!',
        message: 'Welcome to ExpenseTrace. Your account has been created successfully.',
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Sign up failed',
        message: error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.clear();
      addToast({
        type: 'info',
        title: 'Signed out',
        message: 'You have been successfully signed out.',
      });
      navigate('/signin');
    },
  });
};

export const useForgotPassword = () => {
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await apiClient.post('/auth/forgot-password', data);
      return response.data;
    },
    onSuccess: () => {
      addToast({
        type: 'success',
        title: 'Reset link sent',
        message: 'Check your email for password reset instructions.',
      });
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Failed to send reset link',
        message: error instanceof Error ? error.message : 'Please try again.',
      });
    },
  });
};