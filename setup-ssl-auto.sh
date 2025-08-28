#!/bin/bash

echo "🔐 Автоматическая настройка SSL сертификатов для Forel..."
echo "========================================================"

# Проверка root прав
if [ "$EUID" -ne 0 ]; then
    echo "❌ Этот скрипт должен быть запущен с правами root"
    exit 1
fi

# Проверка наличия certbot
if ! command -v certbot &> /dev/null; then
    echo "📦 Установка certbot..."
    apt update
    apt install certbot python3-certbot-nginx -y
fi

# Остановка сервисов
echo "🛑 Остановка сервисов..."
systemctl stop nginx 2>/dev/null || true

# Проверяем, есть ли Docker контейнеры
if [ -f "docker-compose.prod.yml" ]; then
    echo "🛑 Остановка Docker контейнеров..."
    docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
fi

# Проверка, что порты свободны
echo "🔍 Проверка портов..."
if netstat -tlnp | grep :80 > /dev/null; then
    echo "⚠️  Порт 80 занят. Останавливаем сервисы..."
    pkill -f nginx || true
    pkill -f apache || true
    sleep 2
fi

if netstat -tlnp | grep :443 > /dev/null; then
    echo "⚠️  Порт 443 занят. Останавливаем сервисы..."
    pkill -f nginx || true
    pkill -f apache || true
    sleep 2
fi

# Получение сертификатов
echo "🔐 Получение SSL сертификатов..."

# Для основного домена
echo "📝 Получение сертификата для forelrest.com..."
certbot certonly --standalone -d forelrest.com -d www.forelrest.com --non-interactive --agree-tos --email admin@forelrest.com

if [ $? -eq 0 ]; then
    echo "✅ Сертификат для forelrest.com получен успешно"
else
    echo "❌ Ошибка получения сертификата для forelrest.com"
    exit 1
fi

# Для Telegram WebApp
echo "📝 Получение сертификата для telegram.forelrest.com..."
certbot certonly --standalone -d telegram.forelrest.com --non-interactive --agree-tos --email admin@forelrest.com

if [ $? -eq 0 ]; then
    echo "✅ Сертификат для telegram.forelrest.com получен успешно"
else
    echo "❌ Ошибка получения сертификата для telegram.forelrest.com"
    exit 1
fi

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
if [ -f "docker-compose.prod.yml" ]; then
    docker-compose -f docker-compose.prod.yml up -d
    
    # Проверка статуса
    echo "📊 Статус контейнеров:"
    docker-compose -f docker-compose.prod.yml ps
else
    echo "⚠️  Файл docker-compose.prod.yml не найден"
fi

# Настройка автоматического обновления сертификатов
echo "🔄 Настройка автоматического обновления сертификатов..."
CRON_JOB="0 12 * * * /usr/bin/certbot renew --quiet && cp /etc/letsencrypt/live/forelrest.com/fullchain.pem $(pwd)/ssl/forelrest.com.crt && cp /etc/letsencrypt/live/forelrest.com/privkey.pem $(pwd)/ssl/forelrest.com.key && cp /etc/letsencrypt/live/telegram.forelrest.com/fullchain.pem $(pwd)/ssl/telegram.forelrest.com.crt && cp /etc/letsencrypt/live/telegram.forelrest.com/privkey.pem $(pwd)/ssl/telegram.forelrest.com.key && docker-compose -f $(pwd)/docker-compose.prod.yml restart nginx"

# Удаляем старую задачу если есть
crontab -l 2>/dev/null | grep -v "certbot renew" | crontab -

# Добавляем новую задачу
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

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
echo "🔍 Проверка работы HTTPS:"
echo "   curl -I https://forelrest.com"
echo "   curl -I https://telegram.forelrest.com"
echo ""
echo "📋 Для проверки логов используйте:"
echo "   docker logs forel-nginx"
echo ""
