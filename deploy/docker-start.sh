#!/bin/bash

# Скрипт для запуска проекта Forel с помощью Docker

set -e

echo "🐳 Запуск проекта Forel с помощью Docker..."
echo "📋 Компоненты:"
echo "   - API Server (порт 3001)"
echo "   - Telegram Bot"
echo "   - Web Application (forelrest.com)"
echo "   - Telegram WebApp (telegram.forelrest.com)"
echo "   - Nginx Reverse Proxy (порт 80/443)"
echo ""

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и Docker Compose."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose."
    exit 1
fi

# Проверяем наличие .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Создаем пример..."
    cat > .env << EOF
# Docker Environment Variables
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
EOF
    echo "📝 Создан файл .env. Отредактируйте его перед запуском!"
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Удаляем старые образы (опционально)
read -p "🗑️  Удалить старые образы? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧹 Удаляем старые образы..."
    docker-compose -f docker-compose.prod.yml down --rmi all
fi

# Создаем необходимые директории
echo "📁 Создаем необходимые директории..."
mkdir -p logs/nginx
mkdir -p ssl

# Собираем и запускаем контейнеры
echo "🔨 Собираем и запускаем контейнеры..."
docker-compose -f docker-compose.prod.yml up --build -d

# Ждем запуска сервисов
echo "⏳ Ждем запуска сервисов..."
sleep 15

# Проверяем статус контейнеров
echo "📊 Статус контейнеров:"
docker-compose -f docker-compose.prod.yml ps

# Проверяем логи
echo "📋 Проверяем логи API сервера..."
docker-compose -f docker-compose.prod.yml logs api-server --tail=10

echo ""
echo "✅ Проект Forel запущен с помощью Docker!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   - Веб-сайт: https://forelrest.com"
echo "   - Telegram WebApp: https://telegram.forelrest.com"
echo "   - API: https://forelrest.com/api"
echo "   - Админка: https://forelrest.com/admin (код: 0202)"
echo ""
echo "🔧 Управление:"
echo "   - Остановить: docker-compose -f docker-compose.prod.yml down"
echo "   - Логи: docker-compose -f docker-compose.prod.yml logs -f [service]"
echo "   - Перезапустить: docker-compose -f docker-compose.prod.yml restart [service]"
echo ""
echo "📝 Логи доступны в папке logs/"
echo ""
echo "🎯 Все компоненты запущены и готовы к работе!"
