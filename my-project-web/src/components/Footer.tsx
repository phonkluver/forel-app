import React from 'react';
import { MapPin, Phone, Clock, Instagram, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../hooks/useLanguage';
import { Page } from '../config/navigation';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
}

export function Footer({ setCurrentPage }: FooterProps) {
  const { translations } = useLanguage();

  // Получаем логотип из localStorage или используем дефолтный
  const getRestaurantLogo = () => {
    const savedLogo = localStorage.getItem('forel_restaurant_logo');
    return savedLogo || null;
  };

  const [restaurantLogo, setRestaurantLogo] = React.useState<string | null>(getRestaurantLogo());

  // Слушаем изменения в localStorage для обновления логотипа
  React.useEffect(() => {
    const handleStorageChange = () => {
      const newLogo = localStorage.getItem('forel_restaurant_logo');
      setRestaurantLogo(newLogo);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <footer className="bg-gray-900 text-white pt-12 sm:pt-16 pb-6 sm:pb-8 mt-12 sm:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 mb-6 sm:mb-0">
  <div
    className="w-48 h-32 sm:w-60 sm:h-40 overflow-hidden cursor-pointer transform transition-transform duration-200"
    onClick={() => setCurrentPage('home')}
  >
    <ImageWithFallback
      src={restaurantLogo || '/favicon.png'}
      alt="Restaurant Logo"
      className="w-full h-full object-contain"
    />
  </div>
            
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 sm:mb-6 text-white text-base sm:text-lg">{translations.quickLinks}</h4>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <button
                  onClick={() => setCurrentPage('home')}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  {translations.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('menu')}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  {translations.menu}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('reservations')}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  {translations.reservations}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('wedding')}
                  className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                >
                  {translations.weddingHall}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4 sm:mb-6 text-white text-base sm:text-lg">{translations.contactUs}</h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm">{translations.khujand}</span>
              </li>
              <li className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
                  <div className="text-gray-300 text-xs sm:text-sm">
                    {translations.deliveryLabel}: {translations.phoneDelivery}
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3 ml-6">
                  <div className="text-gray-300 text-xs sm:text-sm">
                    {translations.reservationMade}: {translations.phoneReservation}
                  </div>
                </div>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm">info@forelrest.com</span>
              </li>
              <li className="flex items-center space-x-2 sm:space-x-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500 flex-shrink-0" />
                <span className="text-gray-300 text-xs sm:text-sm">{translations.workingHours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 sm:pt-8">
          <div className="flex justify-center items-center">
            <p className="text-gray-400 text-xs sm:text-sm text-center px-2">
              &copy; 2025 {translations.forelRestaurant}. {translations.allRightsReserved}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}