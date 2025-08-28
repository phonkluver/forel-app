import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Minus, Loader2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedBlock } from './AnimatedBlock';
import { getApiUrl, API_CONFIG } from '../config/api';

// Обновленные интерфейсы для работы с новым API
interface MenuItem {
  id: string;
  name: { ru: string; en: string; tj: string; zh: string };
  price: number;
  category: string;
  image: string; // Основное изображение для совместимости с useCart
  images: string[]; // Дополнительные изображения
  isActive: boolean;
}

interface MenuCategory {
  id: string;
  name: { ru: string; en: string; tj: string; zh: string };
  image: string;
  items: MenuItem[];
}

interface Banner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

// Импортируем типы из mockData для совместимости
import { CartItem as MockCartItem, MenuItem as MockMenuItem } from '../utils/mockData';

interface MenuComponentProps {
  addToCart: (item: MockMenuItem) => void;
  cart: MockCartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

export function MenuComponent({ addToCart, cart, updateQuantity }: MenuComponentProps) {
  const { language, translations } = useLanguage();
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImages, setCurrentImages] = useState<Record<string, string>>({});
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedItemImages, setSelectedItemImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Ref для скролла к разделу с блюдами
  const menuItemsRef = React.useRef<HTMLDivElement>(null);

  // Базовый URL API
  const API_BASE = API_CONFIG.BASE_URL;

