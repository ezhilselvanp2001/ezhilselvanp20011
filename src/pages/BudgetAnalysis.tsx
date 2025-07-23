import { useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useBudgetAnalysis } from '../hooks/useBudgets';
import { MONTHS } from '../types/budget';
import CategoryIcon from '../components/CategoryIcon';

function BudgetAnalysis() {
  const { budgetId } = useParams<{ budgetId: string }>();
  const [searchParams] = useSearchParams();
  const budgetType = searchParams.get('type') as 'monthly' | 'yearly' || 'monthly';

  const { data: budget, isLoading } = useBudgetAnalysis(budgetId || '', budgetType);

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  const getProgressPercentage = (spent: number, budget: number) => {
    return budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const CircularProgress = ({ percentage, size = 160 }: { percentage: number; size?: number }) => {
    const radius = (size - 16) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="16"
            fill="transparent"
            className="text-gray-200"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="16"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className={getProgressColor(percentage)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <span className={`text-3xl font-bold ${getProgressColor(percentage)}`}>
              {Math.round(percentage)}%
            </span>
            <p className="text-sm text-gray-500 mt-1">Used</p>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Budget not found</p>
          <Link to="/budgets" className="text-indigo-600 hover:text-indigo-700 mt-2 inline-block">
            Back to Budgets
          </Link>
        </div>
      </div>
    );
  }

  const percentage = getProgressPercentage(budget.totalSpent, budget.budget);
  const availableBalance = budget.budget - budget.totalSpent;

  // Prepare chart data
  const pieData = budget.categories.map(category => ({
    name: category.name,
    value: category.spent,
    color: `#${category.color}`,
    icon: category.icon
  }));

  const barData = budget.categories.map(category => ({
    name: category.name,
    budget: category.limit,
    spent: category.spent,
    color: `#${category.color}`
  }));

  const COLORS = budget.categories.map(cat => `#${cat.color}`);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <Link
          to="/budgets"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Budgets
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Analysis</h1>
            <p className="text-gray-600 mt-1">
              {budgetType === 'monthly' 
                ? `${MONTHS[budget.month! - 1]} ${budget.year}`
                : budget.year.toString()
              }
            </p>
          </div>
          <Link
            to={`/budgets/edit/${budgetId}?type=${budgetType}`}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Edit className="w-5 h-5 mr-2" />
            Edit Budget
          </Link>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Progress Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-center mb-6">
            <CircularProgress percentage={percentage} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Budget:</span>
              <span className="font-semibold">{formatCurrency(budget.budget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Spent:</span>
              <span className="font-semibold">{formatCurrency(budget.totalSpent)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Available Balance:</span>
              <span className={`font-semibold ${
                availableBalance >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {formatCurrency(availableBalance)}
              </span>
            </div>
          </div>
        </div>

        {/* Spending Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Spending Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Category Breakdown</h3>
        <div className="h-64 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="budget" fill="#E5E7EB" name="Budget" />
              <Bar dataKey="spent" fill="#6366F1" name="Spent" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Included Categories */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Included Categories</h3>
        <div className="space-y-4">
          {budget.categories.map((category) => {
            const categoryPercentage = category.limit > 0 ? (category.spent / category.limit) * 100 : 0;
            return (
              <div key={category.categoryId} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <CategoryIcon icon={category.icon} color={category.color} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{category.name}</h4>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(category.spent)}</p>
                      {category.limit > 0 && (
                        <p className="text-sm text-gray-500">of {formatCurrency(category.limit)}</p>
                      )}
                    </div>
                  </div>
                  {category.limit > 0 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          categoryPercentage >= 90 ? 'bg-red-500' : 
                          categoryPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(categoryPercentage, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
                {category.limit > 0 && (
                  <div className="text-right">
                    <span className={`text-sm font-medium ${
                      categoryPercentage >= 90 ? 'text-red-600' : 
                      categoryPercentage >= 75 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {Math.round(categoryPercentage)}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default BudgetAnalysis;