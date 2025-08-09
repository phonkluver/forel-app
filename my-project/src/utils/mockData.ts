// Mock данные и типы для ресторана "Форель"

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  imageAltEn?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  items: MenuItem[];
  promoImage?: string;
  categoryImage?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  user_id: string;
  telegram_id: number;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  customer_info: {
    name: string;
    phone: string;
    delivery_method: 'delivery' | 'pickup';
    address?: string;
    comment?: string;
  };
  payment_method: 'card' | 'cash';
  created_at: string;
  updated_at: string;
}

export interface CheckoutRequest {
  telegram_init_data: string;
  items: CartItem[];
  total: number;
  customer_info: {
    name: string;
    phone: string;
    delivery_method: 'delivery' | 'pickup';
    address?: string;
    comment?: string;
  };
  payment_method: 'card' | 'cash';
}

export interface CheckoutResponse {
  order_id: string;
  total: number;
  items: CartItem[];
  success: boolean;
}

export interface ReservationRequest {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
}

export interface TableItem {
  id: string;
  name: string;
  status: 'free' | 'busy';
  seats: number;
  hallName?: string;
  imageUrl?: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

// Mock данные меню
export function getMockMenuData(language: string = 'ru'): MenuCategory[] {
  const categories = {
    ru: { salads:'Салаты', soups:'Первые блюда', meat:'Вторые блюда', fish:'Вторые блюда', pasta:'Пасты', appetizers:'Ассорти и закуски', garnish:'Гарниры', cutlets:'Котлеты', ribs:'Рёбра и кайла', steaks:'Стейки', kebab:'Шашлыки', special:'Спецзаказ (ассорти)', drinks:'Напитки' },
    en: { salads:'Salads', soups:'Soups', meat:'Meat Dishes', fish:'Fish Dishes', pasta:'Pasta', appetizers:'Appetizers & Snacks', garnish:'Side Dishes', cutlets:'Cutlets', ribs:'Ribs & Kayla', steaks:'Steaks', kebab:'Shashlik (BBQ Skewers)', special:'Special Orders (Assorted)', drinks:'Drinks' },
    tj: { salads:'Салатҳо', soups:'Шӯрбоҳо', meat:'Таомҳои гӯштӣ', fish:'Таомҳои моҳӣ', pasta:'Пастаҳо', appetizers:'Газакҳо', garnish:'Гарнирҳо', cutlets:'Котлетҳо', ribs:'Қабурға ва кайла', steaks:'Стейкҳо', kebab:'Кабобҳо', special:'Фармоишҳои махсус', drinks:'Нӯшокиҳо' },
    zh: { salads:'沙拉', soups:'汤类', meat:'肉类主菜', fish:'鱼类主菜', pasta:'意面', appetizers:'开胃菜和小食', garnish:'配菜', cutlets:'肉饼', ribs:'肋排和烤肉', steaks:'牛排', kebab:'烤肉串', special:'特色拼盘', drinks:'饮品' }
  } as const;

  const lang = (['ru','en','tj','zh'] as const).includes(language as any) ? (language as 'ru'|'en'|'tj'|'zh') : 'ru';
  const categoryNames = categories[lang];
  const t = (names: {ru: string; en: string; tj?: string; zh?: string}) => {
    if (lang === 'en') return names.en;
    if (lang === 'tj') return names.tj ?? names.ru;
    if (lang === 'zh') return names.zh ?? names.ru;
    return names.ru;
  };

  const data = {
    salads: [
      { id: "sal-01", names:{ru:"Цезарь с курицей",en:"Caesar with Chicken",zh:"凯撒沙拉配鸡肉"}, price:32,
        desc:{ru:"Салат «Цезарь с курицей» со свежими ингредиентами и фирменной подачей.",en:"Caesar with Chicken salad with fresh ingredients and signature plating.",zh:"凯撒沙拉配鸡肉，新鲜食材，特色摆盘。"},
        image:"/menu/Cezar-s-kuritsey.png", imageAltEn:"Caesar with Chicken salad served in a bowl with fresh vegetables and herbs" },
      { id: "sal-02", names:{ru:"Цезарь с форелью",en:"Caesar with Trout",zh:"凯撒沙拉配鳟鱼"}, price:45,
        desc:{ru:"Салат «Цезарь с форелью» со свежими ингредиентами и фирменной подачей.",en:"Caesar with Trout salad with fresh ingredients and signature plating.",zh:"凯撒沙拉配鳟鱼，新鲜食材，特色摆盘。"},
        image:"/menu/Cezar-s-foreliu.png", imageAltEn:"Caesar with Trout salad served in a bowl with fresh vegetables and herbs" },
    ],
    soups: [
      { id:"sup-01", names:{ru:"Бикиншурбо",en:"Bikinsurbo"}, price:34,
        desc:{ru:"Горячий суп «Бикиншурбо», приготовленный по традиционному рецепту.",en:"Hot Bikinsurbo soup cooked by a traditional recipe."},
        image:"/menu/bikinsurbo.png", imageAltEn:"Bikinsurbo soup in a bowl" },
      { id:"sup-02", names:{ru:"Хомшурбо",en:"Khomsurbo"}, price:28,
        desc:{ru:"Горячий суп «Хомшурбо», приготовленный по традиционному рецепту.",en:"Hot Khomsurbo soup cooked by a traditional recipe."},
        image:"/menu/khomsurbo.png", imageAltEn:"Khomsurbo soup in a bowl" },
    ],
    meat: [
      { id:"meat-01", names:{ru:"Мясное филе с грибами",en:"Meat Fillet with Mushrooms"}, price:58,
        desc:{ru:"«Мясное филе с грибами» — фирменное блюдо из меню.",en:"Signature menu item: Meat Fillet with Mushrooms."},
        image:"/menu/Myasnoe-file-s-gribami.png", imageAltEn:"Meat fillet with mushrooms" },
      { id:"meat-02", names:{ru:"Баранина в фольге",en:"Lamb in Foil"}, price:52,
        desc:{ru:"«Баранина в фольге» — фирменное блюдо из меню.",en:"Signature menu item: Lamb in Foil."},
        image:"/menu/Branina-v-folge.png", imageAltEn:"Lamb baked in foil" },
    ],
    fish: [
      { id:"fish-01", names:{ru:"Форель на мангале (1 кг)",en:"Grilled Trout (1 kg)"}, price:195,
        desc:{ru:"Свежая форель на мангале. Цена за 1 кг.",en:"Fresh grilled trout. Price per 1 kg."},
        image:"/menu/Forel-na-mangale.png", imageAltEn:"Grilled trout (per kg)" },
      { id:"fish-02", names:{ru:"Форель жареный (1 кг)",en:"Fried Trout (1 kg)"}, price:195,
        desc:{ru:"Форель жареная. Цена за 1 кг.",en:"Fried trout. Price per 1 kg."},
        image:"/menu/Forel-zhareniy.png", imageAltEn:"Fried trout (per kg)" },
    ],
    pasta: [
      { id:"pasta-01", names:{ru:"Фетучини с курицей",en:"Fettuccine with Chicken"}, price:45,
        desc:{ru:"Фетучини с курицей.",en:"Fettuccine with chicken."},
        image:"/menu/Fetuchi-s-kuritsei.png", imageAltEn:"Fettuccine with chicken" },
      { id:"pasta-02", names:{ru:"Фетучини с форелью",en:"Fettuccine with Trout"}, price:60,
        desc:{ru:"Фетучини с форелью.",en:"Fettuccine with trout."},
        image:"/menu/Fetuchini-s-forelyu.png", imageAltEn:"Fettuccine with trout" },
    ],
    appetizers: [
      { id:"app-01", names:{ru:"Фруктовая нарезка (1 кг)",en:"Fruit Platter (1 kg)"}, price:70,
        desc:{ru:"Ассорти свежих фруктов. Цена за 1 кг.",en:"Assorted fresh fruits. Price per 1 kg."},
        image:"/menu/Fruktovaya-Narezka.png", imageAltEn:"Fruit platter" },
      { id:"app-02", names:{ru:"Мясное ассорти (100 г)",en:"Meat Platter (100 g)"}, price:29,
        desc:{ru:"Ассорти мясных деликатесов. Цена за 100 г.",en:"Assorted meats. Price per 100 g."},
        image:"/menu/Myasnoe-assorti.png", imageAltEn:"Meat platter" },
    ],
    garnish: [
      { id:"gar-01", names:{ru:"Картофель фри",en:"French Fries"}, price:18,
        desc:{ru:"Хрустящий картофель фри.",en:"Crispy french fries."},
        image:"/menu/French-fries.png", imageAltEn:"French fries" },
      { id:"gar-02", names:{ru:"Картофельное пюре",en:"Mashed Potatoes"}, price:14,
        desc:{ru:"Нежное картофельное пюре.",en:"Creamy mashed potatoes."},
        image:"/menu/Mashed-potatoes.png", imageAltEn:"Mashed potatoes" },
    ],
    cutlets: [
      { id:"cut-01", names:{ru:"Котлета на мангале с гарниром",en:"Grilled Cutlet with Side"}, price:40,
        desc:{ru:"Котлета на мангале с гарниром.",en:"Grilled cutlet with side."},
        image:"/menu/Kotleta-na-mangale-s-garnirom.png", imageAltEn:"Grilled cutlet with side" },
      { id:"cut-02", names:{ru:"Котлета по-домашнему с гарниром",en:"Homemade Cutlet with Side"}, price:42,
        desc:{ru:"Котлета по‑домашнему с гарниром.",en:"Homestyle cutlet with side."},
        image:"/menu/Kotleta-po-domashnemu-s-garnirom.png", imageAltEn:"Homemade cutlet with side" },
    ],
    ribs: [
      { id:"ribs-01", names:{ru:"Говяжьи рёбра в соусе (100 г)",en:"Beef Ribs in Sauce (100 g)"}, price:35,
        desc:{ru:"Цена за 100 г.",en:"Price per 100 g."},
        image:"/menu/Govyazhii-Ryobra.png", imageAltEn:"Beef ribs in sauce (per 100 g)" },
      { id:"ribs-02", names:{ru:"Бараньи рёбра в соусе (100 г)",en:"Lamb Ribs in Sauce (100 g)"}, price:34,
        desc:{ru:"Цена за 100 г.",en:"Price per 100 g."},
        image:"/menu/Baraniy-ryobra-v-souse.png", imageAltEn:"Lamb ribs in sauce (per 100 g)" },
    ],
    steaks: [
      { id:"stk-01", names:{ru:"Стейк с косточкой",en:"Bone-in Steak"}, price:105,
        desc:{ru:"Стейк на кости.",en:"Bone‑in steak."},
        image:"/menu/Steak-s-kostochkoi.png", imageAltEn:"Bone-in steak" },
      { id:"stk-02", names:{ru:"Стейк миньон",en:"Filet Mignon"}, price:85,
        desc:{ru:"Нежный стейк миньон.",en:"Tender filet mignon."},
        image:"/menu/Steal-minion.png", imageAltEn:"Filet mignon" },
    ],
    kebab: [
      { id:"keb-01", names:{ru:"Фарш",en:"Minced Meat Skewer"}, price:26,
        desc:{ru:"Шашлык из фарша.",en:"Minced meat skewer."},
        image:"/menu/Farsh.png", imageAltEn:"Minced meat skewer" },
      { id:"keb-02", names:{ru:"Нежный",en:"Tender Skewer"}, price:30,
        desc:{ru:"Шашлык «Нежный».",en:"Tender skewer."},
        image:"/menu/Nezhniy.png", imageAltEn:"Tender skewer" },
    ],
    special: [
      { id:"spc-01", names:{ru:"Шашлык ассорти стандарт (10 персон)",en:"Standard Shashlik Platter (10 people)"}, price:435,
        desc:{ru:"Большое ассорти шашлыков (10 персон).",en:"Large mixed shashlik platter for 10."},
        image:"/menu/Shashlik-assorti.png", imageAltEn:"Standard shashlik platter" },
      { id:"spc-02", names:{ru:"Шашлык ассорти VIP (15 персон)",en:"VIP Shashlik Platter (15 people)"}, price:640,
        desc:{ru:"VIP ассорти шашлыков (15 персон).",en:"VIP mixed shashlik platter for 15."},
        image:"/menu/Shashlik-assorti.png", imageAltEn:"VIP shashlik platter" },
    ],
    drinks: []
  } as const;

  const buildItems = (key: keyof typeof data) =>
    data[key].map(it => ({
      id: it.id,
      name: t({ru: (it as any).names.ru, en: (it as any).names.en, tj: (it as any).names.ru}),
      description: t({ru: (it as any).desc.ru, en: (it as any).desc.en, tj: (it as any).desc.ru}),
      price: (it as any).price,
      category: key as any,
      image: (it as any).image,
      imageAltEn: (it as any).imageAltEn || '',
      rating: undefined
    }));

  return [
    { id:'salads', name:categoryNames.salads, items:buildItems('salads'), promoImage:'/promo/salads-promo.jpg', categoryImage:'/categories/salads.jpg' },
    { id:'soups', name:categoryNames.soups, items:buildItems('soups'), promoImage:'/promo/soups-promo.jpg', categoryImage:'/categories/soups.jpg' },
    { id:'meat', name:categoryNames.meat, items:buildItems('meat'), promoImage:'/promo/meat-promo.jpg', categoryImage:'/categories/meat.jpg' },
    { id:'fish', name:categoryNames.fish, items:buildItems('fish'), promoImage:'/promo/fish-promo.jpg', categoryImage:'/categories/fish.jpg' },
    { id:'pasta', name:categoryNames.pasta, items:buildItems('pasta'), promoImage:'/promo/pasta-promo.jpg', categoryImage:'/categories/pasta.jpg' },
    { id:'appetizers', name:categoryNames.appetizers, items:buildItems('appetizers'), promoImage:'/promo/appetizers-promo.jpg', categoryImage:'/categories/appetizers.jpg' },
    { id:'garnish', name:categoryNames.garnish, items:buildItems('garnish'), promoImage:'/promo/garnish-promo.jpg', categoryImage:'/categories/garnish.jpg' },
    { id:'cutlets', name:categoryNames.cutlets, items:buildItems('cutlets'), promoImage:'/promo/cutlets-promo.jpg', categoryImage:'/categories/cutlets.jpg' },
    { id:'ribs', name:categoryNames.ribs, items:buildItems('ribs'), promoImage:'/promo/ribs-promo.jpg', categoryImage:'/categories/ribs.jpg' },
    { id:'steaks', name:categoryNames.steaks, items:buildItems('steaks'), promoImage:'/promo/steaks-promo.jpg', categoryImage:'/categories/steaks.jpg' },
    { id:'kebab', name:categoryNames.kebab, items:buildItems('kebab'), promoImage:'/promo/kebab-promo.jpg', categoryImage:'/categories/kebab.jpg' },
    { id:'special', name:categoryNames.special, items:buildItems('special'), promoImage:'/promo/special-promo.jpg', categoryImage:'/categories/special.jpg' },
    { id:'drinks', name:categoryNames.drinks, items:buildItems('drinks'), promoImage:'/promo/drinks-promo.jpg', categoryImage:'/categories/drinks.jpg' }
  ];
}

// Mock API клиент
export const apiClient = {
  // Получение меню
  getMenu: async (language: string = 'ru'): Promise<ApiResponse<MenuCategory[]>> => {
    console.log('Используем mock данные меню');
    await new Promise(resolve => setTimeout(resolve, 500)); // Симуляция задержки
    return {
      data: getMockMenuData(language),
      error: null,
      success: true
    };
  },

  // Синхронизация корзины
  syncCart: async (cartItems: CartItem[]): Promise<ApiResponse<boolean>> => {
    console.log('Mock: синхронизация корзины');
    await new Promise(resolve => setTimeout(resolve, 200));
    return {
      data: true,
      error: null,
      success: true
    };
  },

  // Оформление заказа
  checkout: async (orderData: CheckoutRequest): Promise<ApiResponse<CheckoutResponse>> => {
    console.log('Mock: оформление заказа');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderResponse = {
      order_id: 'ORDER_' + Date.now(),
      total: orderData.total,
      items: orderData.items,
      success: true
    };
    
    return {
      data: orderResponse,
      error: null,
      success: true
    };
  },

  // Получение статуса заказа
  getOrderStatus: async (orderId: string): Promise<ApiResponse<Order>> => {
    console.log('Mock: получение статуса заказа');
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      data: null,
      error: 'Заказ не найден',
      success: false
    };
  },
};

