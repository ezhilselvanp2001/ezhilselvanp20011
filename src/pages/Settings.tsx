import { useState } from 'react';
import { Edit, Clock, Globe, Bell, AlertTriangle, Trash2 } from 'lucide-react';
import { 
  useSettings,
  useUpdateTimeFormat,
  useUpdateDecimalFormat,
  useUpdateNumberFormat,
  useUpdateCurrencyCode,
  useUpdateDailyReminder,
  useClearAllData,
  useDeleteAccount
} from '../hooks/useSettings';
import { 
  TIME_FORMATS, 
  DECIMAL_FORMATS, 
  NUMBER_FORMATS, 
  CURRENCIES,
  Currency
} from '../types/settings';
import TimeFormatModal from '../components/TimeFormatModal';
import DecimalFormatModal from '../components/DecimalFormatModal';
import NumberFormatModal from '../components/NumberFormatModal';
import CurrencyModal from '../components/CurrencyModal';
import ConfirmationModal from '../components/ConfirmationModal';

function Settings() {
  const [isTimeFormatModalOpen, setIsTimeFormatModalOpen] = useState(false);
  const [isDecimalFormatModalOpen, setIsDecimalFormatModalOpen] = useState(false);
  const [isNumberFormatModalOpen, setIsNumberFormatModalOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const [isClearDataModalOpen, setIsClearDataModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const { data: settings, isLoading } = useSettings();
  const updateTimeFormat = useUpdateTimeFormat();
  const updateDecimalFormat = useUpdateDecimalFormat();
  const updateNumberFormat = useUpdateNumberFormat();
  const updateCurrencyCode = useUpdateCurrencyCode();
  const updateDailyReminder = useUpdateDailyReminder();
  const clearAllData = useClearAllData();
  const deleteAccount = useDeleteAccount();

  const handleDailyReminderToggle = async () => {
    if (settings) {
      await updateDailyReminder.mutateAsync(!settings.dailyReminder);
    }
  };

  const handleClearData = async () => {
    await clearAllData.mutateAsync();
    setIsClearDataModalOpen(false);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount.mutateAsync();
    setIsDeleteAccountModalOpen(false);
  };

  const getCurrentCurrency = (): Currency | undefined => {
    return CURRENCIES.find(currency => currency.code === settings?.currencyCode);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="space-y-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-4">
                  {[1, 2].map((j) => (
                    <div key={j} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
      </div>

      <div className="space-y-8">
        {/* Appearance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-indigo-600" />
            Appearance
          </h2>
          
          <div className="space-y-6">
            {/* Time Format */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Time Format</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {TIME_FORMATS[settings.timeFormat as keyof typeof TIME_FORMATS]}
                </p>
              </div>
              <button
                onClick={() => setIsTimeFormatModalOpen(true)}
                className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>

            {/* Decimal Format */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Decimal Format</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {DECIMAL_FORMATS[settings.decimalFormat as keyof typeof DECIMAL_FORMATS]}
                </p>
              </div>
              <button
                onClick={() => setIsDecimalFormatModalOpen(true)}
                className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Globe className="w-6 h-6 mr-2 text-indigo-600" />
            Preferences
          </h2>
          
          <div className="space-y-6">
            {/* Currency */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Currency</h3>
                <div className="flex items-center mt-1">
                  {getCurrentCurrency() && (
                    <>
                      <span className="text-lg mr-2">{getCurrentCurrency()?.flag}</span>
                      <span className="text-sm text-gray-500">
                        {getCurrentCurrency()?.country} - {getCurrentCurrency()?.name} ({getCurrentCurrency()?.symbol})
                      </span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setIsCurrencyModalOpen(true)}
                className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>

            {/* Number Format */}
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">Number Format</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {NUMBER_FORMATS[settings.numberFormat as keyof typeof NUMBER_FORMATS]}
                </p>
              </div>
              <button
                onClick={() => setIsNumberFormatModalOpen(true)}
                className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <Bell className="w-6 h-6 mr-2 text-indigo-600" />
            Notifications
          </h2>
          
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Daily Reminder</h3>
              <p className="text-sm text-gray-500 mt-1">
                {settings.dailyReminder ? 'Remind me daily at 7:00 PM' : 'Daily reminders are disabled'}
              </p>
            </div>
            <button
              onClick={handleDailyReminderToggle}
              disabled={updateDailyReminder.isPending}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 ${
                settings.dailyReminder ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.dailyReminder ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <h2 className="text-xl font-semibold text-red-900 mb-6 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
            Danger Zone
          </h2>
          
          <div className="space-y-4">
            {/* Clear Data */}
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h3 className="font-medium text-red-900">Delete Data & Start Afresh</h3>
                <p className="text-sm text-red-600 mt-1">
                  This will permanently delete all your data but keep your account
                </p>
              </div>
              <button
                onClick={() => setIsClearDataModalOpen(true)}
                disabled={clearAllData.isPending}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Data
              </button>
            </div>

            {/* Delete Account */}
            <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
              <div>
                <h3 className="font-medium text-red-900">Delete Account</h3>
                <p className="text-sm text-red-600 mt-1">
                  This will permanently delete your account and all data. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => setIsDeleteAccountModalOpen(true)}
                disabled={deleteAccount.isPending}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TimeFormatModal
        isOpen={isTimeFormatModalOpen}
        onClose={() => setIsTimeFormatModalOpen(false)}
        currentFormat={settings.timeFormat}
        onUpdate={updateTimeFormat.mutateAsync}
      />

      <DecimalFormatModal
        isOpen={isDecimalFormatModalOpen}
        onClose={() => setIsDecimalFormatModalOpen(false)}
        currentFormat={settings.decimalFormat}
        onUpdate={updateDecimalFormat.mutateAsync}
      />

      <NumberFormatModal
        isOpen={isNumberFormatModalOpen}
        onClose={() => setIsNumberFormatModalOpen(false)}
        currentFormat={settings.numberFormat}
        onUpdate={updateNumberFormat.mutateAsync}
      />

      <CurrencyModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        currentCurrency={settings.currencyCode}
        onUpdate={updateCurrencyCode.mutateAsync}
      />

      <ConfirmationModal
        isOpen={isClearDataModalOpen}
        onClose={() => setIsClearDataModalOpen(false)}
        onConfirm={handleClearData}
        title="Clear All Data"
        message="Are you sure you want to delete all your data? This action cannot be undone. Your account will remain active but all transactions, budgets, and other data will be permanently deleted."
        confirmText="Clear Data"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={clearAllData.isPending}
      />

      <ConfirmationModal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to permanently delete your account? This action cannot be undone. All your data will be permanently deleted and you will not be able to recover it."
        confirmText="Delete Account"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={deleteAccount.isPending}
      />
    </div>
  );
}

export default Settings;