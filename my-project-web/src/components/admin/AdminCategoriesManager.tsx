import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  categoryImage: string;
}

export function AdminCategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminCode = localStorage.getItem('adminCode');

  // Загрузка категорий
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        const normalized: Category[] = (Array.isArray(data) ? data : []).map((cat: any) => ({
          id: String(cat.id || ''),
          name: typeof cat.name === 'string' ? cat.name : (cat?.name?.ru || Object.values(cat?.name || {})[0] || ''),
          categoryImage: cat.image || ''
        }));
        setCategories(normalized);
      } else {
        setError('Ошибка загрузки категорий');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-code': adminCode || '',
        },
      });

      if (response.ok) {
        await loadCategories();
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.error}`);
      }
    } catch (error) {
      alert('Ошибка при удалении категории');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleSaveCategory = async (category: Category) => {
    try {
      const formData = new FormData();
      formData.append('name', category.name);
      
      if (category.categoryImage && !category.categoryImage.startsWith('/categories/')) {
        // Если это новый файл, добавляем его в FormData
        const response = await fetch(category.categoryImage);
        const blob = await response.blob();
        formData.append('image', blob, 'category-image.jpg');
      }

      const url = editingCategory 
        ? `/api/categories/${editingCategory.id}`
        : '/api/categories';
      
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'x-admin-code': adminCode || '',
        },
        body: formData,
      });

      if (response.ok) {
        await loadCategories();
        setShowForm(false);
        setEditingCategory(null);
      } else {
        const errorData = await response.json();
        alert(`Ошибка: ${errorData.error}`);
      }
    } catch (error) {
      alert('Ошибка при сохранении категории');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Загрузка категорий...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        {error}
        <Button onClick={loadCategories} className="ml-4">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Управление категориями</h2>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Добавить категорию
        </Button>
      </div>

      {/* Список категорий */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {categories.map((category) => (
          <Card key={category.id} className="relative">
            <CardContent className="p-4">
              <div className="aspect-video mb-3 overflow-hidden rounded-lg">
                <img
                  src={`/api${category.categoryImage}`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(category)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Форма добавления/редактирования */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <CategoryForm
                category={editingCategory}
                onSave={handleSaveCategory}
                onCancel={() => setShowForm(false)}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

interface CategoryFormProps {
  category: Category | null;
  onSave: (category: Category) => void;
  onCancel: () => void;
}

function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(category?.categoryImage || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Введите название категории');
      return;
    }

    const categoryData: Category = {
      id: category?.id || '',
      name: name.trim(),
      categoryImage: imagePreview,
    };

    onSave(categoryData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Название категории</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Введите название категории"
          required
        />
      </div>

      <div>
        <Label htmlFor="image">Изображение категории</Label>
        <div className="mt-2">
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        {imagePreview && (
          <div className="mt-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-20 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {category ? 'Сохранить' : 'Добавить'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
}
