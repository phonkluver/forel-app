// API сервис для работы с единым API сервером

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

interface Banner {
  id: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
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

interface AuthResponse {
  token: string;
  message: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    // Восстанавливаем токен из localStorage при инициализации
    this.token = localStorage.getItem('admin_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

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

  // Аутентификация
  async authenticateAdmin(adminCode: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/admin', {
      method: 'POST',
      body: JSON.stringify({ adminCode }),
    });

    if (response.success && response.data) {
      this.token = response.data.token;
      localStorage.setItem('admin_token', this.token);
    }

    return response.data!;
  }

  // Проверка токена
  async verifyToken(): Promise<boolean> {
    try {
      await this.request('/auth/verify');
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('admin_token');
  }

  // Меню
  async getMenu(): Promise<MenuItem[]> {
    const response = await this.request<MenuItem[]>('/menu');
    return response.data || [];
  }

  async getMenuCategories(): Promise<string[]> {
    const response = await this.request<string[]>('/menu/categories');
    return response.data || [];
  }

  async getMenuByCategory(category: string): Promise<MenuItem[]> {
    const response = await this.request<MenuItem[]>(`/menu/category/${category}`);
    return response.data || [];
  }

  async addMenuItem(formData: FormData): Promise<MenuItem> {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
        // Не устанавливаем Content-Type для FormData, браузер сам установит
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add menu item');
    }

    return data.data;
  }

  async updateMenuItem(id: string, formData: FormData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.token}`,
        // Не устанавливаем Content-Type для FormData, браузер сам установит
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update menu item');
    }
  }

  async deleteMenuItem(id: string): Promise<void> {
    await this.request(`/menu/${id}`, {
      method: 'DELETE',
    });
  }

  // Баннеры
  async getBanners(): Promise<Banner[]> {
    const response = await this.request<Banner[]>('/banners');
    return response.data || [];
  }

  async getActiveBanners(): Promise<Banner[]> {
    const response = await this.request<Banner[]>('/banners/active');
    return response.data || [];
  }

  async addBanner(formData: FormData): Promise<Banner> {
    const response = await fetch(`${API_BASE_URL}/banners`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add banner');
    }

    return data.data;
  }

  async updateBanner(id: string, formData: FormData): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update banner');
    }
  }

  async deleteBanner(id: string): Promise<void> {
    await this.request(`/banners/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleBanner(id: string): Promise<{ id: string; isActive: boolean }> {
    const response = await this.request<{ id: string; isActive: boolean }>(
      `/banners/${id}/toggle`,
      {
        method: 'PUT',
      }
    );
    return response.data!;
  }

  async reorderBanners(bannerIds: string[]): Promise<void> {
    await this.request('/banners/reorder', {
      method: 'PUT',
      body: JSON.stringify({ bannerIds }),
    });
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    const response = await this.request<Category[]>('/categories');
    return response.data || [];
  }

  async getActiveCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories/active`);
    if (!response.ok) throw new Error('Failed to fetch active categories');
    return response.json();
  }

  async addCategory(formData: FormData): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to add category');
    }

    return data;
  }

  async updateCategory(id: string, formData: FormData): Promise<Category> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update category');
    }

    return data;
  }

  async deleteCategory(id: string): Promise<void> {
    await this.request(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  async toggleCategory(id: string): Promise<Category> {
    const response = await this.request<Category>(`/categories/${id}/toggle`, {
      method: 'PATCH',
    });
    return response.data!;
  }
}

export const apiService = new ApiService();
export type { MenuItem, Banner, AuthResponse };
