import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Upload } from 'lucide-react';
import { apiService, MenuItem } from '../../services/api';

// Типы данных
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

interface MenuCategory {
  id: string;
  name: string;
  categoryImage: string;
  items: MenuItem[];
}

export function AdminMenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка меню и категорий из API
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Загружаем категории
      const categoriesData = await apiService.getCategories();
      setCategories(categoriesData);
      
      // Загружаем меню
      const menuData = await apiService.getMenu();
      
      // Преобразуем данные из формата {category: items[]} в плоский массив
      const allItems: MenuItem[] = [];
      Object.values(menuData).forEach(items => {
        allItems.push(...items);
      });
      
      setMenuItems(allItems);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Группируем блюда по категориям
  const menuData = categories.map(category => ({
    id: category.id,
    name: category.name_ru,
    categoryImage: category.image,
    items: menuItems.filter(item => item.category === category.id)
  }));

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleDelete = async (itemId: string) => {
    if (confirm('Вы уверены, что хотите удалить это блюдо?')) {
      try {
        await apiService.deleteMenuItem(itemId);
        setMenuItems(prev => prev.filter(item => item.id !== itemId));
      } catch (err) {
        console.error('Error deleting menu item:', err);
        alert('Ошибка при удалении блюда');
      }
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setShowForm(true);
  };

  const handleSaveItem = async (item: MenuItem) => {
    try {
      if (editingItem) {
        // Редактирование
        await apiService.updateMenuItem(editingItem.id, createFormData(item));
        setMenuItems(prev => prev.map(menuItem => 
          menuItem.id === editingItem.id ? item : menuItem
        ));
      } else {
        // Добавление нового
        const newItem = await apiService.addMenuItem(createFormData(item));
        setMenuItems(prev => [...prev, newItem]);
      }
      setShowForm(false);
      setEditingItem(null);
    } catch (err) {
      console.error('Error saving menu item:', err);
      alert('Ошибка при сохранении блюда');
    }
  };

  // Создание FormData для загрузки файлов
  const createFormData = (item: MenuItem): FormData => {
    const formData = new FormData();
    formData.append('name', JSON.stringify(item.name));
    formData.append('description', JSON.stringify(item.description));
    formData.append('price', item.price.toString());
    formData.append('category', item.category);
    
    // Если есть изображение, добавляем его
    if (item.image && item.image.startsWith('data:')) {
      // Конвертируем base64 в файл
      const response = fetch(item.image);
      response.then(res => res.blob()).then(blob => {
        formData.append('image', blob, 'image.jpg');
      });
    }
    
    return formData;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка меню...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadData} className="bg-blue-600 hover:bg-blue-700">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление меню</h2>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Добавить блюдо
        </Button>
      </div>

      {/* Форма добавления/редактирования */}
      {showForm && (
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <AdminMenuForm
              item={editingItem}
              categories={categories}
              onSave={handleSaveItem}
              onCancel={() => {
                setShowForm(false);
                setEditingItem(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Фильтры категорий */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('all')}
        >
          Все категории ({menuItems.length})
        </Button>
        {categories.map(category => {
          const itemCount = menuItems.filter(item => item.category === category.id).length;
          return (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name_ru} ({itemCount})
            </Button>
          );
        })}
      </div>

      {/* Список блюд */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name.ru}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/loading.png';
                }}
              />
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{item.name.ru}</h3>
                <span className="text-lg font-bold text-blue-600">{item.price} TJS</span>
              </div>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description.ru}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {categories.find(cat => cat.id === item.category)?.name_ru}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            В выбранной категории пока нет блюд
          </p>
        </div>
      )}
    </div>
  );
}

// Компонент формы для добавления/редактирования
interface AdminMenuFormProps {
  item: MenuItem | null;
  categories: Category[];
  onSave: (item: MenuItem) => void;
  onCancel: () => void;
}

function AdminMenuForm({ item, categories, onSave, onCancel }: AdminMenuFormProps) {
  const [formData, setFormData] = useState<MenuItem>({
    id: '',
    name: { ru: '', en: '', tj: '', cn: '' },
    description: { ru: '', en: '', tj: '', cn: '' },
    price: 0,
    image: '',
    category: 'salads'
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (item) {
      setFormData(item);
      setImagePreview(item.image);
    }
  }, [item]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.ru && formData.price > 0) {
      // В реальном приложении здесь была бы загрузка файла на сервер
      const finalItem = {
        ...formData,
        image: imagePreview || formData.image
      };
      onSave(finalItem);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-xl font-semibold">
        {item ? 'Редактировать блюдо' : 'Добавить новое блюдо'}
      </h3>
      
      {/* Названия на разных языках */}
      <div className="space-y-4">
        <h4 className="font-medium text-lg">Названия</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Название RU *</label>
            <input
              type="text"
              value={formData.name.ru}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                name: { ...prev.name, ru: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Название EN</label>
            <input
              type="text"
              value={formData.name.en}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                name: { ...prev.name, en: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Название TJ</label>
            <input
              type="text"
              value={formData.name.tj}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                name: { ...prev.name, tj: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Название CN</label>
            <input
              type="text"
              value={formData.name.cn}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                name: { ...prev.name, cn: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Описания на разных языках */}
      <div className="space-y-4">
        <h4 className="font-medium text-lg">Описания</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Описание RU</label>
            <textarea
              value={formData.description.ru}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                description: { ...prev.description, ru: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Описание EN</label>
            <textarea
              value={formData.description.en}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                description: { ...prev.description, en: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Описание TJ</label>
            <textarea
              value={formData.description.tj}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                description: { ...prev.description, tj: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Описание CN</label>
            <textarea
              value={formData.description.cn}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                description: { ...prev.description, cn: e.target.value }
              }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Цена и категория */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Цена (TJS) *</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
            className="w-full p-2 border border-gray-300 rounded-md"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Категория</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name_ru}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Загрузка изображения */}
      <div>
        <label className="block text-sm font-medium mb-1">Фото блюда</label>
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          {item ? 'Сохранить' : 'Добавить'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
} 