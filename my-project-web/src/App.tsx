import { useState, useEffect } from 'react';
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
import { useLanguage } from './hooks/useLanguage';
import { useCart } from './hooks/useCart';
import { Page, createNavigationItems } from './config/navigation';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { translations } = useLanguage();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartItemsCount, getCartTotal, getDeliveryFee, getFinalTotal } = useCart();

  const navigationItems = createNavigationItems(translations);
  const cartItemsCount = getCartItemsCount();

  // Проверяем URL для админки
  const isAdminPage = window.location.pathname === '/admin';

  // Wrapper функция для типовой совместимости
  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
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
            getFinalTotal={getFinalTotal}
          />
        );
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Если это админка, показываем только админ-панель
  if (isAdminPage) {
    return <AdminPanel />;
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