#!/bin/bash

# Скрипт для запуска проекта Forel в режиме разработки с помощью Docker

set -e

echo "🐳 Запуск проекта Forel в режиме разработки с помощью Docker..."

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker и Docker Compose."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose."
    exit 1
fi

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.dev.yml down

# Собираем и запускаем контейнеры
echo "🔨 Собираем и запускаем контейнеры в режиме разработки..."
docker-compose -f docker-compose.dev.yml up --build -d

# Ждем запуска сервисов
echo "⏳ Ждем запуска сервисов..."
sleep 15

# Проверяем статус контейнеров
echo "📊 Статус контейнеров:"
docker-compose -f docker-compose.dev.yml ps

echo ""
echo "✅ Проект Forel запущен в режиме разработки!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   - Веб-сайт: http://localhost:3000"
echo "   - Telegram WebApp: http://localhost:8081"
echo "   - API: http://localhost:3001/api"
echo "   - Админка: http://localhost:3000/admin (код: 0202)"
echo ""
echo "🔧 Управление:"
echo "   - Остановить: docker-compose -f docker-compose.dev.yml down"
echo "   - Логи: docker-compose -f docker-compose.dev.yml logs -f [service]"
echo "   - Перезапустить: docker-compose -f docker-compose.dev.yml restart [service]"
echo ""
echo "📝 Режим разработки:"
echo "   - Изменения в коде автоматически перезагружаются"
echo "   - Логи выводятся в реальном времени"
echo "   - Hot reload включен для всех сервисов"
