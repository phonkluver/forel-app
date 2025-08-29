const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Устанавливаем кодировку UTF-8 для процесса
process.env.LANG = 'en_US.UTF-8';
process.env.LC_ALL = 'en_US.UTF-8';
process.env.LC_CTYPE = 'en_US.UTF-8';

// Принудительно устанавливаем кодировку для Node.js
if (process.platform === 'win32') {
  process.env.CHCP = '65001';
}

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://127.0.0.1', 'http://localhost:8080', 'http://localhost:5173', 'http://localhost:5174', 'http://forelrest.com', 'http://www.forelrest.com', 'http://telegram.forelrest.com', 'https://forelrest.com', 'https://www.forelrest.com', 'https://telegram.forelrest.com'],
  credentials: true
}));

// Настройка кодировки для JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Устанавливаем заголовки для правильной кодировки
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-code');
  next();
});

app.use(express.static('public'));

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'public', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { 
    fileSize: 10 * 1024 * 1024, // 10MB
    fieldSize: 1024 * 1024 // 1MB для полей
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Только изображения разрешены'));
    }
  }
});

// In-memory хранилище данных
let menuItems = [];
let categories = [];
let banners = [];

// Функция сохранения данных в файлы
function saveDataToFiles() {
  try {
    // Сохраняем категории
    const categoriesData = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      image_url: cat.image.replace('/', '')
    }));
    fs.writeFileSync(path.join(__dirname, 'categories_current.json'), JSON.stringify(categoriesData, null, 2), 'utf8');

    // Сохраняем блюда с сохранением исправленных переводов
    const dishesData = menuItems.map(dish => {
      // Проверяем, есть ли исправленный перевод для этого блюда
      let correctedName = dish.name;
      
      // Словарь исправленных переводов
      const translationFixes = {
        "lamb-seeds": {"zh":"羊籽","en":"Lamb Seeds","ru":"Ягнячьи семечки","tj":"Тукмаи барра"},
        "waguri-ribs": {"zh":"瓦古里肋排","en":"Waguri Ribs","ru":"Ребрышки Вагури","tj":"Кабобгоҳи Вагури"},
        "stewed-dum": {"zh":"炖羊肩","en":"Stewed Dum","ru":"Тушеная лопатка","tj":"Шонаи туш"},
        "stewed-tush": {"zh":"炖羊臀","en":"Stewed Tush","ru":"Тушеная задняя часть","tj":"Пушти туш"},
        "pumpkin-beef": {"zh":"南瓜炖牛肉","en":"Pumpkin with Beef","ru":"Тыква с говядиной","tj":"Каду бо говядина"},
        "mini-kiev-cutlet": {"zh":"迷你基辅肉排","en":"Mini Kiev Cutlet","ru":"Мини котлета по-киевски","tj":"Котлетаи хурди Киев"},
        "lula-kebab-breaded": {"zh":"面包屑烤串","en":"Lula Kebab Breaded","ru":"Люля-кебаб в панировке","tj":"Люля-кебаб бо панировка"},
        "lula-kebab": {"zh":"烤串","en":"Lula Kebab","ru":"Люля-кебаб","tj":"Люля-кебаб"},
        "breaded-lyulya-kebab": {"zh":"面包屑烤串","en":"Breaded Lyulya Kebab","ru":"Люля-кебаб в панировке","tj":"Люля-кебаб бо панировка"},
        "lyulya-kebab": {"zh":"烤串","en":"Lyulya Kebab","ru":"Люля-кебаб","tj":"Люля-кебаб"},
        "kazy-potato": {"zh":"卡兹配土豆","en":"Kazy with Potato","ru":"Казы с картошкой","tj":"Казы бо картошка"},
        "warm-salad": {"zh":"温沙拉","en":"Warm Salad","ru":"Теплый салат","tj":"Салати гарм"},
        "burrata-salad": {"zh":"布拉塔沙拉","en":"Burrata","ru":"Буратта","tj":"Буратта"},
        "steak-salad": {"zh":"牛排沙拉","en":"Steak Salad","ru":"Салат со стейком","tj":"Салат бо стейк"},
        "broccoli-salad": {"zh":"西兰花沙拉","en":"Broccoli Salad","ru":"Салат с брокколи","tj":"Салат бо брокколи"},
        "arugula-salad": {"zh":"芝麻菜沙拉","en":"Arugula Salad","ru":"Салат с рукколой","tj":"Салат бо руккола"},
        "adjarian-khachapuri": {"zh":"阿扎尔哈恰普里","en":"Adjarian Khachapuri","ru":"Аджарский хачапури","tj":"Хачапурии Аджария"},
        "imeretian-khachapuri": {"zh":"伊梅列季哈恰普里","en":"Imeretian Khachapuri","ru":"Имеретинский хачапури","tj":"Хачапурии Имеретия"},
        "margalian-khachapuri": {"zh":"马尔加利安哈恰普里","en":"Margalian Khachapuri","ru":"Маргалианский хачапури","tj":"Хачапурии Маргали"},
        "penovani-khachapuri": {"zh":"佩诺瓦尼哈恰普里","en":"Penovani Khachapuri","ru":"Пеновани хачапури","tj":"Хачапурии Пеновани"},
        "stuffed-eggplant": {"zh":"酿茄子","en":"Stuffed Eggplant","ru":"Фаршированные баклажаны","tj":"Боқлажони пур"},
        "stuffed-zucchini": {"zh":"酿西葫芦","en":"Stuffed Zucchini","ru":"Фаршированные кабачки","tj":"Кабачки пур"},
        "eggplant-rolls": {"zh":"茄子卷","en":"Eggplant Rolls","ru":"Рулеты из баклажанов","tj":"Рулети боқлажон"},
        "khinkali": {"zh":"欣卡利","en":"Khinkali","ru":"Хинкали","tj":"Хинкали"},
        "fried-khinkali": {"zh":"炸欣卡利","en":"Fried Khinkali","ru":"Жареные хинкали","tj":"Хинкалии бирён"},
        "hot-beer-assortment": {"zh":"热啤酒拼盘","en":"Hot Beer Assortment","ru":"Горячее пиво ассорти","tj":"Бирои гарми гуногун"},
        "tiramisu": {"zh":"提拉米苏","en":"Tiramisu","ru":"Тирамису","tj":"Тирамису"},
        "chocolate-fondant": {"zh":"巧克力熔岩蛋糕","en":"Chocolate Fondant","ru":"Шоколадный фондан","tj":"Фондани шоколад"},
        "gelato-ice-cream": {"zh":"意式冰淇淋","en":"Gelato Ice Cream","ru":"Мороженое Gelato","tj":"Яхмос бо Gelato"},
        "fruit-salad": {"zh":"水果沙拉","en":"Fruit Salad","ru":"Фруктовый салат","tj":"Салати мева"},
        "assorted-ice-cream": {"zh":"什锦冰淇淋","en":"Assorted Ice Cream","ru":"Мороженое ассорти","tj":"Яхмои гуногун"},
        "fruit-salad-variant": {"zh":"水果沙拉（变体）","en":"Fruit Salad (Variant)","ru":"Фруктовый салат (вариант)","tj":"Салати мева (вариант)"},
        "tropic-dessert": {"zh":"热带","en":"Tropic","ru":"Тропик","tj":"Тропик"},
        "exotic-dessert": {"zh":"异国情调","en":"Exotic","ru":"Экзотика","tj":"Экзотика"},
        "strawberry-boom": {"zh":"草莓爆炸","en":"Strawberry Boom","ru":"Клубничный бум","tj":"Буми тути замин"},
        "banana-fantasy": {"zh":"香蕉幻想","en":"Banana Fantasy","ru":"Банановая фантазия","tj":"Фантазияи банан"},
        "surprise-dessert": {"zh":"惊喜","en":"Surprise","ru":"Сюрприз","tj":"Сюрприз"},
        "chocolate-delight": {"zh":"巧克力喜悦","en":"Chocolate Delight","ru":"Шоколадное наслаждение","tj":"Лаззати шоколад"},
        "pepperoni-25": {"zh":"意大利辣香肠披萨 25厘米","en":"Pepperoni Pizza 25cm","ru":"Пицца пепперони 25 см","tj":"Пиццаи пепперони 25 см"},
        "pepperoni-35": {"zh":"意大利辣香肠披萨 35厘米","en":"Pepperoni Pizza 35cm","ru":"Пицца пепперони 35 см","tj":"Пиццаи пепперони 35 см"},
        "pepperoni-40": {"zh":"意大利辣香肠披萨 40厘米","en":"Pepperoni Pizza 40cm","ru":"Пицца пепперони 40 см","tj":"Пиццаи пепперони 40 см"},
        "four-seasons-25": {"zh":"四季披萨 25厘米","en":"Four Seasons Pizza 25cm","ru":"Пицца четыре сезона 25 см","tj":"Пиццаи чор фасл 25 см"},
        "four-seasons-35": {"zh":"四季披萨 35厘米","en":"Four Seasons Pizza 35cm","ru":"Пицца четыре сезона 35 см","tj":"Пиццаи чор фасл 35 см"},
        "four-seasons-40": {"zh":"四季披萨 40厘米","en":"Four Seasons Pizza 40cm","ru":"Пицца четыре сезона 40 см","tj":"Пиццаи чор фасл 40 см"},
        "chili-35": {"zh":"辣椒披萨 35厘米","en":"Chili Pizza 35cm","ru":"Пицца чили 35 см","tj":"Пиццаи чили 35 см"},
        "chili-40": {"zh":"辣椒披萨 40厘米","en":"Chili Pizza 40cm","ru":"Пицца чили 40 см","tj":"Пиццаи чили 40 см"},
        "empire-35": {"zh":"帝国披萨 35厘米","en":"Empire Pizza 35cm","ru":"Пицца империя 35 см","tj":"Пиццаи империя 35 см"},
        "empire-40": {"zh":"帝国披萨 40厘米","en":"Empire Pizza 40cm","ru":"Пицца империя 40 см","tj":"Пиццаи империя 40 см"},
        "bellissimo-25": {"zh":"贝利西莫披萨 25厘米","en":"Bellissimo Pizza 25cm","ru":"Пицца беллиссимо 25 см","tj":"Пиццаи беллиссимо 25 см"},
        "bellissimo-35": {"zh":"贝利西莫披萨 35厘米","en":"Bellissimo Pizza 35cm","ru":"Пицца беллиссимо 35 см","tj":"Пиццаи беллиссимо 35 см"},
        "bellissimo-40": {"zh":"贝利西莫披萨 40厘米","en":"Bellissimo Pizza 40cm","ru":"Пицца беллиссимо 40 см","tj":"Пиццаи беллиссимо 40 см"},
        "caesar-25": {"zh":"凯撒披萨 25厘米","en":"Caesar Pizza 25cm","ru":"Пицца цезарь 25 см","tj":"Пиццаи цезарь 25 см"},
        "caesar-35": {"zh":"凯撒披萨 35厘米","en":"Caesar Pizza 35cm","ru":"Пицца цезарь 35 см","tj":"Пиццаи цезарь 35 см"},
        "caesar-40": {"zh":"凯撒披萨 40厘米","en":"Caesar Pizza 40cm","ru":"Пицца цезарь 40 см","tj":"Пиццаи цезарь 40 см"},
        "dragon-roll": {"zh":"龙卷","en":"Dragon Roll","ru":"Ролл дракон","tj":"Ролли аждаҳо"},
        "miami-roll": {"zh":"迈阿密卷","en":"Miami Roll","ru":"Ролл майами","tj":"Ролли Майами"},
        "fried-spice-roll": {"zh":"炸香料卷","en":"Fried Spice Roll","ru":"Жареный ролл со специями","tj":"Ролли бирён бо хушк"},
        "sinavo-baked-roll": {"zh":"西纳沃烤卷","en":"Sinavo Baked Roll","ru":"Запеченный ролл синаво","tj":"Ролли пухтаи Синаво"},
        "totomm-roll": {"zh":"托托姆卷","en":"Totomm Roll","ru":"Ролл тотомм","tj":"Ролли Тотомм"},
        "verona-baked-roll": {"zh":"维罗纳烤卷","en":"Verona Baked Roll","ru":"Запеченный ролл верона","tj":"Ролли пухтаи Верона"},
        "caesar-roll": {"zh":"凯撒卷","en":"Caesar Roll","ru":"Ролл цезарь","tj":"Ролли цезарь"},
        "baked-trout-roll": {"zh":"烤鳟鱼卷","en":"Baked Trout Roll","ru":"Запеченный ролл с форелью","tj":"Ролли пухтаи форел"},
        "royal-roll": {"zh":"皇家卷","en":"Royal Roll","ru":"Королевский ролл","tj":"Ролли шоҳӣ"},
        "signature-trout-roll": {"zh":"招牌鳟鱼卷","en":"Signature Trout Roll","ru":"Фирменный ролл с форелью","tj":"Ролли форели имзо"},
        "philadelphia-vip-roll": {"zh":"费城VIP卷","en":"Philadelphia VIP Roll","ru":"Филадельфия VIP ролл","tj":"Ролли Филадельфия VIP"},
        "hot-shrimp-roll": {"zh":"热虾卷","en":"Hot Shrimp Roll","ru":"Горячий ролл с креветками","tj":"Ролли гарми бо креветка"},
        "ebi-black-roll": {"zh":"黑虾卷","en":"Ebi Black Roll","ru":"Черный ролл эби","tj":"Ролли сиёҳи Эби"},
        "black-eel-roll": {"zh":"黑鳗卷","en":"Black Eel Roll","ru":"Черный ролл с угрем","tj":"Ролли сиёҳи морӣ"},
        "nevada-roll": {"zh":"内华达卷","en":"Nevada Roll","ru":"Ролл невада","tj":"Ролли Невада"},
        "creed-roll": {"zh":"信条卷","en":"Creed Roll","ru":"Ролл крид","tj":"Ролли Крид"},
        "california-roll": {"zh":"加州卷","en":"California Roll","ru":"Калифорнийский ролл","tj":"Ролли Калифорния"},
        "unagi-sushi": {"zh":"鳗鱼寿司","en":"Unagi Sushi","ru":"Суши с угрем","tj":"Суши бо морӣ"},
        "sake-sushi": {"zh":"三文鱼寿司","en":"Sake Sushi","ru":"Суши с лососем","tj":"Суши бо лосось"},
        "ebi-sushi": {"zh":"虾寿司","en":"Ebi Sushi","ru":"Суши с креветкой","tj":"Суши бо креветка"},
        "seven-bato-set": {"zh":"七巴托套餐","en":"Seven Bato Set","ru":"Сет семь бато","tj":"Сети ҳафт бато"},
        "quartet-set": {"zh":"四重奏套餐","en":"Quartet Set","ru":"Сет квартет","tj":"Сети квартет"},
        "kappa-maki-set": {"zh":"黄瓜卷套餐","en":"Kappa Maki Set","ru":"Сет каппа маки","tj":"Сети каппа маки"},
        "ebi-maki-set": {"zh":"虾卷套餐","en":"Ebi Maki Set","ru":"Сет эби маки","tj":"Сети эби маки"},
        "philadelphia-maki": {"zh":"费城卷","en":"Philadelphia Maki","ru":"Филадельфия маки","tj":"Филадельфия маки"},
        "trout-fillet-sauce": {"zh":"鳟鱼片配酱","en":"Trout Fillet with Sauce","ru":"Филе форели с соусом","tj":"Филеи форел бо соус"},
        "trout-fillet-rice": {"zh":"鳟鱼片配米饭","en":"Trout Fillet with Rice","ru":"Филе форели с рисом","tj":"Филеи форел бо биринҷ"},
        "pike-perch-batter": {"zh":"面糊梭鲈","en":"Pike Perch in Batter","ru":"Судак в кляре","tj":"Судак дар хамир"}
      };
      
      // Если есть исправленный перевод, используем его
      if (translationFixes[dish.id]) {
        correctedName = translationFixes[dish.id];
      }
      
      return {
        id: dish.id,
        name: correctedName,                 // ← без JSON.stringify
        price: dish.price.toString(),
        category_id: dish.category,
        image: (dish.images[0] || '').replace(/^\//, ''),
        isActive: dish.isActive
      };
    });
    
    fs.writeFileSync(path.join(__dirname, 'dishes_current.json'), JSON.stringify(dishesData, null, 2), 'utf8');

    // Сохраняем баннеры
    fs.writeFileSync(path.join(__dirname, 'banners_current.json'), JSON.stringify(banners, null, 2), 'utf8');

    console.log('✅ Данные сохранены в файлы');
  } catch (error) {
    console.error('❌ Ошибка сохранения данных:', error);
  }
}

