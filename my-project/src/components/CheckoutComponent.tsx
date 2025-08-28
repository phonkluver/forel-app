import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Check, User, Phone, Package, Truck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useLanguage } from '../hooks/useLanguage';
import { telegramService } from '../utils/telegram';

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
    comment: '',
    payment_method: 'cash' as 'card' | 'cash'
  });
  const [deliveryArea, setDeliveryArea] = useState<'city' | 'out_of_city'>('city');

  // Инициализация данных пользователя из Telegram и сохраненного адреса
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const user = window.Telegram.WebApp.initDataUnsafe?.user;
      if (user) {
        setFormData(prev => ({
          ...prev,
          name: `${user.first_name} ${user.last_name || ''}`.trim()
        }));
      }
      
      // Загружаем сохраненный адрес из localStorage
      const savedAddress = localStorage.getItem('userDeliveryAddress');
      if (savedAddress) {
        setFormData(prev => ({
          ...prev,
          address: savedAddress
        }));
      }
    }
  }, []);

  // Настройка Telegram MainButton
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const mainButton = window.Telegram.WebApp.MainButton;
      
      if (!orderPlaced) {
        mainButton.setParams({
          text: `${translations.placeOrder} • ${
            formData.delivery_method === 'delivery' && deliveryArea === 'out_of_city' 
              ? 'Договорная' 
              : formatPrice(formData.delivery_method === 'delivery' ? getFinalTotal() : getCartTotal())
          }`,
          color: '#FDCB6F',
          text_color: '#FFFFFF',
          is_active: true,
          is_visible: true
        });
        
        mainButton.onClick(handleSubmit);
        
        return () => {
          mainButton.offClick(handleSubmit);
          mainButton.hide();
        };
      } else {
        mainButton.hide();
      }
    }
  }, [orderPlaced, formData, deliveryArea, translations, getFinalTotal]);

  const formatPrice = (price: number) => {
    return `${price} TJS`;
  };

  const handleSubmit = async () => {
    // Валидация формы
    if (!formData.name.trim()) {
      setError('Введите ваше имя');
      return;
    }
    
    if (!formData.phone.trim()) {
      setError('Введите номер телефона');
      return;
    }
    
    if (formData.delivery_method === 'delivery' && !formData.address.trim()) {
      setError('Введите адрес доставки');
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
        items: cart.filter(item => item && item.name && item.price).map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        total: getFinalTotal()
      };

      const telegramSuccess = await telegramService.sendOrderToTelegram(orderData);
      
      if (telegramSuccess) {
        setOrderId(newOrderId);
        setOrderPlaced(true);
        clearCart();
        
        // Отправка haptic feedback
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
        }
      } else {
        setError('Ошибка при отправке заказа');
      }
    } catch (error) {
      console.error('Ошибка при оформлении заказа:', error);
      setError('Ошибка соединения с сервером');
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
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-20 h-20 golden-gradient rounded-full flex items-center justify-center mb-4">
          <Check className="h-10 w-10 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{translations.orderConfirmed}</h3>
        <p className="text-gray-600 text-center mb-4">{translations.orderConfirmedDescription}</p>
        <div className="bg-amber-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-amber-800 font-medium">
            {translations.orderConfirmed} #{orderId}
          </p>
        </div>
        <p className="text-sm text-gray-500 mb-8">
          {formData.delivery_method === 'delivery' 
            ? translations.estimatedDelivery 
            : translations.estimatedPickup}
        </p>
        <Button
          className="golden-gradient text-white hover:golden-gradient-hover"
          onClick={() => window.location.reload()}
        >
          {translations.backToMenu}
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-[calc(env(safe-area-inset-bottom,0)+80px)]">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">{translations.checkout}</h2>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-6">
        {/* Contact Information */}
        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-amber-800">
              <User className="h-5 w-5 mr-2" />
              {translations.contactInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">{translations.fullName} *</Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder={translations.enterName}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">{translations.phoneNumber} *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+992 XX XXX XXXX"
                className="mt-1"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Delivery Method */}
        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle className="text-lg flex items-center text-amber-800">
              <Package className="h-5 w-5 mr-2" />
              {translations.deliveryMethod}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={formData.delivery_method}
              onValueChange={(value) => handleInputChange('delivery_method', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="delivery" id="delivery" />
                <Label htmlFor="delivery" className="flex items-center cursor-pointer">
                  <Truck className="h-4 w-4 mr-2 text-amber-600" />
                  {translations.delivery}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pickup" id="pickup" />
                <Label htmlFor="pickup" className="flex items-center cursor-pointer">
                  <Package className="h-4 w-4 mr-2 text-amber-600" />
                  {translations.pickup}
                </Label>
              </div>
            </RadioGroup>
            
            {formData.delivery_method === 'delivery' && (
              <div className="mt-4">
                <Label className="text-sm font-medium text-gray-700">{translations.deliveryZone}</Label>
                <RadioGroup
                  value={deliveryArea}
                  onValueChange={(value) => setDeliveryArea(value as 'city' | 'out_of_city')}
                  className="mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="city" id="city" />
                    <Label htmlFor="city" className="cursor-pointer">
                      {translations.inCityPrice}
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="out_of_city" id="out_of_city" />
                    <Label htmlFor="out_of_city" className="cursor-pointer">
                      {translations.outOfCityPrice}
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delivery Address */}
        {formData.delivery_method === 'delivery' && (
          <Card className="border-amber-100">
            <CardHeader>
              <CardTitle className="text-lg flex items-center text-amber-800">
                <MapPin className="h-5 w-5 mr-2" />
                {translations.deliveryAddress}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">{translations.address} *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder={translations.enterAddress}
                  className="mt-1"
                  rows={3}
                  required
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comment */}
        <Card className="border-amber-100">
          <CardContent className="pt-6">
            <div>
              <Label htmlFor="comment">{translations.comment}</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) => handleInputChange('comment', e.target.value)}
                placeholder={translations.orderComment}
                className="mt-1"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}

        {/* Order Summary */}
        <Card className="border-amber-100">
          <CardHeader>
            <CardTitle className="text-lg text-amber-800">{translations.orderSummary}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">{translations.subtotal}</span>
                <span className="font-medium">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{translations.deliveryFee}</span>
                <span className="font-medium">
                  {formData.delivery_method === 'delivery' ? (
                    deliveryArea === 'city' ? (
                      formatPrice(20)
                    ) : (
                      <span className="text-amber-600">Договорная</span>
                    )
                  ) : (
                    <span className="text-green-600">Бесплатно</span>
                  )}
                </span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between text-lg font-bold text-amber-800">
                  <span>{translations.total}</span>
                  <span>
                    {formData.delivery_method === 'delivery' && deliveryArea === 'out_of_city' ? (
                      <span className="text-amber-600">Договорная</span>
                    ) : (
                      formatPrice(formData.delivery_method === 'delivery' ? getFinalTotal() : getCartTotal())
                    )}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Time */}
        <Card className="border-amber-100">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>
                {formData.delivery_method === 'delivery' 
                  ? translations.estimatedDelivery 
                  : translations.estimatedPickup}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Restaurant Info */}
        <Card className="border-amber-100">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-amber-800 mb-2">{translations.forelRestaurant}</h3>
              <p className="text-sm text-gray-600">{translations.khujand}</p>
              <p className="text-sm text-gray-600">+992 111 30 7777</p>
              <p className="text-sm text-gray-600">{translations.workingHours}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Fallback Button */}
      <div className="mt-8 mb-4">
        <Button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full golden-gradient text-white py-3 hover:golden-gradient-hover"
          size="lg"
        >
          {isLoading ? translations.loading : `${translations.placeOrder} • ${
            formData.delivery_method === 'delivery' && deliveryArea === 'out_of_city' 
              ? 'Договорная' 
              : formatPrice(formData.delivery_method === 'delivery' ? getFinalTotal() : getCartTotal())
          }`}
        </Button>
      </div>
    </div>
  );
}