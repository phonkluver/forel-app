import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { MenuComponent } from './components/MenuComponent';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { ReservationsPage } from './components/ReservationsPage';
import { WeddingHallPage } from './components/WeddingHallPage';
import { CartComponent } from './components/CartComponent';
import { CheckoutComponent } from './components/CheckoutComponent';
import { AdminPanel } from './components/AdminPanel';
import { AdminAuth } from './components/admin/AdminAuth';
import { useLanguage } from './hooks/useLanguage';
import { useCart } from './hooks/useCart';
import { createNavigationItems, Page } from './config/navigation';
import { apiService } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { translations } = useLanguage();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartItemsCount, getCartTotal, getDeliveryFee, getTax, getFinalTotal } = useCart();
  
  const navigationItems = createNavigationItems(translations);
  const cartItemsCount = getCartItemsCount();

  // Проверка URL для админки
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  // Проверка аутентификации при загрузке
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isValid = await apiService.verifyToken();
        setIsAdminAuthenticated(isValid);
      } catch (error) {
        setIsAdminAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Wrapper функция для типовой совместимости
  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    
    // Обновляем URL для админки
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (page === 'home') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleAuthSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleLogout = () => {
    apiService.logout();
    setIsAdminAuthenticated(false);
    setCurrentPage('home');
    window.history.pushState({}, '', '/');
  };

  const renderCurrentPage = () => {
    // Проверяем, является ли текущая страница админкой
    if (currentPage === 'admin') {
      if (isCheckingAuth) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        );
      }

      if (!isAdminAuthenticated) {
        return <AdminAuth onAuthSuccess={handleAuthSuccess} />;
      }

      return <AdminPanel />;
    }

    // Обычные страницы
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'menu':
        return (
          <MenuComponent
            addToCart={addToCart}
            cart={cart}
            updateQuantity={updateQuantity}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;
      case 'reservations':
        return <ReservationsPage />;
      case 'wedding':
        return <WeddingHallPage />;
      case 'cart':
        return (
          <CartComponent
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            onCheckout={() => setCurrentPage('checkout')}
            getCartTotal={getCartTotal}
            getDeliveryFee={getDeliveryFee}
            getTax={getTax}
            getFinalTotal={getFinalTotal}
          />
        );
      case 'checkout':
        return (
          <CheckoutComponent
            cart={cart}
            clearCart={clearCart}
            onBack={() => setCurrentPage('cart')}
            getCartTotal={getCartTotal}
            getDeliveryFee={getDeliveryFee}
            getTax={getTax}
            getFinalTotal={getFinalTotal}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Не показываем Header и Footer для админки
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen">
        {isAdminAuthenticated && (
          <div className="bg-gray-800 text-white p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <h1 className="text-xl font-bold">Админ-панель</h1>
              <div className="flex gap-4">
                <button
                  onClick={() => handleNavigate('home')}
                  className="text-white hover:text-gray-300"
                >
                  Вернуться на сайт
                </button>
                <button
                  onClick={handleLogout}
                  className="text-white hover:text-gray-300"
                >
                  Выйти
                </button>
              </div>
            </div>
          </div>
        )}
        <main className="flex-grow">
          {renderCurrentPage()}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        cartItemsCount={cartItemsCount}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        navigationItems={navigationItems}
      />
      <main className="flex-grow">
        {renderCurrentPage()}
      </main>
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}