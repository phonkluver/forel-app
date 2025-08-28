import { useState } from 'react';
import { ArrowLeft, Check, User, Package, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useLanguage } from '../hooks/useLanguage';
import { telegramService } from '../utils/telegramService';

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

interface CheckoutComponentProps {
  cart: CartItem[];
  clearCart: () => void;
  onBack: () => void;
  getFinalTotal: () => number;
  getCartTotal: () => number;
  getDeliveryFee: () => number;
}

export function CheckoutComponent({
  cart,
  clearCart,
  onBack,
  getFinalTotal,
  getCartTotal,
  getDeliveryFee
}: CheckoutComponentProps) {
  const { language, translations } = useLanguage();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    delivery_method: 'delivery' as 'delivery' | 'pickup',
    address: '',
    comment: ''
  });

  const formatPrice = (price: number) => {
    return `${price} TJS`;
  };

  const handleSubmit = async () => {
    // Валидация формы
    if (!formData.name.trim()) {
      setError(translations.enterName || 'Введите ваше имя');
      return;
    }

    if (!formData.phone.trim()) {
      setError(translations.phoneNumber || 'Введите номер телефона');
      return;
    }

    if (formData.delivery_method === 'delivery' && !formData.address.trim()) {
      setError(translations.deliveryAddress || 'Введите адрес доставки');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Генерируем ID заказа
      const newOrderId = 'ORDER-' + Date.now().toString().slice(-6);

      // Отправляем заказ в Telegram
      const orderData = {
        orderId: newOrderId,
        customerName: formData.name,
        customerPhone: formData.phone,
        deliveryMethod: formData.delivery_method,
        address: formData.delivery_method === 'delivery' ? formData.address : undefined,
        comment: formData.comment || undefined,
        items: cart.map(item => ({
          name: item.item.name[language as keyof typeof item.item.name] || item.item.name.ru,
          quantity: item.quantity,
          price: item.item.price
        })),
        total: getFinalTotal()
      };

      const telegramSuccess = await telegramService.sendOrderToTelegram(orderData);

      if (telegramSuccess) {
        setOrderId(newOrderId);
        setOrderPlaced(true);
        clearCart();
      } else {
        setError(translations.error || 'Ошибка при отправке заказа');
      }

    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      setError(translations.error || 'Произошла ошибка при оформлении заказа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              {translations.orderSuccess || 'Заказ успешно оформлен!'}
            </h2>
            <p className="text-green-700 mb-4">
              {translations.orderNumber || 'Номер заказа'}: <span className="font-semibold">{orderId}</span>
            </p>
            <p className="text-green-600 mb-6">
              {translations.orderConfirmedDescription || 'Мы свяжемся с вами в ближайшее время для подтверждения заказа.'}
            </p>
            <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
              {translations.backToMenu || 'Вернуться к меню'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="outline" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {translations.back || 'Назад'}
        </Button>
        <h1 className="text-2xl font-bold">{translations.checkoutTitle || 'Оформление заказа'}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Форма заказа */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {translations.contactInfo || 'Контактная информация'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">{translations.fullName || 'Имя'} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={translations.enterName || 'Введите ваше имя'}
                />
              </div>
              <div>
                <Label htmlFor="phone">{translations.phoneNumber || 'Телефон'} *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+992 XX-XXX-XX-XX"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                {translations.deliveryMethod || 'Способ получения'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.delivery_method}
                onValueChange={(value) => handleInputChange('delivery_method', value)}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery">{translations.delivery2 || 'Доставка'}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup">{translations.pickup || 'Самовывоз'}</Label>
                </div>
              </RadioGroup>

              {formData.delivery_method === 'delivery' && (
                <div className="mt-4">
                  <Label htmlFor="address">{translations.deliveryAddress || 'Адрес доставки'} *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder={translations.deliveryAddress || 'Введите адрес доставки'}
                    rows={3}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{translations.comment || 'Комментарий к заказу'}</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                placeholder={translations.comment || 'Дополнительные пожелания...'}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Сводка заказа */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="h-5 w-5 mr-2" />
                {translations.orderSummary || 'Ваш заказ'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((cartItem) => (
                  <div key={cartItem.item.id} className="flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <img
                        src={cartItem.item.images[0] || '/images/default-dish.jpg'}
                        alt={cartItem.item.name[language as keyof typeof cartItem.item.name] || cartItem.item.name.ru}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = '/loading.png';
                        }}
                      />
                      <div>
                        <p className="font-medium">{cartItem.item.name[language as keyof typeof cartItem.item.name] || cartItem.item.name.ru}</p>
                        <p className="text-sm text-gray-500">
                          {cartItem.quantity} × {formatPrice(cartItem.item.price)}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold">
                      {formatPrice(cartItem.item.price * cartItem.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mt-4 space-y-2">
                <div className="flex justify-between">
                  <span>{translations.subtotal || 'Сумма'}:</span>
                  <span>{formatPrice(getCartTotal())}</span>
                </div>
                <div className="flex justify-between">
                  <span>{translations.delivery || 'Доставка'}:</span>
                  <span>{formatPrice(getDeliveryFee())}</span>
                </div>

                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>{translations.total || 'Итого'}:</span>
                  <span>{formatPrice(getFinalTotal())}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-4">
                <p className="text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 text-lg golden-gradient text-white hover:golden-gradient-hover"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {translations.processing || 'Оформление заказа...'}
              </div>
            ) : (
              translations.placeOrder || 'Оформить заказ'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}