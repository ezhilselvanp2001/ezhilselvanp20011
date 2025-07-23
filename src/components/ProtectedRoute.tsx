import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSettings } from '../hooks/useSettings';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: user, isLoading: userLoading, error } = useAuth();
  const location = useLocation();

  // Fetch settings only if user is available
  const {
    isLoading: settingsLoading,
  } = useSettings(!!user); // enable only when user exists

  if (userLoading || (user && settingsLoading)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}