import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForgotPassword } from '../hooks/useAuth';
import { CheckCircle } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const forgotPassword = useForgotPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword.mutateAsync({ email });
      setIsSuccess(true);
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-3 sm:px-4 lg:px-6 xl:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <CheckCircle className="h-10 w-10 sm:h-12 sm:w-12 text-green-500" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
            We've sent a password reset link to {email}
          </p>
        </div>

        <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow sm:rounded-lg">
            <div className="text-center">
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                Didn't receive the email? Check your spam folder or try again.
              </p>
              <Link
                to="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 text-sm sm:text-base"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-8 sm:py-12 px-3 sm:px-4 lg:px-6 xl:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center space-x-1">
              <span className="text-xl sm:text-2xl font-extrabold text-indigo-600">Expense
                <span className="text-lg sm:text-xl font-bold text-gray-900">Trace</span>
              </span>
            </Link>
          </div>
        </div>
        <h2 className="mt-4 sm:mt-6 text-center text-2xl sm:text-3xl font-bold text-gray-900">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-6 sm:py-8 px-4 sm:px-6 lg:px-10 shadow sm:rounded-lg">
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                />
              </div>
            </div>

            {forgotPassword.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
                <div className="text-sm sm:text-base text-red-600">
                  {forgotPassword.error instanceof Error ? forgotPassword.error.message : 'Failed to send reset email'}
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={forgotPassword.isPending}
                className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {forgotPassword.isPending ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="text-center">
              <Link
                to="/signin"
                className="font-medium text-indigo-600 hover:text-indigo-500 text-sm sm:text-base"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;