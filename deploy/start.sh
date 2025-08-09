#!/bin/bash

# Скрипт запуска системы ресторана "Форель"
# Запускает API сервер, Telegram бота и веб-приложения

echo "🚀 Запуск системы ресторана 'Форель'..."

# Проверяем наличие Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js не установлен. Установите Node.js версии 18 или выше."
    exit 1
fi

echo "✅ Node.js найден: $(node --version)"

# Создаем необходимые директории
echo "📁 Создание директорий..."
mkdir -p logs
mkdir -p data
mkdir -p uploads

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    npm install
fi

# Проверяем наличие конфигурационных файлов
if [ ! -f "../api-server/config.env" ]; then
    echo "❌ Файл config.env не найден в api-server/"
    exit 1
fi

if [ ! -f "../telegram-bot/config.env" ]; then
    echo "❌ Файл config.env не найден в telegram-bot/"
    exit 1
fi

# Запускаем API сервер в фоне
echo "🌐 Запуск API сервера..."
cd ../api-server
nohup npm start > ../deploy/logs/api.log 2>&1 &
API_PID=$!
echo $API_PID > ../deploy/logs/api.pid
cd ../deploy

# Ждем запуска API сервера
echo "⏳ Ожидание запуска API сервера..."
sleep 5

# Проверяем, что API сервер запустился
if curl -s http://localhost:3001/health > /dev/null; then
    echo "✅ API сервер запущен успешно"
else
    echo "❌ Ошибка запуска API сервера"
    exit 1
fi

# Запускаем Telegram бота в фоне
echo "🤖 Запуск Telegram бота..."
cd ../telegram-bot
nohup node bot.js > ../deploy/logs/bot.log 2>&1 &
BOT_PID=$!
echo $BOT_PID > ../deploy/logs/bot.pid
cd ../deploy

# Ждем запуска бота
echo "⏳ Ожидание запуска Telegram бота..."
sleep 3

# Проверяем, что бот запустился
if ps -p $BOT_PID > /dev/null; then
    echo "✅ Telegram бот запущен успешно"
else
    echo "❌ Ошибка запуска Telegram бота"
    exit 1
fi

# Запускаем веб-сервер для статических файлов (если нужно)
echo "🌍 Запуск веб-сервера для статических файлов..."
cd ../my-project-web/dist
nohup python3 -m http.server 8080 > ../../deploy/logs/web.log 2>&1 &
WEB_PID=$!
echo $WEB_PID > ../../deploy/logs/web.pid
cd ../../deploy

# Запускаем веб-сервер для Telegram WebApp
echo "📱 Запуск веб-сервера для Telegram WebApp..."
cd ../my-project/dist
nohup python3 -m http.server 8081 > ../../deploy/logs/telegram-web.log 2>&1 &
TELEGRAM_WEB_PID=$!
echo $TELEGRAM_WEB_PID > ../../deploy/logs/telegram-web.pid
cd ../../deploy

echo ""
echo "🎉 Система успешно запущена!"
echo ""
echo "📊 Статус сервисов:"
echo "   🌐 API сервер: http://localhost:3001 (PID: $API_PID)"
echo "   🤖 Telegram бот: запущен (PID: $BOT_PID)"
echo "   🌍 Веб-сайт: http://localhost:8080 (PID: $WEB_PID)"
echo "   📱 Telegram WebApp: http://localhost:8081 (PID: $TELEGRAM_WEB_PID)"
echo ""
echo "📁 Логи:"
echo "   API: logs/api.log"
echo "   Бот: logs/bot.log"
echo "   Веб: logs/web.log"
echo "   Telegram WebApp: logs/telegram-web.log"
echo ""
echo "🛑 Для остановки используйте: ./stop.sh"
echo "📋 Для просмотра статуса: ./status.sh"

# Сохраняем PIDs в общий файл
echo "API:$API_PID" > logs/pids.txt
echo "BOT:$BOT_PID" >> logs/pids.txt
echo "WEB:$WEB_PID" >> logs/pids.txt
echo "TELEGRAM_WEB:$TELEGRAM_WEB_PID" >> logs/pids.txt
