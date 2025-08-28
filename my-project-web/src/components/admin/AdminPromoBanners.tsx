import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload, Loader2 } from 'lucide-react';

// Типы данных
interface Banner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

export function AdminPromoBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Получаем код админа из localStorage
  const getAdminCode = () => localStorage.getItem('adminCode') || '';

  // Загружаем баннеры с сервера
  const loadBanners = async () => {
    try {
      setIsLoading(true);
      setError('');
      console.log('🔄 Загрузка баннеров...');
      
      const response = await fetch('/api/admin/banners', {
        headers: {
          'x-admin-code': getAdminCode(),
        },
      });
      
      console.log(`📡 Ответ загрузки баннеров: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📊 Загружено баннеров:', data.length, data);
        setBanners(data);
      } else {
        const errorText = await response.text();
        console.error('❌ Ошибка загрузки баннеров:', errorText);
        setError(`Ошибка загрузки баннеров: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Ошибка подключения при загрузке баннеров:', error);
      setError('Ошибка подключения к серверу');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleDelete = async (bannerId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот баннер?')) {
      try {
        const response = await fetch(`/api/banners/${bannerId}`, {
          method: 'DELETE',
          headers: {
            'x-admin-code': getAdminCode(),
          },
        });

        if (response.ok) {
          await loadBanners(); // Перезагружаем данные
        } else {
          setError('Ошибка удаления баннера');
        }
      } catch (error) {
        setError('Ошибка подключения к серверу');
      }
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleAddNew = () => {
    console.log('➕ Нажата кнопка "Добавить баннер"');
    setEditingBanner(null);
    setShowForm(true);
  };

  const handleSaveBanner = async (banner: Banner) => {
    try {
      console.log('💾 Сохранение баннера:', banner);
      
      const formData = new FormData();
      formData.append('isActive', banner.isActive.toString());
      formData.append('sortOrder', banner.sortOrder.toString());

      // Если есть новое изображение, добавляем его
      if (banner.image.startsWith('blob:')) {
        // Конвертируем blob URL в File
        const response = await fetch(banner.image);
        const blob = await response.blob();
        const file = new File([blob], 'banner.jpg', { type: blob.type });
        formData.append('image', file);
        console.log('📁 Добавлен файл изображения');
      } else {
        console.log('⚠️ Изображение не является blob URL:', banner.image);
        setError('Ошибка: изображение не загружено');
        return;
      }

      let url = '/api/banners';
      let method = 'POST';

      if (editingBanner) {
        url = `/api/banners/${editingBanner.id}`;
        method = 'PUT';
      }

      console.log(`🌐 Отправка запроса: ${method} ${url}`);

      const response = await fetch(url, {
        method,
        headers: {
          'x-admin-code': getAdminCode(),
        },
        body: formData,
      });

      console.log(`📡 Ответ сервера: ${response.status} ${response.statusText}`);

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Баннер сохранен:', result);
        await loadBanners(); // Перезагружаем данные
        setShowForm(false);
        setEditingBanner(null);
        setError(''); // Очищаем ошибки
      } else {
        const errorText = await response.text();
        console.error('❌ Ошибка сохранения:', errorText);
        setError(`Ошибка сохранения баннера: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('❌ Ошибка подключения:', error);
      setError('Ошибка подключения к серверу');
    }
  };

  const handleToggleActive = async (bannerId: string) => {
    try {
      const banner = banners.find(b => b.id === bannerId);
      if (!banner) return;

              const response = await fetch(`/api/banners/${bannerId}`, {
        method: 'PUT',
        headers: {
          'x-admin-code': getAdminCode(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !banner.isActive,
          sortOrder: banner.sortOrder,
        }),
      });

      if (response.ok) {
        await loadBanners(); // Перезагружаем данные
      } else {
        setError('Ошибка обновления статуса баннера');
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    }
  };

  const handleMoveUp = async (bannerId: string) => {
    try {
      const index = banners.findIndex(b => b.id === bannerId);
      if (index > 0) {
        const newBanners = [...banners];
        [newBanners[index], newBanners[index - 1]] = [newBanners[index - 1], newBanners[index]];
        
        // Обновляем порядок на сервере
        for (let i = 0; i < newBanners.length; i++) {
          const response = await fetch(`/api/banners/${newBanners[i].id}`, {
            method: 'PUT',
            headers: {
              'x-admin-code': getAdminCode(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              isActive: newBanners[i].isActive,
              sortOrder: i + 1,
            }),
          });
          if (!response.ok) {
            setError('Ошибка обновления порядка баннеров');
            return;
          }
        }
        
        await loadBanners(); // Перезагружаем данные
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    }
  };

  const handleMoveDown = async (bannerId: string) => {
    try {
      const index = banners.findIndex(b => b.id === bannerId);
      if (index < banners.length - 1) {
        const newBanners = [...banners];
        [newBanners[index], newBanners[index + 1]] = [newBanners[index + 1], newBanners[index]];
        
        // Обновляем порядок на сервере
        for (let i = 0; i < newBanners.length; i++) {
          const response = await fetch(`/api/banners/${newBanners[i].id}`, {
            method: 'PUT',
            headers: {
              'x-admin-code': getAdminCode(),
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              isActive: newBanners[i].isActive,
              sortOrder: i + 1,
            }),
          });
          if (!response.ok) {
            setError('Ошибка обновления порядка баннеров');
            return;
          }
        }
        
        await loadBanners(); // Перезагружаем данные
      }
    } catch (error) {
      setError('Ошибка подключения к серверу');
    }
  };

  // Сортируем баннеры по порядку
  const sortedBanners = [...banners].sort((a, b) => a.sortOrder - b.sortOrder);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Загрузка баннеров...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление промо-баннерами</h2>
        <Button onClick={handleAddNew} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Добавить баннер
        </Button>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Форма добавления/редактирования */}
      {showForm && (
        <Card className="border-green-200">
          <CardContent className="p-6">
            <AdminBannerForm
              banner={editingBanner}
              onSave={handleSaveBanner}
              onCancel={() => {
                setShowForm(false);
                setEditingBanner(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      {/* Список баннеров */}
      <div className="space-y-4" data-banners-count={sortedBanners.length}>
        {sortedBanners.map((banner, index) => (
          <Card key={banner.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Изображение */}
              <div className="relative w-full md:w-64 h-48 md:h-auto">
                <img
                  src={banner.image}
                  alt="Промо баннер"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/loading.png';
                  }}
                />
                <div className="absolute top-2 left-2">
                  {banner.isActive ? (
                    <Badge className="bg-green-500">Активен</Badge>
                  ) : (
                    <Badge className="bg-gray-500">Неактивен</Badge>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <Badge className="bg-blue-500">#{banner.sortOrder}</Badge>
                </div>
              </div>

              {/* Контент */}
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">Баннер #{banner.sortOrder}</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  Размер: 1200x400px (рекомендуется)
                </p>

                {/* Кнопки управления */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(banner.id)}
                  >
                    {banner.isActive ? (
                      <>
                        <EyeOff className="h-4 w-4 mr-1" />
                        Деактивировать
                      </>
                    ) : (
                      <>
                        <Eye className="h-4 w-4 mr-1" />
                        Активировать
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Редактировать
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveUp(banner.id)}
                    disabled={index === 0}
                  >
                    ↑ Вверх
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleMoveDown(banner.id)}
                    disabled={index === sortedBanners.length - 1}
                  >
                    ↓ Вниз
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(banner.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {sortedBanners.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Промо-баннеры не добавлены
          </p>
        </div>
      )}
    </div>
  );
}

// Компонент формы для добавления/редактирования
interface AdminBannerFormProps {
  banner: Banner | null;
  onSave: (banner: Banner) => void;
  onCancel: () => void;
}

function AdminBannerForm({ banner, onSave, onCancel }: AdminBannerFormProps) {
  const [formData, setFormData] = useState<Banner>({
    id: '',
    image: '',
    isActive: true,
    sortOrder: 1
  });

  // Получаем количество баннеров для определения sortOrder
  const getBannersCount = () => {
    const bannersElement = document.querySelector('[data-banners-count]');
    return bannersElement ? parseInt(bannersElement.getAttribute('data-banners-count') || '0') : 0;
  };

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    if (banner) {
      setFormData(banner);
      setImagePreview(banner.image);
    }
  }, [banner]);

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
    if (imagePreview) {
      const finalBanner = {
        ...formData,
        image: imagePreview,
        sortOrder: banner ? banner.sortOrder : getBannersCount() + 1
      };
      onSave(finalBanner);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold">
        {banner ? 'Редактировать баннер' : 'Добавить новый баннер'}
      </h3>
      
      {/* Загрузка изображения */}
      <div>
        <label className="block text-sm font-medium mb-1">Фото баннера *</label>
        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
          <p className="text-xs text-gray-500">
            Рекомендуемый размер: 1200x400px, формат: JPG, PNG
          </p>
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full max-w-md h-32 object-cover rounded-md border"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
            className="mr-2"
          />
          Активный баннер
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="bg-green-600 hover:bg-green-700">
          {banner ? 'Сохранить' : 'Добавить'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Отмена
        </Button>
      </div>
    </form>
  );
} 