import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import apiClient from '../lib/axios';
import { 
  Transaction, 
  CreateTransactionData, 
  UpdateTransactionData,
  PaginatedTransactions,
  TransactionFilters
} from '../types/transaction';

// Get all transactions with pagination
export const useTransactions = (page = 0, size = 10, filters?: TransactionFilters) => {
  return useQuery<PaginatedTransactions>({
    queryKey: ['transactions', page, size, filters],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        size: size.toString(),
      });

      if (filters?.search) params.append('search', filters.search);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.categoryId) params.append('categoryId', filters.categoryId);
      if (filters?.accountId) params.append('accountId', filters.accountId);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);

      const response = await apiClient.get(`/transactions?${params.toString()}`);
      console.log('Transactions response:', response.data.data.content);
      return response.data.data || {
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: size,
        number: page,
        first: true,
        last: true
      };
    },
  });
};

// Get transaction by ID
export const useTransaction = (id: string) => {
  return useQuery<Transaction>({
    queryKey: ['transaction', id],
    queryFn: async () => {
      const response = await apiClient.get(`/transactions/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

// Create transaction
export const useCreateTransaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (data: CreateTransactionData) => {
      const response = await apiClient.post('/transactions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      addToast({
        type: 'success',
        title: 'Transaction created',
        message: 'Your transaction has been recorded successfully.',
      });
      navigate('/transactions');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to create transaction',
        message: 'Please try again.',
      });
    },
  });
};

// Update transaction
export const useUpdateTransaction = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateTransactionData }) => {
      const response = await apiClient.put(`/transactions/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      addToast({
        type: 'success',
        title: 'Transaction updated',
        message: 'Your transaction has been updated successfully.',
      });
      navigate('/transactions');
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to update transaction',
        message: 'Please try again.',
      });
    },
  });
};

// Delete transaction
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/transactions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      addToast({
        type: 'success',
        title: 'Transaction deleted',
        message: 'The transaction has been deleted successfully.',
      });
    },
    onError: () => {
      addToast({
        type: 'error',
        title: 'Failed to delete transaction',
        message: 'Please try again.',
      });
    },
  });
};