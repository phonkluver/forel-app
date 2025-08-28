export interface MenuItemImage {
  image_id: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface MenuItem {
  id: string;
  name: { ru: string; en: string; tj: string; zh: string };
  description: { ru: string; en: string; tj: string; zh: string };
  price: number;
  images: string[];
  category: string;
  isActive: boolean;
}

export interface MenuCategory {
  id: string;
  name: { ru: string; en: string; tj: string; zh: string };
  image: string;
  items: MenuItem[];
}