// Функция проверки на битые символы
function hasBadChars(obj) {
  const s = typeof obj === 'string' ? obj : JSON.stringify(obj ?? '');
  return /\uFFFD/.test(s); // символ замены (ромбик с ?)
}

// Загрузка начальных данных
function loadInitialData() {
  try {
    // Пытаемся загрузить текущие данные
    let categoriesData, dishesData, bannersData;
    
    try {
      categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories_current.json'), 'utf8'));
      dishesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'dishes_current.json'), 'utf8'));
      bannersData = JSON.parse(fs.readFileSync(path.join(__dirname, 'banners_current.json'), 'utf8'));

      // если в снапшоте обнаружили "", игнорируем current и падаем в fallback
      if (hasBadChars(categoriesData) || hasBadChars(dishesData)) {
        throw new Error('snapshot contains U+FFFD');
      }
      console.log('📁 Загружены текущие данные');
    } catch (error) {
      console.log('📁 Загружаем исходные данные');
      // Если текущие файлы не найдены, загружаем исходные UTF-8 файлы
      try {
        categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories_rows.utf8.json'), 'utf8'));
        dishesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'dishes_rows.utf8.json'), 'utf8'));
      } catch (utf8Error) {
        // Если UTF-8 файлы не найдены, пробуем оригинальные
        categoriesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'categories_rows (1).json'), 'utf8'));
        dishesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'dishes_rows (1).json'), 'utf8'));
      }
      bannersData = []; // Пустой массив для баннеров - они будут добавляться через админку
    }

    categories = categoriesData.map(cat => ({
      id: cat.id,
      name: typeof cat.name === 'string' ? JSON.parse(cat.name) : cat.name,
      image: (cat.image || cat.image_url || '/categories/default.jpg').replace(/^\/+/, '/')
    }));

    menuItems = dishesData.map(dish => {
      const dishName = typeof dish.name === 'string' ? JSON.parse(dish.name) : dish.name;
      const img = (dish.image || '').replace(/^\/+/, '');
      
      // Словарь исправленных переводов
      const translationFixes = {
        "lamb-seeds": {"zh":"羊籽","en":"Lamb Seeds","ru":"Ягнячьи семечки","tj":"Тукмаи барра"},
        "waguri-ribs": {"zh":"瓦古里肋排","en":"Waguri Ribs","ru":"Ребрышки Вагури","tj":"Кабобгоҳи Вагури"},
        "stewed-dum": {"zh":"炖羊肩","en":"Stewed Dum","ru":"Тушеная лопатка","tj":"Шонаи туш"},
        "stewed-tush": {"zh":"炖羊臀","en":"Stewed Tush","ru":"Тушеная задняя часть","tj":"Пушти туш"},
        "pumpkin-beef": {"zh":"南瓜炖牛肉","en":"Pumpkin with Beef","ru":"Тыква с говядиной","tj":"Каду бо говядина"},
        "mini-kiev-cutlet": {"zh":"迷你基辅肉排","en":"Mini Kiev Cutlet","ru":"Мини котлета по-киевски","tj":"Котлетаи хурди Киев"},
        "lula-kebab-breaded": {"zh":"面包屑烤串","en":"Lula Kebab Breaded","ru":"Люля-кебаб в панировке","tj":"Люля-кебаб бо панировка"},
        "lula-kebab": {"zh":"烤串","en":"Lula Kebab","ru":"Люля-кебаб","tj":"Люля-кебаб"},
        "breaded-lyulya-kebab": {"zh":"面包屑烤串","en":"Breaded Lyulya Kebab","ru":"Люля-кебаб в панировке","tj":"Люля-кебаб бо панировка"},
        "lyulya-kebab": {"zh":"烤串","en":"Lyulya Kebab","ru":"Люля-кебаб","tj":"Люля-кебаб"},
        "kazy-potato": {"zh":"卡兹配土豆","en":"Kazy with Potato","ru":"Казы с картошкой","tj":"Казы бо картошка"},
        "warm-salad": {"zh":"温沙拉","en":"Warm Salad","ru":"Теплый салат","tj":"Салати гарм"},
        "burrata-salad": {"zh":"布拉塔沙拉","en":"Burrata","ru":"Буратта","tj":"Буратта"},
        "steak-salad": {"zh":"牛排沙拉","en":"Steak Salad","ru":"Салат со стейком","tj":"Салат бо стейк"},
        "broccoli-salad": {"zh":"西兰花沙拉","en":"Broccoli Salad","ru":"Салат с брокколи","tj":"Салат бо брокколи"},
        "arugula-salad": {"zh":"芝麻菜沙拉","en":"Arugula Salad","ru":"Салат с рукколой","tj":"Салат бо руккола"},
        "adjarian-khachapuri": {"zh":"阿扎尔哈恰普里","en":"Adjarian Khachapuri","ru":"Аджарский хачапури","tj":"Хачапурии Аджария"},
        "imeretian-khachapuri": {"zh":"伊梅列季哈恰普里","en":"Imeretian Khachapuri","ru":"Имеретинский хачапури","tj":"Хачапурии Имеретия"},
        "margalian-khachapuri": {"zh":"马尔加利安哈恰普里","en":"Margalian Khachapuri","ru":"Маргалианский хачапури","tj":"Хачапурии Маргали"},
        "penovani-khachapuri": {"zh":"佩诺瓦尼哈恰普里","en":"Penovani Khachapuri","ru":"Пеновани хачапури","tj":"Хачапурии Пеновани"},
        "stuffed-eggplant": {"zh":"酿茄子","en":"Stuffed Eggplant","ru":"Фаршированные баклажаны","tj":"Боқлажони пур"},
        "stuffed-zucchini": {"zh":"酿西葫芦","en":"Stuffed Zucchini","ru":"Фаршированные кабачки","tj":"Кабачки пур"},
        "eggplant-rolls": {"zh":"茄子卷","en":"Eggplant Rolls","ru":"Рулеты из баклажанов","tj":"Рулети боқлажон"},
        "khinkali": {"zh":"欣卡利","en":"Khinkali","ru":"Хинкали","tj":"Хинкали"},
        "fried-khinkali": {"zh":"炸欣卡利","en":"Fried Khinkali","ru":"Жареные хинкали","tj":"Хинкалии бирён"},
        "hot-beer-assortment": {"zh":"热啤酒拼盘","en":"Hot Beer Assortment","ru":"Горячее пиво ассорти","tj":"Бирои гарми гуногун"},
        "tiramisu": {"zh":"提拉米苏","en":"Tiramisu","ru":"Тирамису","tj":"Тирамису"},
        "chocolate-fondant": {"zh":"巧克力熔岩蛋糕","en":"Chocolate Fondant","ru":"Шоколадный фондан","tj":"Фондани шоколад"},
        "gelato-ice-cream": {"zh":"意式冰淇淋","en":"Gelato Ice Cream","ru":"Мороженое Gelato","tj":"Яхмос бо Gelato"},
        "fruit-salad": {"zh":"水果沙拉","en":"Fruit Salad","ru":"Фруктовый салат","tj":"Салати мева"},
        "assorted-ice-cream": {"zh":"什锦冰淇淋","en":"Assorted Ice Cream","ru":"Мороженое ассорти","tj":"Яхмои гуногун"},
        "fruit-salad-variant": {"zh":"水果沙拉（变体）","en":"Fruit Salad (Variant)","ru":"Фруктовый салат (вариант)","tj":"Салати мева (вариант)"},
        "tropic-dessert": {"zh":"热带","en":"Tropic","ru":"Тропик","tj":"Тропик"},
        "exotic-dessert": {"zh":"异国情调","en":"Exotic","ru":"Экзотика","tj":"Экзотика"},
        "strawberry-boom": {"zh":"草莓爆炸","en":"Strawberry Boom","ru":"Клубничный бум","tj":"Буми тути замин"},
        "banana-fantasy": {"zh":"香蕉幻想","en":"Banana Fantasy","ru":"Банановая фантазия","tj":"Фантазияи банан"},
        "surprise-dessert": {"zh":"惊喜","en":"Surprise","ru":"Сюрприз","tj":"Сюрприз"},
        "chocolate-delight": {"zh":"巧克力喜悦","en":"Chocolate Delight","ru":"Шоколадное наслаждение","tj":"Лаззати шоколад"},
        "pepperoni-25": {"zh":"意大利辣香肠披萨 25厘米","en":"Pepperoni Pizza 25cm","ru":"Пицца пепперони 25 см","tj":"Пиццаи пепперони 25 см"},
        "pepperoni-35": {"zh":"意大利辣香肠披萨 35厘米","en":"Pepperoni Pizza 35cm","ru":"Пицца пепперони 35 см","tj":"Пиццаи пепперони 35 см"},
        "pepperoni-40": {"zh":"意大利辣香肠披萨 40厘米","en":"Pepperoni Pizza 40cm","ru":"Пицца пепперони 40 см","tj":"Пиццаи пепперони 40 см"},
        "four-seasons-25": {"zh":"四季披萨 25厘米","en":"Four Seasons Pizza 25cm","ru":"Пицца четыре сезона 25 см","tj":"Пиццаи чор фасл 25 см"},
        "four-seasons-35": {"zh":"四季披萨 35厘米","en":"Four Seasons Pizza 35cm","ru":"Пицца четыре сезона 35 см","tj":"Пиццаи чор фасл 35 см"},
        "four-seasons-40": {"zh":"四季披萨 40厘米","en":"Four Seasons Pizza 40cm","ru":"Пицца четыре сезона 40 см","tj":"Пиццаи чор фасл 40 см"},
        "chili-35": {"zh":"辣椒披萨 35厘米","en":"Chili Pizza 35cm","ru":"Пицца чили 35 см","tj":"Пиццаи чили 35 см"},
        "chili-40": {"zh":"辣椒披萨 40厘米","en":"Chili Pizza 40cm","ru":"Пицца чили 40 см","tj":"Пиццаи чили 40 см"},
        "empire-35": {"zh":"帝国披萨 35厘米","en":"Empire Pizza 35cm","ru":"Пицца империя 35 см","tj":"Пиццаи империя 35 см"},
        "empire-40": {"zh":"帝国披萨 40厘米","en":"Empire Pizza 40cm","ru":"Пицца империя 40 см","tj":"Пиццаи империя 40 см"},
        "bellissimo-25": {"zh":"贝利西莫披萨 25厘米","en":"Bellissimo Pizza 25cm","ru":"Пицца беллиссимо 25 см","tj":"Пиццаи беллиссимо 25 см"},
        "bellissimo-35": {"zh":"贝利西莫披萨 35厘米","en":"Bellissimo Pizza 35cm","ru":"Пицца беллиссимо 35 см","tj":"Пиццаи беллиссимо 35 см"},
        "bellissimo-40": {"zh":"贝利西莫披萨 40厘米","en":"Bellissimo Pizza 40cm","ru":"Пицца беллиссимо 40 см","tj":"Пиццаи беллиссимо 40 см"},
        "caesar-25": {"zh":"凯撒披萨 25厘米","en":"Caesar Pizza 25cm","ru":"Пицца цезарь 25 см","tj":"Пиццаи цезарь 25 см"},
        "caesar-35": {"zh":"凯撒披萨 35厘米","en":"Caesar Pizza 35cm","ru":"Пицца цезарь 35 см","tj":"Пиццаи цезарь 35 см"},
        "caesar-40": {"zh":"凯撒披萨 40厘米","en":"Caesar Pizza 40cm","ru":"Пицца цезарь 40 см","tj":"Пиццаи цезарь 40 см"},
        "dragon-roll": {"zh":"龙卷","en":"Dragon Roll","ru":"Ролл дракон","tj":"Ролли аждаҳо"},
        "miami-roll": {"zh":"迈阿密卷","en":"Miami Roll","ru":"Ролл майами","tj":"Ролли Майами"},
        "fried-spice-roll": {"zh":"炸香料卷","en":"Fried Spice Roll","ru":"Жареный ролл со специями","tj":"Ролли бирён бо хушк"},
        "sinavo-baked-roll": {"zh":"西纳沃烤卷","en":"Sinavo Baked Roll","ru":"Запеченный ролл синаво","tj":"Ролли пухтаи Синаво"},
        "totomm-roll": {"zh":"托托姆卷","en":"Totomm Roll","ru":"Ролл тотомм","tj":"Ролли Тотомм"},
        "verona-baked-roll": {"zh":"维罗纳烤卷","en":"Verona Baked Roll","ru":"Запеченный ролл верона","tj":"Ролли пухтаи Верона"},
        "caesar-roll": {"zh":"凯撒卷","en":"Caesar Roll","ru":"Ролл цезарь","tj":"Ролли цезарь"},
        "baked-trout-roll": {"zh":"烤鳟鱼卷","en":"Baked Trout Roll","ru":"Запеченный ролл с форелью","tj":"Ролли пухтаи форел"},
        "royal-roll": {"zh":"皇家卷","en":"Royal Roll","ru":"Королевский ролл","tj":"Ролли шоҳӣ"},
        "signature-trout-roll": {"zh":"招牌鳟鱼卷","en":"Signature Trout Roll","ru":"Фирменный ролл с форелью","tj":"Ролли форели имзо"},
        "philadelphia-vip-roll": {"zh":"费城VIP卷","en":"Philadelphia VIP Roll","ru":"Филадельфия VIP ролл","tj":"Ролли Филадельфия VIP"},
        "hot-shrimp-roll": {"zh":"热虾卷","en":"Hot Shrimp Roll","ru":"Горячий ролл с креветками","tj":"Ролли гарми бо креветка"},
        "ebi-black-roll": {"zh":"黑虾卷","en":"Ebi Black Roll","ru":"Черный ролл эби","tj":"Ролли сиёҳи Эби"},
        "black-eel-roll": {"zh":"黑鳗卷","en":"Black Eel Roll","ru":"Черный ролл с угрем","tj":"Ролли сиёҳи морӣ"},
        "nevada-roll": {"zh":"内华达卷","en":"Nevada Roll","ru":"Ролл невада","tj":"Ролли Невада"},
        "creed-roll": {"zh":"信条卷","en":"Creed Roll","ru":"Ролл крид","tj":"Ролли Крид"},
        "california-roll": {"zh":"加州卷","en":"California Roll","ru":"Калифорнийский ролл","tj":"Ролли Калифорния"},
        "unagi-sushi": {"zh":"鳗鱼寿司","en":"Unagi Sushi","ru":"Суши с угрем","tj":"Суши бо морӣ"},
        "sake-sushi": {"zh":"三文鱼寿司","en":"Sake Sushi","ru":"Суши с лососем","tj":"Суши бо лосось"},
        "ebi-sushi": {"zh":"虾寿司","en":"Ebi Sushi","ru":"Суши с креветкой","tj":"Суши бо креветка"},
        "seven-bato-set": {"zh":"七巴托套餐","en":"Seven Bato Set","ru":"Сет семь бато","tj":"Сети ҳафт бато"},
        "quartet-set": {"zh":"四重奏套餐","en":"Quartet Set","ru":"Сет квартет","tj":"Сети квартет"},
        "kappa-maki-set": {"zh":"黄瓜卷套餐","en":"Kappa Maki Set","ru":"Сет каппа маки","tj":"Сети каппа маки"},
        "ebi-maki-set": {"zh":"虾卷套餐","en":"Ebi Maki Set","ru":"Сет эби маки","tj":"Сети эби маки"},
        "philadelphia-maki": {"zh":"费城卷","en":"Philadelphia Maki","ru":"Филадельфия маки","tj":"Филадельфия маки"},
        "trout-fillet-sauce": {"zh":"鳟鱼片配酱","en":"Trout Fillet with Sauce","ru":"Филе форели с соусом","tj":"Филеи форел бо соус"},
        "trout-fillet-rice": {"zh":"鳟鱼片配米饭","en":"Trout Fillet with Rice","ru":"Филе форели с рисом","tj":"Филеи форел бо биринҷ"},
        "pike-perch-batter": {"zh":"面糊梭鲈","en":"Pike Perch in Batter","ru":"Судак в кляре","tj":"Судак дар хамир"}
      };
      
      // Получаем имя блюда
      let finalName = dishName;
      
      // Если есть исправленный перевод, используем его
      if (translationFixes[dish.id]) {
        finalName = translationFixes[dish.id];
      }
      
      return {
        id: dish.id,
        name: finalName,
        price: parseInt(dish.price),
        category: dish.category_id,
        images: img ? (img.startsWith('http') ? [img] : [`/${img}`]) : [],
        isActive: dish.isActive !== false
      };
    });

    banners = bannersData;

  } catch (error) {
    console.error('Ошибка загрузки данных из файлов:', error);
    // Инициализируем пустые массивы если файлы не найдены
    categories = [];
    menuItems = [];
    banners = []; // Пустой массив для баннеров
  }
}

