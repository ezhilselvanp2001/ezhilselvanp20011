import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiClient from '../lib/axios';
import {  
  BudgetSummary,
  BudgetAnalysis,
  CreateMonthlyBudgetData,
  CreateYearlyBudgetData,
  UpdateMonthlyBudgetData,
  UpdateYearlyBudgetData
} from '../types/budget';

// Get budget summaries
export const useBudgetSummary = () => {
  return useQuery<BudgetSummary>({
    queryKey: ['budget-summary'],
    queryFn: async () => {
      const [monthlyResponse, yearlyResponse] = await Promise.all([
        apiClient.get('/budget/summary/month'),
        apiClient.get('/budget/summary/year')
      ]);
      return {
        monthly: monthlyResponse.data || { upcoming: [], past: [] },
        yearly: yearlyResponse.data || { upcoming: [], past: [] }
      };
    },
  });
};

// Get budget analysis
export const useBudgetAnalysis = (budgetId: string, type: 'monthly' | 'yearly') => {
  return useQuery<BudgetAnalysis>({
    queryKey: ['budget-analysis', budgetId, type],
    queryFn: async () => {
      const endpoint = type === 'monthly' ? `/budget/monthly/${budgetId}` : `/budget/yearly/${budgetId}`;
      const response = await apiClient.get(endpoint);
      return response.data;
    },
    enabled: !!budgetId,
  });
};

// Create budgets
export const useCreateMonthlyBudget = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMonthlyBudgetData) => {
      const response = await apiClient.post('/budget/month', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      navigate('/budgets');
    },
  });
};

export const useCreateYearlyBudget = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateYearlyBudgetData) => {
      const response = await apiClient.post('/budget/year', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      navigate('/budgets');
    },
  });
};

// Update budgets
export const useUpdateMonthlyBudget = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateMonthlyBudgetData }) => {
      const response = await apiClient.put(`/budget/month/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      queryClient.invalidateQueries({ queryKey: ['budget-analysis'] });
      navigate('/budgets');
    },
  });
};

export const useUpdateYearlyBudget = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateYearlyBudgetData }) => {
      const response = await apiClient.put(`/budget/year/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      queryClient.invalidateQueries({ queryKey: ['budget-analysis'] });
      navigate('/budgets');
    },
  });
};

// Delete budget
export const useDeleteBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/budget/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budget-summary'] });
      queryClient.invalidateQueries({ queryKey: ['budget-analysis'] });
    },
  });
};