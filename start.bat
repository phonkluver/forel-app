@echo off
echo 🚀 Запуск проекта Forel...

echo 📦 Останавливаем существующие контейнеры...
docker-compose -f docker-compose.prod.yml down

echo 🔨 Собираем новые Docker образы...
docker-compose -f docker-compose.prod.yml build --no-cache

echo 🚀 Запускаем контейнеры...
docker-compose -f docker-compose.prod.yml up -d

echo ✅ Проверяем статус контейнеров...
docker-compose -f docker-compose.prod.yml ps

echo.
echo 🎉 Деплой завершен!
echo 📱 Веб-приложение доступно на порту 8080
echo 🤖 Telegram WebApp доступен на порту 8081
echo 🔧 API сервер доступен на порту 3001
echo.
pause

