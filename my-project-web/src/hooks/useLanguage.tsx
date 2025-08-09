import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ruTranslations } from './translations.ru';
import { tjTranslations } from './translations.tj';
import { enTranslations } from './translations.en';
import { zhTranslations } from './translations.zh';

export type Language = 'ru' | 'en' | 'tj' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Translations;
}

export interface Translations {
  // Header & Navigation
  home: string;
  menu: string;
  reservations: string;
  weddingHall: string;
  contact: string;
  cart: string;
  aboutUs: string;
  instagramTitle: string;
  instagramDesc: string;
  instagramButton: string;
  
  // Restaurant Info
  forelRestaurant: string;
  restaurantTagline: string;
  address: string;
  phone: string;
  phoneDelivery: string;
  phoneReservation: string;
  email: string;
  businessHours: string;
  workingHours: string;
  khujand: string;
  
  // Home Page
  welcomeTitle: string;
  welcomeSubtitle: string;
  discoverMenu: string;
  makeReservation: string;
  ourSpecialities: string;
  freshSeafood: string;
  freshSeafoodDesc: string;
  uniqueExperience: string;
  uniqueExperienceDesc: string;
  expertChefs: string;
  expertChefsDesc: string;
  premiumService: string;
  premiumServiceDesc: string;
  eleganAtmosphere: string;
  eleganAtmosphereDesc: string;
  visitUs: string;
  bookNow: string;
  viewMore: string;
  ourGallery: string;
  ourSpecialties: string;
  
  // Menu
  menuTitle: string;
  menuSubtitle: string;
  addToCart: string;
  new: string;
  popular: string;
  items: string;
  emptyMenu: string;
  searchDishes: string;
  selectCategory: string;
  allCategories: string;
  
  // Cart
  cartTitle: string;
  cartSubtitle: string;
  cartEmpty: string;
  addItemsToCart: string;
  continueShopping: string;
  checkout: string;
  subtotal: string;
  delivery: string;
  tax: string;
  total: string;
  freeDelivery: string;
  orderSummary: string;
  removeItem: string;
  
  // Checkout
  checkoutTitle: string;
  orderType: string;
  delivery2: string;
  pickup: string;
  contactInfo: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  deliveryAddress: string;
  paymentMethod: string;
  cash: string;
  card: string;
  placeOrder: string;
  processing: string;
  orderSuccess: string;
  orderNumber: string;
  backToMenu: string;
  orderConfirmed: string;
  orderConfirmedDescription: string;
  deliveryMethod: string;
  deliveryFee: string;
  enterName: string;
  comment: string;
  creditCard: string;
  
  // Reservations
  reservationTitle: string;
  reservationSubtitle: string;
  bookTable: string;
  tableReservation: string;
  onlineReservation: string;
  reservationBenefits: string;
  whyBookTable: string;
  whyBookTableDesc: string;
  guaranteedSeatTitle: string;
  guaranteedSeatFullDesc: string;
  timeSavingTitle: string;
  timeSavingFullDesc: string;
  bestSeatsTitle: string;
  bestSeatsFullDesc: string;
  howToBook: string;
  simpleBooking: string;
  step1: string;
  step1Desc: string;
  step2: string;
  step2Desc: string;
  step3: string;
  step3Desc: string;
  needHelp: string;
  needHelpDesc: string;
  callUs: string;
  dailyHours: string;
  onlineBooking: string;
  available247: string;
  instantConfirmation: string;
  bookTableNow: string;
  needHelpWithBooking: string;
  needHelpWithBookingDesc: string;
  callUsForBooking: string;
  dailyHoursBooking: string;
  onlineBookingAvailable: string;
  available247Booking: string;
  instantConfirmationBooking: string;
  bookTableNowButton: string;
  
  // Wedding Hall
  weddingTitle: string;
  weddingSubtitle: string;
  weddingDescription: string;
  weddingBookingTitle: string;
  weddingBookingDescription: string;
  weddingCapacity: string;
  weddingServices: string;
  weddingPackages: string;
  getQuote: string;
  contactForDetails: string;
  exclusiveMenu: string;
  exclusiveMenuDesc: string;
  floristryDesc: string;
  keyEntertainment: string;
  keyEntertainmentDesc: string;
  banquetService: string;
  banquetServiceDesc: string;
  basicPackage: string;
  standardPackage: string;
  premiumPackage: string;
  contactForWedding: string;
  weddingFormTitle: string;
  
  // Wedding Form Fields
  weddingDate: string;
  budget: string;
  message: string;
  notSpecified: string;
  notSpecifiedFemale: string;
  notSpecifiedMale: string;
  
  // Placeholders
  coupleNamesPlaceholder: string;
  budgetPlaceholder: string;
  weddingMessagePlaceholder: string;
  
  // System messages
  sendingToTelegram: string;
  sendingError: string;
  
  // Wedding Page Additional
  ourServices: string;
  weddingServicesDesc: string;
  ourWeddingHall: string;
  luxuryAtmosphereDesc: string;
  
  // Menu errors
  menuLoadError: string;
  
  // Stats
  yearsExperience: string;
  happyGuests: string;
  dishesInMenu: string;
  rating: string;
  
