#!/bin/bash

echo "🔐 Настройка SSL сертификатов для TimeWeb..."
echo "============================================="

# Проверка наличия certbot
if ! command -v certbot &> /dev/null; then
    echo "❌ Certbot не установлен. Установите certbot:"
    echo "   apt install certbot python3-certbot-nginx -y"
    exit 1
fi

# Остановка nginx если запущен
echo "🛑 Остановка nginx..."
systemctl stop nginx 2>/dev/null || true

# Остановка Docker контейнеров
echo "🛑 Остановка Docker контейнеров..."
docker-compose -f docker-compose.prod.yml down 2>/dev/null || true

# Получение сертификатов
echo "🔐 Получение SSL сертификатов..."

# Для основного домена
echo "📝 Получение сертификата для forelrest.com..."
certbot certonly --standalone -d forelrest.com -d www.forelrest.com --non-interactive --agree-tos --email admin@forelrest.com

# Для Telegram WebApp
echo "📝 Получение сертификата для telegram.forelrest.com..."
certbot certonly --standalone -d telegram.forelrest.com --non-interactive --agree-tos --email admin@forelrest.com

# Создание папки для SSL
echo "📁 Создание папки ssl..."
mkdir -p ssl

# Копирование сертификатов
echo "📋 Копирование сертификатов..."
cp /etc/letsencrypt/live/forelrest.com/fullchain.pem ssl/forelrest.com.crt
cp /etc/letsencrypt/live/forelrest.com/privkey.pem ssl/forelrest.com.key
cp /etc/letsencrypt/live/telegram.forelrest.com/fullchain.pem ssl/telegram.forelrest.com.crt
cp /etc/letsencrypt/live/telegram.forelrest.com/privkey.pem ssl/telegram.forelrest.com.key

# Установка прав доступа
echo "🔒 Установка прав доступа..."
chmod 644 ssl/*.crt
chmod 600 ssl/*.key

# Запуск Docker контейнеров
echo "🚀 Запуск Docker контейнеров..."
docker-compose -f docker-compose.prod.yml up -d

# Настройка автоматического обновления сертификатов
echo "🔄 Настройка автоматического обновления сертификатов..."
(crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet && cp /etc/letsencrypt/live/forelrest.com/fullchain.pem /var/www/project-forel/ssl/forelrest.com.crt && cp /etc/letsencrypt/live/forelrest.com/privkey.pem /var/www/project-forel/ssl/forelrest.com.key && cp /etc/letsencrypt/live/telegram.forelrest.com/fullchain.pem /var/www/project-forel/ssl/telegram.forelrest.com.crt && cp /etc/letsencrypt/live/telegram.forelrest.com/privkey.pem /var/www/project-forel/ssl/telegram.forelrest.com.key && docker-compose -f /var/www/project-forel/docker-compose.prod.yml restart nginx") | crontab -

echo ""
echo "✅ SSL сертификаты настроены!"
echo ""
echo "🔐 Сертификаты получены для:"
echo "   • forelrest.com"
echo "   • www.forelrest.com"
echo "   • telegram.forelrest.com"
echo ""
echo "📁 Сертификаты сохранены в папке ssl/"
echo "🔄 Автоматическое обновление настроено"
echo ""
echo "🌐 Теперь ваши сайты доступны по HTTPS:"
echo "   • https://forelrest.com"
echo "   • https://telegram.forelrest.com"
echo ""
