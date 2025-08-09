#!/bin/bash

# Быстрое развертывание системы ресторана "Форель"
# Этот скрипт автоматически настроит и запустит всю систему

echo "🚀 Быстрое развертывание системы ресторана 'Форель'"
echo "=================================================="

# Проверяем, что мы в правильной директории
if [ ! -f "start.sh" ]; then
    echo "❌ Ошибка: запустите скрипт из директории deploy/"
    exit 1
fi

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "📦 Установка Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "✅ Node.js: $(node --version)"

# Проверяем наличие Python3
if ! command -v python3 &> /dev/null; then
    echo "📦 Установка Python3..."
    sudo apt install python3 python3-pip -y
fi

echo "✅ Python3: $(python3 --version)"

# Создаем необходимые директории
echo "📁 Создание директорий..."
mkdir -p logs data uploads backup

# Проверяем наличие конфигурационных файлов
echo "🔧 Проверка конфигурации..."

if [ ! -f "../api-server/config.env" ]; then
    echo "⚠️  Создание конфигурации API сервера..."
    cat > ../api-server/config.env << EOF
PORT=3001
NODE_ENV=production
DB_PATH=./data/forel.db
ADMIN_CODE=0202
JWT_SECRET=forel-restaurant-jwt-secret-key-2024
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_ORIGINS=https://forelrest.com,https://telegram.forelrest.com,http://localhost:3000,http://localhost:5173
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
EOF
fi

if [ ! -f "../telegram-bot/config.env" ]; then
    echo "⚠️  Создание конфигурации Telegram бота..."
    cat > ../telegram-bot/config.env << EOF
BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
WEBAPP_URL=https://telegram.forelrest.com
EOF
fi

# Делаем скрипты исполняемыми
echo "🔧 Настройка скриптов..."
chmod +x start.sh stop.sh status.sh

# Устанавливаем зависимости
echo "📦 Установка зависимостей..."
npm run install-deps

# Собираем проекты
echo "🔨 Сборка проектов..."
npm run build-web
npm run build-telegram

# Проверяем, что сборка прошла успешно
if [ ! -d "../my-project-web/dist" ]; then
    echo "❌ Ошибка сборки веб-сайта"
    exit 1
fi

if [ ! -d "../my-project/dist" ]; then
    echo "❌ Ошибка сборки Telegram WebApp"
    exit 1
fi

echo "✅ Проекты собраны успешно"

# Запускаем систему
echo "🚀 Запуск системы..."
./start.sh

# Ждем немного и проверяем статус
echo "⏳ Ожидание запуска сервисов..."
sleep 10

echo ""
echo "📊 Проверка статуса системы..."
./status.sh

echo ""
echo "🎉 Развертывание завершено!"
echo ""
echo "🌐 Доступные сервисы:"
echo "   API сервер: http://localhost:3001"
echo "   Веб-сайт: http://localhost:8080"
echo "   Telegram WebApp: http://localhost:8081"
echo ""
echo "🔐 Админка: http://localhost:8080/admin (код: 0202)"
echo ""
echo "📁 Логи:"
echo "   API: logs/api.log"
echo "   Бот: logs/bot.log"
echo "   Веб: logs/web.log"
echo "   Telegram WebApp: logs/telegram-web.log"
echo ""
echo "🔧 Управление:"
echo "   Статус: ./status.sh"
echo "   Остановка: ./stop.sh"
echo "   Перезапуск: ./stop.sh && ./start.sh"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте домены в панели управления сервером"
echo "2. Установите SSL сертификаты"
echo "3. Настройте Nginx для проксирования"
echo "4. Обновите конфигурацию с реальными доменами"
echo ""
echo "📖 Подробная инструкция: README.md"
