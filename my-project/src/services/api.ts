// API сервис для работы с единым API сервером (Telegram WebApp)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface MenuItem {
  id: string;
  name_ru: string;
  name_en: string;
  name_tj: string;
  name_cn: string;
  description_ru: string;
  description_en: string;
  description_tj: string;
  description_cn: string;
  price: number;
  image: string;
  category_id: string;
  is_active: boolean;
  sort_order: number;
  category_name_ru?: string;
  category_name_en?: string;
  category_name_tj?: string;
  category_name_cn?: string;
}

interface Category {
  id: string;
  name_ru: string;
  name_en: string;
  name_tj: string;
  name_cn: string;
  image: string;
  sort_order: number;
  is_active: boolean;
}

interface Banner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Меню
  async getMenu(): Promise<MenuItem[]> {
    const response = await this.request<MenuItem[]>('/menu');
    return response.data || [];
  }

  async getActiveCategories(): Promise<Category[]> {
    const response = await this.request<Category[]>('/categories/active');
    return response.data || [];
  }

  async getMenuByCategory(categoryId: string): Promise<MenuItem[]> {
    const response = await this.request<MenuItem[]>(`/menu/category/${categoryId}`);
    return response.data || [];
  }

  // Баннеры
  async getActiveBanners(): Promise<Banner[]> {
    const response = await this.request<Banner[]>('/banners/active');
    return response.data || [];
  }

  // Получить меню в формате для Telegram WebApp
  async getMenuForTelegram(language: string = 'ru'): Promise<any[]> {
    try {
      const [menuData, categoriesData] = await Promise.all([
        this.getMenu(),
        this.getActiveCategories()
      ]);
      
      // Создаем объект категорий для быстрого поиска
      const categoriesMap = categoriesData.reduce((acc, category) => {
        acc[category.id] = category;
        return acc;
      }, {} as Record<string, Category>);
      
      // Группируем блюда по категориям
      const groupedMenu = menuData.reduce((acc, item) => {
        const category = categoriesMap[item.category_id];
        if (category && category.is_active) {
          if (!acc[item.category_id]) {
            acc[item.category_id] = {
              id: category.id,
              name: category[`name_${language}` as keyof Category] as string || category.name_ru,
              items: []
            };
          }
          
          acc[item.category_id].items.push({
            id: item.id,
            name: item[`name_${language}` as keyof MenuItem] as string || item.name_ru,
            description: item[`description_${language}` as keyof MenuItem] as string || item.description_ru,
            price: item.price,
            image: item.image
          });
        }
        return acc;
      }, {} as Record<string, any>);
      
      // Преобразуем в массив и сортируем по sort_order
      const categories = Object.values(groupedMenu).sort((a, b) => {
        const categoryA = categoriesMap[a.id];
        const categoryB = categoriesMap[b.id];
        return (categoryA?.sort_order || 0) - (categoryB?.sort_order || 0);
      });

      return categories;

      return categories;
    } catch (error) {
      console.error('Error fetching menu for Telegram:', error);
      // Возвращаем пустой массив в случае ошибки
      return [];
    }
  }

  // Получить баннеры для Telegram WebApp
  async getBannersForTelegram(): Promise<string[]> {
    try {
      const banners = await this.getActiveBanners();
      return banners.map(banner => banner.image);
    } catch (error) {
      console.error('Error fetching banners for Telegram:', error);
      // Возвращаем пустой массив в случае ошибки
      return [];
    }
  }
}

export const apiService = new ApiService();
export type { MenuItem, Banner, Category };
