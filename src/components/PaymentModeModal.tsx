import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { CreatePaymentModeData, PAYMENT_MODE_TYPES, PaymentModeType } from '../types/account';
import { useCreatePaymentMode } from '../hooks/useAccounts';

interface PaymentModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountId: string;
  onPaymentModeAdded: (paymentMode: CreatePaymentModeData) => void;
}

export default function PaymentModeModal({ 
  isOpen, 
  onClose, 
  accountId,
  onPaymentModeAdded 
}: PaymentModeModalProps) {
  const [selectedType, setSelectedType] = useState<PaymentModeType>('1');
  const createPaymentMode = useCreatePaymentMode();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePaymentModeData>({
    defaultValues: {
      name: '',
      type: '1'
    }
  });

  const onSubmit = async (data: CreatePaymentModeData) => {
    try {
      const paymentModeData = { ...data, type: selectedType };
      await createPaymentMode.mutateAsync({ accountId, data: paymentModeData });
      onPaymentModeAdded(paymentModeData);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create payment mode:', error);
    }
  };

  const handleClose = () => {
    reset();
    setSelectedType('1');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Add Payment Mode
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Payment Mode Name
            </label>
            <input
              {...register('name', { required: 'Payment mode name is required' })}
              type="text"
              id="name"
              placeholder="Enter payment mode name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Mode Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(PAYMENT_MODE_TYPES).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedType(value as PaymentModeType)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedType === value
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {createPaymentMode.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-600">
                {createPaymentMode.error.message || 'Failed to create payment mode'}
              </div>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createPaymentMode.isPending}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {createPaymentMode.isPending ? (
                'Adding...'
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Payment Mode
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}