#!/bin/bash

echo "🐳 Запуск проекта Forel с помощью Docker..."
echo "📋 Компоненты:"
echo "  - API Server (порт 3001)"
echo "  - Telegram Bot"
echo "  - Web Application (forelrest.com)"
echo "  - Telegram WebApp (telegram.forelrest.com)"
echo "  - Nginx Reverse Proxy (порт 80/443)"

# Создаем .env файл если его нет
if [ ! -f .env ]; then
    echo "📝 Создаем .env файл..."
    cat > .env << 'EOF'
# Docker Environment Variables
JWT_SECRET=forel_restaurant_jwt_secret_key_2024_secure_and_unique
TELEGRAM_BOT_TOKEN=8448547384:AAEiORI0JIrXoo6LYubHDdEHTeH3fTXCdVs
TELEGRAM_ADMIN_CHAT_ID=-4729513227
EOF
    echo "✅ .env файл создан"
fi

echo "🛑 Останавливаем существующие контейнеры..."
docker compose down

echo "🔨 Собираем и запускаем контейнеры..."
docker compose -f docker-compose.prod.yml up --build -d

echo "⏳ Ждем запуска сервисов..."
sleep 10

echo "📊 Проверяем статус контейнеров..."
docker compose -f docker-compose.prod.yml ps

echo "🌐 Проверяем доступность сервисов..."
echo "  - API Server: http://localhost:3001"
echo "  - Web App: http://localhost:8080"
echo "  - Telegram WebApp: http://localhost:8081"

echo "✅ Проект запущен!"
echo "📝 Для просмотра логов используйте: docker compose -f docker-compose.prod.yml logs -f"

