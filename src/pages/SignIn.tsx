import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const login = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login.mutate({ email, password });
  };

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
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
          Or{' '}
          <Link
            to="/signup"
            className="font-medium text-indigo-600 hover:text-indigo-500 text-sm sm:text-base"
          >
            create a new account
          </Link>
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

            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm sm:text-base">
                <Link
                  to="/forgotpassword"
                  className="font-medium text-indigo-600 hover:text-indigo-500 text-sm sm:text-base"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            {login.error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
                <div className="text-sm sm:text-base text-red-600">
                  {login.error instanceof Error ? login.error.message : 'Sign in failed'}
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={login.isPending}
                className="w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {login.isPending ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignIn;