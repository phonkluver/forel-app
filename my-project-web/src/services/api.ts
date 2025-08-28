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

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
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

  // Аутентификация
  async verifyAdmin(code: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/admin/verify', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  }

  // Меню
  async getMenu(): Promise<MenuItem[]> {
    return this.request<MenuItem[]>('/menu');
  }

  async addMenuItem(data: FormData): Promise<ApiResponse<MenuItem>> {
    const response = await fetch(`${API_BASE_URL}/menu`, {
      method: 'POST',
      headers: {
        'x-admin-code': '0202',
      },
      body: data,
    });
    return response.json();
  }

  async updateMenuItem(id: string, data: FormData): Promise<ApiResponse<MenuItem>> {
    const response = await fetch(`${API_BASE_URL}/menu${id}`, {
      method: 'PUT',
      headers: {
        'x-admin-code': '0202',
      },
      body: data,
    });
    return response.json();
  }

  async deleteMenuItem(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/menu${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-code': '0202',
      },
    });
  }

  // Баннеры
  async getBanners(): Promise<Banner[]> {
    return this.request<Banner[]>('/banners');
  }

  async addBanner(data: FormData): Promise<ApiResponse<Banner>> {
    const response = await fetch(`${API_BASE_URL}/banners`, {
      method: 'POST',
      headers: {
        'x-admin-code': '0202',
      },
      body: data,
    });
    return response.json();
  }

  async updateBanner(id: string, data: FormData): Promise<ApiResponse<Banner>> {
    const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
      method: 'PUT',
      headers: {
        'x-admin-code': '0202',
      },
      body: data,
    });
    return response.json();
  }

  async deleteBanner(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/banners/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-code': '0202',
      },
    });
  }

  // Категории
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/categories');
  }

  async addCategory(data: FormData): Promise<ApiResponse<Category>> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'x-admin-code': '0202',
      },
      body: data,
    });
    return response.json();
  }

  async updateCategory(id: string, data: FormData): Promise<ApiResponse<Category>> {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: {
        'x-admin-code': '0202',
      },
      body: data,
    });
    return response.json();
  }

  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return this.request<ApiResponse<void>>(`/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-code': '0202',
      },
    });
  }
}

export const apiService = new ApiService();
