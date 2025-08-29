# 🍽️ Forel Restaurant API Server

API сервер для ресторана Forel с поддержкой многоязычного меню.

## 🚀 Запуск

```bash
npm start
# или
node server.js
```

## 📊 Проверка данных

```bash
node check-all-dishes.js
```

## 🌍 Поддерживаемые языки

- 🇷🇺 Русский (`ru`)
- 🇺🇸 Английский (`en`)
- 🇨🇳 Китайский (`zh`)
- 🇹🇯 Таджикский (`tj`)

## 📁 Основные файлы

- `server.js` - основной сервер
- `categories_current.json` - категории блюд
- `dishes_current.json` - блюда меню
- `banners_current.json` - баннеры
- `check-all-dishes.js` - скрипт проверки данных

## 🔧 API Endpoints

- `GET /api/categories` - категории
- `GET /api/dishes` - блюда
- `GET /api/banners` - баннеры

## ✅ Статус

- **Категорий**: 18 (все с переводами)
- **Блюд**: 232 (все с переводами)
- **Переводы**: Полная поддержка китайского языка
