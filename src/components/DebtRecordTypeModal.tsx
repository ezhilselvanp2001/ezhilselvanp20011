import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface DebtRecordTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  debtId: string;
}

export default function DebtRecordTypeModal({ isOpen, onClose, debtId }: DebtRecordTypeModalProps) {
  const navigate = useNavigate();

  const handleSelect = (type: '1' | '2') => {
    navigate(`/debts/${debtId}/records/add`, { state: { recordType: type } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add Record</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6">Select what you want to track:</p>
          
          <div className="space-y-4">
            <button
              onClick={() => handleSelect('1')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg group-hover:bg-green-200 transition-colors">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Money Paid</h3>
                  <p className="text-sm text-gray-600">Record money you have paid to someone</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelect('2')}
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-all text-left group"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-lg group-hover:bg-red-200 transition-colors">
                  <TrendingDown className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Money Received</h3>
                  <p className="text-sm text-gray-600">Record money you have received from someone</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}