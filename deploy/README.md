# 🍽️ Система ресторана "Форель" - Инструкция по развертыванию

## 📋 Обзор системы

Система состоит из следующих компонентов:
- **API сервер** (порт 3001) - единая база данных и API
- **Telegram бот** - для заказов и резерваций
- **Веб-сайт** (порт 8080) - основной сайт с админкой
- **Telegram WebApp** (порт 8081) - мобильное приложение в Telegram

## 🚀 Быстрый старт

### 1. Подготовка сервера

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Устанавливаем Python3 (для веб-серверов)
sudo apt install python3 python3-pip -y

# Устанавливаем Nginx
sudo apt install nginx -y

# Устанавливаем curl для проверок
sudo apt install curl -y
```

### 2. Настройка доменов

В панели управления Timeweb Cloud:
1. Перейдите в раздел "Домены"
2. Добавьте домены:
   - `forelrest.com` (основной сайт)
   - `telegram.forelrest.com` (Telegram WebApp)

### 3. Настройка SSL сертификатов

```bash
# Устанавливаем Certbot для Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y

# Получаем SSL сертификаты
sudo certbot --nginx -d forelrest.com -d www.forelrest.com
sudo certbot --nginx -d telegram.forelrest.com
```

### 4. Загрузка проекта

```bash
# Создаем директорию проекта
mkdir -p /var/www/forel
cd /var/www/forel

# Клонируем проект (замените на ваш репозиторий)
git clone https://github.com/your-username/project-forel.git .

# Переходим в директорию развертывания
cd deploy
```

### 5. Настройка конфигурации

#### API сервер (`../api-server/config.env`):
```env
PORT=3001
NODE_ENV=production
DB_PATH=./data/forel.db
ADMIN_CODE=0202
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
ALLOWED_ORIGINS=https://forelrest.com,https://telegram.forelrest.com
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
```

#### Telegram бот (`../telegram-bot/config.env`):
```env
BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
WEBAPP_URL=https://telegram.forelrest.com
```

### 6. Установка зависимостей

```bash
# Делаем скрипты исполняемыми
chmod +x start.sh stop.sh status.sh

# Устанавливаем зависимости
npm run install-deps
```

### 7. Сборка проектов

```bash
# Собираем веб-сайт
npm run build-web

# Собираем Telegram WebApp
npm run build-telegram
```

### 8. Настройка Nginx

```bash
# Копируем конфигурацию
sudo cp nginx.conf /etc/nginx/sites-available/forel

# Активируем сайт
sudo ln -s /etc/nginx/sites-available/forel /etc/nginx/sites-enabled/

# Проверяем конфигурацию
sudo nginx -t

# Перезапускаем Nginx
sudo systemctl restart nginx
```

### 9. Запуск системы

```bash
# Запускаем все сервисы
./start.sh

# Проверяем статус
./status.sh
```

## 🔧 Управление системой

### Команды управления:

```bash
# Запуск всех сервисов
./start.sh

# Остановка всех сервисов
./stop.sh

# Проверка статуса
./status.sh

# Просмотр логов
tail -f logs/api.log      # API сервер
tail -f logs/bot.log      # Telegram бот
tail -f logs/web.log      # Веб-сайт
tail -f logs/telegram-web.log  # Telegram WebApp
```

### Автозапуск при перезагрузке сервера:

```bash
# Создаем systemd сервис
sudo nano /etc/systemd/system/forel.service
```

Содержимое файла:
```ini
[Unit]
Description=Forel Restaurant System
After=network.target

[Service]
Type=forking
User=www-data
WorkingDirectory=/var/www/forel/deploy
ExecStart=/var/www/forel/deploy/start.sh
ExecStop=/var/www/forel/deploy/stop.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Активируем автозапуск
sudo systemctl enable forel.service
sudo systemctl start forel.service
```

## 📊 Мониторинг

### Проверка работы системы:

1. **API сервер**: https://forelrest.com/api/health
2. **Веб-сайт**: https://forelrest.com
3. **Админка**: https://forelrest.com/admin (код: 0202)
4. **Telegram WebApp**: https://telegram.forelrest.com

### Логи системы:

```bash
# Nginx логи
sudo tail -f /var/log/nginx/forelrest.com.access.log
sudo tail -f /var/log/nginx/forelrest.com.error.log

# Логи приложений
tail -f logs/api.log
tail -f logs/bot.log
```

## 🔒 Безопасность

### Рекомендации:

1. **Измените пароли и токены** в конфигурационных файлах
2. **Настройте firewall**:
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```
3. **Регулярно обновляйте систему**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```
4. **Настройте резервное копирование** базы данных:
   ```bash
   # Копирование базы данных
   cp data/forel.db backup/forel-$(date +%Y%m%d).db
   ```

## 🆘 Устранение неполадок

### Частые проблемы:

1. **API сервер не запускается**:
   - Проверьте порт 3001 (не занят ли)
   - Проверьте конфигурацию в `config.env`
   - Проверьте логи: `tail -f logs/api.log`

2. **Telegram бот не отвечает**:
   - Проверьте токен бота
   - Проверьте логи: `tail -f logs/bot.log`

3. **Веб-сайт не загружается**:
   - Проверьте Nginx: `sudo systemctl status nginx`
   - Проверьте порты: `netstat -tuln | grep :80`

4. **SSL сертификаты**:
   - Обновите сертификаты: `sudo certbot renew`

### Полезные команды:

```bash
# Проверка занятых портов
netstat -tuln

# Проверка процессов
ps aux | grep node

# Перезапуск всех сервисов
./stop.sh && ./start.sh

# Очистка логов
> logs/api.log
> logs/bot.log
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи системы
2. Убедитесь, что все порты свободны
3. Проверьте конфигурационные файлы
4. Перезапустите систему: `./stop.sh && ./start.sh`

---

**Успешного развертывания! 🎉**
