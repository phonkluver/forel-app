const express = require('express');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../database');
const { verifyToken, requireAdmin } = require('../middleware');

const router = express.Router();

// Настройка multer для загрузки изображений
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// GET /api/menu - Получить все блюда
router.get('/', async (req, res) => {
  try {
    const menuItems = await db.getMenuItems();
    
    // Группируем блюда по категориям
    const categories = {};
    menuItems.forEach(item => {
      if (!categories[item.category]) {
        categories[item.category] = [];
      }
      
      categories[item.category].push({
        id: item.id,
        name: {
          ru: item.name_ru,
          en: item.name_en,
          tj: item.name_tj,
          cn: item.name_cn
        },
        description: {
          ru: item.description_ru,
          en: item.description_en,
          tj: item.description_tj,
          cn: item.description_cn
        },
        price: item.price,
        image: item.image,
        category: item.category
      });
    });
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu items'
    });
  }
});

// GET /api/menu/categories - Получить список категорий
router.get('/categories', async (req, res) => {
  try {
    const menuItems = await db.getMenuItems();
    const categories = [...new Set(menuItems.map(item => item.category))];
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories'
    });
  }
});

// GET /api/menu/category/:category - Получить блюда по категории
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const menuItems = await db.getMenuItemsByCategory(category);
    
    const formattedItems = menuItems.map(item => ({
      id: item.id,
      name: {
        ru: item.name_ru,
        en: item.name_en,
        tj: item.name_tj,
        cn: item.name_cn
      },
      description: {
        ru: item.description_ru,
        en: item.description_en,
        tj: item.description_tj,
        cn: item.description_cn
      },
      price: item.price,
      image: item.image,
      category: item.category
    }));
    
    res.json({
      success: true,
      data: formattedItems
    });
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch menu items by category'
    });
  }
});

// POST /api/menu - Добавить новое блюдо (только админ)
router.post('/', verifyToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const {
      name_ru, name_en, name_tj, name_cn,
      description_ru, description_en, description_tj, description_cn,
      price, category
    } = req.body;
    
    // Валидация данных
    if (!name_ru || !name_en || !name_tj || !name_cn ||
        !description_ru || !description_en || !description_tj || !description_cn ||
        !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Image is required'
      });
    }
    
    const menuItem = {
      id: uuidv4(),
      name: {
        ru: name_ru,
        en: name_en,
        tj: name_tj,
        cn: name_cn
      },
      description: {
        ru: description_ru,
        en: description_en,
        tj: description_tj,
        cn: description_cn
      },
      price: parseFloat(price),
      image: `/uploads/${req.file.filename}`,
      category: category
    };
    
    await db.addMenuItem(menuItem);
    
    res.status(201).json({
      success: true,
      data: menuItem,
      message: 'Menu item added successfully'
    });
  } catch (error) {
    console.error('Error adding menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add menu item'
    });
  }
});

// PUT /api/menu/:id - Обновить блюдо (только админ)
router.put('/:id', verifyToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name_ru, name_en, name_tj, name_cn,
      description_ru, description_en, description_tj, description_cn,
      price, category
    } = req.body;
    
    // Валидация данных
    if (!name_ru || !name_en || !name_tj || !name_cn ||
        !description_ru || !description_en || !description_tj || !description_cn ||
        !price || !category) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }
    
    const menuItem = {
      name: {
        ru: name_ru,
        en: name_en,
        tj: name_tj,
        cn: name_cn
      },
      description: {
        ru: description_ru,
        en: description_en,
        tj: description_tj,
        cn: description_cn
      },
      price: parseFloat(price),
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      category: category
    };
    
    const result = await db.updateMenuItem(id, menuItem);
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Menu item updated successfully'
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update menu item'
    });
  }
});

// DELETE /api/menu/:id - Удалить блюдо (только админ)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.deleteMenuItem(id);
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        error: 'Menu item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete menu item'
    });
  }
});

module.exports = router;
