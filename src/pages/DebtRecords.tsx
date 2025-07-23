import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { 
  useDebt, 
  useDebtRecords, 
  usePaidRecords, 
  useReceivedRecords, 
  useAdjustmentRecords,
  useDebtRecordSummary,
  useDeleteDebtRecord 
} from '../hooks/useDebts';
import { DEBT_RECORD_TYPES } from '../types/debt';
import DebtRecordTypeModal from '../components/DebtRecordTypeModal';

const tabs = ['All', 'Paid', 'Received', 'Adjustment'];

function DebtRecords() {
  const { debtId } = useParams<{ debtId: string }>();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [isRecordTypeModalOpen, setIsRecordTypeModalOpen] = useState(false);

  const { data: debt } = useDebt(debtId || '');
  const { data: allRecords, isLoading: allLoading } = useDebtRecords(debtId || '', currentPage, pageSize);
  const { data: paidRecords, isLoading: paidLoading } = usePaidRecords(debtId || '', currentPage, pageSize);
  const { data: receivedRecords, isLoading: receivedLoading } = useReceivedRecords(debtId || '', currentPage, pageSize);
  const { data: adjustmentRecords, isLoading: adjustmentLoading } = useAdjustmentRecords(debtId || '', currentPage, pageSize);
  const { data: summary } = useDebtRecordSummary(debtId || '');
  const deleteRecord = useDeleteDebtRecord();

  // Get current data based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 1:
        return { data: paidRecords, isLoading: paidLoading };
      case 2:
        return { data: receivedRecords, isLoading: receivedLoading };
      case 3:
        return { data: adjustmentRecords, isLoading: adjustmentLoading };
      default:
        return { data: allRecords, isLoading: allLoading };
    }
  };

  const { data: currentData, isLoading } = getCurrentData();
  const records = currentData?.content || [];
  const totalPages = currentData?.totalPages || 0;
  const totalElements = currentData?.totalElements || 0;

  const handleDeleteRecord = async (id: string, description: string) => {
    if (window.confirm(`Are you sure you want to delete "${description}" record?`)) {
      try {
        await deleteRecord.mutateAsync(id);
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case '1': // Paid
        return 'text-red-600';
      case '2': // Received
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case '1': // Paid
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case '2': // Received
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      default:
        return <DollarSign className="w-5 h-5 text-gray-600" />;
    }
  };

  if (!debtId) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Debt ID not found</p>
          <Link to="/debts" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
            Back to Debts
          </Link>
        </div>
      </div>
    );
  }

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
      <div className="mb-8">
        <Link
          to="/debts"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Debts
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Records</h1>
            <p className="text-gray-600 mt-1">
              {debt ? `Debt with ${debt.personName}` : 'Debt records'}
            </p>
          </div>
          <button
            onClick={() => setIsRecordTypeModalOpen(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Record
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8">
        {debt?.type === '2' ? (
          // Borrowing - show Total Payable
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Payable</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(debt?.remainingAmount || 0)}
                </p>
              </div>
              <div className="bg-red-100 rounded-full p-3">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Amount you owe</p>
          </div>
        ) : (
          // Lending - show Total Receivable
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Receivable</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(debt?.remainingAmount || 0)}
                </p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">Amount owed to you</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Paid</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(summary?.totalPaid || 0)}
              </p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Total transactions</p>
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

      {/* Records List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {tabs[activeTab]} Records ({totalElements})
          </h2>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center">
            <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No {tabs[activeTab].toLowerCase()} records yet
            </h3>
            <p className="text-gray-500 mb-4">
              Start tracking by adding your first record
            </p>
            <button
              onClick={() => setIsRecordTypeModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Record
            </button>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-200">
              {records.map((record) => (
                <div key={record.id} className="p-4 sm:p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {getRecordTypeIcon(record.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-medium text-gray-900 truncate">
                          {record.description}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          record.type === '1' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {DEBT_RECORD_TYPES[record.type]}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-gray-500">
                        <span>{formatDate(record.date)}</span>
                        {record.account && (
                          <span className="hidden sm:inline">• {record.account.name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className={`font-semibold ${getRecordTypeColor(record.type)}`}>
                        {record.type === '1' ? '-' : '+'}
                        {formatCurrency(record.amount)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/debts/${debtId}/records/edit/${record.id}`}
                        className="p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteRecord(record.id, record.description)}
                        disabled={deleteRecord.isPending}
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
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} records
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

      {/* Record Type Selection Modal */}
      <DebtRecordTypeModal
        isOpen={isRecordTypeModalOpen}
        onClose={() => setIsRecordTypeModalOpen(false)}
        debtId={debtId}
      />
    </div>
  );
}

export default DebtRecords;