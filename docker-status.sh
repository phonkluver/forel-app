#!/bin/bash

echo "📊 Статус проекта Forel..."

echo "🐳 Контейнеры:"
docker compose -f docker-compose.prod.yml ps

echo ""
echo "🌐 Проверка доступности сервисов:"

# Проверяем API сервер
if curl -s http://localhost:3001/api/menu > /dev/null; then
    echo "✅ API Server (порт 3001) - доступен"
else
    echo "❌ API Server (порт 3001) - недоступен"
fi

# Проверяем веб-приложение
if curl -s http://localhost:8080 > /dev/null; then
    echo "✅ Web App (порт 8080) - доступен"
else
    echo "❌ Web App (порт 8080) - недоступен"
fi

# Проверяем Telegram WebApp
if curl -s http://localhost:8081 > /dev/null; then
    echo "✅ Telegram WebApp (порт 8081) - доступен"
else
    echo "❌ Telegram WebApp (порт 8081) - недоступен"
fi

echo ""
echo "📝 Для просмотра логов: docker compose -f docker-compose.prod.yml logs -f"

