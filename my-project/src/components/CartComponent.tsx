import React from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AnimatedBlock } from './AnimatedBlock';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartComponentProps {
  cart: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  onCheckout: () => void;
  getCartTotal: () => number;
  getDeliveryFee: () => number;
  getFinalTotal: () => number;
}

export function CartComponent({
  cart,
  updateQuantity,
  removeFromCart,
  onCheckout,
  getCartTotal,
  getDeliveryFee,
  getFinalTotal
}: CartComponentProps) {
  const { language, translations } = useLanguage();

  // Получение локализованного названия блюда
  const getLocalizedName = (item: CartItem) => {
    // Для таджикского языка названия блюд остаются на русском
    if (language === 'tj') {
      return item.name;
    }
    
    if (language === 'en') {
      const englishNames: { [key: string]: string } = {
        'Форель на гриле': 'Grilled Trout',
        'Стейк из лосося': 'Salmon Steak',
        'Дорадо в соли': 'Salt-Baked Dorado',
        'Морской окунь': 'Sea Bass',
        'Паэлья с морепродуктами': 'Seafood Paella',
        'Севиче из креветок': 'Shrimp Ceviche',
        'Тартар из тунца': 'Tuna Tartare',
        'Салат с форелью': 'Trout Salad',
        'Цезарь с креветками': 'Caesar with Shrimp',
        'Свежевыжатый сок': 'Fresh Juice',
        'Лимонад': 'Lemonade'
      };
      return englishNames[item.name] || item.name;
    }
    
    return item.name;
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return `${price} TJS`;
  };

  const totalPrice = getCartTotal();
  const deliveryFee = getDeliveryFee();
  const finalTotal = getFinalTotal();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 pb-[calc(env(safe-area-inset-bottom,0)+80px)]">
        <AnimatedBlock animationType="scale">
          <ShoppingBag className="h-24 w-24 text-amber-300 mb-4" />
        </AnimatedBlock>
        <AnimatedBlock animationType="fade-up" delay={200}>
          <h3 className="text-xl font-medium text-gray-900 mb-2">{translations.emptyCart}</h3>
        </AnimatedBlock>
        <AnimatedBlock animationType="fade-up" delay={300}>
          <p className="text-gray-500 text-center mb-8">{translations.emptyCartDescription}</p>
        </AnimatedBlock>
        <AnimatedBlock animationType="fade-up" delay={400}>
          <Button
            className="golden-gradient text-white hover:golden-gradient-hover"
            onClick={() => window.history.back()}
          >
            {translations.startShopping}
          </Button>
        </AnimatedBlock>
      </div>
    );
  }

  return (
    <div className="p-4 pb-[calc(env(safe-area-inset-bottom,0)+80px)]">
      <AnimatedBlock className="mb-6" animationType="fade-up">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{translations.cart}</h2>
        <p className="text-gray-600">
          {totalItems} {translations.items} • {formatPrice(totalPrice)}
        </p>
      </AnimatedBlock>

      <AnimatedBlock className="space-y-4 mb-6" animationType="fade-up" delay={200}>
        {cart.map((item, index) => (
          <Card 
            key={item.id} 
            className="shadow-sm border-amber-100"
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={item.image}
                    alt={getLocalizedName(item)}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{getLocalizedName(item)}</h4>
                  <p className="text-sm text-gray-500 mt-1">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                    className="h-8 w-8 p-0 border-amber-200 hover:bg-amber-50"
                  >
                    <Minus className="h-4 w-4 text-amber-800" />
                  </Button>
                  <span className="w-8 text-center font-medium text-amber-800">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 p-0 border-amber-200 hover:bg-amber-50"
                  >
                    <Plus className="h-4 w-4 text-amber-800" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="h-8 w-8 p-0 ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </AnimatedBlock>

      {/* Order Summary */}
      <AnimatedBlock>
        <Card className="mb-6 border-amber-100">
          <CardHeader>
            <CardTitle className="text-lg text-amber-800">{translations.orderSummary}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{translations.subtotal}</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{translations.deliveryFee}</span>
                <span className="font-medium">
                  {deliveryFee === -1 ? (
                    <span className="text-amber-600">Договорная</span>
                  ) : (
                    formatPrice(deliveryFee)
                  )}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold text-amber-800">
                  <span>{translations.total}</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedBlock>

      {/* Checkout Button */}
      <AnimatedBlock animationType="fade-up" delay={400}>
        <Button
          onClick={onCheckout}
          className="w-full golden-gradient text-white py-3 hover:golden-gradient-hover"
          size="lg"
        >
          {translations.proceedToCheckout}
        </Button>
      </AnimatedBlock>
    </div>
  );
}