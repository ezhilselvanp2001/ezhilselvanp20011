import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, User, Calendar, ChevronLeft, ChevronRight, HandCoins, TrendingUp, TrendingDown } from 'lucide-react';
import { useDebts, useLendingDebts, useBorrowingDebts, usePayableDebts, useReceivableDebts, useDeleteDebt } from '../hooks/useDebts';
import { DEBT_TYPES } from '../types/debt';
import DebtTypeModal from '../components/DebtTypeModal';

const tabs = ['All', 'Lending', 'Borrowing'];

function Debts() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isDebtTypeModalOpen, setIsDebtTypeModalOpen] = useState(false);

  // Get data based on active tab
  const { data: allDebts, isLoading: allLoading } = useDebts(currentPage, pageSize);
  const { data: lendingDebts, isLoading: lendingLoading } = useLendingDebts(currentPage, pageSize);
  const { data: borrowingDebts, isLoading: borrowingLoading } = useBorrowingDebts(currentPage, pageSize);
  
  // Get summary data
  const { data: payableDebts = [] } = usePayableDebts();
  const { data: receivableDebts = [] } = useReceivableDebts();
  
  const deleteDebt = useDeleteDebt();

  // Calculate totals
  const totalPayable = payableDebts.reduce((sum, debt) => sum + (debt.remainingAmount || 0), 0);
  const totalReceivable = receivableDebts.reduce((sum, debt) => sum + (debt.remainingAmount || 0), 0);

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 1:
        return { data: lendingDebts, isLoading: lendingLoading };
      case 2:
        return { data: borrowingDebts, isLoading: borrowingLoading };
      default:
        return { data: allDebts, isLoading: allLoading };
    }
  };

  const { data: currentData, isLoading } = getCurrentData();
  const debts = currentData?.content || [];
  const totalPages = currentData?.totalPages || 0;
  const totalElements = currentData?.totalElements || 0;

  const handleDeleteDebt = async (id: string, personName: string) => {
    if (window.confirm(`Are you sure you want to delete debt with "${personName}"?`)) {
      try {
        await deleteDebt.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete debt:', error);
      }
    }
  };

  const handleDebtTypeSelect = (type: '1' | '2') => {
    navigate('/debts/add', { state: { debtType: type } });
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDebtTypeColor = (type: string) => {
    switch (type) {
      case '1': // Lending
        return 'bg-green-100 text-green-700';
      case '2': // Borrowing
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDebtTypeIcon = (type: string) => {
    switch (type) {
      case '1': // Lending
        return <TrendingUp className="w-5 h-5" />;
      case '2': // Borrowing
        return <TrendingDown className="w-5 h-5" />;
      default:
        return <HandCoins className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Debts</h1>
          <p className="text-gray-600 mt-1">Track money you've lent and borrowed</p>
        </div>
        <button
          onClick={() => setIsDebtTypeModalOpen(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Debt
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Payable</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalPayable)}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Money you owe to others</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Receivable</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalReceivable)}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Money others owe to you</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(index);
                setCurrentPage(0);
              }}
              className={`flex-1 text-sm font-medium rounded-lg py-2 transition-all duration-200 ${
                active
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Debts List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {tabs[activeTab]} Debts ({totalElements})
          </h2>
        </div>

        {debts.length === 0 ? (
          <div className="p-8 text-center">
            <HandCoins className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {tabs[activeTab].toLowerCase()} debts yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start tracking your debts by adding your first entry
            </p>
            <button
              onClick={() => setIsDebtTypeModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Debt
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {debts.map((debt) => (
                <div key={debt.id} className="p-4 sm:p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className={`p-3 rounded-lg ${getDebtTypeColor(debt.type)}`}>
                      {getDebtTypeIcon(debt.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {debt.personName}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDebtTypeColor(debt.type)}`}>
                          {DEBT_TYPES[debt.type]}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Due: {formatDate(debt.dueDate)}
                        </div>
                        {debt.additionalDetail && (
                          <span className="hidden sm:inline truncate">• {debt.additionalDetail}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(debt.remainingAmount || 0)}
                      </p>
                      <p className="text-sm text-gray-500">
                        of {formatCurrency(debt.totalAmount || 0)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/debts/${debt.id}/records`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                        title="View Records"
                      >
                        <User className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/debts/edit/${debt.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteDebt(debt.id, debt.personName)}
                        disabled={deleteDebt.isPending}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} debts
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                      disabled={currentPage === 0}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    <span className="px-3 py-2 text-sm font-medium">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Debt Type Selection Modal */}
      <DebtTypeModal
        isOpen={isDebtTypeModalOpen}
        onClose={() => setIsDebtTypeModalOpen(false)}
        onSelect={handleDebtTypeSelect}
      />
    </div>
  );
}

export default Debts;