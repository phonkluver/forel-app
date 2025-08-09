require('dotenv').config({ path: './config.env' });
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');

// Middleware
const {
  corsMiddleware,
  requestLogger,
  errorHandler,
  validateJson
} = require('./middleware');

// Routes
const authRoutes = require('./routes/auth');
const menuRoutes = require('./routes/menu');
const bannerRoutes = require('./routes/banners');
const categoryRoutes = require('./routes/categories');

// Database
const db = require('./database');

// Initialize database
db.init().then(() => {
  console.log('✅ Database initialized successfully');
}).catch(err => {
  console.error('❌ Database initialization failed:', err);
  process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 3001;

// Создаем папки для загрузок если их нет
const uploadPath = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(requestLogger);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(validateJson);

// Статические файлы
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/categories', categoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Forel Restaurant API Server',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      menu: '/api/menu',
      banners: '/api/banners',
      categories: '/api/categories',
      health: '/health'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  db.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down server...');
  db.close();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Admin auth: http://localhost:${PORT}/api/auth/admin`);
  console.log(`🍽️ Menu API: http://localhost:${PORT}/api/menu`);
  console.log(`🎨 Banners API: http://localhost:${PORT}/api/banners`);
  console.log(`📂 Categories API: http://localhost:${PORT}/api/categories`);
});

module.exports = app;
