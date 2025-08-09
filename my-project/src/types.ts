export interface MenuItemImage {
  image_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: MenuItemImage[];
  category: string;
  category_id?: string;
  available: boolean;
  popular: boolean;
  sort_order: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  categoryImage?: string;
  items: MenuItem[];
}