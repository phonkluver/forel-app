import React from 'react';
import { ShoppingCart, Menu, X, Upload, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../hooks/useLanguage';
import { Page, NavigationItem } from '../config/navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  cartItemsCount: number;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  navigationItems: NavigationItem[];
}

export function Header({
  currentPage,
  setCurrentPage,
  cartItemsCount,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  navigationItems = []
}: HeaderProps) {
  const { translations } = useLanguage();

  // Получаем логотип из localStorage или используем дефолтный
  const getRestaurantLogo = () => {
    const savedLogo = localStorage.getItem('forel_restaurant_logo');
    return savedLogo || null;
  };

  const [restaurantLogo, setRestaurantLogo] = React.useState<string | null>(getRestaurantLogo());

  // Функция для загрузки логотипа
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target?.result as string;
        localStorage.setItem('forel_restaurant_logo', logoUrl);
        setRestaurantLogo(logoUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-amber-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer group" onClick={() => {
            setCurrentPage('home');
            setIsMobileMenuOpen(false);
          }}>
            <div className="relative">
              {restaurantLogo ? (
                <div className="w-32 h-16 sm:w-40 sm:h-20 lg:w-40 lg:h-20 overflow-hidden transform transition-transform duration-200">
                  <ImageWithFallback
                    src={restaurantLogo}
                    alt="Restaurant Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-32 h-16 sm:w-40 sm:h-20 lg:w-40 lg:h-20 overflow-hidden transform transition-transform duration-200">
                  <ImageWithFallback
                    src="/favicon.png"
                    alt="Restaurant Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center space-x-2">
            {navigationItems?.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? 'default' : 'ghost'}
                onClick={() => setCurrentPage(item.id as Page)}
                className={`px-4 sm:px-6 py-2 transition-all duration-200 text-sm sm:text-base ${
                  currentPage === item.id 
                    ? 'golden-gradient text-white hover:golden-gradient-hover shadow-lg' 
                    : 'text-gray-700 hover:text-amber-800 hover:bg-amber-50'
                }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Selector */}
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>

          
            {/* Cart Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentPage('cart');
                setIsMobileMenuOpen(false);
              }}
              className="relative border-amber-200 hover:bg-amber-50 px-2 sm:px-3 lg:px-4 py-1 sm:py-2 transition-all duration-200 hover:shadow-md"
            >
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-amber-800" />
              <span className="hidden lg:inline ml-2">{translations.cart}</span>
              {cartItemsCount > 0 && (
                <Badge className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 flex items-center justify-center text-xs golden-gradient text-white shadow-lg animate-pulse">
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden hover:bg-amber-50 p-2"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 sm:h-6 sm:w-6 text-amber-800" />
              ) : (
                <Menu className="h-5 w-5 sm:h-6 sm:w-6 text-amber-800" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-amber-100 py-4 bg-white">
            <div className="flex flex-col space-y-2">
              {/* Language Selector Mobile */}
              <div className="sm:hidden mb-4 px-2">
                <LanguageSelector />
              </div>
              
              {navigationItems?.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? 'default' : 'ghost'}
                  onClick={() => {
                    setCurrentPage(item.id as Page);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`justify-start transition-all duration-200 text-left px-4 py-3 ${currentPage === item.id 
                    ? 'golden-gradient text-white shadow-lg' 
                    : 'text-gray-700 hover:text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  {item.label}
                </Button>
              ))}
              

            </div>
          </div>
        )}
      </div>
    </header>
  );
}