#!/bin/bash

# Скрипт запуска системы ресторана "Форель" (один сервер)
# forelrest.com - веб-сайт
# telegram.forelrest.com - Telegram WebApp

echo "🚀 Запуск системы ресторана 'Форель' (один сервер)..."

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

# Проверяем наличие конфигурационных файлов
if [ ! -f "../api-server/config.env" ]; then
    echo "❌ Файл config.env не найден в api-server/"
    exit 1
fi

if [ ! -f "../telegram-bot/config.env" ]; then
    echo "❌ Файл config.env не найден в telegram-bot/"
    exit 1
fi

# Останавливаем существующие процессы
echo "🛑 Остановка существующих процессов..."
./stop.sh

# Ждем завершения процессов
sleep 2

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

# Собираем веб-сайт если нужно
echo "🏗️ Сборка веб-сайта..."
cd ../my-project-web
if [ ! -d "dist" ] || [ "$(find dist -maxdepth 0 -empty 2>/dev/null)" ]; then
    echo "📦 Установка зависимостей веб-сайта..."
    npm install
    echo "🔨 Сборка веб-сайта..."
    npm run build
fi

# Запускаем веб-сервер для веб-сайта
echo "🌍 Запуск веб-сервера для веб-сайта (forelrest.com)..."
cd dist
nohup python3 -m http.server 8080 > ../../deploy/logs/web.log 2>&1 &
WEB_PID=$!
echo $WEB_PID > ../../deploy/logs/web.pid
cd ../../deploy

# Собираем Telegram WebApp если нужно
echo "🏗️ Сборка Telegram WebApp..."
cd ../my-project
if [ ! -d "dist" ] || [ "$(find dist -maxdepth 0 -empty 2>/dev/null)" ]; then
    echo "📦 Установка зависимостей Telegram WebApp..."
    npm install
    echo "🔨 Сборка Telegram WebApp..."
    npm run build
fi

# Запускаем веб-сервер для Telegram WebApp
echo "📱 Запуск веб-сервера для Telegram WebApp (telegram.forelrest.com)..."
cd dist
nohup python3 -m http.server 8081 > ../../deploy/logs/telegram-web.log 2>&1 &
TELEGRAM_WEB_PID=$!
echo $TELEGRAM_WEB_PID > ../../deploy/logs/telegram-web.pid
cd ../../deploy

# Ждем запуска веб-серверов
echo "⏳ Ожидание запуска веб-серверов..."
sleep 3

# Проверяем, что веб-серверы запустились
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Веб-сайт запущен успешно (порт 8080)"
else
    echo "❌ Ошибка запуска веб-сайта"
fi

if curl -s http://localhost:8081 > /dev/null; then
    echo "✅ Telegram WebApp запущен успешно (порт 8081)"
else
    echo "❌ Ошибка запуска Telegram WebApp"
fi

echo ""
echo "🎉 Система успешно запущена!"
echo ""
echo "📊 Статус сервисов:"
echo "   🌐 API сервер: http://localhost:3001 (PID: $API_PID)"
echo "   🤖 Telegram бот: запущен (PID: $BOT_PID)"
echo "   🌍 Веб-сайт: http://localhost:8080 (PID: $WEB_PID)"
echo "   📱 Telegram WebApp: http://localhost:8081 (PID: $TELEGRAM_WEB_PID)"
echo ""
echo "🌐 Домены:"
echo "   🌍 Веб-сайт: https://forelrest.com"
echo "   📱 Telegram WebApp: https://telegram.forelrest.com"
echo "   🔐 Админка: https://forelrest.com/admin (код: 0202)"
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

echo ""
echo "✅ Все сервисы запущены и готовы к работе!"
