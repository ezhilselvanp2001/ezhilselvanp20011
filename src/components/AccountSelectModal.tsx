import { useState } from 'react';
import { X, Search, Building2, Wallet, CreditCard, Banknote } from 'lucide-react';
import { Account } from '../types/account';

interface AccountSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onSelect: (account: Account) => void;
  selectedAccount?: Account;
  title: string;
  excludeAccountId?: string; // For transfer to exclude from account
}

export default function AccountSelectModal({ 
  isOpen, 
  onClose, 
  accounts, 
  onSelect,
  selectedAccount,
  title,
  excludeAccountId 
}: AccountSelectModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccounts = accounts
    .filter(account => account.id !== excludeAccountId)
    .filter(account =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleSelectAccount = (account: Account) => {
    onSelect(account);
    onClose();
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case '1':
        return <Building2 className="w-5 h-5" />;
      case '2':
        return <Wallet className="w-5 h-5" />;
      case '3':
        return <CreditCard className="w-5 h-5" />;
      case '4':
        return <Banknote className="w-5 h-5" />;
      default:
        return <Building2 className="w-5 h-5" />;
    }
  };

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case 'bank':
        return 'bg-blue-100 text-blue-700';
      case 'wallet':
        return 'bg-green-100 text-green-700';
      case 'credit-card':
        return 'bg-purple-100 text-purple-700';
      case 'cash':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search accounts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredAccounts.map((account) => (
              <button
                key={account.id}
                onClick={() => handleSelectAccount(account)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                  selectedAccount?.id === account.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`p-2 rounded-lg ${getAccountTypeColor(account.type)}`}>
                  {getAccountIcon(account.type)}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{account.name}</p>
                  <p className="text-sm text-gray-500 capitalize">{account.type}</p>
                </div>
                {selectedAccount?.id === account.id && (
                  <span className="text-sm text-indigo-600 font-medium">Selected</span>
                )}
              </button>
            ))}
          </div>

          {filteredAccounts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No accounts found matching "{searchTerm}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}