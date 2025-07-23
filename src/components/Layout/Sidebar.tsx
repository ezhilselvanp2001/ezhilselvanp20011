import { NavLink } from 'react-router-dom';
import { useLogout } from '../../hooks/useAuth';
import { BarChart3, TrendingUp, CreditCard, ArrowUpDown, Tag, Target, FolderOpen, Calendar, Users, Eye, Settings, Info, LogOut, DollarSign, X, ChevronDown, ChevronRight, CalendarDays, Sliders as Sliders3 } from 'lucide-react';
import { useState } from 'react';

const mainMenuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
  { name: 'Analysis', path: '/analysis', icon: TrendingUp },
  { name: 'Accounts', path: '/accounts', icon: CreditCard },
  { name: 'Transactions', path: '/transactions', icon: ArrowUpDown },
  { name: 'Tags', path: '/tags', icon: Tag },
  { name: 'Budgets', path: '/budgets', icon: Target },
  { name: 'Categories', path: '/categories', icon: FolderOpen },
  { name: 'Scheduled Txns', path: '/scheduled', icon: Calendar },
  { name: 'Debts', path: '/debts', icon: Users },
];

const viewsSubMenu = [
  { name: 'Day', path: '/views/day', icon: CalendarDays },
  { name: 'Calendar', path: '/views/calendar', icon: Calendar },
  { name: 'Custom', path: '/views/custom', icon: Sliders3 },
];
const otherItems = [
  { name: 'Settings', path: '/settings', icon: Settings },
  { name: 'About', path: '/about', icon: Info },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const logout = useLogout();
  const [isViewsExpanded, setIsViewsExpanded] = useState(false);

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg h-screen flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-4 right-4">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-8 w-8 text-indigo-600" />
          <h1 className="text-xl font-bold text-gray-900">ExpenseTrace</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-6">
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Main Menu
            </h3>
            <div className="space-y-1">
              {mainMenuItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
              
              {/* Views with submenu */}
              <div>
                <button
                  onClick={() => setIsViewsExpanded(!isViewsExpanded)}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <div className="flex items-center">
                    <Eye className="mr-3 h-5 w-5" />
                    Views
                  </div>
                  {isViewsExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {isViewsExpanded && (
                  <div className="ml-6 mt-1 space-y-1">
                    {viewsSubMenu.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => onClose()}
                        className={({ isActive }) =>
                          `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`
                        }
                      >
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              Other
            </h3>
            <div className="space-y-1">
              {otherItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors disabled:opacity-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          {logout.isPending ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
      </div>
    </>
  );
}