  // Загрузка баннеров
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/banners`);
        if (response.ok) {
          const data = await response.json();
          // Фильтруем только активные баннеры и сортируем по sortOrder
          const activeBanners = data.filter((banner: Banner) => banner.isActive)
            .sort((a: Banner, b: Banner) => a.sortOrder - b.sortOrder);
          setBanners(activeBanners);
        } else {
          console.error('Ошибка загрузки баннеров:', response.statusText);
        }
      } catch (error) {
        console.error('Ошибка загрузки баннеров:', error);
      }
    };

    loadBanners();
  }, []);

  // Загрузка меню
  useEffect(() => {
    const loadMenu = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Загружаем категории
        const categoriesResponse = await fetch(`${API_BASE}/api/categories`);
        if (!categoriesResponse.ok) {
          throw new Error('Ошибка загрузки категорий');
        }
        const categories: MenuCategory[] = await categoriesResponse.json();

        // Загружаем меню
        const menuResponse = await fetch(`${API_BASE}/api/menu`);
        if (!menuResponse.ok) {
          throw new Error('Ошибка загрузки меню');
        }
        const menuItems: MenuItem[] = await menuResponse.json();

        // Группируем блюда по категориям
        const groupedMenu = categories.map(category => ({
          ...category,
          items: menuItems
            .filter(item => item.category === category.id && item.isActive)
            .map(item => ({
              ...item,
              image: item.images[0] || '/categories/default.jpg' // Используем первое изображение
            }))
        }));

        setMenuData(groupedMenu);
        if (groupedMenu.length > 0) {
          setSelectedCategory(groupedMenu[0].id);
        }
      } catch (error) {
        console.error('Ошибка загрузки меню:', error);
        setError('Ошибка подключения к серверу');
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, [language]);

  // Автоматическая прокрутка слайдера
  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentPromoIndex(prev => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  // Функции для свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50; // Минимальное расстояние для свайпа

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Свайп влево - следующий слайд
        setCurrentPromoIndex(prev => (prev + 1) % banners.length);
      } else {
        // Свайп вправо - предыдущий слайд
        setCurrentPromoIndex(prev => prev === 0 ? banners.length - 1 : prev - 1);
      }
    }

    setIsDragging(false);
  };



  // Получение локализованного названия блюда
  const getLocalizedName = (item: MenuItem) => {
    return item.name[language as keyof typeof item.name] || item.name.ru;
  };

  // Получение локализованного названия категории
  const getLocalizedCategoryName = (category: MenuCategory) => {
    return category.name[language as keyof typeof category.name] || category.name.ru;
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return `${price} TJS`;
  };

  // Получение количества товара в корзине
  const getCartItemQuantity = (itemId: string) => {
    const cartItem = cart.find(item => item.id === itemId);
    return cartItem ? cartItem.quantity : 0;
  };

  // Получение текущей категории
  const currentCategory = menuData.find(cat => cat.id === selectedCategory);

  // Функция для автоматической прокрутки изображений при наведении
  const handleImageHover = (itemId: string, images: string[]) => {
    if (images.length <= 1) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % images.length;
      setCurrentImages(prev => ({
        ...prev,
        [itemId]: images[currentIndex]
      }));
    }, 2000); // Смена каждые 2 секунды

    // Сохраняем интервал для очистки
    setCurrentImages(prev => ({
      ...prev,
      [itemId]: images[0]
    }));

    return () => clearInterval(interval);
  };

  // Функция для остановки прокрутки изображений
  const handleImageLeave = (itemId: string) => {
    setCurrentImages(prev => ({
      ...prev,
      [itemId]: ''
    }));
  };

  // Функция для скролла к разделу с блюдами
  const scrollToMenuItems = () => {
    if (menuItemsRef.current) {
      menuItemsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Обработчик выбора категории с автоскроллом
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Плавный скролл к конкретной категории
    setTimeout(() => {
      const categoryElement = document.getElementById(`category-${categoryId}`);
      if (categoryElement) {
        categoryElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 150);
  };

  // Открытие модального окна с изображением
  const handleImageClick = (item: MenuItem) => {
    if (item.images && item.images.length > 0) {
      setSelectedItemImages(item.images);
      setCurrentImageIndex(0);
      setSelectedImage(item.images[0]);
    }
  };

  // Закрытие модального окна
  const handleCloseModal = () => {
    setSelectedImage(null);
    setSelectedItemImages([]);
    setCurrentImageIndex(0);
  };

  // Переход к следующему изображению
  const handleNextImage = () => {
    if (selectedItemImages.length > 1) {
      const nextIndex = (currentImageIndex + 1) % selectedItemImages.length;
      setCurrentImageIndex(nextIndex);
      setSelectedImage(selectedItemImages[nextIndex]);
    }
  };

  // Переход к предыдущему изображению
  const handlePrevImage = () => {
    if (selectedItemImages.length > 1) {
      const prevIndex = (currentImageIndex - 1 + selectedItemImages.length) % selectedItemImages.length;
      setCurrentImageIndex(prevIndex);
      setSelectedImage(selectedItemImages[prevIndex]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-600">{translations.loading}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-red-500 mb-4">{translations.error}</div>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="golden-gradient text-white">
          {translations.tryAgain}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Promo Banner Slider */}
      {banners.length > 0 && (
        <AnimatedBlock className="mb-6" animationType="fade-up">
          <div
            className="relative h-40 rounded-2xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Слайды */}
            <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentPromoIndex * 100}%)` }}>
              {banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="w-full h-40 flex-shrink-0 relative cursor-pointer"
                >
                  <ImageWithFallback
                    src={`${API_BASE}${banner.image}`}
                    alt="Промо баннер"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              ))}
            </div>

            {/* Кнопки навигации */}
            {banners.length > 1 && (
              <>
                {/* Кнопка "Назад" */}
                <button
                  onClick={() => setCurrentPromoIndex(prev => prev === 0 ? banners.length - 1 : prev - 1)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  ‹
                </button>

                {/* Кнопка "Вперед" */}
                <button
                  onClick={() => setCurrentPromoIndex(prev => (prev + 1) % banners.length)}
                  className="absolute right-2 top-1/2 -translate-x-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  ›
                </button>

                {/* Индикаторы слайдов */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                  {banners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPromoIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${index === currentPromoIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </AnimatedBlock>
      )}

      {/* Category Icons */}
      <AnimatedBlock className="mb-6" animationType="fade-up" delay={200}>
        <div className="flex flex-nowrap overflow-x-auto whitespace-nowrap space-x-4 pb-2 scroll-smooth px-2 scrollbar-hide">
          {menuData.map(category => (
            <div
              key={category.id}
              className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0"
              onClick={() => handleCategorySelect(category.id)}
            >
              {/* Круглая иконка категории */}
              <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-gradient-to-br from-amber-50 to-amber-100 ${selectedCategory === category.id
                  ? 'border-amber-500 shadow-lg scale-110'
                  : 'border-gray-200 hover:border-amber-300'
                }`}>
                <ImageWithFallback
                  src={`${API_BASE}${category.image}`}
                  alt={category.name[language as keyof typeof category.name] || category.name.ru}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Название категории */}
              <span className={`text-xs font-medium text-center w-16 truncate ${selectedCategory === category.id
                  ? 'text-amber-600'
                  : 'text-gray-600'
                }`}>
                {category.name[language as keyof typeof category.name] || category.name.ru}
              </span>
            </div>
          ))}
        </div>
      </AnimatedBlock>

      {/* Menu Items - All Categories */}
      <div ref={menuItemsRef} className="space-y-12">
        {menuData.map((category) => (
          <div 
            key={category.id} 
            id={`category-${category.id}`} 
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <span className="w-12 h-12 rounded-full overflow-hidden mr-4 ring-2 ring-amber-400">
                <ImageWithFallback
                  src={`${API_BASE}${category.image}`}
                  alt={getLocalizedCategoryName(category)}
                  className="w-full h-full object-cover"
                />
              </span>
              {getLocalizedCategoryName(category)}
            </h2>
            
            <div className="space-y-6">
              {category.items && category.items.length > 0 ? (
                category.items.map((item, index) => {
                  const cartQuantity = getCartItemQuantity(item.id);
                  const hasMultipleImages = item.images && item.images.length > 1;
                  const currentImage = currentImages[item.id] || item.images[0] || '/categories/default.jpg';
                  const isGarnishCategory = category.id === "5f3d7b36-cf30-4727-a868-961a14e03a27";

                  return (
                    <Card
                      key={item.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 rounded-xl border-0 shadow-lg animate-on-scroll"
                      style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
                    >
                      {/* Image area - скрываем для гарниров */}
                      {!isGarnishCategory && (
                        <div
                          className="relative group"
                          onMouseEnter={() => hasMultipleImages && handleImageHover(item.id, item.images)}
                          onMouseLeave={() => hasMultipleImages && handleImageLeave(item.id)}
                        >
                          <div className="relative w-full h-64">
                            <ImageWithFallback
                              src={currentImage.startsWith('http') ? currentImage : `${API_BASE}${currentImage}`}
                              alt={getLocalizedName(item)}
                              className="w-full h-full object-cover transition-all duration-500 cursor-pointer"
                              loading="eager"
                              onClick={() => handleImageClick(item)}
                            />

                            {/* Индикаторы для множественных изображений */}
                            {hasMultipleImages && (
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                                {item.images.map((_, imgIndex) => (
                                  <div
                                    key={imgIndex}
                                    className={`w-2 h-2 rounded-full ${currentImage === item.images[imgIndex] ? 'bg-white' : 'bg-white/50'}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-xl text-gray-900 line-clamp-2 pr-2">
                            {getLocalizedName(item)}
                          </h3>
                          <span className="text-xl font-bold text-amber-600 whitespace-nowrap">
                            {formatPrice(item.price)}
                          </span>
                        </div>

                        {/* CTA / Quantity */}
                        <div className="mt-auto pt-1">
                          {cartQuantity > 0 ? (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, Math.max(0, cartQuantity - 1))}
                                  className="h-8 w-8 p-0 border-amber-200 hover:bg-amber-50"
                                >
                                  <Minus className="h-4 w-4 text-amber-800" />
                                </Button>
                                <span className="w-8 text-center font-semibold text-amber-800">
                                  {cartQuantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, cartQuantity + 1)}
                                  className="h-8 w-8 p-0 border-amber-200 hover:bg-amber-50"
                                >
                                  <Plus className="h-4 w-4 text-amber-800" />
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 0)}
                                className="h-8 px-4 border-red-200 text-red-600 hover:bg-red-50"
                              >
                                Убрать
                              </Button>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              onClick={() => {
                                // Преобразуем локализованный MenuItem в MockMenuItem
                                const mockItem: MockMenuItem = {
                                  id: item.id,
                                  name: getLocalizedName(item),
                                  description: '',
                                  price: item.price,
                                  category: item.category,
                                  image: item.image
                                };
                                addToCart(mockItem);
                              }}
                              className="w-full h-12 font-semibold text-base golden-gradient text-white hover:golden-gradient-hover"
                            >
                              В корзину
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  В этой категории пока нет блюд
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Модальное окно для просмотра изображений */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Кнопка закрытия */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Изображение */}
            <div className="relative">
              <ImageWithFallback
                src={selectedImage.startsWith('http') ? selectedImage : `${API_BASE}${selectedImage}`}
                alt="Увеличенное изображение"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              {/* Навигационные кнопки */}
              {selectedItemImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Индикаторы */}
              {selectedItemImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                  {selectedItemImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImageIndex(index);
                        setSelectedImage(selectedItemImages[index]);
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}