  // HomePage sections
  restaurantSpace: string;
  enterRestaurantSpace: string;
  whatMakesUsSpecial: string;
  everyDetailCreated: string;
  visitUsToday: string;
  discoverCulinaryExperience: string;
  restaurantForel: string;
  exquisiteCuisineInHeart: string;
  weddingFormDesc: string;
  guests: string;
  weddingMessage: string;
  sendWeddingRequest: string;
  weddingRequestSent: string;
  weddingRequestDesc: string;
  galleryAndVideo: string;

  galleryDesc: string;
  videoTour: string;
  videoTourDesc: string;
  watchHowHallLooks: string;
  numberOfGuests: string;
  approximateBudget: string;
  budgetExample: string;
  additionalInfoWedding: string;
  sending: string;
  getProposal: string;
  thankYouForRequest: string;
  thankYouForRequestDesc: string;
  sendNewRequest: string;
  callUsNow: string;
  
  // Contact
  contactTitle: string;
  contactSubtitle: string;
  contactUs: string;
  ourLocation: string;
  sendMessage: string;
  getInTouch: string;
  contactFormTitle: string;
  contactFormDesc: string;
  name: string;
  subject: string;
  contactFormSent: string;
  contactFormSentDesc: string;
  sendNewMessage: string;
  thankYouMessage: string;
  
  // Footer
  followUs: string;
  quickLinks: string;
  privacyPolicy: string;
  termsOfService: string;
  allRightsReserved: string;
  
  // Common
  submit: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  loading: string;
  error: string;
  success: string;
  yes: string;
  no: string;
  back: string;
  next: string;
  close: string;
  open: string;
  
  // Forms
  required: string;
  optional: string;
  pleaseEnter: string;
  invalidEmail: string;
  invalidPhone: string;
  
  // Notifications
  itemAdded: string;
  itemRemoved: string;
  cartUpdated: string;
  orderPlaced: string;
  messageSent: string;
  reservationMade: string;

  // Additional translations
  welcomeToForel: string;
  exquisiteCuisine: string;
  exploreMenu: string;
  specialDay: string;
  unforgettableDay: string;
  upToGuests: string;
  reviewOrder: string;
  addDishesToStart: string;
  checkOrderBeforeCheckout: string;
  freeFrom500: string;
  tryChangingCriteria: string;
  guaranteedSeat: string;
  timeSaving: string;
  bestSeats: string;
  whyReserve: string;
  guaranteedSeatDesc: string;
  timeSavingDesc: string;
  bestSeatsDesc: string;
  orderDelivery: string;
  
  // Additional translations for pages
  location: string;
  monday: string;
  sunday: string;
  yourMessage: string;
  additionalInfo: string;
  deliveryDesc: string;
  deliveryLabel: string;
  paymentMethods: string;
  paymentMethodsDesc: string;
  parking: string;
  parkingDesc: string;
  adminPanel: string;
  adminPanelDesc: string;
  howToFindUs: string;
  interactiveMap: string;
  openInGoogleMaps: string;
  respondWithin24Hours: string;
  noDaysOff: string;
  instagramRestaurantTitle: string;
  instagramRestaurantDescription: string;
  instagramRestaurantButton: string;
}

