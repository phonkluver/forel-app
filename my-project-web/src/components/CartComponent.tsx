import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { useLanguage } from '../hooks/useLanguage';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Локальные типы данных - совместимые с useCart
interface MenuItem {
  id: string;
  name: { ru: string; en: string; tj: string; zh: string };
  price: number;
  category: string;
  images: string[];
  isActive: boolean;
}

interface CartItem {
  item: MenuItem;
  quantity: number;
}

interface CartComponentProps {
  cart: CartItem[];
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
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

  const subtotal = getCartTotal();
  const deliveryFee = getDeliveryFee();
  const total = getFinalTotal();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-2">
          {translations.cart}
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2">
          {translations.cartSubtitle}
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {translations.cartEmpty}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6">
            {translations.addItemsToCart}
          </p>
          <Button
            onClick={() => window.history.back()}
            className="golden-gradient text-black hover:golden-gradient-hover px-6 sm:px-8 py-3 sm:py-4"
          >
            {translations.continueShopping}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((cartItem) => {
              const localizedName = cartItem.item.name[language as keyof typeof cartItem.item.name] || cartItem.item.name.ru;
              
              return (
                <Card key={cartItem.item.id} className="border-amber-100">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-24 h-24 sm:h-24 flex-shrink-0">
                        <ImageWithFallback
                          src={cartItem.item.images[0] || '/images/default-dish.jpg'}
                          alt={localizedName}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate text-base sm:text-lg">
                          {localizedName}
                        </h3>

                        <p className="font-bold text-amber-700 text-base sm:text-lg">
                          {cartItem.item.price} TJS
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity - 1)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-amber-200"
                          >
                            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                          
                          <span className="font-medium text-foreground min-w-[24px] sm:min-w-[30px] text-center text-sm sm:text-base">
                            {cartItem.quantity}
                          </span>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(cartItem.item.id, cartItem.quantity + 1)}
                            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-amber-200"
                          >
                            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromCart(cartItem.item.id)}
                          className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="border-amber-100 sticky top-20 sm:top-24">
              <CardHeader className="pb-4">
                <CardTitle className="text-amber-800 text-lg sm:text-xl">{translations.orderSummary}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm sm:text-base">{translations.subtotal}</span>
                  <span className="font-medium text-foreground text-sm sm:text-base">{subtotal} TJS</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm sm:text-base">{translations.delivery}</span>
                  <span className="font-medium text-foreground text-sm sm:text-base">
                    {`${deliveryFee} TJS`}
                  </span>
                </div>
                
                <div className="text-xs sm:text-sm text-amber-700 bg-amber-50 p-3 rounded-lg">
                  {language === 'ru' ? 'Доставка по городу 20 TJS (самовывоз бесплатно). За город - договорная цена.' :
                   language === 'en' ? 'City delivery 20 TJS (pickup free). Out of town - negotiable price.' :
                   'Расонидани шаҳр 20 TJS (гирифтан ройгон). Берун аз шаҳр - нархи келишувӣ.'}
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-base sm:text-lg font-bold">
                  <span className="text-foreground">{translations.total}</span>
                  <span className="text-amber-700">{total} TJS</span>
                </div>
                
                <div className="text-xs text-red-600 bg-white p-2 rounded-lg border border-amber-300">
                  * Цена может отличаться в связи с тем, что точный вес порций может варьироваться
                </div>
                
                <Button
                  onClick={onCheckout}
                  className="w-full golden-gradient text-white hover:golden-gradient-hover py-3 text-sm sm:text-base"
                  size="lg"
                >
                  {translations.checkout}
                </Button>
                
                <Button
                  onClick={() => window.history.back()}
                  variant="outline"
                  className="w-full border-amber-200 text-amber-800 hover:bg-amber-50 text-sm sm:text-base"
                >
                  {translations.continueShopping}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}