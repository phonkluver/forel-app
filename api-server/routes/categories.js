const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const db = require('../database');
const { authenticateAdmin } = require('../middleware');

const router = express.Router();

// Настройка multer для загрузки изображений категорий
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.env.UPLOAD_PATH || './uploads', 'categories');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
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
      cb(new Error('Только изображения разрешены!'));
    }
  }
});

// Получить все категории (для админки)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const categories = await db.getAllMenuCategories();
    res.json(categories);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить активные категории (для фронтенда)
router.get('/active', async (req, res) => {
  try {
    const categories = await db.getMenuCategories();
    res.json(categories);
  } catch (error) {
    console.error('Ошибка при получении активных категорий:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Получить категорию по ID
router.get('/:id', async (req, res) => {
  try {
    const category = await db.getMenuCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }
    res.json(category);
  } catch (error) {
    console.error('Ошибка при получении категории:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Добавить новую категорию
router.post('/', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name_ru, name_en, name_tj, name_cn, sort_order, is_active } = req.body;
    
    if (!name_ru) {
      return res.status(400).json({ error: 'Название на русском обязательно' });
    }

    const categoryId = uuidv4();
    const imagePath = req.file ? `/uploads/categories/${req.file.filename}` : null;

    const category = {
      id: categoryId,
      name_ru: name_ru || '',
      name_en: name_en || '',
      name_tj: name_tj || '',
      name_cn: name_cn || '',
      image: imagePath,
      sort_order: parseInt(sort_order) || 0,
      is_active: is_active === 'true' || is_active === true
    };

    await db.addMenuCategory(category);
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Ошибка при добавлении категории:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Обновить категорию
router.put('/:id', authenticateAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name_ru, name_en, name_tj, name_cn, sort_order, is_active } = req.body;
    
    if (!name_ru) {
      return res.status(400).json({ error: 'Название на русском обязательно' });
    }

    // Получаем текущую категорию
    const currentCategory = await db.getMenuCategoryById(req.params.id);
    if (!currentCategory) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    // Определяем путь к изображению
    let imagePath = currentCategory.image;
    if (req.file) {
      // Удаляем старое изображение если есть
      if (currentCategory.image) {
        const oldImagePath = path.join(process.env.UPLOAD_PATH || './uploads', currentCategory.image.replace('/uploads/', ''));
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imagePath = `/uploads/categories/${req.file.filename}`;
    }

    const category = {
      name_ru: name_ru || '',
      name_en: name_en || '',
      name_tj: name_tj || '',
      name_cn: name_cn || '',
      image: imagePath,
      sort_order: parseInt(sort_order) || 0,
      is_active: is_active === 'true' || is_active === true
    };

    await db.updateMenuCategory(req.params.id, category);
    
    res.json({ ...category, id: req.params.id });
  } catch (error) {
    console.error('Ошибка при обновлении категории:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Удалить категорию
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    // Проверяем, есть ли блюда в этой категории
    const itemsInCategory = await db.getMenuItemsByCategory(req.params.id);
    if (itemsInCategory.length > 0) {
      return res.status(400).json({ 
        error: 'Нельзя удалить категорию, в которой есть блюда. Сначала переместите или удалите все блюда из этой категории.' 
      });
    }

    // Получаем информацию о категории для удаления изображения
    const category = await db.getMenuCategoryById(req.params.id);
    if (category && category.image) {
      const imagePath = path.join(process.env.UPLOAD_PATH || './uploads', category.image.replace('/uploads/', ''));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await db.deleteMenuCategory(req.params.id);
    res.json({ message: 'Категория удалена' });
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Переключить активность категории
router.patch('/:id/toggle', authenticateAdmin, async (req, res) => {
  try {
    const category = await db.getMenuCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: 'Категория не найдена' });
    }

    const newActiveState = !category.is_active;
    await db.updateMenuCategory(req.params.id, { ...category, is_active: newActiveState });
    
    res.json({ ...category, is_active: newActiveState });
  } catch (error) {
    console.error('Ошибка при переключении активности категории:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
