// Типы для Telegram WebApp API

interface TelegramWebAppUser {
  id: number;
  is_bot?: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebAppChat {
  id: number;
  type: 'group' | 'supergroup' | 'channel';
  title: string;
  username?: string;
  photo_url?: string;
}

interface TelegramWebAppInitData {
  query_id?: string;
  user?: TelegramWebAppUser;
  receiver?: TelegramWebAppUser;
  chat?: TelegramWebAppChat;
  start_param?: string;
  can_send_after?: number;
  auth_date: number;
  hash: string;
}

interface TelegramWebAppThemeParams {
  bg_color?: string;
  text_color?: string;
  hint_color?: string;
  link_color?: string;
  button_color?: string;
  button_text_color?: string;
  secondary_bg_color?: string;
  header_bg_color?: string;
  accent_text_color?: string;
  section_bg_color?: string;
  section_header_text_color?: string;
  subtitle_text_color?: string;
  destructive_text_color?: string;
}

interface TelegramWebAppMainButton {
  text: string;
  color: string;
  textColor: string;
  isVisible: boolean;
  isActive: boolean;
  readonly isProgressVisible: boolean;
  setText(text: string): TelegramWebAppMainButton;
  onClick(callback: () => void): TelegramWebAppMainButton;
  offClick(callback: () => void): TelegramWebAppMainButton;
  show(): TelegramWebAppMainButton;
  hide(): TelegramWebAppMainButton;
  enable(): TelegramWebAppMainButton;
  disable(): TelegramWebAppMainButton;
  showProgress(leaveActive?: boolean): TelegramWebAppMainButton;
  hideProgress(): TelegramWebAppMainButton;
  setParams(params: {
    text?: string;
    color?: string;
    text_color?: string;
    is_active?: boolean;
    is_visible?: boolean;
  }): TelegramWebAppMainButton;
}

interface TelegramWebAppBackButton {
  isVisible: boolean;
  onClick(callback: () => void): TelegramWebAppBackButton;
  offClick(callback: () => void): TelegramWebAppBackButton;
  show(): TelegramWebAppBackButton;
  hide(): TelegramWebAppBackButton;
}

interface TelegramWebAppSettingsButton {
  isVisible: boolean;
  onClick(callback: () => void): TelegramWebAppSettingsButton;
  offClick(callback: () => void): TelegramWebAppSettingsButton;
  show(): TelegramWebAppSettingsButton;
  hide(): TelegramWebAppSettingsButton;
}

interface TelegramWebAppHapticFeedback {
  impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): TelegramWebAppHapticFeedback;
  notificationOccurred(type: 'error' | 'success' | 'warning'): TelegramWebAppHapticFeedback;
  selectionChanged(): TelegramWebAppHapticFeedback;
}

interface TelegramWebAppCloudStorage {
  setItem(key: string, value: string, callback?: (error: string | null, result?: boolean) => void): void;
  getItem(key: string, callback: (error: string | null, result?: string) => void): void;
  getItems(keys: string[], callback: (error: string | null, result?: {[key: string]: string}) => void): void;
  removeItem(key: string, callback?: (error: string | null, result?: boolean) => void): void;
  removeItems(keys: string[], callback?: (error: string | null, result?: boolean) => void): void;
  getKeys(callback: (error: string | null, result?: string[]) => void): void;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: TelegramWebAppInitData;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: TelegramWebAppThemeParams;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  MainButton: TelegramWebAppMainButton;
  BackButton: TelegramWebAppBackButton;
  SettingsButton: TelegramWebAppSettingsButton;
  HapticFeedback: TelegramWebAppHapticFeedback;
  CloudStorage: TelegramWebAppCloudStorage;
  
  ready(): void;
  expand(): void;
  close(): void;
  setHeaderColor(color: string): void;
  setBackgroundColor(color: string): void;
  enableClosingConfirmation(): void;
  disableClosingConfirmation(): void;
  enableVerticalSwipes(): void;
  disableVerticalSwipes(): void;
  onEvent(eventType: string, eventHandler: () => void): void;
  offEvent(eventType: string, eventHandler: () => void): void;
  sendData(data: string): void;
  switchInlineQuery(query: string, choose_chat_types?: string[]): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  openInvoice(url: string, callback?: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text: string;
    }>;
  }, callback?: (buttonId: string) => void): void;
  showAlert(message: string, callback?: () => void): void;
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void;
  showScanQrPopup(params: {
    text?: string;
  }, callback?: (text: string) => boolean): void;
  closeScanQrPopup(): void;
  readTextFromClipboard(callback?: (text: string) => void): void;
  requestWriteAccess(callback?: (granted: boolean) => void): void;
  requestContact(callback?: (granted: boolean, contact?: {
    contact: {
      phone_number: string;
      first_name: string;
      last_name?: string;
      user_id?: number;
    };
  }) => void): void;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export {};