const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface MenuItem {
  id: string;
  name: {
    ru: string;
    en: string;
    tj: string;
    cn: string;
  };
  description: {
    ru: string;
    en: string;
    tj: string;
    cn: string;
  };
  price: number;
  category: string;
  images: string[];
  isActive: boolean;
}

export interface Banner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: {
    ru: string;
    en: string;
    tj: string;
    cn: string;
  };
  image: string;
}

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Меню
  async getMenu(): Promise<MenuItem[]> {
    return this.request<MenuItem[]>('/menu');
  }

  // Баннеры
  async getBanners(): Promise<Banner[]> {
    return this.request<Banner[]>('/banners');
  }

  // Категории
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  // Получение меню для Telegram с группировкой по категориям
  async getMenuForTelegram(language: string = 'ru'): Promise<Record<string, any[]>> {
    const [menuItems, categories] = await Promise.all([
      this.getMenu(),
      this.getCategories()
    ]);

    // Создаем карту категорий
    const categoryMap = new Map<string, Category>();
    categories.forEach(cat => categoryMap.set(cat.id, cat));

    // Группируем блюда по категориям
    const groupedMenu: Record<string, any[]> = {};
    
    menuItems.forEach(item => {
      const category = categoryMap.get(item.category);
      if (category) {
        const categoryName = category.name[language as keyof typeof category.name] || category.name.ru;
        
        if (!groupedMenu[categoryName]) {
          groupedMenu[categoryName] = [];
        }
        
        // Добавляем локализованные имена и описания
        const localizedItem = {
          ...item,
          name: item.name[language as keyof typeof item.name] || item.name.ru,
          description: item.description[language as keyof typeof item.description] || item.description.ru
        };
        
        groupedMenu[categoryName].push(localizedItem);
      }
    });

    return groupedMenu;
  }
}

export const apiService = new ApiService();
