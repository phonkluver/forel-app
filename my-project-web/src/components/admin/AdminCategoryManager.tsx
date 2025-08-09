import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

interface Category {
  id: string;
  name_ru: string;
  name_en: string;
  name_tj: string;
  name_cn: string;
  image: string;
  sort_order: number;
  is_active: boolean;
}

const AdminCategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Ошибка при загрузке категорий');
      console.error('Error loading categories:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      await apiService.deleteCategory(id);
      await loadCategories();
    } catch (err) {
      setError('Ошибка при удалении категории');
      console.error('Error deleting category:', err);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await apiService.toggleCategory(id);
      await loadCategories();
    } catch (err) {
      setError('Ошибка при изменении статуса категории');
      console.error('Error toggling category:', err);
    }
  };

  const createFormData = (category: Partial<Category>, imageFile?: File): FormData => {
    const formData = new FormData();
    
    if (category.name_ru) formData.append('name_ru', category.name_ru);
    if (category.name_en) formData.append('name_en', category.name_en);
    if (category.name_tj) formData.append('name_tj', category.name_tj);
    if (category.name_cn) formData.append('name_cn', category.name_cn);
    if (category.sort_order !== undefined) formData.append('sort_order', category.sort_order.toString());
    if (category.is_active !== undefined) formData.append('is_active', category.is_active.toString());
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return formData;
  };

  const handleSaveCategory = async (category: Partial<Category>, imageFile?: File) => {
    try {
      const formData = createFormData(category, imageFile);
      
      if (editingCategory) {
        await apiService.updateCategory(editingCategory.id, formData);
      } else {
        await apiService.addCategory(formData);
      }
      
      setEditingCategory(null);
      setIsAddingNew(false);
      await loadCategories();
    } catch (err) {
      setError('Ошибка при сохранении категории');
      console.error('Error saving category:', err);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsAddingNew(true);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsAddingNew(false);
  };

  if (isLoading) {
    return <div className="text-center py-8">Загрузка категорий...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Управление категориями</h2>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
        >
          Добавить категорию
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Форма добавления/редактирования */}
      {(isAddingNew || editingCategory) && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSaveCategory}
          onCancel={handleCancel}
        />
      )}

      {/* Список категорий */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`border rounded-lg p-4 ${
              category.is_active ? 'bg-white' : 'bg-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">{category.name_ru}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleToggleActive(category.id)}
                  className={`text-sm ${
                    category.is_active ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {category.is_active ? '✅' : '❌'}
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑️
                </button>
              </div>
            </div>

            {category.image && (
              <div className="mb-3">
                <img
                  src={`${import.meta.env.VITE_API_URL}${category.image}`}
                  alt={category.name_ru}
                  className="w-full h-32 object-cover rounded"
                />
              </div>
            )}

            <div className="text-sm text-gray-600 space-y-1">
              <div><strong>EN:</strong> {category.name_en || '-'}</div>
              <div><strong>TJ:</strong> {category.name_tj || '-'}</div>
              <div><strong>CN:</strong> {category.name_cn || '-'}</div>
              <div><strong>Порядок:</strong> {category.sort_order}</div>
              <div><strong>Статус:</strong> {category.is_active ? 'Активна' : 'Неактивна'}</div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && !isLoading && (
        <div className="text-center py-8 text-gray-500">
          Категории не найдены
        </div>
      )}
    </div>
  );
};

// Компонент формы для добавления/редактирования категории
interface CategoryFormProps {
  category: Category | null;
  onSave: (category: Partial<Category>, imageFile?: File) => Promise<void>;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name_ru: category?.name_ru || '',
    name_en: category?.name_en || '',
    name_tj: category?.name_tj || '',
    name_cn: category?.name_cn || '',
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active ?? true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name_ru.trim()) {
      alert('Название на русском обязательно');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(formData, imageFile || undefined);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-gray-50 border rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4">
        {category ? 'Редактировать категорию' : 'Добавить новую категорию'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название (RU) *
            </label>
            <input
              type="text"
              value={formData.name_ru}
              onChange={(e) => handleInputChange('name_ru', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название (EN)
            </label>
            <input
              type="text"
              value={formData.name_en}
              onChange={(e) => handleInputChange('name_en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название (TJ)
            </label>
            <input
              type="text"
              value={formData.name_tj}
              onChange={(e) => handleInputChange('name_tj', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Название (CN)
            </label>
            <input
              type="text"
              value={formData.name_cn}
              onChange={(e) => handleInputChange('name_cn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Порядок сортировки
            </label>
            <input
              type="number"
              value={formData.sort_order}
              onChange={(e) => handleInputChange('sort_order', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Статус
            </label>
            <select
              value={formData.is_active.toString()}
              onChange={(e) => handleInputChange('is_active', e.target.value === 'true')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="true">Активна</option>
              <option value="false">Неактивна</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Изображение категории
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {category?.image && !imageFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Текущее изображение:</p>
              <img
                src={`${import.meta.env.VITE_API_URL}${category.image}`}
                alt={category.name_ru}
                className="w-32 h-32 object-cover rounded mt-1"
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Сохранение...' : (category ? 'Обновить' : 'Добавить')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCategoryManager;
