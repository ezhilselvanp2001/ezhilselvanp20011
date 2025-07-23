import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, lazy } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import PrivateLayout from './components/Layout/PrivateLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Lazy load components
const LandingPage = lazy(() => import('./pages/LandingPage'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analysis = lazy(() => import('./pages/Analysis'));
const About = lazy(() => import('./pages/About'));
const PlaceholderPage = lazy(() => import('./pages/placeholder/PlaceholderPage'));
const Categories = lazy(() => import('./pages/Categories'));
const CategoryForm = lazy(() => import('./pages/CategoryForm'));
const Budgets = lazy(() => import('./pages/Budgets'));
const BudgetForm = lazy(() => import('./pages/BudgetForm'));
const BudgetAnalysis = lazy(() => import('./pages/BudgetAnalysis'));
const Accounts = lazy(() => import('./pages/Accounts'));
const AccountForm = lazy(() => import('./pages/AccountForm'));
const Transactions = lazy(() => import('./pages/Transactions'));
const TransactionForm = lazy(() => import('./pages/TransactionForm'));
const Debts = lazy(() => import('./pages/Debts'));
const DebtForm = lazy(() => import('./pages/DebtForm'));
const DebtRecords = lazy(() => import('./pages/DebtRecords'));
const DebtRecordForm = lazy(() => import('./pages/DebtRecordForm'));
const Settings = lazy(() => import('./pages/Settings'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingSpinner />}>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            } />
            <Route path="/signin" element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            } />
            <Route path="/signup" element={
              <PublicRoute>
                <SignUp />
              </PublicRoute>
            } />
            <Route path="/forgotpassword" element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <PrivateLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="analysis" element={<Analysis />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="accounts/add" element={<AccountForm />} />
              <Route path="accounts/edit/:id" element={<AccountForm />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transactions/add" element={<TransactionForm />} />
              <Route path="transactions/edit/:id" element={<TransactionForm />} />
              <Route path="tags" element={
                <PlaceholderPage 
                  title="Tags" 
                  description="Organize your expenses with custom tags" 
                />
              } />
              <Route path="budgets" element={<Budgets />} />
              <Route path="budgets/add" element={<BudgetForm />} />
              <Route path="budgets/edit/:id" element={<BudgetForm />} />
              <Route path="budgets/analysis/:budgetId" element={<BudgetAnalysis />} />
              <Route path="categories" element={<Categories />} />
              <Route path="categories/add" element={<CategoryForm />} />
              <Route path="categories/edit/:id" element={<CategoryForm />} />
              <Route path="scheduled" element={
                <PlaceholderPage 
                  title="Scheduled Transactions" 
                  description="Set up recurring income and expenses" 
                />
              } />
              <Route path="debts" element={<Debts />} />
              <Route path="debts/add" element={<DebtForm />} />
              <Route path="debts/edit/:id" element={<DebtForm />} />
              <Route path="debts/:debtId/records" element={<DebtRecords />} />
              <Route path="debts/:debtId/records/add" element={<DebtRecordForm />} />
              <Route path="debts/:debtId/records/edit/:recordId" element={<DebtRecordForm />} />
              <Route path="views/day" element={
                <PlaceholderPage 
                  title="Day View" 
                  description="View your daily financial activities and transactions" 
                />
              } />
              <Route path="views/calendar" element={
                <PlaceholderPage 
                  title="Calendar View" 
                  description="View your financial data in a calendar format" 
                />
              } />
              <Route path="views/custom" element={
                <PlaceholderPage 
                  title="Custom Views" 
                  description="Create and manage custom views of your financial data" 
                />
              } />
              <Route path="settings" element={<Settings />} />
              <Route path="about" element={
                <About />
              } />
            </Route>

            {/* Redirect to dashboard for authenticated users */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </Suspense>
    </QueryClientProvider>
  );
}

export default App;