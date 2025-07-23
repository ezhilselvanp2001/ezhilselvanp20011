import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/axios';
import { 
  UserSettings
} from '../types/settings';

// Get user settings
export const useSettings = (enabled = true) => {
  return useQuery<UserSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await apiClient.get('/settings');
      return response.data.data;
    },
    enabled
  });
};

// Update time format
export const useUpdateTimeFormat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formatCode: number) => {
      const response = await apiClient.patch(`/settings/time-format?formatCode=${formatCode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Update decimal format
export const useUpdateDecimalFormat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formatCode: number) => {
      const response = await apiClient.patch(`/settings/number-format?formatCode=${formatCode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Update number format
export const useUpdateNumberFormat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formatCode: number) => {
      const response = await apiClient.patch(`/settings/number-format?formatCode=${formatCode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Update currency code
export const useUpdateCurrencyCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (currencyCode: string) => {
      const response = await apiClient.patch(`/settings/currency-code?currencyCode=${currencyCode}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Update daily reminder
export const useUpdateDailyReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dailyReminder: boolean) => {
      const response = await apiClient.patch(`/settings/daily-reminder?dailyReminder=${dailyReminder}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });
};

// Clear all data
export const useClearAllData = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/settings/data');
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/dashboard');
    },
  });
};

// Delete account
export const useDeleteAccount = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiClient.delete('/settings/account');
      return response.data;
    },
    onSuccess: () => {
      queryClient.clear();
      navigate('/signin');
    },
  });
};