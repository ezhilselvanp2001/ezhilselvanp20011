import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useCategoriesByType, useDefaultCategory, useDeleteCategory } from '../hooks/useCategories';
import CategoryIcon from '../components/CategoryIcon';
import DefaultCategoryModal from '../components/DefaultCategoryModal';
import ConfirmationModal from '../components/ConfirmationModal';

const tabs = ['Expense', 'Income'];

function Categories() {
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{ id: string; name: string } | null>(null);

  const currentType = activeTab === 0 ? 1 : 2;

  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesByType(currentType);
  const { data: defaultCategory, isLoading: defaultLoading } = useDefaultCategory(currentType);
  const deleteCategory = useDeleteCategory();

  const handleDeleteCategory = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory.mutateAsync(categoryToDelete.id);
        setCategoryToDelete(null);
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  if (categoriesLoading || defaultLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm sm:text-base text-gray-600">Organize your expenses and income</p>
        </div>
        <Link
          to="/categories/add"
          className="inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors self-start sm:self-center text-xs sm:text-sm"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          Add Category
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-4 sm:mb-6">
        {tabs.map((tab, index) => {
          const active = activeTab === index;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(index)}
              className={`flex-1 text-xs sm:text-sm font-medium rounded-lg py-2 transition-all duration-200 ${active
                  ? "bg-white shadow text-black"
                  : "text-gray-500 hover:text-black"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Default Category Section */}
      {defaultCategory && (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Default {tabs[activeTab]} Category
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-xs sm:text-sm flex items-center"
            >
              <Edit className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Edit
            </button>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <CategoryIcon icon={defaultCategory.icon} color={defaultCategory.color} />
            <div>
              <p className="text-sm sm:text-base font-medium text-gray-900">{defaultCategory.name}</p>
              <p className="text-xs sm:text-sm text-gray-500">
                This category is used by default for new {tabs[activeTab].toLowerCase()} entries
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            All {tabs[activeTab]} Categories ({categories.length})
          </h2>
        </div>

        {categories.length === 0 ? (
          <div className="p-6 sm:p-8 text-center">
            <div className="text-gray-400 mb-4">
              <CategoryIcon icon="utensils" color="gray" size="md" className="mx-auto mb-3 sm:mb-4" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No {tabs[activeTab].toLowerCase()} categories yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Create your first category to start organizing your {tabs[activeTab].toLowerCase()}s
            </p>
            <Link
              to="/categories/add"
              className="inline-flex items-center px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors text-xs sm:text-sm"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
              Add Category
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div key={category.id} className="p-3 sm:p-4 lg:p-6 flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                  <CategoryIcon icon={category.icon} color={category.color} />
                  <div>
                    <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{category.name}</h3>
                    <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                      <span className="text-xs sm:text-sm text-gray-500">
                        {category.type === 1 ? 'Expense' : 'Income'}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-xs sm:text-sm text-gray-500 capitalize">{category.color}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 sm:space-x-2">
                  {category.deletable ? (
                    <>
                      <Link
                        to={`/categories/edit/${category.id}`}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Link>
                      <button
                        onClick={() => setCategoryToDelete({ id: category.id, name: category.name })}
                        disabled={deleteCategory.isPending}
                        className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50 rounded-md hover:bg-gray-50"
                      >
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <span className="p-1.5 sm:p-2 text-gray-300 cursor-not-allowed rounded-md">
                        <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                      <span className="p-1.5 sm:p-2 text-gray-300 cursor-not-allowed rounded-md">
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Default Category Modal */}
      <DefaultCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        type={currentType}
        currentDefault={defaultCategory}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDeleteCategory}
        title="Delete Category"
        message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Category"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
        isPending={deleteCategory.isPending}
      />
    </div>
  );
}

export default Categories;