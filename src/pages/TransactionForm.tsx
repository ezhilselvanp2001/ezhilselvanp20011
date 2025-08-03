import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Calculator as CalculatorIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import {
  useCreateTransaction,
  useUpdateTransaction,
  useTransaction
} from '../hooks/useTransactions';
import {
  useCategoriesByType,
  useDefaultCategory
} from '../hooks/useCategories';
import {
  useAccounts,
  useDefaultPaymentMode
} from '../hooks/useAccounts';
import { CreateTransactionData } from '../types/transaction';
import CalculatorModal from '../components/CalculatorModal';
import CategorySelectModal from '../components/CategorySelectModal';
import AccountSelectModal from '../components/AccountSelectModal';
import CategoryIcon from '../components/CategoryIcon';

const tabs = ['Expense', 'Income', 'Transfer'];

interface FormData {
  type: 1 | 2 | 3;
  date: string;
  time: string;
  amount: number;
  categoryId?: string;
  accountId: string;
  toAccountId?: string;
  paymentModeId?: string;
  fromPaymentModeId?: string;
  toPaymentModeId?: string;
  description: string;
  tags: string[];
}

function TransactionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const defaultTags = ['vacation', 'needs', 'busineess', 'food', 'shopping', 'entertainment', 'health', 'transportation'];
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isToAccountModalOpen, setIsToAccountModalOpen] = useState(false);
  const [isFromAccountModalOpen, setIsFromAccountModalOpen] = useState(false);

  const { data: transaction, isLoading: transactionLoading } = useTransaction(id || '');
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();

  // Get categories and accounts
  const currentType = activeTab === 0 ? 1 : activeTab === 1 ? 2 : 1; // For transfer, use expense categories
  const { data: categories = [] } = useCategoriesByType(currentType);
  const { data: defaultCategory } = useDefaultCategory(currentType);
  const { data: accounts = [] } = useAccounts();
  const { data: defaultPaymentMode } = useDefaultPaymentMode();

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      type: 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      amount: 0,
      categoryId: '',
      accountId: '',
      toAccountId: '',
      paymentModeId: '',
      fromPaymentModeId: '',
      toPaymentModeId: '',
      description: '',
      tags: []
    }
  });

  const watchedValues = watch();
  const selectedCategory = categories.find(cat => cat.id === watchedValues.categoryId);
  const selectedAccount = accounts.find(acc => acc.id === watchedValues.accountId);
  const selectedToAccount = accounts.find(acc => acc.id === watchedValues.toAccountId);
  const selectedPaymentMode = selectedAccount?.linkedPaymentModes?.find(pm => pm.id === watchedValues.paymentModeId);
  const selectedFromPaymentMode = selectedAccount?.linkedPaymentModes?.find(pm => pm.id === watchedValues.fromPaymentModeId);
  const selectedToPaymentMode = selectedToAccount?.linkedPaymentModes?.find(pm => pm.id === watchedValues.toPaymentModeId);

  // Load existing transaction data for editing
  useEffect(() => {
    if (isEditing && transaction) {
      const transactionType = transaction.type;
      if (transaction.type === 1)
        setActiveTab(transactionType === 1 ? 0 : transactionType === 2 ? 1 : 2);
      setValue('type', transactionType);
      setValue('date', '' + (transaction.year.toString().padStart(2, '0') + '-' + transaction.month.toString().padStart(2, '0') + '-' + transaction.date).toString());
      // setValue('time', `${transaction.time.hour.toString().padStart(2, '0')}:${transaction.time.minute.toString().padStart(2, '0')}`);
      setValue('amount', transaction.amount);
      setValue('categoryId', transaction.categoryId || '');
      setValue('accountId', transaction.accountId);
      setValue('toAccountId', transaction.toAccountId || '');
      setValue('paymentModeId', transaction.paymentMode?.id || '');
      setValue('description', transaction.description);
      setValue('tags', transaction.tags?.map(tag => tag.name) || []);
    }
  }, [isEditing, transaction, setValue]);

  // Set defaults when not editing
  useEffect(() => {
    if (!isEditing) {
      if (defaultCategory && activeTab !== 2) {
        setValue('categoryId', defaultCategory.id);
      }

      if (defaultPaymentMode) {
        setValue('accountId', defaultPaymentMode.id);
      }
    }
  }, [defaultCategory, defaultPaymentMode, activeTab, isEditing, setValue]);

  // Update form type when tab changes
  useEffect(() => {
    const newType = activeTab === 0 ? 1 : activeTab === 1 ? 2 : 3;
    setValue('type', newType);

    // Clear category for transfer
    if (activeTab === 2) {
      setValue('categoryId', '');
    } else if (defaultCategory) {
      setValue('categoryId', defaultCategory.id);
    }
  }, [activeTab, setValue, defaultCategory]);

  const onSubmit = async (data: FormData) => {
    try {
      const [year, month, day] = data.date.split("-").map(Number);
      const [hours, minutes] = data.time.split(':').map(Number);

      const transactionData: CreateTransactionData = {
        type: data.type,
        date: day,
        month: month,
        year: year,
        time: {
          hour: hours,
          minute: minutes,
          second: 0,
          nano: 0
        },
        amount: data.amount,
        categoryId: data.type === 3 ? undefined : data.categoryId,
        accountId: data.accountId,
        toAccountId: data.type === 3 ? data.toAccountId : undefined,
        paymentModeId: data.type === 3 ? data.fromPaymentModeId : data.paymentModeId,
        toPaymentModeId: data.type === 3 ? data.toPaymentModeId : undefined,
        description: data.description,
        tags: data.tags
      };

      const transactionType = data.type === 1 ? 'expense' : data.type === 2 ? 'income' : 'transfer';

      if (isEditing && id) {
        await updateTransaction.mutateAsync({ 
          id, 
          data: transactionData, 
          transactionType 
        });
      } else {
        await createTransaction.mutateAsync({ 
          ...transactionData, 
          transactionType 
        });
      }
    } catch (error) {
      console.error('Failed to save transaction:', error);
    }
  };

  const handleAmountChange = (amount: number) => {
    setValue('amount', amount);
  };

  const toggleTag = (tag: string) => {
    const currentTags = watch('tags');
    if (currentTags.includes(tag)) {
      setValue('tags', currentTags.filter(t => t !== tag));
    } else {
      setValue('tags', [...currentTags, tag]);
    }
  };


  const isPending = createTransaction.isPending || updateTransaction.isPending;

  if (isEditing && transactionLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => navigate('/transactions')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Transactions
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Transaction' : 'Add Transaction'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditing ? 'Update transaction details' : 'Record a new financial transaction'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Transaction Type Tabs */}
        {/* {!isEditing && ( */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Transaction Type
          </label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {tabs.map((tab, index) => {
              const active = activeTab === index;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(index)}
                  className={`flex-1 text-sm font-medium rounded-lg py-2 transition-all duration-200 ${active
                    ? "bg-white shadow text-black"
                    : "text-gray-500 hover:text-black"
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
        {/* )} */}

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <input
              {...register('date', { required: 'Date is required' })}
              type="date"
              id="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.date && (
              <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
            )}
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">
              Time
            </label>
            <input
              {...register('time', { required: 'Time is required' })}
              type="time"
              id="time"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.time && (
              <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
            )}
          </div>
        </div>

        {/* Amount */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
            >
              <CalculatorIcon className="w-4 h-4 mr-1" />
              Calculator
            </button>
          </div>
          <input
            {...register('amount', {
              required: 'Amount is required',
              min: { value: 0.01, message: 'Amount must be greater than 0' }
            })}
            type="number"
            step="0.01"
            id="amount"
            placeholder="0.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
          )}
        </div>

        {/* Category (for Expense and Income) */}
        {activeTab !== 2 && (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(true)}
                className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
              >
                <Edit className="w-4 h-4 mr-1" />
                Change
              </button>
            </div>

            {selectedCategory ? (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <CategoryIcon icon={selectedCategory.icon} color={selectedCategory.color} />
                <span className="font-medium text-gray-900">{selectedCategory.name}</span>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                No category selected
              </div>
            )}
          </div>
        )}

        {/* Account */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Account
            </label>
            <button
              type="button"
              onClick={() => setIsAccountModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
            >
              <Edit className="w-4 h-4 mr-1" />
              Change
            </button>
          </div>

          {selectedAccount ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-medium">
                    {selectedAccount.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedAccount.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{selectedAccount.type}</p>
                </div>
              </div>
              
              {/* Payment Mode for non-transfer transactions */}
              {activeTab !== 2 && selectedAccount.linkedPaymentModes && selectedAccount.linkedPaymentModes.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode (Optional)
                  </label>
                  {selectedPaymentMode ? (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="p-2 rounded-lg bg-blue-100">
                        {/* Payment mode icon would go here */}
                        <span className="text-blue-600 text-sm font-medium">PM</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{selectedPaymentMode.name}</p>
                        <p className="text-sm text-gray-500">{selectedPaymentMode.type}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedAccount.linkedPaymentModes.map((paymentMode) => (
                        <button
                          key={paymentMode.id}
                          type="button"
                          onClick={() => setValue('paymentModeId', paymentMode.id)}
                          className="p-2 text-left border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-colors"
                        >
                          <p className="text-sm font-medium text-gray-900">{paymentMode.name}</p>
                          <p className="text-xs text-gray-500">{paymentMode.type}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
              No account selected
            </div>
          )}
        </div>

        {/* To Account (for Transfer) */}
        {activeTab === 2 && (
          <div className="space-y-6">
            {/* From Account for Transfer */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  From Account
                </label>
                <button
                  type="button"
                  onClick={() => setIsFromAccountModalOpen(true)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Change
                </button>
              </div>

              {selectedAccount ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-medium">
                        {selectedAccount.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedAccount.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{selectedAccount.type}</p>
                    </div>
                  </div>
                  
                  {/* From Payment Mode */}
                  {selectedAccount.linkedPaymentModes && selectedAccount.linkedPaymentModes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Payment Mode (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedAccount.linkedPaymentModes.map((paymentMode) => (
                          <button
                            key={paymentMode.id}
                            type="button"
                            onClick={() => setValue('fromPaymentModeId', paymentMode.id)}
                            className={`p-2 text-left border rounded-lg transition-colors ${
                              watchedValues.fromPaymentModeId === paymentMode.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900">{paymentMode.name}</p>
                            <p className="text-xs text-gray-500">{paymentMode.type}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                  No account selected
                </div>
              )}
            </div>

            {/* To Account for Transfer */}
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  To Account
                </label>
                <button
                  type="button"
                  onClick={() => setIsToAccountModalOpen(true)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Change
                </button>
              </div>

              {selectedToAccount ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium">
                        {selectedToAccount.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedToAccount.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{selectedToAccount.type}</p>
                    </div>
                  </div>
                  
                  {/* To Payment Mode */}
                  {selectedToAccount.linkedPaymentModes && selectedToAccount.linkedPaymentModes.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        To Payment Mode (Optional)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedToAccount.linkedPaymentModes.map((paymentMode) => (
                          <button
                            key={paymentMode.id}
                            type="button"
                            onClick={() => setValue('toPaymentModeId', paymentMode.id)}
                            className={`p-2 text-left border rounded-lg transition-colors ${
                              watchedValues.toPaymentModeId === paymentMode.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-900">{paymentMode.name}</p>
                            <p className="text-xs text-gray-500">{paymentMode.type}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg text-gray-500">
                  No account selected
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tag Selector */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags <span className="text-xs text-gray-500">(optional)</span>
          </label>
          <div className="flex flex-col gap-2">
            {/* Input to add new tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a new tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => {
                  const trimmedTag = newTag.trim();
                  if (
                    trimmedTag &&
                    !watch('tags').includes(trimmedTag)
                  ) {
                    setValue('tags', [...watch('tags'), trimmedTag]);
                  }
                  setNewTag('');
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Tag list */}
          {/* Selected Tags (user-added or selected default tags) */}
          <div className="flex flex-wrap gap-2 mt-2">
            {watch('tags')?.map((tag) => (
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className="px-3 py-1 rounded-lg text-sm border bg-indigo-600 text-white border-indigo-600"
                >
                  {tag}
                </button>
              </div>
            ))}
            {/* Default Tags (only those not already selected) */}
            {watch('tags').length < defaultTags.length && (
              <div className="flex flex-wrap gap-2 mt-2">
                {defaultTags
                  .filter(tag => !watch('tags').includes(tag))
                  .slice(0, 3) // Only show 2 unselected default tags
                  .map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className="px-3 py-1 rounded-lg text-sm border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            id="description"
            rows={3}
            placeholder="Enter transaction description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Error Messages */}
        {(createTransaction.error || updateTransaction.error) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">
              Failed to save transaction. Please try again.
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isPending ? 'Saving...' : isEditing ? 'Update Transaction' : 'Create Transaction'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Modals */}
      <CalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        onAmountChange={handleAmountChange}
        currentAmount={watchedValues.amount || 0}
      />

      <CategorySelectModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        onSelect={(category) => setValue('categoryId', category.id)}
        selectedCategory={selectedCategory}
        title={`Select ${tabs[activeTab]} Category`}
      />

      <AccountSelectModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          setValue('accountId', account.id);
          // Clear payment mode when account changes
          setValue('paymentModeId', '');
        }}
        onPaymentModeSelect={(paymentModeId) => setValue('paymentModeId', paymentModeId)}
        selectedAccount={selectedAccount}
        selectedPaymentModeId={watchedValues.paymentModeId}
        title="Select Account"
        showPaymentModes={activeTab !== 2}
      />

      <AccountSelectModal
        isOpen={isFromAccountModalOpen}
        onClose={() => setIsFromAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          setValue('accountId', account.id);
          setValue('fromPaymentModeId', '');
        }}
        onPaymentModeSelect={(paymentModeId) => setValue('fromPaymentModeId', paymentModeId)}
        selectedAccount={selectedAccount}
        selectedPaymentModeId={watchedValues.fromPaymentModeId}
        title="Select From Account"
        showPaymentModes={true}
      />

      <AccountSelectModal
        isOpen={isToAccountModalOpen}
        onClose={() => setIsToAccountModalOpen(false)}
        accounts={accounts}
        onSelect={(account) => {
          setValue('toAccountId', account.id);
          setValue('toPaymentModeId', '');
        }}
        onPaymentModeSelect={(paymentModeId) => setValue('toPaymentModeId', paymentModeId)}
        selectedAccount={selectedToAccount}
        selectedPaymentModeId={watchedValues.toPaymentModeId}
        title="Select Destination Account"
        excludeAccountId={watchedValues.accountId}
        showPaymentModes={true}
      />
    </div>
  );
}

export default TransactionForm;