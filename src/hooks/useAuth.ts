import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await apiClient.post('/auth/login', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/dashboard');
    },
  });
};

export const useSignup = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SignupData) => {
      const response = await apiClient.post('/users/add', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      navigate('/dashboard');
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiClient.post('/auth/logout');
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/signin');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (data: ForgotPasswordData) => {
      const response = await apiClient.post('/auth/forgot-password', data);
      return response.data;
    },
  });
};