import * as React from "react";
import { useState, useEffect } from "react";
import { MenuCard } from "./MenuCard";
import { useCart } from "../hooks/useCart";
import { Plus, Minus, Loader2, X, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { apiService } from '../services/api';

// Интерфейсы для меню
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
  categoryImage?: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  link: string;
}
import { AnimatedBlock } from './AnimatedBlock';

interface MenuComponentProps {
  addToCart: (item: MenuItem) => void;
  cart: Array<{ id: string; quantity: number }>;
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

  // Загрузка баннеров
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

  // Функция загрузки меню
  const loadMenu = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const menuData = await apiService.getMenuForTelegram(language);
      
      if (menuData && menuData.length > 0) {
        setMenuData(menuData);
        setSelectedCategory(menuData[0].id);
      } else {
        setError('Меню пусто');
      }
    } catch (error) {
      console.error('Ошибка загрузки меню:', error);
      setError('Ошибка загрузки меню');
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка меню
  useEffect(() => {
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
        <Button onClick={loadMenu} className="golden-gradient text-white">
          {translations.tryAgain}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Promo Banner Slider */}
      <AnimatedBlock className="mb-6" animationType="fade-up">
        <div 
          className="relative h-40 rounded-2xl overflow-hidden shadow-lg cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Слайды */}
          <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentPromoIndex * 100}%)` }}>
            {banners.length > 0 ? (
              banners.map((banner, index) => (
                <div 
                  key={banner.id} 
                  className="w-full h-40 flex-shrink-0 relative cursor-pointer"
                  onClick={() => {
                    if (banner.link) {
                      window.location.href = banner.link;
                    }
                  }}
                >
                  <ImageWithFallback
                    src={banner.image}
                    alt="Промо баннер"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="w-full flex-shrink-0 bg-gray-100" />
            )}
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
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center transition-colors"
              >
                ›
              </button>
              
              {/* Индикаторы слайдов */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPromoIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentPromoIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </AnimatedBlock>

      {/* Category Icons */}
      <AnimatedBlock className="mb-6" animationType="fade-up" delay={200}>
        <div className="flex overflow-x-auto space-x-4 pb-2 scroll-smooth px-2 scrollbar-hide">
          {menuData.map(category => (
            <div
              key={category.id}
              className="flex flex-col items-center space-y-2 cursor-pointer flex-shrink-0"
              onClick={() => setSelectedCategory(category.id)}
            >
              {/* Круглая иконка категории */}
              <div className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-200 flex-shrink-0 bg-gradient-to-br from-amber-50 to-amber-100 ${
                selectedCategory === category.id 
                  ? 'border-amber-500 shadow-lg scale-110' 
                  : 'border-gray-200 hover:border-amber-300'
              }`}>
                <ImageWithFallback
                  src={category.categoryImage || `/categories/${category.id}.jpg`}
                  alt={category.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Название категории */}
              <span className={`text-xs font-medium text-center w-16 truncate ${
                selectedCategory === category.id 
                  ? 'text-amber-600' 
                  : 'text-gray-600'
              }`}>
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </AnimatedBlock>

      {/* Menu Items */}
<div className="space-y-3"> {/* было space-y-4 */}
  {currentCategory?.items.map((item, index) => {
    const cartQuantity = getCartItemQuantity(item.id);

    return (
      <Card 
        key={item.id} 
        className="overflow-hidden shadow-sm border-amber-100 rounded-2xl animate-on-scroll cursor-pointer"
        style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
        onClick={() => {}}
      >
        <CardContent className="p-0">
          {/* Ряд: фото слева тянется на всю высоту */}
          <div className="flex flex-col md:flex-row md:items-stretch">
            {/* Фото */}
            <div 
              className="relative w-full h-40 md:h-auto md:w-40 md:flex-none flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg overflow-hidden"
              onMouseEnter={() => {
                // Убираем hover эффект для упрощения
              }}
              onMouseLeave={() => {
                // Убираем hover эффект для упрощения
              }}
            >
              <ImageWithFallback
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
            </div>

            {/* Контент */}
            <div className="flex-1 p-3 md:p-4 flex flex-col">
              {/* Верхняя строка: заголовок и цена */}
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="font-semibold text-gray-900 leading-tight">
                  {item.name}
                </h3>
                <span
                  className="shrink-0 rounded-xl px-3 py-1 text-sm font-semibold text-[#1B1B1B] shadow-[0_1px_6px_rgba(0,0,0,0.12)]"
                  style={{
                    background:
                      "linear-gradient(90deg,#FDCB6F 0%,#FDCE78 3%,#FDD891 9%,#FEE9BA 16%,#FFECC1 18%,#FEE5B1 20%,#FEDB99 25%,#FDD486 31%,#FDCF78 37%,#FDCB71 46%,#FDCB6F 62%,#FBC96E 77%,#F4C36C 82%,#E8B868 86%,#D7A962 89%,#C1955B 92%,#A67C52 94%,#AB8153 95%,#BC9059 97%,#D7A962 98%,#FDCB6F 100%)",
                  }}
                >
                  {formatPrice(item.price)}
                </span>
              </div>

              {/* Описание + рейтинг */}
              <p className="text-sm text-gray-600 mb-2">
                {item.description}
              </p>
    
              {/* Кнопки (прижаты к низу без лишнего воздуха) */}
              <div className="mt-auto pt-1 flex items-center justify-end">
                {cartQuantity > 0 ? (
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
                ) : (
                  <Button
                    size="sm"
                    onClick={() => addToCart(item)}
                    className="rounded-xl px-4 py-2 text-sm font-medium text-[#1B1B1B] shadow-sm transition-transform active:scale-95"
                    style={{
                      background:
                        "linear-gradient(90deg,#FDCB6F 0%,#FDCE78 3%,#FDD891 9%,#FEE9BA 16%,#FFECC1 18%,#FEE5B1 20%,#FEDB99 25%,#FDD486 31%,#FDCF78 37%,#FDCB71 46%,#FDCB6F 62%,#FBC96E 77%,#F4C36C 82%,#E8B868 86%,#D7A962 89%,#C1955B 92%,#A67C52 94%,#AB8153 95%,#BC9059 97%,#D7A962 98%,#FDCB6F 100%)",
                    }}
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