// Загружаем начальные данные
loadInitialData();

// Диагностика кодировки
console.log('🔍 Диагностика кодировки:');
console.log('📝 LANG:', process.env.LANG);
console.log('📝 LC_ALL:', process.env.LC_ALL);
console.log('📝 LC_CTYPE:', process.env.LC_CTYPE);
console.log('📝 Платформа:', process.platform);
console.log('📝 Версия Node.js:', process.version);

// Middleware для проверки админского доступа
function requireAdmin(req, res, next) {
  const adminCode = req.headers['x-admin-code'] || req.headers['authorization']?.replace('Bearer ', '');
  if (adminCode === '0202') {
    next();
  } else {
    res.status(401).json({ error: 'Неверный код доступа' });
  }
}

// Маршруты для категорий
app.get('/api/categories', (req, res) => {
  // Устанавливаем заголовки для правильной кодировки
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  // Отправляем JSON с правильной кодировкой
  res.send(Buffer.from(JSON.stringify(categories), 'utf8'));
});

app.post('/api/categories', requireAdmin, upload.single('image'), (req, res) => {
  try {
    const { name } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '/categories/default.jpg';
    
    // Парсим JSON из name, если это строка
    let parsedName = name;
    if (typeof name === 'string') {
      try {
        parsedName = JSON.parse(name);
      } catch (e) {
        // Если не удалось распарсить, создаем объект с одним значением
        parsedName = {
          ru: name,
          en: name,
          cn: name,
          tj: name
        };
      }
    }
    
    const newCategory = {
      id: uuidv4(),
      name: parsedName,
      image: image
    };
    
    categories.push(newCategory);
    saveDataToFiles();
    res.json({ success: true, data: newCategory });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/categories/:id', requireAdmin, upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    console.log('PUT /api/categories/:id - Request data:', {
      id,
      name,
      hasFile: !!req.file,
      image
    });
    
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    console.log('Found category at index:', categoryIndex);
    console.log('Current category:', categories[categoryIndex]);
    
    // Парсим JSON из name, если это строка
    if (name) {
      let parsedName = name;
      if (typeof name === 'string') {
        try {
          parsedName = JSON.parse(name);
        } catch (e) {
          // Если не удалось распарсить, создаем объект с одним значением
          parsedName = {
            ru: name,
            en: name,
            cn: name,
            tj: name
          };
        }
      }
      categories[categoryIndex].name = parsedName;
      console.log('Updated name to:', parsedName);
    }
    
    // Обновляем изображение если файл загружен
    if (req.file) {
      categories[categoryIndex].image = image;
      console.log('Updated image to:', image);
    }
    
    console.log('Final category data:', categories[categoryIndex]);
    
    saveDataToFiles();
    res.json({ success: true, data: categories[categoryIndex] });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/categories/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    
    if (categoryIndex === -1) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    // Проверяем, есть ли блюда в этой категории
    const hasItems = menuItems.some(item => item.category === id);
    if (hasItems) {
      return res.status(400).json({ error: 'Нельзя удалить категорию с блюдами' });
    }
    
    categories.splice(categoryIndex, 1);
    saveDataToFiles();
    res.json({ success: true, message: 'Категория удалена' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршруты для меню
app.get('/api/menu', (req, res) => {
  // Возвращаем только активные блюда
  const activeMenuItems = menuItems.filter(item => item.isActive);
  
  // Устанавливаем заголовки для правильной кодировки
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  // Отправляем JSON с правильной кодировкой
  res.send(Buffer.from(JSON.stringify(activeMenuItems), 'utf8'));
});

app.post('/api/menu', requireAdmin, upload.array('images', 5), (req, res) => {
  try {
    const { name, price, category } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const newMenuItem = {
      id: uuidv4(),
      name: JSON.parse(name),
      price: parseFloat(price),
      category,
      images,
      isActive: true
    };
    
    menuItems.push(newMenuItem);
    saveDataToFiles();
    res.json({ success: true, data: newMenuItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/menu/:id', requireAdmin, upload.array('images', 5), (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, isActive } = req.body;
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : undefined;
    
    const itemIndex = menuItems.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }
    
    if (name) menuItems[itemIndex].name = JSON.parse(name);
    if (price) menuItems[itemIndex].price = parseFloat(price);
    if (category) menuItems[itemIndex].category = category;
    if (images) menuItems[itemIndex].images = images;
    if (isActive !== undefined) menuItems[itemIndex].isActive = isActive === 'true';
    
    saveDataToFiles();
    res.json({ success: true, data: menuItems[itemIndex] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/menu/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const itemIndex = menuItems.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Блюдо не найдено' });
    }
    
    menuItems.splice(itemIndex, 1);
    saveDataToFiles();
    res.json({ success: true, message: 'Блюдо удалено' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для изменения порядка категорий
app.post('/api/categories/reorder', requireAdmin, (req, res) => {
  try {
    console.log('Получен запрос на изменение порядка категорий:', req.body);
    const { categoryId, newIndex } = req.body;
    
    console.log('Ищем категорию с ID:', categoryId);
    console.log('Текущие категории:', categories.map(cat => ({ id: cat.id, name: cat.name.ru })));
    
    const categoryIndex = categories.findIndex(cat => cat.id === categoryId);
    console.log('Индекс найденной категории:', categoryIndex);
    
    if (categoryIndex === -1) {
      console.log('Категория не найдена');
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    
    if (newIndex < 0 || newIndex >= categories.length) {
      console.log('Неверный индекс:', newIndex, 'всего категорий:', categories.length);
      return res.status(400).json({ error: 'Неверный индекс' });
    }
    
    console.log('Перемещаем категорию с индекса', categoryIndex, 'на индекс', newIndex);
    
    // Перемещаем элемент
    const [movedCategory] = categories.splice(categoryIndex, 1);
    categories.splice(newIndex, 0, movedCategory);
    
    saveDataToFiles();
    console.log('Порядок категорий изменен успешно');
    res.json({ success: true, message: 'Порядок категорий изменен' });
  } catch (error) {
    console.error('Ошибка при изменении порядка категорий:', error);
    res.status(500).json({ error: error.message });
  }
});

// Маршруты для баннеров
app.get('/api/banners', (req, res) => {
  const activeBanners = banners.filter(banner => banner.isActive);
  
  // Устанавливаем заголовки для правильной кодировки
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  // Отправляем JSON с правильной кодировкой
  res.send(Buffer.from(JSON.stringify(activeBanners), 'utf8'));
});

// Маршрут для получения всех баннеров (для админки)
app.get('/api/admin/banners', requireAdmin, (req, res) => {
  res.json(banners);
});

app.post('/api/banners', requireAdmin, upload.single('image'), (req, res) => {
  try {
    console.log('📝 Добавление нового баннера:', req.body);
    console.log('📁 Загруженный файл:', req.file);
    
    const { isActive, sortOrder } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Изображение обязательно для баннера' });
    }
    
    const image = `/uploads/${req.file.filename}`;
    
    const newBanner = {
      id: uuidv4(),
      image,
      isActive: isActive === 'true',
      sortOrder: parseInt(sortOrder) || banners.length + 1
    };
    
    console.log('✅ Создан новый баннер:', newBanner);
    
    banners.push(newBanner);
    saveDataToFiles();
    
    console.log(`📊 Всего баннеров: ${banners.length}`);
    res.json({ success: true, data: newBanner });
  } catch (error) {
    console.error('❌ Ошибка при добавлении баннера:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/banners/:id', requireAdmin, upload.single('image'), (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, sortOrder } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    
    const bannerIndex = banners.findIndex(banner => banner.id === id);
    if (bannerIndex === -1) {
      return res.status(404).json({ error: 'Баннер не найден' });
    }
    
    if (isActive !== undefined) banners[bannerIndex].isActive = isActive === 'true';
    if (sortOrder) banners[bannerIndex].sortOrder = parseInt(sortOrder);
    if (image) banners[bannerIndex].image = image;
    
    saveDataToFiles();
    res.json({ success: true, data: banners[bannerIndex] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/banners/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const bannerIndex = banners.findIndex(banner => banner.id === id);
    
    if (bannerIndex === -1) {
      return res.status(404).json({ error: 'Баннер не найден' });
    }
    
    banners.splice(bannerIndex, 1);
    saveDataToFiles();
    res.json({ success: true, message: 'Баннер удален' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для изменения порядка баннеров
app.post('/api/banners/reorder', requireAdmin, (req, res) => {
  try {
    const { bannerId, newIndex } = req.body;
    
    const bannerIndex = banners.findIndex(banner => banner.id === bannerId);
    if (bannerIndex === -1) {
      return res.status(404).json({ error: 'Баннер не найден' });
    }
    
    if (newIndex < 0 || newIndex >= banners.length) {
      return res.status(400).json({ error: 'Неверный индекс' });
    }
    
    // Перемещаем элемент
    const [movedBanner] = banners.splice(bannerIndex, 1);
    banners.splice(newIndex, 0, movedBanner);
    
    // Обновляем sortOrder для всех баннеров
    banners.forEach((banner, index) => {
      banner.sortOrder = index + 1;
    });
    
    saveDataToFiles();
    res.json({ success: true, message: 'Порядок баннеров изменен' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для проверки админского доступа
app.post('/api/admin/verify', (req, res) => {
  const { code } = req.body;
  if (code === '0202') {
    res.json({ success: true, message: 'Доступ разрешен' });
  } else {
    res.status(401).json({ error: 'Неверный код доступа' });
  }
});

// Обработка ошибок
app.use((error, req, res, next) => {
  console.error('Ошибка:', error);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
const server = app.listen(PORT, () => {
  console.log(`🚀 API сервер запущен на порту ${PORT}`);
  console.log(`📁 Загружено ${categories.length} категорий`);
  console.log(`🍽 Загружено ${menuItems.length} блюд`);
  console.log(`🖼 Загружено ${banners.length} баннеров`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Получен сигнал SIGINT, сохраняем данные...');
  saveDataToFiles();
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Получен сигнал SIGTERM, сохраняем данные...');
  saveDataToFiles();
  server.close(() => {
    console.log('✅ Сервер остановлен');
    process.exit(0);
  });
});