const express = require('express');
const { adminAuthMiddleware } = require('../middleware');

const router = express.Router();

// POST /api/auth/admin - Аутентификация админа по коду
router.post('/admin', adminAuthMiddleware);

// GET /api/auth/verify - Проверка валидности токена
router.get('/verify', (req, res) => {
  res.json({
    success: true,
    message: 'Token is valid'
  });
});

module.exports = router;
