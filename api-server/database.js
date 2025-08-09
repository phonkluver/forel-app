const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor(dbPath) {
    this.dbPath = dbPath;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      // Создаем директорию для базы данных если её нет
      const dbDir = path.dirname(this.dbPath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
        } else {
          this.createTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function(err) {
        if (err) reject(err);
        else resolve(this);
      });
    });
  }

  async createTables() {
    const queries = [
      // Таблица категорий меню
      `CREATE TABLE IF NOT EXISTS menu_categories (
        id TEXT PRIMARY KEY,
        name_ru TEXT NOT NULL,
        name_en TEXT,
        name_tj TEXT,
        name_cn TEXT,
        image TEXT,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Таблица блюд меню
      `CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        name_ru TEXT NOT NULL,
        name_en TEXT,
        name_tj TEXT,
        name_cn TEXT,
        description_ru TEXT,
        description_en TEXT,
        description_tj TEXT,
        description_cn TEXT,
        price REAL NOT NULL,
        image TEXT,
        category_id TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES menu_categories (id)
      )`,

      // Таблица промо-баннеров
      `CREATE TABLE IF NOT EXISTS promo_banners (
        id TEXT PRIMARY KEY,
        image TEXT NOT NULL,
        is_active BOOLEAN DEFAULT 1,
        sort_order INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Таблица заказов
      `CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_address TEXT,
        items TEXT NOT NULL,
        total_amount REAL NOT NULL,
        delivery_fee REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        final_total REAL NOT NULL,
        delivery_method TEXT DEFAULT 'delivery',
        payment_method TEXT DEFAULT 'cash',
        status TEXT DEFAULT 'pending',
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Таблица резерваций
      `CREATE TABLE IF NOT EXISTS reservations (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        customer_email TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        guests_count INTEGER NOT NULL,
        table_type TEXT,
        special_requests TEXT,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Таблица отзывов
      `CREATE TABLE IF NOT EXISTS reviews (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        is_approved BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of queries) {
      await this.run(query);
    }

    // Добавляем дефолтные категории если их нет
    await this.addDefaultCategories();
  }

  async addDefaultCategories() {
    const defaultCategories = [
      {
        id: 'salads',
        name_ru: 'Салаты',
        name_en: 'Salads',
        name_tj: 'Салатҳо',
        name_cn: '沙拉',
        image: '/categories/salads.jpg',
        sort_order: 1
      },
      {
        id: 'soups',
        name_ru: 'Первые блюда',
        name_en: 'Soups',
        name_tj: 'Шӯрбоҳо',
        name_cn: '汤类',
        image: '/categories/soups.jpg',
        sort_order: 2
      },
      {
        id: 'meat',
        name_ru: 'Вторые блюда — мясо',
        name_en: 'Meat Dishes',
        name_tj: 'Таомҳои гӯштӣ',
        name_cn: '肉类主菜',
        image: '/categories/meat.jpg',
        sort_order: 3
      },
      {
        id: 'fish',
        name_ru: 'Вторые блюда — рыба',
        name_en: 'Fish Dishes',
        name_tj: 'Таомҳои моҳӣ',
        name_cn: '鱼类主菜',
        image: '/categories/fish.jpg',
        sort_order: 4
      },
      {
        id: 'pasta',
        name_ru: 'Пасты',
        name_en: 'Pasta',
        name_tj: 'Пастаҳо',
        name_cn: '意面',
        image: '/categories/pasta.jpg',
        sort_order: 5
      },
      {
        id: 'appetizers',
        name_ru: 'Ассорти и закуски',
        name_en: 'Appetizers & Snacks',
        name_tj: 'Газакҳо',
        name_cn: '开胃菜和小食',
        image: '/categories/appetizers.jpg',
        sort_order: 6
      },
      {
        id: 'garnish',
        name_ru: 'Гарниры',
        name_en: 'Side Dishes',
        name_tj: 'Гарнирҳо',
        name_cn: '配菜',
        image: '/categories/garnish.jpg',
        sort_order: 7
      },
      {
        id: 'cutlets',
        name_ru: 'Котлеты',
        name_en: 'Cutlets',
        name_tj: 'Котлетҳо',
        name_cn: '肉饼',
        image: '/categories/cutlets.jpg',
        sort_order: 8
      },
      {
        id: 'ribs',
        name_ru: 'Рёбра и кайла',
        name_en: 'Ribs & Kayla',
        name_tj: 'Қабурға ва кайла',
        name_cn: '肋排和烤肉',
        image: '/categories/ribs.jpg',
        sort_order: 9
      },
      {
        id: 'steaks',
        name_ru: 'Стейки',
        name_en: 'Steaks',
        name_tj: 'Стейкҳо',
        name_cn: '牛排',
        image: '/categories/steaks.jpg',
        sort_order: 10
      },
      {
        id: 'kebab',
        name_ru: 'Шашлыки',
        name_en: 'Shashlik (BBQ Skewers)',
        name_tj: 'Кабобҳо',
        name_cn: '烤肉串',
        image: '/categories/kebab.jpg',
        sort_order: 11
      },
      {
        id: 'special',
        name_ru: 'Спецзаказ (ассорти)',
        name_en: 'Special Orders (Assorted)',
        name_tj: 'Фармоишҳои махсус',
        name_cn: '特色拼盘',
        image: '/categories/special.jpg',
        sort_order: 12
      },
      {
        id: 'drinks',
        name_ru: 'Напитки',
        name_en: 'Drinks',
        name_tj: 'Нӯшокиҳо',
        name_cn: '饮品',
        image: '/categories/drinks.jpg',
        sort_order: 13
      }
    ];

    for (const category of defaultCategories) {
      await this.run(
        `INSERT OR IGNORE INTO menu_categories 
         (id, name_ru, name_en, name_tj, name_cn, image, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [category.id, category.name_ru, category.name_en, category.name_tj, category.name_cn, category.image, category.sort_order]
      );
    }
  }

  // Методы для работы с категориями меню
  async getMenuCategories() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM menu_categories WHERE is_active = 1 ORDER BY sort_order', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getAllMenuCategories() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM menu_categories ORDER BY sort_order', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async addMenuCategory(category) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO menu_categories (
          id, name_ru, name_en, name_tj, name_cn, image, sort_order, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        category.id, category.name_ru, category.name_en, category.name_tj, category.name_cn,
        category.image, category.sort_order, category.is_active
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      
      stmt.finalize();
    });
  }

  async updateMenuCategory(id, category) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        UPDATE menu_categories SET
          name_ru = ?, name_en = ?, name_tj = ?, name_cn = ?,
          image = ?, sort_order = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      stmt.run([
        category.name_ru, category.name_en, category.name_tj, category.name_cn,
        category.image, category.sort_order, category.is_active, id
      ], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
      
      stmt.finalize();
    });
  }

  async deleteMenuCategory(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM menu_categories WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  async getMenuCategoryById(id) {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT * FROM menu_categories WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Методы для работы с меню
  async getMenuItems() {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT mi.*, mc.name_ru as category_name_ru, mc.name_en as category_name_en, 
               mc.name_tj as category_name_tj, mc.name_cn as category_name_cn
        FROM menu_items mi
        LEFT JOIN menu_categories mc ON mi.category_id = mc.id
        WHERE mi.is_active = 1
        ORDER BY mc.sort_order, mi.sort_order, mi.name_ru
      `, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async getMenuItemsByCategory(categoryId) {
    return new Promise((resolve, reject) => {
      this.db.all(`
        SELECT mi.*, mc.name_ru as category_name_ru, mc.name_en as category_name_en, 
               mc.name_tj as category_name_tj, mc.name_cn as category_name_cn
        FROM menu_items mi
        LEFT JOIN menu_categories mc ON mi.category_id = mc.id
        WHERE mi.category_id = ? AND mi.is_active = 1
        ORDER BY mi.sort_order, mi.name_ru
      `, [categoryId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async addMenuItem(item) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO menu_items (
          id, name_ru, name_en, name_tj, name_cn,
          description_ru, description_en, description_tj, description_cn,
          price, image, category_id, is_active, sort_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        item.id, item.name_ru, item.name_en, item.name_tj, item.name_cn,
        item.description_ru, item.description_en, item.description_tj, item.description_cn,
        item.price, item.image, item.category_id, item.is_active, item.sort_order
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      
      stmt.finalize();
    });
  }

  async updateMenuItem(id, item) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        UPDATE menu_items SET
          name_ru = ?, name_en = ?, name_tj = ?, name_cn = ?,
          description_ru = ?, description_en = ?, description_tj = ?, description_cn = ?,
          price = ?, image = ?, category_id = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      stmt.run([
        item.name_ru, item.name_en, item.name_tj, item.name_cn,
        item.description_ru, item.description_en, item.description_tj, item.description_cn,
        item.price, item.image, item.category_id, item.is_active, item.sort_order, id
      ], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
      
      stmt.finalize();
    });
  }

  async deleteMenuItem(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM menu_items WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  // Методы для работы с баннерами
  async getBanners() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM promo_banners ORDER BY sort_order', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async addBanner(banner) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO promo_banners (id, image, is_active, sort_order)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run([banner.id, banner.image, banner.isActive, banner.sortOrder], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      
      stmt.finalize();
    });
  }

  async updateBanner(id, banner) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        UPDATE promo_banners SET
          image = ?, is_active = ?, sort_order = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      stmt.run([banner.image, banner.isActive, banner.sortOrder, id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
      
      stmt.finalize();
    });
  }

  async deleteBanner(id) {
    return new Promise((resolve, reject) => {
      this.db.run('DELETE FROM promo_banners WHERE id = ?', [id], function(err) {
        if (err) reject(err);
        else resolve(this.changes);
      });
    });
  }

  // Методы для работы с заказами
  async addOrder(order) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO orders (
          id, user_id, telegram_id, items, total, status, customer_info, payment_method
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        order.id, order.user_id, order.telegram_id,
        JSON.stringify(order.items), order.total, order.status,
        JSON.stringify(order.customer_info), order.payment_method
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      
      stmt.finalize();
    });
  }

  async getOrders() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM orders ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows.map(row => ({
          ...row,
          items: JSON.parse(row.items),
          customer_info: JSON.parse(row.customer_info)
        })));
      });
    });
  }

  // Методы для работы с резервациями
  async addReservation(reservation) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO reservations (id, name, phone, date, time, guests)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        reservation.id, reservation.name, reservation.phone,
        reservation.date, reservation.time, reservation.guests
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      
      stmt.finalize();
    });
  }

  async getReservations() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM reservations ORDER BY date, time', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Методы для работы с отзывами
  async addReview(review) {
    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(`
        INSERT INTO reviews (id, user_name, user_telegram_id, review_text, rating)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        review.id, review.user_name, review.user_telegram_id,
        review.review_text, review.rating
      ], function(err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
      
      stmt.finalize();
    });
  }

  async getReviews() {
    return new Promise((resolve, reject) => {
      this.db.all('SELECT * FROM reviews ORDER BY created_at DESC', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    this.db.close();
  }
}

module.exports = new Database(process.env.DB_PATH || './data/forel.db');
