# 🚀 Инструкция по развертыванию на TimeWeb

## 📋 Требования к серверу
- **VPS сервер**: 2 CPU, 4 GB RAM, 20 GB SSD (минимум)
- **ОС**: Ubuntu 22.04 LTS
- **Домены**: forelrest.com, telegram.forelrest.com

## 📋 Данные вашего сервера:
- **Публичный IP**: `62.113.42.135`
- **Приватный IP**: `192.168.0.4`
- **SSH подключение**: `ssh root@62.113.42.135`
- **Root пароль**: `********` (указан в панели TimeWeb)

## 🔧 Шаг 1: Подготовка сервера

### Подключение к серверу
```bash
ssh root@62.113.42.135
```
Введите root пароль из панели TimeWeb.

### Обновление системы
```bash
apt update && apt upgrade -y
```

### Установка Docker и Docker Compose
```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Добавление пользователя в группу docker
usermod -aG docker $USER
```

### Установка Nginx (для SSL)
```bash
apt install nginx certbot python3-certbot-nginx -y
```

## 📁 Шаг 2: Загрузка проекта

### Клонирование проекта
```bash
cd /var/www
git clone https://github.com/your-username/project-forel.git
cd project-forel
```

### Создание файла с переменными окружения
```bash
# Создаем .env файл
cat > .env << EOF
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
WEBAPP_URL=https://telegram.forelrest.com
ADMIN_CHAT_ID=-4729513227

# API Configuration
API_BASE_URL=https://forelrest.com/api
PORT=3001
EOF
```

## 🌐 Шаг 3: Настройка доменов

### Настройка DNS в TimeWeb
1. Зайдите в панель управления TimeWeb
2. Перейдите в раздел "Домены"
3. Добавьте A-записи:
   - `forelrest.com` → `62.113.42.135`
   - `www.forelrest.com` → `62.113.42.135`
   - `telegram.forelrest.com` → `62.113.42.135`

### Получение SSL сертификатов
```bash
# Останавливаем nginx временно
systemctl stop nginx

# Получаем сертификаты
certbot certonly --standalone -d forelrest.com -d www.forelrest.com
certbot certonly --standalone -d telegram.forelrest.com

# Создаем папку для SSL
mkdir -p ssl
cp /etc/letsencrypt/live/forelrest.com/fullchain.pem ssl/forelrest.com.crt
cp /etc/letsencrypt/live/forelrest.com/privkey.pem ssl/forelrest.com.key
cp /etc/letsencrypt/live/telegram.forelrest.com/fullchain.pem ssl/telegram.forelrest.com.crt
cp /etc/letsencrypt/live/telegram.forelrest.com/privkey.pem ssl/telegram.forelrest.com.key
```

## 🐳 Шаг 4: Развертывание с Docker

### Сборка и запуск
```bash
# Сборка образов
docker-compose -f docker-compose.prod.yml build --no-cache

# Запуск контейнеров
docker-compose -f docker-compose.prod.yml up -d

# Проверка статуса
docker-compose -f docker-compose.prod.yml ps
```

### Проверка логов
```bash
# Логи всех сервисов
docker-compose -f docker-compose.prod.yml logs

# Логи конкретного сервиса
docker-compose -f docker-compose.prod.yml logs web-app
docker-compose -f docker-compose.prod.yml logs telegram-bot
```

## 🔄 Шаг 5: Настройка автоперезапуска

### Создание systemd сервиса
```bash
cat > /etc/systemd/system/forel.service << EOF
[Unit]
Description=Forel Restaurant Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/var/www/project-forel
ExecStart=/usr/local/bin/docker-compose -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# Активация сервиса
systemctl enable forel.service
systemctl start forel.service
```

## 🔧 Шаг 6: Настройка Telegram бота

### Обновление WebApp URL
1. Найдите @BotFather в Telegram
2. Отправьте команду `/mybots`
3. Выберите вашего бота
4. Нажмите "Bot Settings" → "Menu Button"
5. Установите URL: `https://telegram.forelrest.com`

### Проверка работы бота
```bash
# Проверка логов бота
docker-compose -f docker-compose.prod.yml logs telegram-bot
```

## 📊 Шаг 7: Мониторинг и обслуживание

### Полезные команды
```bash
# Статус всех контейнеров
docker-compose -f docker-compose.prod.yml ps

# Перезапуск сервиса
docker-compose -f docker-compose.prod.yml restart web-app

# Обновление приложения
cd /var/www/project-forel
git pull
docker-compose -f docker-compose.prod.yml up -d --build

# Просмотр логов в реальном времени
docker-compose -f docker-compose.prod.yml logs -f
```

### Автоматическое обновление SSL
```bash
# Добавляем в crontab
crontab -e

# Добавляем строку для обновления сертификатов
0 12 * * * /usr/bin/certbot renew --quiet && cp /etc/letsencrypt/live/forelrest.com/fullchain.pem /var/www/project-forel/ssl/forelrest.com.crt && cp /etc/letsencrypt/live/forelrest.com/privkey.pem /var/www/project-forel/ssl/forelrest.com.key && docker-compose -f /var/www/project-forel/docker-compose.prod.yml restart nginx
```

## ✅ Проверка работоспособности

### Тестирование сайтов
- **forelrest.com** - основное веб-приложение
- **telegram.forelrest.com** - Telegram WebApp
- **forelrest.com/api** - API сервер

### Тестирование Telegram бота
1. Найдите бота в Telegram
2. Отправьте `/start`
3. Проверьте работу кнопки "Открыть меню"

## 🆘 Устранение неполадок

### Если сайты не открываются
```bash
# Проверка портов
netstat -tlnp | grep :80
netstat -tlnp | grep :443

# Проверка контейнеров
docker ps
docker-compose -f docker-compose.prod.yml ps
```

### Если бот не работает
```bash
# Проверка логов бота
docker-compose -f docker-compose.prod.yml logs telegram-bot

# Проверка переменных окружения
docker-compose -f docker-compose.prod.yml exec telegram-bot env
```

### Перезапуск всего приложения
```bash
cd /var/www/project-forel
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs`
2. Убедитесь, что все порты открыты
3. Проверьте настройки DNS
4. Убедитесь, что SSL сертификаты действительны

---

**🎉 Поздравляем! Ваше приложение развернуто и готово к работе!**

