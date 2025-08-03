export interface Transaction {
  id: string;
  type: 1 | 2 | 3; // 1 = Expense, 2 = Income, 3 = Transfer
  date: number;
  month: number;
  year: number;
  time: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  amount: number;
  categoryId?: string;
  accountId: string;
  toAccountId?: string; // For transfers
  paymentModeId?: string;
  fromPaymentModeId?: string; // For transfers
  toPaymentModeId?: string; // For transfers
  description: string;
  tags?: string[];
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  account?: {
    id: string;
    name: string;
    type: string;
  };
  toAccount?: {
    id: string;
    name: string;
    type: string;
  };
  paymentMode?: {
    id: string;
    name: string;
    type: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionData {
  type: 1 | 2 | 3;
  date: number;
  month: number;
  year: number;
  time: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  amount: number;
  categoryId?: string;
  accountId: string;
  toAccountId?: string;
  paymentModeId?: string;
  fromPaymentModeId?: string;
  toPaymentModeId?: string;
  description: string;
  tags?: string[];
}

export interface UpdateTransactionData {
  type?: 1 | 2 | 3;
  date?: string;
  time?: {
    hour: number;
    minute: number;
    second: number;
    nano: number;
  };
  amount?: number;
  categoryId?: string;
  accountId?: string;
  toAccountId?: string;
  paymentModeId?: string;
  fromPaymentModeId?: string;
  toPaymentModeId?: string;
  description?: string;
  tags?: string[];
}

export interface TransactionFilters {
  search?: string;
  type?: 1 | 2 | 3;
  categoryId?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedTransactions {
  content: Transaction[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export const TRANSACTION_TYPES = {
  '1': 'Expense',
  '2': 'Income',
  '3': 'Transfer'
} as const;

export type TransactionType = keyof typeof TRANSACTION_TYPES;