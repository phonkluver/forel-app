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
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
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

// GET /api/banners - Получить все баннеры
router.get('/', async (req, res) => {
  try {
    const banners = await db.getBanners();
    
    const formattedBanners = banners.map(banner => ({
      id: banner.id,
      image: banner.image,
      isActive: Boolean(banner.is_active),
      sortOrder: banner.sort_order
    }));
    
    res.json({
      success: true,
      data: formattedBanners
    });
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch banners'
    });
  }
});

// GET /api/banners/active - Получить только активные баннеры
router.get('/active', async (req, res) => {
  try {
    const banners = await db.getBanners();
    
    const activeBanners = banners
      .filter(banner => banner.is_active)
      .sort((a, b) => a.sort_order - b.sort_order)
      .map(banner => ({
        id: banner.id,
        image: banner.image,
        isActive: Boolean(banner.is_active),
        sortOrder: banner.sort_order
      }));
    
    res.json({
      success: true,
      data: activeBanners
    });
  } catch (error) {
    console.error('Error fetching active banners:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch active banners'
    });
  }
});

// POST /api/banners - Добавить новый баннер (только админ)
router.post('/', verifyToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { isActive, sortOrder } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Image is required'
      });
    }
    
    const banner = {
      id: uuidv4(),
      image: `/uploads/${req.file.filename}`,
      isActive: isActive === 'true' || isActive === true,
      sortOrder: parseInt(sortOrder) || 0
    };
    
    await db.addBanner(banner);
    
    res.status(201).json({
      success: true,
      data: banner,
      message: 'Banner added successfully'
    });
  } catch (error) {
    console.error('Error adding banner:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add banner'
    });
  }
});

// PUT /api/banners/:id - Обновить баннер (только админ)
router.put('/:id', verifyToken, requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive, sortOrder } = req.body;
    
    const banner = {
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
      isActive: isActive === 'true' || isActive === true,
      sortOrder: parseInt(sortOrder) || 0
    };
    
    const result = await db.updateBanner(id, banner);
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Banner updated successfully'
    });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update banner'
    });
  }
});

// DELETE /api/banners/:id - Удалить баннер (только админ)
router.delete('/:id', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await db.deleteBanner(id);
    
    if (result === 0) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete banner'
    });
  }
});

// PUT /api/banners/:id/toggle - Переключить активность баннера (только админ)
router.put('/:id/toggle', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Сначала получаем текущий баннер
    const banners = await db.getBanners();
    const currentBanner = banners.find(b => b.id === id);
    
    if (!currentBanner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }
    
    const banner = {
      image: currentBanner.image,
      isActive: !currentBanner.is_active,
      sortOrder: currentBanner.sort_order
    };
    
    await db.updateBanner(id, banner);
    
    res.json({
      success: true,
      message: 'Banner toggled successfully',
      data: {
        id: id,
        isActive: banner.isActive
      }
    });
  } catch (error) {
    console.error('Error toggling banner:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to toggle banner'
    });
  }
});

// PUT /api/banners/reorder - Изменить порядок баннеров (только админ)
router.put('/reorder', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { bannerIds } = req.body;
    
    if (!Array.isArray(bannerIds)) {
      return res.status(400).json({
        success: false,
        error: 'bannerIds must be an array'
      });
    }
    
    // Обновляем порядок для каждого баннера
    for (let i = 0; i < bannerIds.length; i++) {
      const bannerId = bannerIds[i];
      const banners = await db.getBanners();
      const currentBanner = banners.find(b => b.id === bannerId);
      
      if (currentBanner) {
        const banner = {
          image: currentBanner.image,
          isActive: currentBanner.is_active,
          sortOrder: i + 1
        };
        
        await db.updateBanner(bannerId, banner);
      }
    }
    
    res.json({
      success: true,
      message: 'Banners reordered successfully'
    });
  } catch (error) {
    console.error('Error reordering banners:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reorder banners'
    });
  }
});

module.exports = router;
