// Конфигурация API для разных окружений
export const API_CONFIG = {
  // Базовый URL API
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3001',
  
  // Telegram Bot конфигурация
  TELEGRAM: {
    BOT_TOKEN: '8448547384:AAEiORI0JIrXoo6LYubHDdEHTeH3fTXCdVs',
    ADMIN_CHAT_ID: '-4729513227', // Admin group chat ID
    API_URL: 'https://api.telegram.org/bot8448547384:AAEiORI0JIrXoo6LYubHDdEHTeH3fTXCdVs'
  },
  
  // Endpoints
  ENDPOINTS: {
    MENU: '/api/menu',
    CATEGORIES: '/api/categories',
    BANNERS: '/api/banners',
    ORDERS: '/api/orders'
  }
};

// Функция для получения полного URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Функция для получения Telegram API URL
export const getTelegramApiUrl = (method: string): string => {
  return `${API_CONFIG.TELEGRAM.API_URL}/${method}`;
};


