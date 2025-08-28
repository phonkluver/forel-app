import { Translations } from '../hooks/useLanguage';

export const PAGES = {
  HOME: 'home',
  MENU: 'menu',
  ABOUT: 'about',
  RESERVATIONS: 'reservations',
  WEDDING: 'wedding',
  CONTACT: 'contact',
  CART: 'cart',
  CHECKOUT: 'checkout',
  ADMIN_DASHBOARD: 'admin-dashboard',
  ADMIN_MENU: 'admin-menu'
} as const;

export type Page = typeof PAGES[keyof typeof PAGES];
export type AppMode = 'customer' | 'admin';

export interface NavigationItem {
  id: Page;
  label: string;
}

export function createNavigationItems(translations: Translations): NavigationItem[] {
  return [
    { id: 'home', label: translations.home },
    { id: 'about', label: translations.aboutUs },
    { id: 'menu', label: translations.menu },
    { id: 'reservations', label: translations.reservations },
    { id: 'wedding', label: translations.weddingHall },
    { id: 'contact', label: translations.contact }
  ];
}

export function createAdminNavigationItems(translations: Translations): NavigationItem[] {
  return [
    { id: 'admin-dashboard', label: 'Панель управления' },
    { id: 'admin-menu', label: 'Управление меню' }
  ];
}