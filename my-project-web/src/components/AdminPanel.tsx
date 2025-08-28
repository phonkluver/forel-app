import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AdminPromoBanners } from './admin/AdminPromoBanners';

const API_BASE = 'http://localhost:3001';
const ADMIN_CODE = '0202';

interface MenuItem {
  id: string;
  name: { ru: string; en: string; tj: string; zh: string };
  price: number;
  category: string;
  images: string[];
  isActive: boolean;
}

interface MenuCategory {
  id: string;
  name: { ru: string; en: string; tj: string; zh: string };
  image: string;
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'menu' | 'categories' | 'banners'>('menu');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDish, setEditingDish] = useState<MenuItem | null>(null);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [formData, setFormData] = useState({
    name: { ru: '', en: '', tj: '', zh: '' },
    price: 0,
    category: '',
    images: [] as string[],
    isActive: true
  });
  const [categoryFormData, setCategoryFormData] = useState({
    name: { ru: '', en: '', tj: '', zh: '' },
    image: ''
  });
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [selectedCategoryImage, setSelectedCategoryImage] = useState<File | null>(null);
  const [showPositionForm, setShowPositionForm] = useState(false);
  const [selectedCategoryForPosition, setSelectedCategoryForPosition] = useState<string | null>(null);
  const [newPosition, setNewPosition] = useState<number>(1);

  // Восстанавливаем авторизацию при загрузке
  useEffect(() => {
    const savedAdminCode = localStorage.getItem('adminCode');
    if (savedAdminCode) {
      setAdminCode(savedAdminCode);
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  // Функция для добавления новых файлов к уже выбранным
  const handleFileSelect = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    if (selectedFiles) {
      // Объединяем существующие и новые файлы
      const dt = new DataTransfer();
      
      // Добавляем существующие файлы
      Array.from(selectedFiles).forEach(file => dt.items.add(file));
      
      // Добавляем новые файлы
      Array.from(newFiles).forEach(file => dt.items.add(file));
      
      setSelectedFiles(dt.files);
    } else {
      setSelectedFiles(newFiles);
    }
  };

  // Проверка авторизации
  const handleAuth = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/admin/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: adminCode })
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setError(null);
        // Сохраняем админский код в localStorage
        localStorage.setItem('adminCode', adminCode);
        loadData();
      } else {
        setError('Неверный код доступа');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    }
  };

  // Загрузка данных
  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [menuResponse, categoriesResponse] = await Promise.all([
        fetch(`${API_BASE}/api/menu`),
        fetch(`${API_BASE}/api/categories`)
      ]);

      if (menuResponse.ok && categoriesResponse.ok) {
        const menuData = await menuResponse.json();
        const categoriesData = await categoriesResponse.json();
        
        console.log('Загруженные категории:', categoriesData);
        
        setMenuItems(menuData);
        setCategories(categoriesData);
      } else {
        setError('Ошибка загрузки данных');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  const retryConnection = () => {
    setError(null);
    if (isAuthenticated) {
      loadData();
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminCode('');
    localStorage.removeItem('adminCode');
  };

  // Обработчики для редактирования
  const handleEditDish = (dish: MenuItem) => {
    setEditingDish(dish);
    setFormData({
      name: dish.name,
      price: dish.price,
      category: dish.category,
      images: dish.images,
      isActive: dish.isActive
    });
    setShowAddForm(true);
  };

  const handleDeleteDish = async (dishId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это блюдо?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/menu${dishId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-code': '0202'
        }
      });
      
      if (response.ok) {
        loadData(); // Перезагружаем данные
      } else {
        setError('Ошибка при удалении блюда');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    }
  };

  const handleSaveDish = async () => {
    try {
      const url = editingDish 
        ? `${API_BASE}/api/menu${editingDish.id}`
        : `${API_BASE}/api/menu`;
      
      const method = editingDish ? 'PUT' : 'POST';
      
      // Создаем FormData для отправки файлов
      const formDataToSend = new FormData();
      formDataToSend.append('name', JSON.stringify(formData.name));
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('category', formData.category);
      formDataToSend.append('isActive', 'true');
      
      // Добавляем выбранные файлы
      if (selectedFiles) {
        Array.from(selectedFiles).forEach((file) => {
          formDataToSend.append('images', file);
        });
      }
      
      const response = await fetch(url, {
        method,
        headers: { 
          'x-admin-code': '0202'
          // Не устанавливаем Content-Type для FormData - браузер сделает это автоматически
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        setShowAddForm(false);
        setEditingDish(null);
        setSelectedFiles(null);
        setFormData({
          name: { ru: '', en: '', tj: '', zh: '' },
          price: 0,
          category: '',
          images: [],
          isActive: true
        });
        loadData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при сохранении блюда');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    }
  };

  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingDish(null);
    setFormData({
      name: { ru: '', en: '', tj: '', zh: '' },
      price: 0,
      category: '',
      images: [],
      isActive: true
    });
  };

  // Функции для работы с категориями
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryFormData({
      name: { ru: '', en: '', tj: '', zh: '' },
      image: ''
    });
    setSelectedCategoryImage(null);
    setShowCategoryForm(true);
  };

  const handleEditCategory = (category: MenuCategory) => {
    setEditingCategory(category);
    setCategoryFormData({
      name: category.name,
      image: category.image
    });
    setSelectedCategoryImage(null);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'x-admin-code': '0202'
        }
      });
      
      if (response.ok) {
        loadData(); // Перезагружаем данные
      } else {
        setError('Ошибка при удалении категории');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    }
  };

  const handleSaveCategory = async () => {
    try {
      const url = editingCategory 
        ? `${API_BASE}/api/categories/${editingCategory.id}`
        : `${API_BASE}/api/categories`;
      
      const method = editingCategory ? 'PUT' : 'POST';
      
      // Создаем FormData для отправки файлов
      const formDataToSend = new FormData();
      formDataToSend.append('name', JSON.stringify(categoryFormData.name));
      
      // Добавляем изображение если выбрано
      if (selectedCategoryImage) {
        formDataToSend.append('image', selectedCategoryImage);
      }
      
      const response = await fetch(url, {
        method,
        headers: { 
          'x-admin-code': '0202'
        },
        body: formDataToSend
      });
      
      if (response.ok) {
        setShowCategoryForm(false);
        setEditingCategory(null);
        setSelectedCategoryImage(null);
        setCategoryFormData({
          name: { ru: '', en: '', tj: '', zh: '' },
          image: ''
        });
        loadData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка при сохранении категории');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    }
  };

  const handleCancelCategoryEdit = () => {
    setShowCategoryForm(false);
    setEditingCategory(null);
    setCategoryFormData({
      name: { ru: '', en: '', tj: '', zh: '' },
      image: ''
    });
    setSelectedCategoryImage(null);
  };

  // Функции для изменения позиции категории
  const handleChangePosition = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      const currentIndex = categories.findIndex(cat => cat.id === categoryId);
      setSelectedCategoryForPosition(categoryId);
      setNewPosition(currentIndex + 1);
      setShowPositionForm(true);
    }
  };

  const handleSavePosition = async () => {
    if (!selectedCategoryForPosition) return;

    try {
      const categoryIndex = categories.findIndex(cat => cat.id === selectedCategoryForPosition);
      if (categoryIndex === -1) {
        setError('Категория не найдена');
        return;
      }

      const targetIndex = Math.max(0, Math.min(newPosition - 1, categories.length - 1));

      // Создаем новый массив с измененным порядком
      const newCategories = [...categories];
      const [movedCategory] = newCategories.splice(categoryIndex, 1);
      newCategories.splice(targetIndex, 0, movedCategory);

      // Обновляем UI
      setCategories(newCategories);

      // Сохраняем в базе данных
      const response = await fetch(`${API_BASE}/api/categories/reorder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-code': '0202'
        },
        body: JSON.stringify({
          categoryId: selectedCategoryForPosition,
          newIndex: targetIndex
        })
      });

      if (response.ok) {
        setError('');
        setShowPositionForm(false);
        setSelectedCategoryForPosition(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(`Ошибка при изменении позиции: ${errorData.error || response.statusText}`);
        loadData(); // Откатываем изменения
      }
    } catch (error) {
      setError(`Ошибка подключения к серверу: ${error.message}`);
      loadData(); // Откатываем изменения
    }
  };

  const handleCancelPosition = () => {
    setShowPositionForm(false);
    setSelectedCategoryForPosition(null);
    setNewPosition(1);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Вход в админ-панель</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="code">Код доступа</Label>
              <Input
                id="code"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                placeholder="Введите код доступа"
                onKeyPress={(e) => e.key === 'Enter' && handleAuth()}
              />
            </div>
            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}
            <Button onClick={handleAuth} className="w-full">
              Войти
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Админ-панель</h1>
            <p className="text-gray-600">Управление меню, категориями и промо-баннерами</p>
          </div>
          {isAuthenticated && (
            <Button variant="outline" onClick={handleLogout} className="text-red-600 hover:text-red-700">
              Выйти
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'menu' ? 'default' : 'outline'}
            onClick={() => setActiveTab('menu')}
          >
            Управление меню
          </Button>
          <Button
            variant={activeTab === 'categories' ? 'default' : 'outline'}
            onClick={() => setActiveTab('categories')}
          >
            Категории
          </Button>
          <Button
            variant={activeTab === 'banners' ? 'default' : 'outline'}
            onClick={() => setActiveTab('banners')}
          >
            Промо-баннеры
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4 flex items-center justify-between">
              <span className="text-red-700">{error}</span>
              <Button onClick={retryConnection} variant="outline" size="sm">
                Попробовать снова
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}

        {/* Menu Management */}
        {activeTab === 'menu' && !isLoading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление меню</h2>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить блюдо
              </Button>
            </div>

            <div className="grid gap-4">
              {menuItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {item.images[0] && (
                          <img
                            src={`${API_BASE}${item.images[0]}`}
                            alt={item.name.ru}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold">{item.name.ru}</h3>
                          <p className="text-sm font-medium">{item.price} TJS</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditDish(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteDish(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Edit Form Modal */}
            {showAddForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {editingDish ? 'Редактировать блюдо' : 'Добавить блюдо'}
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name-ru">Название (RU)</Label>
                        <Input
                          id="name-ru"
                          value={formData.name.ru}
                          onChange={(e) => setFormData({
                            ...formData,
                            name: { ...formData.name, ru: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="name-en">Название (EN)</Label>
                        <Input
                          id="name-en"
                          value={formData.name.en}
                          onChange={(e) => setFormData({
                            ...formData,
                            name: { ...formData.name, en: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name-tj">Название (TJ)</Label>
                        <Input
                          id="name-tj"
                          value={formData.name.tj}
                          onChange={(e) => setFormData({
                            ...formData,
                            name: { ...formData.name, tj: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="name-zh">Название (ZH)</Label>
                        <Input
                          id="name-zh"
                          value={formData.name.zh}
                          onChange={(e) => setFormData({
                            ...formData,
                            name: { ...formData.name, zh: e.target.value }
                          })}
                        />
                      </div>
                    </div>



                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Цена</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({
                            ...formData,
                            price: Number(e.target.value)
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Категория</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => setFormData({
                            ...formData,
                            category: value
                          })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name.ru}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <Label htmlFor="images">Изображения</Label>
                      <div className="space-y-4">
                        {/* Current Images */}
                        {formData.images.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Текущие изображения:</p>
                            <div className="flex flex-wrap gap-2">
                              {formData.images.map((image, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={`${API_BASE}${image}`}
                                    alt={`Image ${index + 1}`}
                                    className="w-20 h-20 object-cover rounded border"
                                  />
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                    onClick={() => {
                                      const newImages = formData.images.filter((_, i) => i !== index);
                                      setFormData({ ...formData, images: newImages });
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* File Upload */}
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                          <div className="text-center">
                            <Upload className="mx-auto h-12 w-12 text-gray-400" />
                            <div className="mt-4">
                              <Label htmlFor="file-upload" className="cursor-pointer">
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                  Загрузить новые изображения
                                </span>
                                <Input
                                  id="file-upload"
                                  name="file-upload"
                                  type="file"
                                  multiple
                                  accept="image/*"
                                  className="sr-only"
                                  onChange={(e) => handleFileSelect(e.target.files)}
                                />
                              </Label>
                              <p className="mt-1 text-xs text-gray-500">
                                PNG, JPG, GIF до 10MB
                              </p>
        </div>
                          </div>
                        </div>

                        {/* Selected Files Preview */}
                        {selectedFiles && selectedFiles.length > 0 && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Выбранные файлы для загрузки:</p>
                            <div className="flex flex-wrap gap-2">
                              {Array.from(selectedFiles).map((file, index) => (
                                <div key={index} className="relative">
                                  <div className="w-20 h-20 border rounded overflow-hidden bg-gray-100">
                                    <img
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white text-xs p-1 truncate">
                                    {file.name}
                                  </div>
                                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1 rounded-bl">
                                    {(file.size / 1024 / 1024).toFixed(1)}MB
                                  </div>
                                  <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                    onClick={() => {
                                      const dt = new DataTransfer();
                                      const files = Array.from(selectedFiles);
                                      files.splice(index, 1);
                                      files.forEach(file => dt.items.add(file));
                                      setSelectedFiles(dt.files);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-xs text-gray-500">
                                Всего выбрано: {selectedFiles.length} файл(ов)
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedFiles(null)}
                              >
                                Очистить все
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Отмена
                      </Button>
                      <Button onClick={handleSaveDish}>
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Categories Management */}
        {activeTab === 'categories' && !isLoading && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Управление категориями</h2>
              <Button onClick={handleAddCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Добавить категорию
              </Button>
            </div>

            <div className="grid gap-4">
              {categories.map((category, index) => (
                <Card key={category.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`${API_BASE}${category.image}`}
                          alt={category.name.ru}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">{category.name.ru}</h3>
                          <p className="text-sm text-gray-600">{category.name.en}</p>
                          <p className="text-xs text-gray-500">Позиция: {index + 1}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleChangePosition(category.id)}
                        >
                          Позиция
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Category Form Modal */}
            {showCategoryForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {editingCategory ? 'Редактировать категорию' : 'Добавить категорию'}
                      <Button variant="ghost" size="sm" onClick={handleCancelCategoryEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category-name-ru">Название (RU)</Label>
                        <Input
                          id="category-name-ru"
                          value={categoryFormData.name.ru}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            name: { ...categoryFormData.name, ru: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-name-en">Название (EN)</Label>
                        <Input
                          id="category-name-en"
                          value={categoryFormData.name.en}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            name: { ...categoryFormData.name, en: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category-name-tj">Название (TJ)</Label>
                        <Input
                          id="category-name-tj"
                          value={categoryFormData.name.tj}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            name: { ...categoryFormData.name, tj: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="category-name-zh">Название (ZH)</Label>
                        <Input
                          id="category-name-zh"
                          value={categoryFormData.name.zh}
                          onChange={(e) => setCategoryFormData({
                            ...categoryFormData,
                            name: { ...categoryFormData.name, zh: e.target.value }
                          })}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="category-image">Изображение категории</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          id="category-image"
                          accept="image/*"
                          onChange={(e) => setSelectedCategoryImage(e.target.files?.[0] || null)}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        />
                      </div>
                      {categoryFormData.image && !selectedCategoryImage && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Текущее изображение:</p>
                          <img
                            src={`${API_BASE}${categoryFormData.image}`}
                            alt="Текущее изображение"
                            className="w-32 h-32 object-cover rounded mt-2"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={handleCancelCategoryEdit}>
                        Отмена
                      </Button>
                      <Button onClick={handleSaveCategory}>
                        <Save className="h-4 w-4 mr-2" />
                        Сохранить
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* Position Change Modal */}
        {showPositionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Изменить позицию категории
                  <Button variant="ghost" size="sm" onClick={handleCancelPosition}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="new-position">Новая позиция (от 1 до {categories.length})</Label>
                  <Input
                    id="new-position"
                    type="number"
                    min="1"
                    max={categories.length}
                    value={newPosition}
                    onChange={(e) => setNewPosition(parseInt(e.target.value) || 1)}
                    className="mt-1"
                  />
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Текущий порядок категорий:</p>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    {categories.map((cat, index) => (
                      <li key={cat.id} className={selectedCategoryForPosition === cat.id ? 'font-bold text-blue-600' : ''}>
                        {cat.name.ru}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={handleCancelPosition}>
                    Отмена
                  </Button>
                  <Button onClick={handleSavePosition}>
                    <Save className="h-4 w-4 mr-2" />
                    Сохранить
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Banners Management */}
        {activeTab === 'banners' && !isLoading && (
          <AdminPromoBanners />
        )}
      </div>
    </div>
  );
} 