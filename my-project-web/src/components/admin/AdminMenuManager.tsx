import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Plus, Edit, Trash2, X, Eye, EyeOff } from 'lucide-react';

// Типы данных
interface MenuItem {
  id: string;
  name: {
    ru: string;
    en: string;
    tj: string;
    cn: string;
  };
  price: number;
  category: string;
  images: string[];
  isActive: boolean;
}

interface Category {
  id: string;
  name: string;
  categoryImage: string;
}

export function AdminMenuManager() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminCode = localStorage.getItem('adminCode');

  // Загрузка данных
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [menuResponse, categoriesResponse] = await Promise.all([
        fetch('/api/menu'),
        fetch('/api/categories')
      ]);

      if (menuResponse.ok && categoriesResponse.ok) {
        const menuData = await menuResponse.json();
        const categoriesData = await categoriesResponse.json();

        const normalizedItems: MenuItem[] = (Array.isArray(menuData) ? menuData : []).map((item: any) => ({
          id: item.id,
          name: typeof item.name === 'object'
            ? item.name
            : { ru: String(item.name || ''), en: String(item.name || ''), tj: String(item.name || ''), cn: String(item.name || '') },
          price: Number(item.price) || 0,
          category: String(item.category || ''),
          images: Array.isArray(item.images) ? item.images : [],
          isActive: Boolean(item.isActive)
        }));

        const normalizedCategories: Category[] = (Array.isArray(categoriesData) ? categoriesData : []).map((cat: any) => ({
          id: String(cat.id || ''),
          name: typeof cat.name === 'string' ? cat.name : (cat?.name?.ru || Object.values(cat?.name || {})[0] || ''),
          categoryImage: cat.image || ''
        }));

        setMenuItems(normalizedItems);
        setCategories(normalizedCategories);
      } else {
        setError('Ошибка загрузки данных');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это блюдо?')) return;

    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-code': adminCode || '',
        },
      });

      if (response.ok) {
        await loadData();
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.error}`);
      }
    } catch {
      alert('Ошибка при удалении блюда');
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

  const handleSaveItem = async (item: MenuItem, files: File[]) => {
    try {
      const formData = new FormData();
      formData.append('name', JSON.stringify(item.name));
      formData.append('price', item.price.toString());
      formData.append('category', item.category);
      formData.append('isActive', item.isActive.toString());

      files.forEach((file) => {
        formData.append('images', file, file.name);
      });

      const url = editingItem 
        ? `/api/menu/${editingItem.id}`
        : '/api/menu';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'x-admin-code': adminCode || '',
        },
        body: formData,
      });

      if (response.ok) {
        await loadData();
        setShowForm(false);
        setEditingItem(null);
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.error}`);
      }
    } catch {
      alert('Ошибка при сохранении блюда');
    }
  };

  const handleToggleActive = async (itemId: string) => {
    const item = menuItems.find(i => i.id === itemId);
    if (!item) return;

    try {
      const response = await fetch(`/api/menu/${itemId}`, {
        method: 'PUT',
        headers: {
          'x-admin-code': adminCode || '',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !item.isActive }),
      });

      if (response.ok) {
        await loadData();
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.error}`);
      }
    } catch {
      alert('Ошибка при изменении статуса');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Загрузка данных...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
        <Button onClick={loadData} className="ml-4">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление меню</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Добавить блюдо
        </Button>
      </div>

      {/* Список блюд */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="relative">
            <CardContent className="p-4">
              <div className="aspect-video mb-3 overflow-hidden rounded-lg">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={`/api${item.images[0]}`}
                    alt={item.name.ru}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">Нет фото</span>
                  </div>
                )}
                {item.images && item.images.length > 1 && (
                  <Badge className="absolute top-2 right-2 bg-blue-600">
                    +{item.images.length - 1}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{item.name.ru}</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleActive(item.id)}
                >
                  {item.isActive ? (
                    <Eye className="w-4 h-4 text-green-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-bold text-green-600">
                  {item.price} TJS
                </span>
                <Badge variant="outline">
                  {categories.find(c => c.id === item.category)?.name || item.category}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Модальное окно добавления/редактирования */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editingItem ? 'Редактировать блюдо' : 'Новое блюдо'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <MenuItemForm
                item={editingItem}
                categories={categories}
                onSave={handleSaveItem}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface MenuItemFormProps {
  item: MenuItem | null;
  categories: Category[];
  onSave: (item: MenuItem, files: File[]) => void;
  onCancel: () => void;
}

function MenuItemForm({ item, categories, onSave, onCancel }: MenuItemFormProps) {
  const [name, setName] = useState({
    ru: item?.name.ru || '',
    en: item?.name.en || '',
    tj: item?.name.tj || '',
    cn: item?.name.cn || ''
  });
  const [price, setPrice] = useState(item?.price || 0);
  const [category, setCategory] = useState(item?.category || '');
  const [isActive, setIsActive] = useState(item?.isActive ?? true);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(item?.images || []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(prev => [...prev, ...files]);
    files.forEach(file => {
      const preview = URL.createObjectURL(file);
      setImagePreviews(prev => [...prev, preview]);
    });
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.ru.trim() || price <= 0 || !category) {
      alert('Пожалуйста заполните обязательные поля');
      return;
    }

    const menuItem: MenuItem = {
      id: item?.id || '',
      name,
      price,
      category,
      images: imagePreviews,
      isActive
    };

    onSave(menuItem, images);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name-ru">Название (RU) *</Label>
          <Input
            id="name-ru"
            value={name.ru}
            onChange={(e) => setName(prev => ({ ...prev, ru: e.target.value }))}
            required
          />
        </div>
        <div>
          <Label htmlFor="name-en">Название (EN)</Label>
          <Input
            id="name-en"
            value={name.en}
            onChange={(e) => setName(prev => ({ ...prev, en: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="name-tj">Название (TJ)</Label>
          <Input
            id="name-tj"
            value={name.tj}
            onChange={(e) => setName(prev => ({ ...prev, tj: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="name-cn">Название (CN)</Label>
          <Input
            id="name-cn"
            value={name.cn}
            onChange={(e) => setName(prev => ({ ...prev, cn: e.target.value }))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="price">Цена *</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            min="0"
            step="0.01"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Категория *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Выберите категорию" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            id="isActive"
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="isActive">Активно</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="images">Изображения (до 5 файлов)</Label>
        <Input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="mt-2"
        />
        
        {imagePreviews.length > 0 && (
          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 w-6 h-6 p-0"
                  onClick={() => removeImage(index)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {item ? 'Сохранить' : 'Добавить'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
