#!/bin/bash

# Скрипт для остановки проекта Forel с помощью Docker

echo "🛑 Останавливаем проект Forel..."

# Останавливаем контейнеры
docker-compose -f docker-compose.prod.yml down

echo "✅ Проект Forel остановлен!"

# Показываем статус
echo "📊 Статус контейнеров:"
docker-compose -f docker-compose.prod.yml ps
