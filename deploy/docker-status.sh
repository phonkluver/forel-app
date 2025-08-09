#!/bin/bash

# Скрипт для проверки статуса проекта Forel с помощью Docker

echo "📊 Статус проекта Forel..."
echo ""

# Проверяем статус контейнеров
echo "🐳 Статус контейнеров:"
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "📋 Логи последних событий:"
docker-compose -f docker-compose.prod.yml logs --tail=5

echo ""
echo "🔍 Проверка доступности сервисов:"

# Проверяем API
if curl -s https://forelrest.com/api/health > /dev/null 2>&1; then
    echo "✅ API сервер доступен (https://forelrest.com/api)"
else
    echo "❌ API сервер недоступен (https://forelrest.com/api)"
fi

# Проверяем веб-сайт
if curl -s https://forelrest.com > /dev/null 2>&1; then
    echo "✅ Веб-сайт доступен (https://forelrest.com)"
else
    echo "❌ Веб-сайт недоступен (https://forelrest.com)"
fi

# Проверяем Telegram WebApp
if curl -s https://telegram.forelrest.com > /dev/null 2>&1; then
    echo "✅ Telegram WebApp доступен (https://telegram.forelrest.com)"
else
    echo "❌ Telegram WebApp недоступен (https://telegram.forelrest.com)"
fi

# Проверяем Nginx
if curl -s http://localhost:80 > /dev/null 2>&1; then
    echo "✅ Nginx доступен (http://localhost:80)"
else
    echo "❌ Nginx недоступен (http://localhost:80)"
fi

echo ""
echo "💾 Использование диска:"
docker system df

echo ""
echo "🔧 Полезные команды:"
echo "   - Логи API: docker-compose -f docker-compose.prod.yml logs -f api-server"
echo "   - Логи веб-сайта: docker-compose -f docker-compose.prod.yml logs -f web-app"
echo "   - Логи Telegram WebApp: docker-compose -f docker-compose.prod.yml logs -f telegram-webapp"
echo "   - Логи бота: docker-compose -f docker-compose.prod.yml logs -f telegram-bot"
echo "   - Логи Nginx: docker-compose -f docker-compose.prod.yml logs -f nginx"
echo ""
echo "🌐 Доступные URL:"
echo "   - Веб-сайт: https://forelrest.com"
echo "   - Telegram WebApp: https://telegram.forelrest.com"
echo "   - API: https://forelrest.com/api"
echo "   - Админка: https://forelrest.com/admin (код: 0202)"