// Mock данные для столиков
const mockTables: TableItem[] = [
  {
    id: "1",
    name: "VIP стол у окна",
    status: "free",
    seats: 6,
    hallName: "VIP зал",
    imageUrl: "/tables/vip1.jpg"
  },
  {
    id: "2",
    name: "Стол с диваном",
    status: "free",
    seats: 4,
    hallName: "Основной зал",
    imageUrl: "/tables/main1.jpg"
  },
  {
    id: "3",
    name: "Стол для компании",
    status: "free",
    seats: 8,
    hallName: "VIP зал",
    imageUrl: "/tables/vip2.jpg"
  },
  {
    id: "4",
    name: "Стол у бара",
    status: "busy",
    seats: 4,
    hallName: "Основной зал",
    imageUrl: "/tables/bar1.jpg"
  },
  {
    id: "5",
    name: "Уютный столик",
    status: "free",
    seats: 2,
    hallName: "Основной зал",
    imageUrl: "/tables/cozy1.jpg"
  },
  {
    id: "6",
    name: "Семейный стол",
    status: "free",
    seats: 6,
    hallName: "Основной зал",
    imageUrl: "/tables/family1.jpg"
  }
];

// Функция для возврата mock данных столиков
export async function fetchTables(): Promise<TableItem[]> {
  console.log('Используем mock данные для столов');
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockTables;
}

// Функция бронирования
export async function submitReservation(data: ReservationRequest): Promise<boolean> {
  console.log('Mock: бронирование стола', data);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return true;
} 