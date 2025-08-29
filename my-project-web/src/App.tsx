import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import { useLanguage } from './hooks/useLanguage';
import { useCart } from './hooks/useCart';
import { Page, createNavigationItems } from './config/navigation';
import './App.css';

export default function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { translations } = useLanguage();
  const { cart, addToCart, updateQuantity, removeFromCart, clearCart, getCartItemsCount, getCartTotal, getDeliveryFee, getFinalTotal } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = createNavigationItems(translations);
  const cartItemsCount = getCartItemsCount();

  // Определяем текущую страницу на основе URL
  const getCurrentPage = (): Page => {
    const path = location.pathname;
    switch (path) {
      case '/':
      case '/home':
        return 'home';
      case '/menu':
        return 'menu';
      case '/about':
        return 'about';
      case '/contact':
        return 'contact';
      case '/reservations':
        return 'reservations';
      case '/wedding':
        return 'wedding';
      case '/cart':
        return 'cart';
      case '/checkout':
        return 'checkout';
      default:
        return 'home';
    }
  };

  const currentPage = getCurrentPage();

  // Функция для навигации
  const handleNavigate = (page: Page) => {
    switch (page) {
      case 'home':
        navigate('/');
        break;
      case 'menu':
        navigate('/menu');
        break;
      case 'about':
        navigate('/about');
        break;
      case 'contact':
        navigate('/contact');
        break;
      case 'reservations':
        navigate('/reservations');
        break;
      case 'wedding':
        navigate('/wedding');
        break;
      case 'cart':
        navigate('/cart');
        break;
      case 'checkout':
        navigate('/checkout');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        cartItemsCount={cartItemsCount}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        navigationItems={navigationItems}
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/home" element={<HomePage onNavigate={handleNavigate} />} />
          <Route 
            path="/menu" 
            element={
              <MenuComponent
                addToCart={addToCart}
                cart={cart}
                updateQuantity={updateQuantity}
              />
            } 
          />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/wedding" element={<WeddingHallPage />} />
          <Route 
            path="/cart" 
            element={
              <CartComponent
                cart={cart}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
                onCheckout={() => handleNavigate('checkout')}
                getCartTotal={getCartTotal}
                getDeliveryFee={getDeliveryFee}
                getFinalTotal={getFinalTotal}
              />
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <CheckoutComponent
                cart={cart}
                clearCart={clearCart}
                onBack={() => handleNavigate('cart')}
                getCartTotal={getCartTotal}
                getDeliveryFee={getDeliveryFee}
                getFinalTotal={getFinalTotal}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer setCurrentPage={handleNavigate} />
    </div>
  );
}