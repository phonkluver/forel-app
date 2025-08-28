#!/bin/bash

echo "🚀 Развертывание проекта Forel на TimeWeb..."
echo "=============================================="

# Проверка наличия Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен. Установите Docker сначала."
    exit 1
fi

# Проверка наличия Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose не установлен. Установите Docker Compose сначала."
    exit 1
fi

# Создание .env файла если его нет
if [ ! -f .env ]; then
    echo "📝 Создание файла .env..."
    cat > .env << EOF
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
WEBAPP_URL=https://telegram.forelrest.com
ADMIN_CHAT_ID=-4729513227

# API Configuration
API_BASE_URL=https://forelrest.com/api
PORT=3001
EOF
    echo "✅ Файл .env создан"
fi

# Создание папки для SSL если её нет
if [ ! -d ssl ]; then
    echo "📁 Создание папки ssl..."
    mkdir -p ssl
    echo "✅ Папка ssl создана"
fi

# Остановка существующих контейнеров
echo "🛑 Остановка существующих контейнеров..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Удаление старых образов
echo "🧹 Очистка старых образов..."
docker system prune -f

# Сборка новых образов
echo "🔨 Сборка Docker образов..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Запуск контейнеров
echo "🚀 Запуск контейнеров..."
docker-compose -f docker-compose.prod.yml up -d

# Ожидание запуска сервисов
echo "⏳ Ожидание запуска сервисов..."
sleep 10

# Проверка статуса
echo "✅ Проверка статуса контейнеров..."
docker-compose -f docker-compose.prod.yml ps

# Проверка логов
echo "📋 Проверка логов..."
echo "=== Логи API сервера ==="
docker-compose -f docker-compose.prod.yml logs api-server --tail=10

echo "=== Логи Telegram бота ==="
docker-compose -f docker-compose.prod.yml logs telegram-bot --tail=10

echo "=== Логи веб-приложения ==="
docker-compose -f docker-compose.prod.yml logs web-app --tail=10

echo ""
echo "🎉 Развертывание завершено!"
echo ""
echo "📱 Доступные сервисы:"
echo "   • Основной сайт: http://forelrest.com"
echo "   • Telegram WebApp: https://telegram.forelrest.com"
echo "   • API сервер: https://forelrest.com/api"
echo ""
echo "🔧 Полезные команды:"
echo "   • Статус: docker-compose -f docker-compose.prod.yml ps"
echo "   • Логи: docker-compose -f docker-compose.prod.yml logs -f"
echo "   • Перезапуск: docker-compose -f docker-compose.prod.yml restart"
echo "   • Остановка: docker-compose -f docker-compose.prod.yml down"
echo ""
echo "⚠️  Не забудьте:"
echo "   1. Настроить DNS записи в TimeWeb"
echo "   2. Получить SSL сертификаты"
echo "   3. Обновить WebApp URL в @BotFather"
echo ""
