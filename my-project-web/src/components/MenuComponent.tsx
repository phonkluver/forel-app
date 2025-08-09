/*
  This is a merged version of your two MenuComponent examples.
  It uses the full structure with banner slider, category icons, and adaptive menu items.
  This file assumes you're using TailwindCSS, Lucide, shadcn/ui, and that `apiClient.getMenu()` and translations are correctly set up.
*/

import * as React from 'react';
import { useState, useEffect } from 'react';
import { Plus, Minus, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedBlock } from './AnimatedBlock';
import { apiService, MenuItem as ApiMenuItem } from '../services/api';

// Локальные типы данных
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  images?: string[]; // Массив дополнительных изображений для карусели
}

interface MenuCategory {
  id: string;
  name: string;
  categoryImage: string;
  items: MenuItem[];
}

interface MenuComponentProps {
  addToCart: (item: MenuItem) => void;
  cart: Array<{ item: MenuItem; quantity: number }>;
  updateQuantity: (id: string, quantity: number) => void;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  link: string;
}

export function MenuComponent({ addToCart, cart, updateQuantity }: MenuComponentProps) {
  const { language, translations } = useLanguage();
  const [menuData, setMenuData] = useState<MenuCategory[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  
  // Состояние для карусели изображений в карточках
  const [carouselStates, setCarouselStates] = useState<{ [key: string]: number }>({});
  const [hoveredItems, setHoveredItems] = useState<{ [key: string]: boolean }>({});

  // Загрузка баннеров из API
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const apiBanners = await apiService.getActiveBanners();
        const formattedBanners: Banner[] = apiBanners.map((banner, index) => ({
          id: banner.id,
          title: `Баннер ${index + 1}`,
          subtitle: 'Специальное предложение',
          buttonText: 'Смотреть',
          image: banner.image,
          link: '#menu'
        }));
        setBanners(formattedBanners);
      } catch (error) {
        console.error('Ошибка загрузки баннеров:', error);
        // Fallback баннеры
    setBanners([
      {
        id: '1',
        title: 'Добро пожаловать в ресторан "Форель"',
        subtitle: 'Откройте для себя изысканную кухню',
        buttonText: 'Смотреть меню',
        image: '/banners/banner1.png',
        link: '#menu'
          }
        ]);
      }
    };

    loadBanners();
  }, []);

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
            setCarouselStates(prev => ({
              ...prev,
              [itemId]: (prev[itemId] || 0 + 1) % item.images!.length
            }));
          }, 3000);
        }
      }
    });

    return () => {
      Object.values(intervals).forEach(interval => clearInterval(interval));
    };
  }, [hoveredItems, menuData]);

  // Загрузка меню из API
  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        
        // Загружаем категории и меню из API
        const [categoriesData, apiMenuData] = await Promise.all([
          apiService.getActiveCategories(),
          apiService.getMenu()
        ]);
        
        // Преобразуем данные API в формат компонента
        const categories: MenuCategory[] = categoriesData.map(category => ({
          id: category.id,
          name: category.name_ru,
          categoryImage: category.image || '/categories/default.jpg',
          items: []
        }));

        // Распределяем блюда по категориям
        apiMenuData.forEach((apiItem: ApiMenuItem) => {
          const category = categories.find(cat => cat.id === apiItem.category_id);
          if (category) {
            // Выбираем правильный язык для названия и описания
            const name = apiItem[`name_${language}` as keyof ApiMenuItem] as string || apiItem.name_ru;
            const description = apiItem[`description_${language}` as keyof ApiMenuItem] as string || apiItem.description_ru;
            
            category.items.push({
              id: apiItem.id,
              name: name,
              description: description,
              price: apiItem.price,
              image: apiItem.image,
              images: [apiItem.image] // Пока используем одно изображение
            });
          }
        });

        setMenuData(categories);
        
        // Устанавливаем первую категорию как выбранную
        if (categories.length > 0 && categories[0].items.length > 0) {
          setSelectedCategory(categories[0].id);
        }
      } catch (err) {
        console.error('Ошибка загрузки меню:', err);
        setError('Ошибка загрузки меню');
      } finally {
        setIsLoading(false);
      }
    }

    load();
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

  const getCartItemQuantity = (id: string) => {
    const cartItem = cart.find(item => item.item.id === id);
    return cartItem ? cartItem.quantity : 0;
  };

  const currentCategory = menuData.find(cat => cat.id === selectedCategory);

  // Обработчики для карусели
  const handleMouseEnter = (itemId: string) => {
    setHoveredItems(prev => ({ ...prev, [itemId]: true }));
  };

  const handleMouseLeave = (itemId: string) => {
    setHoveredItems(prev => ({ ...prev, [itemId]: false }));
  };

  const handleCarouselClick = (itemId: string, direction: 'prev' | 'next') => {
    const item = menuData
      .flatMap(cat => cat.items)
      .find(item => item.id === itemId);
    
    if (item && item.images) {
      setCarouselStates(prev => {
        const currentIndex = prev[itemId] || 0;
        const newIndex = direction === 'next' 
          ? (currentIndex + 1) % item.images!.length
          : (currentIndex - 1 + item.images!.length) % item.images!.length;
        return { ...prev, [itemId]: newIndex };
      });
    }
  };

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
        <div className="relative h-40 overflow-hidden rounded-xl">
          <div className="flex transition-all duration-500" style={{ transform: `translateX(-${currentPromoIndex * 100}%)` }}>
            {banners.map(b => (
              <div key={b.id} className="w-full h-40 flex-shrink-0 relative">
                <ImageWithFallback
                  src={b.image}
                  alt={b.title}
                  className="w-full h-40 object-cover"
                />
              </div>
            ))}
          </div>
          {/* Dots */}
          {banners.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
              {banners.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i === currentPromoIndex ? 'bg-white' : 'bg-white/50'}`} />
              ))}
            </div>
          )}
        </div>
      )}

     {/* Категории — адаптивная ширина и выравнивание */}
<div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-white">
  <div className="flex overflow-x-auto lg:overflow-visible gap-4 pb-2 px-4 lg:px-8 flex-nowrap lg:flex-wrap justify-start lg:justify-center max-w-screen-2xl mx-auto">
    {menuData.map((cat) => (
      <div
        key={cat.id}
        className={`flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105 ${
          selectedCategory === cat.id ? 'text-amber-600' : 'text-gray-600'
        }`}
        onClick={() => setSelectedCategory(cat.id)}
      >
        <div
          className={`w-16 h-16 rounded-full overflow-hidden border-2 ${
            selectedCategory === cat.id ? 'border-amber-500' : 'border-gray-300'
          }`}
        >
          <ImageWithFallback
            src={cat.categoryImage || `/categories/${cat.id}.jpg`}
            alt={cat.name}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-xs mt-1 text-center max-w-[64px]">{cat.name}</span>
      </div>
    ))}
  </div>
</div>

      {/* Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCategory?.items.map((item, index) => {
          const quantity = getCartItemQuantity(item.id);
          const currentImageIndex = carouselStates[item.id] || 0;
          const images = item.images || [item.image];
          const isHovered = hoveredItems[item.id];
          
          return (
            <Card 
              key={item.id} 
              className="overflow-hidden shadow-sm border-amber-100 rounded-2xl hover:shadow-lg transition-all duration-300 group animate-on-scroll"
              style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={() => handleMouseLeave(item.id)}
            >
              <CardContent className="p-0">
                <div className="flex flex-col">
                  
                  {/* Фото сверху с каруселью */}
                  <div className="relative w-full h-64 flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 overflow-hidden">
                    {/* Карусель изображений */}
                    <div className="relative w-full h-full">
                      {images.map((image, imgIndex) => (
                        <div
                          key={imgIndex}
                          className={`absolute inset-0 transition-opacity duration-500 ${
                            imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
                          }`}
                        >
                          <ImageWithFallback
                            src={image}
                            alt={`${item.name} - фото ${imgIndex + 1}`}
                            className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                          />
                        </div>
                      ))}
                      
                      {/* Навигационные стрелки (показываются при наведении) */}
                      {images.length > 1 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCarouselClick(item.id, 'prev');
                            }}
                            className={`absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 ${
                              isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCarouselClick(item.id, 'next');
                            }}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-all duration-300 ${
                              isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {/* Индикаторы слайдов */}
                      {images.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {images.map((_, imgIndex) => (
                            <div
                              key={imgIndex}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                imgIndex === currentImageIndex 
                                  ? 'bg-white' 
                                  : 'bg-white/50 hover:bg-white/75'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Контент под фото */}
                  <div className="p-4 flex flex-col">
                    
                    {/* Название и цена */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 leading-tight text-lg">
                        {item.name}
                      </h3>
                      <span className="shrink-0 rounded-xl px-3 py-1 text-sm font-semibold text-[#1B1B1B] shadow-sm" style={{ background: "linear-gradient(90deg,#FDCB6F 0%,#FDCE78 3%,#FDD891 9%,#FEE9BA 16%,#FFECC1 18%,#FEE5B1 20%,#FEDB99 25%,#FDD486 31%,#FDCF78 37%,#FDCB71 46%,#FDCB6F 62%,#FBC96E 77%,#F4C36C 82%,#E8B868 86%,#D7A962 89%,#C1955B 92%,#A67C52 94%,#AB8153 95%,#BC9059 97%,#D7A962 98%,#FDCB6F 100%)", }}>
                      {item.price} TJS
                      </span>
                    </div>

                    {/* Описание */}
                    <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
                      {item.description}
                    </p>

                    {/* Кнопки */}
                    <div className="flex items-center justify-end">
                      {quantity > 0 ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, Math.max(0, quantity - 1))}
                            className="h-8 w-8 p-0 border-amber-200 hover:bg-amber-50 rounded-xl"
                          >
                            <Minus className="h-4 w-4 text-amber-800" />
                          </Button>
                          <span className="w-8 text-center font-semibold text-amber-800">
                            {quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, quantity + 1)}
                            className="h-8 w-8 p-0 border-amber-200 hover:bg-amber-50 rounded-xl"
                          >
                            <Plus className="h-4 w-4 text-amber-800" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => addToCart(item)}
                          className="rounded-xl px-4 py-2 text-sm font-medium text-[#1B1B1B] shadow-sm 
                                     transition-transform active:scale-95"
                          style={{ background: "linear-gradient(90deg,#FDCB6F 0%,#FDCE78 3%,#FDD891 9%,#FEE9BA 16%,#FFECC1 18%,#FEE5B1 20%,#FEDB99 25%,#FDD486 31%,#FDCF78 37%,#FDCB71 46%,#FDCB6F 62%,#FBC96E 77%,#F4C36C 82%,#E8B868 86%,#D7A962 89%,#C1955B 92%,#A67C52 94%,#AB8153 95%,#BC9059 97%,#D7A962 98%,#FDCB6F 100%)", }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {translations.addToCart}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
