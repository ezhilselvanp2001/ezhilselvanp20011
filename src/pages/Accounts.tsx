import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, CreditCard, Wallet, Building2, Banknote, Eye, EyeOff } from 'lucide-react';
import {
  useAccounts,
  useBankAccounts,
  useWalletAccounts,
  useCreditCardAccounts,
  useCashAccounts,
  useAccountSummary,
  useDeleteAccount
} from '../hooks/useAccounts';

function Accounts() {
  const [showBalance, setShowBalance] = useState(false);

  const { data: allAccounts = [], isLoading: allAccountsLoading } = useAccounts();
  const { data: bankAccounts = [], isLoading: bankLoading } = useBankAccounts();
  const { data: walletAccounts = [], isLoading: walletLoading } = useWalletAccounts();
  const { data: creditCardAccounts = [], isLoading: creditLoading } = useCreditCardAccounts();
  const { data: cashAccounts = [], isLoading: cashLoading } = useCashAccounts();
  const { data: summary, isLoading: summaryLoading } = useAccountSummary();
  const deleteAccount = useDeleteAccount();

  const handleDeleteAccount = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" account?`)) {
      try {
        await deleteAccount.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return showBalance ? `$${amount.toFixed(2)}` : '****';
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'bank':
        return <Building2 className="w-6 h-6" />;
      case 'wallet':
        return <Wallet className="w-6 h-6" />;
      case 'credit-card':
        return <CreditCard className="w-6 h-6" />;
      case 'cash':
        return <Banknote className="w-6 h-6" />;
      default:
        return <Building2 className="w-6 h-6" />;
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

  if (allAccountsLoading || summaryLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage your bank accounts and credit cards</p>
          <p className="text-xs sm:text-sm text-yellow-600">
            * Transaction-based balance, actual may vary.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:mt-1">
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="inline-flex items-center px-2 sm:px-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {showBalance ? <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" /> : <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />}
            {showBalance ? 'Hide Balance' : 'Show Balance'}
          </button>
          <Link
            to="/accounts/add"
            className="inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
            Add Account
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Available Balance Card */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-3 sm:mb-4">Available Balance</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">
            {formatCurrency(summary?.availableAmount || 0)}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Total across all accounts</p>
        </div>

        {/* Available Credit Card */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-medium text-gray-600 mb-3 sm:mb-4">Available Credit</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600">
            {formatCurrency(summary?.availableCredit || 0)}
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Credit cards available limit</p>
        </div>
      </div>

      {/* Summary Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Available Balance</h3>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(summary?.availableAmount || 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total across all accounts</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Available Credit</h3>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(summary?.availableCredit || 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Credit cards available limit</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Outstanding Credit</h3>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(summary?.outstandingCredit || 0)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Total outstanding amount</p>
        </div>
      </div> */}

      {/* Account Sections */}
      <div className="space-y-6 sm:space-y-8">
        {/* Cash Accounts */}
        {!cashLoading && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="bg-yellow-100 p-1.5 sm:p-2 rounded-lg">
                  <Banknote className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Cash ({cashAccounts.length})</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Physical cash accounts</p>
                </div>
              </div>
            </div>

            {cashAccounts.length === 0 ? (
              <div className="p-6 sm:p-8 text-center">
                <Banknote className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-sm sm:text-base text-gray-500">No cash accounts yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {cashAccounts.map((account) => (
                  <div key={account.id} className="p-3 sm:p-4 lg:p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                      <div className={`p-2 sm:p-3 rounded-lg ${getAccountTypeColor(account.type)}`}>
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{account.name}</h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Balance: {formatCurrency(account.currentBalance || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <Link
                        to={`/accounts/edit/${account.id}`}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteAccount(account.id, account.name)}
                        disabled={deleteAccount.isPending}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bank Accounts */}
        {!bankLoading && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Bank Accounts ({bankAccounts.length})</h2>
                  <p className="text-sm text-gray-500">Savings and checking accounts</p>
                </div>
              </div>
            </div>

            {bankAccounts.length === 0 ? (
              <div className="p-8 text-center">
                <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No bank accounts yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="p-4 sm:p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getAccountTypeColor(account.type)}`}>
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-500">
                          Balance: {formatCurrency(account.currentBalance || 0)}
                        </p>
                        {account.linkedPaymentModes && account.linkedPaymentModes.length > 0 && (
                          <p className="text-xs text-gray-400">
                            {account.linkedPaymentModes.length} payment mode(s)
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/accounts/edit/${account.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteAccount(account.id, account.name)}
                        disabled={deleteAccount.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Wallet Accounts */}
        {!walletLoading && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Wallet className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Wallets ({walletAccounts.length})</h2>
                  <p className="text-sm text-gray-500">Digital wallets and e-money</p>
                </div>
              </div>
            </div>

            {walletAccounts.length === 0 ? (
              <div className="p-8 text-center">
                <Wallet className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No wallet accounts yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {walletAccounts.map((account) => (
                  <div key={account.id} className="p-4 sm:p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getAccountTypeColor(account.type)}`}>
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-500">
                          Balance: {formatCurrency(account.currentBalance || 0)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/accounts/edit/${account.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteAccount(account.id, account.name)}
                        disabled={deleteAccount.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Credit Card Accounts */}
        {!creditLoading && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <CreditCard className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Credit Cards ({creditCardAccounts.length})</h2>
                  <p className="text-sm text-gray-500">Credit cards and lines of credit</p>
                </div>
              </div>
            </div>

            {creditCardAccounts.length === 0 ? (
              <div className="p-8 text-center">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No credit cards yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {creditCardAccounts.map((account) => (
                  <div key={account.id} className="p-4 sm:p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${getAccountTypeColor(account.type)}`}>
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{account.name}</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Available: {formatCurrency(account.currentAvailableLimit || 0)}</p>
                          <p>Total Limit: {formatCurrency(account.totalCreditLimit || 0)}</p>
                          {account.paymentDueDate && (
                            <p>Due Date: {new Date(account.paymentDueDate).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/accounts/edit/${account.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteAccount(account.id, account.name)}
                        disabled={deleteAccount.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Accounts;