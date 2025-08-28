import * as React from "react";
import { useState, useEffect } from "react";
import { Plus, Minus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { AspectRatio } from './ui/aspect-ratio';

import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedBlock } from './AnimatedBlock';

// Базовый URL API
const API_BASE = '';

// Обновленные интерфейсы для работы с новым API
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
  items: MenuItem[];
}

interface Banner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface MenuComponentProps {
  addToCart: (item: MenuItem) => void;
  cart: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
}

export function MenuComponent({ addToCart, cart, updateQuantity }: MenuComponentProps) {
  const { language } = useLanguage();
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  
  // Состояние для карусели изображений в карточках
  const [carouselStates, setCarouselStates] = useState<{ [key: string]: number }>({});
  const [hoveredItems, setHoveredItems] = useState<{ [key: string]: boolean }>({});
  
  // Состояние для отображения стрелок прокрутки категорий
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Ref для скролла к разделу с блюдами
  const menuItemsRef = React.useRef<HTMLDivElement>(null);
  // Refs для секций категорий
  const categoryRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

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

  // Автоматическое переключение промо баннеров
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentPromoIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  // Автоматическое переключение изображений при наведении
  useEffect(() => {
    const intervals: { [key: string]: NodeJS.Timeout } = {};

    Object.keys(hoveredItems).forEach(itemId => {
      if (hoveredItems[itemId]) {
        const item = menuData
          .flatMap(cat => cat.items)
          .find(item => item.id === itemId);
        
        if (item && item.images && item.images.length > 1) {
          intervals[itemId] = setInterval(() => {
            setCarouselStates(prev => {
              const currentIndex = prev[itemId] || 0;
              const newIndex = (currentIndex + 1) % item.images.length;
              return { ...prev, [itemId]: newIndex };
            });
          }, 2000);
        }
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [hoveredItems, menuData]);

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
    // Небольшая задержка для обновления контента, затем плавный скролл к нужной секции
    setTimeout(() => {
      const target = categoryRefs.current[categoryId];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        scrollToMenuItems();
      }
    }, 100);
  };

  // Получение локализованного названия блюда
  const getLocalizedName = (item: MenuItem) => {
    return item.name[language as keyof typeof item.name] || item.name.ru;
  };



  // Получение локализованного названия категории
  const getLocalizedCategoryName = (category: MenuCategory) => {
    return category.name[language as keyof typeof category.name] || category.name.ru;
  };

  const getCartItemQuantity = (id: string) => {
    const cartItem = cart.find(cartItem => cartItem.item.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const currentCategory = menuData.find(cat => cat.id === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
        <Button onClick={() => window.location.reload()} className="golden-gradient text-white">
          {'Попробовать снова'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Banner */}
      {banners.length > 0 && (
        <div className="relative h-78 overflow-hidden rounded-xl">
          <div className="flex transition-all duration-500" style={{ transform: `translateX(-${currentPromoIndex * 100}%)` }}>
            {banners.map(b => (
              <div key={b.id} className="w-full h-78 flex-shrink-0 relative">
                <ImageWithFallback
                  src={`${API_BASE}${b.image}`}
                  alt="Промо баннер"
                  className="w-full h-78 object-cover"
                />
              </div>
            ))}
          </div>
          {/* Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {banners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentPromoIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Navigation */}
      <div className="relative">
        <div className="flex flex-nowrap overflow-x-auto gap-4 pb-4 px-4 scroll-smooth scrollbar-hide" id="categories-scroll">
          {menuData.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`flex flex-col items-center p-4 rounded-lg transition-all flex-shrink-0 min-w-[120px] ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-lg scale-105'
                  : 'bg-white hover:bg-gray-50 text-gray-700 hover:scale-105'
              }`}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-amber-400">
            <ImageWithFallback
                  src={`${API_BASE}${category.image}`}
                  alt={getLocalizedCategoryName(category)}
              className="w-full h-full object-cover"
            />
          </div>
              <span className="text-sm font-semibold text-center max-w-[120px] line-clamp-2">
                {getLocalizedCategoryName(category)}
              </span>
            </button>
          ))}
        </div>
        
        {/* Индикаторы прокрутки */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => {
              const container = document.getElementById('categories-scroll');
              if (container) {
                container.scrollBy({ left: -200, behavior: 'smooth' });
              }
            }}
            className="w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          <button
            onClick={() => {
              const container = document.getElementById('categories-scroll');
              if (container) {
                container.scrollBy({ left: 200, behavior: 'smooth' });
              }
            }}
            className="w-8 h-8 bg-white/80 hover:bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Menu Items - All Categories */}
      <div ref={menuItemsRef} className="max-w-7xl mx-auto px-4 space-y-12">
        {menuData.map((category) => (
          <div 
            key={category.id} 
            id={`category-${category.id}`} 
            ref={(el) => (categoryRefs.current[category.id] = el)}
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
            
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {category.items.map((item) => {
          const currentImageIndex = carouselStates[item.id] || 0;
                const hasMultipleImages = item.images && item.images.length > 1;
                const hasImages = item.images && item.images.length > 0;
                const isGarnishCategory = category.id === "5f3d7b36-cf30-4727-a868-961a14e03a27";
          
          return (
                  <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 rounded-xl border-0 shadow-lg">
                    <div
                      className="relative group"
                      onMouseEnter={() => setHoveredItems(prev => ({ ...prev, [item.id]: true }))}
                      onMouseLeave={() => setHoveredItems(prev => ({ ...prev, [item.id]: false }))}
                    >
                      {/* Image area with cross-fade - скрываем для гарниров */}
                      {!isGarnishCategory && (
                        <AspectRatio ratio={6/4}>
                          <div className="relative w-full h-full">
                            {hasImages ? (
                              item.images.map((relSrc, idx) => (
                                <ImageWithFallback
                                  key={`${item.id}-${idx}`}
                                  src={`${API_BASE}${relSrc}`}
                                  alt={getLocalizedName(item)}
                                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${idx === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                />
                              ))
                            ) : (
                              <ImageWithFallback
                                src={`${API_BASE}/images/default-dish.jpg`}
                                alt={getLocalizedName(item)}
                                className="absolute inset-0 w-full h-full object-cover"
                              />
                            )}
                          </div>
                        </AspectRatio>
                      )}

                      {/* Multiple images indicator - скрываем для гарниров */}
                      {!isGarnishCategory && hasMultipleImages && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                            {(currentImageIndex + 1)}/{item.images.length}
                          </div>
                        </div>
                      )}
                      
                      {/* Manual arrows - скрываем для гарниров */}
                      {!isGarnishCategory && hasMultipleImages && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCarouselStates(prev => ({
                                ...prev,
                                [item.id]: (currentImageIndex - 1 + item.images.length) % item.images.length,
                              }));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setCarouselStates(prev => ({
                                ...prev,
                                [item.id]: (currentImageIndex + 1) % item.images.length,
                              }));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-xl sm:text-xl lg:text-2xl text-gray-900 line-clamp-2 pr-2">
                          {getLocalizedName(item)}
                      </h3>
                        <span className="text-xl sm:text-2xl lg:text-2xl font-bold text-amber-600 whitespace-nowrap">
                      {item.price} TJS
                      </span>
                    </div>



                      {/* CTA / Quantity */}
                      {(() => {
                        const qty = getCartItemQuantity(item.id);
                        if (qty === 0) {
                          return (
                            <Button
                              onClick={() => addToCart(item)}
                              className="w-full h-12 sm:h-14 font-semibold text-base sm:text-lg golden-gradient text-white hover:golden-gradient-hover"
                            >
                              В корзину
                            </Button>
                          );
                        }
                        return (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                          <Button
                                size="sm"
                            variant="outline"
                                onClick={() => updateQuantity(item.id, Math.max(0, qty - 1))}
                                className="h-10 w-10 sm:h-12 sm:w-12 p-0 border-amber-200"
                          >
                                <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                              <span className="text-lg sm:text-xl lg:text-2xl font-bold min-w-[3rem] text-center">
                                {qty}
                          </span>
                          <Button
                                size="sm"
                            variant="outline"
                                onClick={() => updateQuantity(item.id, qty + 1)}
                                className="h-10 w-10 sm:h-12 sm:w-12 p-0 border-amber-200"
                          >
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                          </Button>
                        </div>
                        <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, 0)}
                              className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-base border-red-200 text-red-600 hover:bg-red-50"
                            >
                              Убрать
                        </Button>
                    </div>
                        );
                      })()}
              </CardContent>
            </Card>
          );
        })}
            </div>
            
            {category.items.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 text-lg">
                  В этой категории пока нет блюд
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Price Disclaimer */}
      <div className="text-center py-6 px-4">
        <p className="text-sm text-gray-500 italic">
          * Цена может отличаться в связи с тем, что точный вес порций может варьироваться
        </p>
      </div>
    </div>
  );
}