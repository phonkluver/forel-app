import { useState, useEffect } from 'react';

// Локальные типы данных - совместимые с MenuComponent
interface MenuItem {
  id: string;
  name: { ru: string; en: string; tj: string; zh: string };
  price: number;
  category: string;
  images: string[];
  isActive: boolean;
}

// Интерфейс CartItem для совместимости с CartComponent
interface CartItem {
  item: MenuItem;
  quantity: number;
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

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

  // Сохранение корзины в localStorage
  useEffect(() => {
    try {
      localStorage.setItem('forel-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Ошибка при сохранении корзины:', error);
    }
  }, [cart]);

  // Добавление товара в корзину
  const addToCart = (item: MenuItem) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(cartItem => cartItem.item.id === item.id);
      
      if (existingItem) {
        return currentCart.map(cartItem =>
          cartItem.item.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        const newCartItem: CartItem = {
          item: item,
          quantity: 1
        };
        return [...currentCart, newCartItem];
      }
    });
  };

  // Удаление товара из корзины
  const removeFromCart = (id: string) => {
    setCart(currentCart => currentCart.filter(item => item.item.id !== id));
  };

  // Обновление количества товара
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(currentCart =>
        currentCart.map(item =>
          item.item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Увеличение количества товара
  const increaseQuantity = (id: string) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Уменьшение количества товара
  const decreaseQuantity = (id: string) => {
    setCart(currentCart =>
      currentCart.map(item =>
        item.item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity - 1) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Очистка корзины
  const clearCart = () => {
    setCart([]);
  };

  // Получение общей суммы корзины
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  };

  // Получение количества товаров в корзине
  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Получение стоимости доставки
  const getDeliveryFee = (deliveryMethod?: 'delivery' | 'pickup') => {
    if (deliveryMethod === 'pickup') {
      return 0;
    }
    return 20; // Фиксированная стоимость доставки 20 сомони
  };

  // Получение налога
  const getTax = () => {
    return 0; // НДС убран
  };

  // Получение итоговой суммы
  const getFinalTotal = (deliveryMethod?: 'delivery' | 'pickup') => {
    const subtotal = getCartTotal();
    const deliveryFee = getDeliveryFee(deliveryMethod);
    const tax = getTax();
    return subtotal + deliveryFee + tax;
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getDeliveryFee,
    getTax,
    getFinalTotal
  };
}