const translations: Record<Language, Translations> = {
  ru: ruTranslations,
  en: enTranslations,
  tj: tjTranslations,
  zh: zhTranslations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('ru');

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    translations: translations[language]
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Функция для получения локализованного названия категории меню
export function getLocalizedCategoryName(categoryKey: string, language: Language) {
  const categories = {
    ru: { 
      salads:'Салаты', 
      soups:'Первые блюда (супы)', 
      meat:'Вторые блюда — мясо', 
      fish:'Вторые блюда — рыба', 
      pasta:'Пасты', 
      appetizers:'Ассорти и закуски', 
      garnish:'Гарниры', 
      cutlets:'Котлеты', 
      ribs:'Рёбра и кайла', 
      steaks:'Стейки', 
      kebab:'Шашлыки', 
      special:'Спецзаказ (ассорти)', 
      drinks:'Напитки' 
    },
    en: { 
      salads:'Salads', 
      soups:'Soups', 
      meat:'Meat Dishes', 
      fish:'Fish Dishes', 
      pasta:'Pasta', 
      appetizers:'Appetizers & Snacks', 
      garnish:'Side Dishes', 
      cutlets:'Cutlets', 
      ribs:'Ribs & Kayla', 
      steaks:'Steaks', 
      kebab:'Shashlik (BBQ Skewers)', 
      special:'Special Orders (Assorted)', 
      drinks:'Drinks' 
    },
    tj: { 
      salads:'Салаты', // Оставляем русское название
      soups:'Первые блюда (супы)', // Оставляем русское название
      meat:'Вторые блюда — мясо', // Оставляем русское название
      fish:'Вторые блюда — рыба', // Оставляем русское название
      pasta:'Пасты', // Оставляем русское название
      appetizers:'Ассорти и закуски', // Оставляем русское название
      garnish:'Гарниры', // Оставляем русское название
      cutlets:'Котлеты', // Оставляем русское название
      ribs:'Рёбра и кайла', // Оставляем русское название
      steaks:'Стейки', // Оставляем русское название
      kebab:'Шашлыки', // Оставляем русское название
      special:'Спецзаказ (ассорти)', // Оставляем русское название
      drinks:'Напитки' // Оставляем русское название
    },
    zh: {
      salads:'沙拉',
      soups:'汤类',
      meat:'肉类主菜',
      fish:'鱼类主菜',
      pasta:'意面',
      appetizers:'开胃菜',
      garnish:'配菜',
      cutlets:'肉饼',
      ribs:'肋排',
      steaks:'牛排',
      kebab:'烤肉串',
      special:'特色拼盘',
      drinks:'饮品'
    }
  };
  
  return categories[language][categoryKey as keyof typeof categories[Language]] || categoryKey;
}

// Функция для получения локализованного названия блюда
export function getLocalizedDishName(dishName: string, language: Language) {
  // Для таджикского языка оставляем русские названия блюд
  if (language === 'tj') {
    return dishName; // Возвращаем оригинальное русское название
  }
  
  // Для английского языка переводим названия блюд
  if (language === 'en') {
    const dishTranslations: Record<string, string> = {
      'Форель на гриле': 'Grilled Trout',
      'Стейк из лосося': 'Salmon Steak', 
      'Цезарь с креветками': 'Caesar with Shrimp',
      'Борщ украинский': 'Ukrainian Borscht',
      'Шашлык из баранины': 'Lamb Kebab',
      'Котлеты по-киевски': 'Chicken Kiev',
      'Стейк рибай': 'Ribeye Steak',
      'Паста карбонара': 'Pasta Carbonara',
      'Рёбра барбекю': 'BBQ Ribs',
      'Ассорти закусок': 'Appetizer Platter'
    };
    
    return dishTranslations[dishName] || dishName;
  }

  // Для китайского языка переводим названия блюд
  if (language === 'zh') {
    const dishTranslations: Record<string, string> = {
      'Форель на гриле': '烤鳟鱼',
      'Стейк из лосося': '三文鱼牛排', 
      'Цезарь с креветками': '虾仁凯撒沙拉',
      'Борщ украинский': '乌克兰罗宋汤',
      'Шашлык из баранины': '羊肉烤串',
      'Котлеты по-киевски': '基辅肉饼',
      'Стейк рибай': '肋眼牛排',
      'Паста карбонара': '奶油培根意面',
      'Рёбра барбекю': '烧烤排骨',
      'Ассорти закусок': '开胃菜拼盘'
    };
    
    return dishTranslations[dishName] || dishName;
  }
  
  // Для русского языка возвращаем как есть
  return dishName;
}

// Функция для получения локализованного описания блюда
export function getLocalizedDishDescription(description: string, language: Language) {
  // Для таджикского языка оставляем русские описания
  if (language === 'tj') {
    return description;
  }
  
  // Для английского языка переводим описания
  if (language === 'en') {
    const descriptionTranslations: Record<string, string> = {
      'Свежая форель с овощами и соусом тартар': 'Fresh trout with vegetables and tartar sauce',
      'Сочный стейк с кунжутом и терияки': 'Juicy steak with sesame and teriyaki',
      'Классический цезарь с тигровыми креветками': 'Classic Caesar with tiger prawns',
      'Традиционный борщ со сметаной': 'Traditional borscht with sour cream',
      'Сочный шашлык из отборной баранины': 'Juicy kebab from select lamb',
      'Классические котлеты с маслом и зеленью': 'Classic cutlets with butter and herbs',
      'Сочный стейк из мраморной говядины': 'Juicy marbled beef steak',
      'Классическая итальянская паста с беконом': 'Classic Italian pasta with bacon',
      'Сочные свиные рёбра в соусе барбекю': 'Juicy pork ribs in BBQ sauce',
      'Разнообразные закуски к пиву': 'Variety of beer snacks'
    };
    
    return descriptionTranslations[description] || description;
  }

  // Для китайского языка переводим описания
  if (language === 'zh') {
    const descriptionTranslations: Record<string, string> = {
      'Свежая форель с овощами и соусом тартар': '新鲜鳟鱼配蔬菜和塔塔酱',
      'Сочный стейк с кунжутом и терияки': '香嫩牛排配芝麻和照烧酱',
      'Классический цезарь с тигровыми креветками': '经典凯撒沙拉配虎虾',
      'Традиционный борщ со сметаной': '传统罗宋汤配酸奶油',
      'Сочный шашлык из отборной баранины': '精选羊肉汁水丰富的烤串',
      'Классические котлеты с маслом и зеленью': '经典肉饼配黄油和香草',
      'Сочный стейк из мраморной говядины': '多汁大理石花纹牛排',
      'Классическая итальянская паста с беконом': '经典意大利培根意面',
      'Сочные свиные рёбра в соусе барбекю': '多汁猪肋排配烧烤酱',
      'Разнообразные закуски к пиву': '各种啤酒小食'
    };
    
    return descriptionTranslations[description] || description;
  }
  
  return description;
}