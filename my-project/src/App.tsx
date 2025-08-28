import { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ShoppingCart, User, MapPin, Clock, Phone, CalendarDays, Home, UtensilsCrossed } from 'lucide-react';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { MenuComponent } from './components/MenuComponent';
import { CartComponent } from './components/CartComponent';
import { CheckoutComponent } from './components/CheckoutComponent';
import { LanguageSelector } from './components/LanguageSelector';
import { ReservationPage } from './components/ReservationPage';
import { HomePage } from './components/HomePage';
import { AboutUsPage } from './components/AboutUsPage';
import { LanguageSelectionPage } from './components/LanguageSelectionPage';
import { LanguageProvider, useLanguage } from './hooks/useLanguage';
import { useCart } from './hooks/useCart';

type Page = 'language-selection' | 'home' | 'menu' | 'cart' | 'checkout' | 'profile' | 'reservation' | 'about-us';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('language-selection');
  const { language, setLanguage, translations } = useLanguage();
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getDeliveryFee,
    getFinalTotal
  } = useCart();

  // Инициализация Telegram WebApp
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;

      tg.ready();
      tg.expand();

      // Настройка цветов для Telegram WebApp
      tg.setHeaderColor('#ffffff');
      tg.setBackgroundColor('#f9fafb');

      // Включение подтверждения закрытия
      tg.enableClosingConfirmation();

      // Настройка BackButton
      tg.BackButton.onClick(() => {
        if (currentPage === 'checkout') {
          setCurrentPage('cart');
        } else if (currentPage === 'cart') {
          setCurrentPage('menu');
        } else if (currentPage === 'profile') {
          setCurrentPage('menu');
        }
      });

      // Показ/скрытие BackButton
      if (currentPage !== 'menu') {
        tg.BackButton.show();
      } else {
        tg.BackButton.hide();
      }
    }
  }, [currentPage]);

  const cartItemsCount = getCartItemsCount();
  const cartTotal = getCartTotal();

  const handleLanguageSelect = (selectedLanguage: 'ru' | 'en' | 'tj' | 'zh') => {
    setLanguage(selectedLanguage);
    setHasSelectedLanguage(true);
    setCurrentPage('home');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'language-selection':
        return <LanguageSelectionPage onLanguageSelect={handleLanguageSelect} />;
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'menu':
        return (
          <MenuComponent
            addToCart={addToCart}
            cart={cart}
            updateQuantity={updateQuantity}
          />
        );
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
            getFinalTotal={getFinalTotal}
            getCartTotal={getCartTotal}
            getDeliveryFee={getDeliveryFee}
          />
        );
      case 'profile':
        return <ProfileComponent />;
      case 'reservation':
        return <ReservationPage />;
      case 'about-us':
        return <AboutUsPage onBack={() => setCurrentPage('home')} />;
      default:
        return (
          <MenuComponent
            addToCart={addToCart}
            cart={cart}
            updateQuantity={updateQuantity}
          />
        );
    }
  };

  // Если язык не выбран, показываем только страницу выбора языка
  if (!hasSelectedLanguage) {
    return <LanguageSelectionPage onLanguageSelect={handleLanguageSelect} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <a href="/" className="flex items-center space-x-2">
                <img
                  src="/favicon.png"
                  alt="Форель"
                  className="h-10 w-auto md:h-11"
                />
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSelector />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage('cart')}
                className="relative border border-primary/20 hover:golden-gradient hover:text-white"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs golden-gradient text-white">
                    {cartItemsCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      <div className="max-w-md mx-auto px-4 py-3 bg-white border-b border-amber-100">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="gold-text">
              <Clock className="h-4 w-4" />
            </div>
            <span>{translations.workingHours}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="gold-text">
              <MapPin className="h-4 w-4" />
            </div>
            <span>{translations.khujand}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="gold-text">
              <Phone className="h-4 w-4" />
            </div>
            <span>+992 {translations.deliveryPhone}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-md mx-auto pb-20">
        {renderPage()}
      </main>

      {/* Fixed Cart Bar */}
      {cartItemsCount > 0 && currentPage === 'menu' && (
        <div className="fixed bottom-20 left-0 right-0 z-40">
          <div className="max-w-md mx-auto px-4">
            <Button
              onClick={() => setCurrentPage('cart')}
              className="w-full golden-gradient text-white py-3 shadow-lg hover:golden-gradient-hover"
              size="lg"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {cartItemsCount} {translations.items} • {cartTotal} TJS
            </Button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto px-4 py-3 pb-[calc(env(safe-area-inset-bottom,0)+25px)]">
          <div className="flex justify-around items-center">
            <button
              onClick={() => setCurrentPage('home')}
              className="flex flex-col items-center justify-center w-14 gap-1"
            >
              <Home
                className={currentPage === 'home' ? 'gold-text h-6 w-6' : 'h-6 w-6 text-gray-400'}
              />
              <span className={`text-xs font-medium ${currentPage === 'home' ? 'gold-text' : 'text-gray-500'
                }`}>
                {translations.restaurant}
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('menu')}
              className="flex flex-col items-center justify-center w-14 gap-1"
            >
              <UtensilsCrossed
                className={currentPage === 'menu' ? 'gold-text h-6 w-6' : 'h-6 w-6 text-gray-400'}
              />
              <span className={`text-xs font-medium ${currentPage === 'menu' ? 'gold-text' : 'text-gray-500'
                }`}>
                {translations.menu}
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('cart')}
              className="flex flex-col items-center justify-center w-14 gap-1 relative"
            >
              <ShoppingCart
                className={currentPage === 'cart' ? 'gold-text h-6 w-6' : 'h-6 w-6 text-gray-400'}
              />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
              <span className={`text-xs font-medium ${currentPage === 'cart' ? 'gold-text' : 'text-gray-500'
                }`}>
                {translations.cart}
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('reservation')}
              className="flex flex-col items-center justify-center w-14 gap-1"
            >
              <CalendarDays
                className={currentPage === 'reservation' ? 'gold-text h-6 w-6' : 'h-6 w-6 text-gray-400'}
              />
              <span className={`text-xs font-medium ${currentPage === 'reservation' ? 'gold-text' : 'text-gray-500'
                }`}>
                {translations.reservation}
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('profile')}
              className="flex flex-col items-center justify-center w-14 gap-1"
            >
              <User
                className={currentPage === 'profile' ? 'gold-text h-6 w-6' : 'h-6 w-6 text-gray-400'}
              />
              <span className={`text-xs font-medium ${currentPage === 'profile' ? 'gold-text' : 'text-gray-500'
                }`}>
                {translations.profile}
              </span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Компонент профиля
