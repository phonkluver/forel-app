#!/bin/bash

echo "🚀 Начинаем деплой проекта Forel..."

# Остановка существующих контейнеров
echo "📦 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Сборка новых образов
echo "🔨 Собираем новые Docker образы..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Запуск контейнеров
echo "🚀 Запускаем контейнеры..."
docker-compose -f docker-compose.prod.yml up -d

# Проверка статуса
echo "✅ Проверяем статус контейнеров..."
docker-compose -f docker-compose.prod.yml ps

echo "🎉 Деплой завершен!"
echo "📱 Веб-приложение доступно на порту 8080"
echo "🤖 Telegram WebApp доступен на порту 8081"
echo "🔧 API сервер доступен на порту 3001"

