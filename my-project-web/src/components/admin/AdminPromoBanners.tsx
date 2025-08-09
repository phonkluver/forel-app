import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff, Upload } from 'lucide-react';
import { apiService, Banner } from '../../services/api';

export function AdminPromoBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка баннеров из API
  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const bannersData = await apiService.getBanners();
      setBanners(bannersData);
    } catch (err) {
      setError('Ошибка загрузки баннеров');
      console.error('Error loading banners:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот баннер?')) {
      try {
        await apiService.deleteBanner(bannerId);
        setBanners(prev => prev.filter(banner => banner.id !== bannerId));
      } catch (err) {
        console.error('Error deleting banner:', err);
        alert('Ошибка при удалении баннера');
      }
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingBanner(null);
    setShowForm(true);
  };

  const handleSaveBanner = async (banner: Banner) => {
    try {
      if (editingBanner) {
        // Редактирование
        await apiService.updateBanner(editingBanner.id, createFormData(banner));
        setBanners(prev => prev.map(b => 
          b.id === editingBanner.id ? banner : b
        ));
      } else {
        // Добавление нового
        const newBanner = await apiService.addBanner(createFormData(banner));
        setBanners(prev => [...prev, newBanner]);
      }
      setShowForm(false);
      setEditingBanner(null);
    } catch (err) {
      console.error('Error saving banner:', err);
      alert('Ошибка при сохранении баннера');
    }
  };

  // Создание FormData для загрузки файлов
  const createFormData = (banner: Banner): FormData => {
    const formData = new FormData();
    formData.append('isActive', banner.isActive.toString());
    formData.append('sortOrder', banner.sortOrder.toString());
    
    // Если есть изображение, добавляем его
    if (banner.image && banner.image.startsWith('data:')) {
      // Конвертируем base64 в файл
      const response = fetch(banner.image);
      response.then(res => res.blob()).then(blob => {
        formData.append('image', blob, 'banner.jpg');
      });
    }
    
    return formData;
  };

  const handleToggleActive = async (bannerId: string) => {
    try {
      const result = await apiService.toggleBanner(bannerId);
      setBanners(prev => prev.map(banner => 
        banner.id === bannerId 
          ? { ...banner, isActive: result.isActive }
          : banner
      ));
    } catch (err) {
      console.error('Error toggling banner:', err);
      alert('Ошибка при изменении статуса баннера');
    }
  };

  const handleMoveUp = async (bannerId: string) => {
    try {
      const currentIndex = banners.findIndex(b => b.id === bannerId);
      if (currentIndex > 0) {
        const newBanners = [...banners];
        [newBanners[currentIndex], newBanners[currentIndex - 1]] = [newBanners[currentIndex - 1], newBanners[currentIndex]];
        const bannerIds = newBanners.map(b => b.id);
        await apiService.reorderBanners(bannerIds);
        setBanners(newBanners.map((b, i) => ({ ...b, sortOrder: i + 1 })));
      }
    } catch (err) {
      console.error('Error moving banner up:', err);
      alert('Ошибка при изменении порядка баннера');
    }
  };

  const handleMoveDown = async (bannerId: string) => {
    try {
      const currentIndex = banners.findIndex(b => b.id === bannerId);
      if (currentIndex < banners.length - 1) {
        const newBanners = [...banners];
        [newBanners[currentIndex], newBanners[currentIndex + 1]] = [newBanners[currentIndex + 1], newBanners[currentIndex]];
        const bannerIds = newBanners.map(b => b.id);
        await apiService.reorderBanners(bannerIds);
        setBanners(newBanners.map((b, i) => ({ ...b, sortOrder: i + 1 })));
      }
    } catch (err) {
      console.error('Error moving banner down:', err);
      alert('Ошибка при изменении порядка баннера');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Загрузка баннеров...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={loadBanners} className="bg-blue-600 hover:bg-blue-700">
          Попробовать снова
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопки */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление промо-баннерами</h2>
        <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Добавить баннер
        </Button>
      </div>

      {/* Форма добавления/редактирования */}
      {showForm && (
        <Card className="border-blue-200">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner, index) => (
          <Card key={banner.id} className="overflow-hidden">
            <div className="relative">
              <img
                src={banner.image}
                alt={`Баннер ${index + 1}`}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/loading.png';
                }}
              />
              <div className="absolute top-2 right-2">
                <Badge variant={banner.isActive ? 'default' : 'secondary'}>
                  {banner.isActive ? 'Активен' : 'Неактивен'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">
                  Порядок: {banner.sortOrder}
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(banner.id)}
                  >
                    {banner.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(banner.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMoveUp(banner.id)}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleMoveDown(banner.id)}
                  disabled={index === banners.length - 1}
                >
                  ↓
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {banners.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            Пока нет баннеров
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
      // В реальном приложении здесь была бы загрузка файла на сервер
      const finalBanner = {
        ...formData,
        image: imagePreview
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