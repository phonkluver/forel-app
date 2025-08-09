import { useState, useEffect } from 'react';
import { apiClient, type CartItem, type MenuItem } from '../utils/mockData';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Загрузка корзины из localStorage при инициализации
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('forel-cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart);
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке корзины:', error);
      setCart([]);
    }
  }, []);

  // Сохранение корзины в localStorage и синхронизация с сервером
  useEffect(() => {
    try {
      localStorage.setItem('forel-cart', JSON.stringify(cart));
      
      // Синхронизация с сервером только если корзина не пуста
      if (cart.length > 0) {
        syncCartWithServer(cart);
      }
    } catch (error) {
      console.error('Ошибка при сохранении корзины:', error);
    }
  }, [cart]);

  // Синхронизация корзины с сервером
  const syncCartWithServer = async (cartData: CartItem[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await apiClient.syncCart(cartData);
      
      if (!response.success && response.error) {
        console.log('Предупреждение синхронизации:', response.error);
        // Не показываем ошибку пользователю, так как это фоновая операция
      }
    } catch (error) {
      console.error('Ошибка синхронизации корзины:', error);
      // Не устанавливаем ошибку для пользователя
    } finally {
      setIsLoading(false);
    }
  };

  // Добавление товара в корзину
  const addToCart = (item: MenuItem) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        const newCartItem: CartItem = {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          image: item.image
        };
        return [...currentCart, newCartItem];
      }
    });
  };

  // Удаление товара из корзины
  const removeFromCart = (id: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
  };

  // Обновление количества товара
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  // Увеличение количества товара
  const increaseQuantity = (id: string) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Уменьшение количества товара
  const decreaseQuantity = (id: string) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Очистка корзины
  const clearCart = () => {
    setCart([]);
    try {
      localStorage.removeItem('forel-cart');
    } catch (error) {
      console.error('Ошибка при очистке корзины:', error);
    }
  };

  // Получение общей стоимости корзины
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Получение количества товаров в корзине
  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Получение стоимости доставки
  const getDeliveryFee = (deliveryArea: 'city' | 'out_of_city' = 'city') => {
    if (deliveryArea === 'city') return 20;
    if (deliveryArea === 'out_of_city') return -1;
    return 20;
  };

  // Получение итоговой стоимости с доставкой
  const getFinalTotal = (deliveryArea: 'city' | 'out_of_city' = 'city') => {
    const subtotal = getCartTotal();
    const deliveryFee = getDeliveryFee(deliveryArea);
    return deliveryFee > 0 ? subtotal + deliveryFee : subtotal;
  };

  return {
    cart,
    isLoading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getDeliveryFee,
    getFinalTotal
  };
}