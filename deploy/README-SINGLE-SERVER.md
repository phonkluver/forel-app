# Инструкция по развертыванию проекта Forel на одном сервере

## 🎯 Обзор

Проект развертывается на одном сервере с двумя доменами:
- **forelrest.com** - основной веб-сайт
- **telegram.forelrest.com** - Telegram WebApp

## 🚀 Быстрое развертывание

### 1. Подготовка сервера

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем необходимые пакеты
sudo apt install -y nodejs npm git nginx certbot python3-certbot-nginx

# Проверяем версии
node --version  # Должна быть 18+ или 20+
npm --version
```

### 2. Клонирование проекта

```bash
# Создаем директорию для проекта
sudo mkdir -p /var/www/forel
sudo chown $USER:$USER /var/www/forel
cd /var/www/forel

# Клонируем проект (замените на ваш репозиторий)
git clone <your-repository-url> .
```

### 3. Настройка конфигурации

#### API сервер
```bash
cd api-server
nano config.env
```

**Содержимое `config.env`:**
```env
# API Server Configuration
PORT=3001
NODE_ENV=production

# Database
DB_PATH=./data/forel.db

# Admin Access
ADMIN_CODE=0202
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# CORS (ваши домены)
ALLOWED_ORIGINS=https://forelrest.com,https://telegram.forelrest.com,http://localhost:3000,http://localhost:5173,http://localhost:8080

# Telegram Bot
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
```

#### Telegram бот
```bash
cd ../telegram-bot
nano config.env
```

**Содержимое `config.env`:**
```env
BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
WEBAPP_URL=https://telegram.forelrest.com
API_URL=https://forelrest.com
```

### 4. Установка зависимостей

```bash
# API сервер
cd /var/www/forel/api-server
npm install

# Веб-сайт
cd /var/www/forel/my-project-web
npm install

# Telegram WebApp
cd /var/www/forel/my-project
npm install

# Telegram бот
cd /var/www/forel/telegram-bot
npm install
```

### 5. Сборка проектов

```bash
# Сборка веб-сайта
cd /var/www/forel/my-project-web
npm run build

# Сборка Telegram WebApp
cd /var/www/forel/my-project
npm run build
```

### 6. Настройка Nginx

```bash
# Копируем конфигурацию
sudo cp /var/www/forel/deploy/nginx-single-server.conf /etc/nginx/sites-available/forel

# Активируем сайт
sudo ln -s /etc/nginx/sites-available/forel /etc/nginx/sites-enabled/

# Удаляем дефолтный сайт
sudo rm -f /etc/nginx/sites-enabled/default

# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
```

### 7. Настройка SSL сертификатов

```bash
# Получаем SSL сертификаты
sudo certbot --nginx -d forelrest.com -d www.forelrest.com
sudo certbot --nginx -d telegram.forelrest.com

# Настраиваем автообновление
sudo crontab -e
```

**Добавить в crontab:**
```bash
0 12 * * * /usr/bin/certbot renew --quiet
```

### 8. Запуск системы

```bash
# Переходим в папку deploy
cd /var/www/forel/deploy

# Делаем скрипты исполняемыми
chmod +x *.sh

# Запускаем систему
./start-single-server.sh
```

### 9. Настройка автозапуска

```bash
# Создаем systemd сервисы
sudo nano /etc/systemd/system/forel.service
```

**Содержимое `forel.service`:**
```ini
[Unit]
Description=Forel Restaurant System
After=network.target

[Service]
Type=forking
User=www-data
WorkingDirectory=/var/www/forel/deploy
ExecStart=/var/www/forel/deploy/start-single-server.sh
ExecStop=/var/www/forel/deploy/stop.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Активируем сервис
sudo systemctl daemon-reload
sudo systemctl enable forel
sudo systemctl start forel
```

## 🔧 Управление системой

### Запуск
```bash
cd /var/www/forel/deploy
./start-single-server.sh
```

### Остановка
```bash
cd /var/www/forel/deploy
./stop.sh
```

### Статус
```bash
cd /var/www/forel/deploy
./status.sh
```

### Просмотр логов
```bash
# API сервер
tail -f /var/www/forel/deploy/logs/api.log

# Telegram бот
tail -f /var/www/forel/deploy/logs/bot.log

# Веб-сайт
tail -f /var/www/forel/deploy/logs/web.log

# Telegram WebApp
tail -f /var/www/forel/deploy/logs/telegram-web.log
```

## 📊 Проверка работоспособности

### Проверка сервисов
```bash
# Проверяем статус всех сервисов
sudo systemctl status forel
sudo systemctl status nginx

# Проверяем порты
netstat -tlnp | grep -E ':(3001|8080|8081)'
```

### Проверка доменов
```bash
# Проверяем веб-сайт
curl -I https://forelrest.com

# Проверяем Telegram WebApp
curl -I https://telegram.forelrest.com

# Проверяем API
curl -I https://forelrest.com/api/health
```

## 🛠️ Устранение неполадок

### Если API не отвечает
```bash
cd /var/www/forel/deploy
./stop.sh
sleep 2
./start-single-server.sh
```

### Если веб-сайт не загружается
```bash
# Проверяем логи
tail -f /var/www/forel/deploy/logs/web.log

# Перезапускаем веб-сервер
cd /var/www/forel/my-project-web/dist
pkill -f "python3 -m http.server 8080"
nohup python3 -m http.server 8080 > ../../deploy/logs/web.log 2>&1 &
```

### Если Telegram WebApp не работает
```bash
# Проверяем логи
tail -f /var/www/forel/deploy/logs/telegram-web.log

# Перезапускаем WebApp сервер
cd /var/www/forel/my-project/dist
pkill -f "python3 -m http.server 8081"
nohup python3 -m http.server 8081 > ../../deploy/logs/telegram-web.log 2>&1 &
```

### Если проблемы с базой данных
```bash
# Проверяем права доступа
sudo chown -R www-data:www-data /var/www/forel/api-server/data
sudo chmod -R 755 /var/www/forel/api-server/data

# Перезапускаем API сервер
cd /var/www/forel/deploy
./stop.sh
sleep 2
./start-single-server.sh
```

## 📝 Чек-лист

- [ ] Node.js установлен (версия 18+)
- [ ] Nginx установлен и настроен
- [ ] SSL сертификаты получены
- [ ] API сервер запущен (порт 3001)
- [ ] Telegram бот запущен
- [ ] Веб-сайт доступен (https://forelrest.com)
- [ ] Telegram WebApp доступен (https://telegram.forelrest.com)
- [ ] Админка работает (https://forelrest.com/admin)
- [ ] Все логи созданы и доступны
- [ ] Автозапуск настроен

## 🎯 Результат

После выполнения всех шагов у вас будет:

1. **Веб-сайт** доступен по адресу `https://forelrest.com`
2. **Telegram WebApp** доступен по адресу `https://telegram.forelrest.com`
3. **Админка** доступна по адресу `https://forelrest.com/admin` (код: 0202)
4. **API сервер** работает на `https://forelrest.com/api`
5. **Telegram бот** работает и отвечает на команды

Все компоненты используют единую базу данных и API, поэтому изменения в админке сразу отображаются и на сайте, и в Telegram WebApp.