function ProfileComponent() {
  const { translations } = useLanguage();
  const [telegramUser, setTelegramUser] = useState<any>(null);
  const [savedAddress, setSavedAddress] = useState<string>('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [tempAddress, setTempAddress] = useState<string>('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      setTelegramUser(user);

      // Загружаем сохраненный адрес из localStorage
      const saved = localStorage.getItem('userDeliveryAddress');
      if (saved) {
        setSavedAddress(saved);
        setTempAddress(saved);
      }
    }
  }, []);

  const handleSaveAddress = () => {
    if (tempAddress.trim()) {
      setSavedAddress(tempAddress.trim());
      localStorage.setItem('userDeliveryAddress', tempAddress.trim());
      setIsEditingAddress(false);
    }
  };

  const handleCancelEdit = () => {
    setTempAddress(savedAddress);
    setIsEditingAddress(false);
  };

  return (
    <div className="p-4 pb-20">
      <Card className="border-amber-100">
        <CardHeader>
          <CardTitle className="text-amber-800">{translations.profile}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Информация о пользователе */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 golden-gradient rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {telegramUser
                    ? `${telegramUser.first_name} ${telegramUser.last_name || ''}`.trim()
                    : (telegramUser?.username ? `@${telegramUser.username}` : 'Гость')}
                </p>
                <p className="text-sm text-gray-500">
                  {telegramUser?.username ? `@${telegramUser.username}` : 'Пользователь Telegram'}
                </p>
                {telegramUser?.id && (
                  <p className="text-xs text-gray-400">ID: {telegramUser.id}</p>
                )}
              </div>
            </div>

            {/* Адрес доставки */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-amber-600" />
                  <p className="text-sm font-medium text-amber-800">{translations.deliveryAddress}</p>
                </div>
                {!isEditingAddress && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingAddress(true)}
                    className="text-amber-600 hover:text-amber-700"
                  >
                    {translations.change}
                  </Button>
                )}
              </div>

              {isEditingAddress ? (
                <div className="mt-3 space-y-2">
                  <Input
                    value={tempAddress}
                    onChange={(e) => setTempAddress(e.target.value)}
                    placeholder={translations.enterAddress}
                    className="text-sm"
                  />
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={handleSaveAddress}
                      className="golden-gradient hover:golden-gradient-hover text-white"
                    >
                      {translations.save}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      {translations.cancel}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2">
                  {savedAddress ? (
                    <p className="text-sm text-gray-700">{savedAddress}</p>
                  ) : (
                    <p className="text-xs text-gray-500">{translations.addressNotSpecified}</p>
                  )}
                </div>
              )}
            </div>

            {/* История заказов */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">{translations.orderHistory}</p>
              </div>
              <p className="text-xs text-gray-600 mt-1">{translations.viewPreviousOrders}</p>
            </div>

            {/* Поддержка */}
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-amber-600" />
                <p className="text-sm font-medium text-amber-800">{translations.support}</p>
              </div>
              <p className="text-xs text-gray-600 mt-1">+992 {translations.deliveryPhone}</p>
            </div>

            {/* Информация о приложении */}
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center space-x-2">
                <UtensilsCrossed className="h-4 w-4 text-gray-600" />
                <p className="text-sm font-medium text-gray-800">{translations.aboutApp}</p>
              </div>
              <p className="text-xs text-gray-600 mt-1">{translations.version}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  );
}