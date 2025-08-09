const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Middleware для проверки CORS
const corsMiddleware = (req, res, next) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};

// Middleware для проверки админского кода
const adminAuthMiddleware = (req, res, next) => {
  const { adminCode } = req.body;
  
  if (!adminCode) {
    return res.status(401).json({ 
      success: false, 
      error: 'Admin code is required' 
    });
  }
  
  if (adminCode !== process.env.ADMIN_CODE) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid admin code' 
    });
  }
  
  // Генерируем JWT токен для админа
  const token = jwt.sign(
    { role: 'admin', timestamp: Date.now() },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.json({ 
    success: true, 
    token,
    message: 'Admin authentication successful' 
  });
};

// Middleware для проверки JWT токена
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'Access token required' 
    });
  }
  
  const token = authHeader.substring(7);
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

// Middleware для проверки роли админа
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      error: 'Admin access required' 
    });
  }
  next();
};

// Middleware для логирования запросов
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
  next();
};

// Middleware для обработки ошибок
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Middleware для валидации JSON
const validateJson = (req, res, next) => {
  if (req.headers['content-type'] === 'application/json') {
    try {
      JSON.parse(JSON.stringify(req.body));
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: 'Invalid JSON format'
      });
    }
  } else {
    next();
  }
};

// Комбинированный middleware для аутентификации админа
const authenticateAdmin = [verifyToken, requireAdmin];

module.exports = {
  corsMiddleware,
  adminAuthMiddleware,
  verifyToken,
  requireAdmin,
  authenticateAdmin,
  requestLogger,
  errorHandler,
  validateJson
};
