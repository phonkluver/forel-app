# 🚀 Быстрый запуск проекта Forel с Docker

## 🎯 Что запускается

1. **API Server** (порт 3001) - Единая база данных для всех сервисов
2. **Telegram Bot** - Бот для обработки команд в Telegram
3. **Web Application** (forelrest.com) - Основной веб-сайт с админкой
4. **Telegram WebApp** (telegram.forelrest.com) - WebApp для заказов через Telegram
5. **Nginx Reverse Proxy** (порт 80/443) - Прокси для маршрутизации

## 🚀 Быстрый запуск

### 1. Подготовка

```bash
# Клонируйте проект
git clone <your-repository-url>
cd project-forel

# Перейдите в папку deploy
cd deploy
```

### 2. Настройка переменных окружения

```bash
# Создайте файл .env
cat > .env << EOF
# Docker Environment Variables
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
EOF
```

### 3. Запуск всех компонентов

```bash
# Сделайте скрипты исполняемыми
chmod +x *.sh

# Запустите все сервисы
./docker-start.sh
```

## 🌐 Доступные сервисы

После запуска будут доступны:

- **Веб-сайт**: https://forelrest.com
- **Telegram WebApp**: https://telegram.forelrest.com
- **API**: https://forelrest.com/api
- **Админка**: https://forelrest.com/admin (код: 0202)

## 🔧 Управление

### Проверка статуса
```bash
./docker-status.sh
```

### Остановка
```bash
./docker-stop.sh
```

### Просмотр логов
```bash
# Логи API сервера
docker-compose -f docker-compose.prod.yml logs -f api-server

# Логи веб-сайта
docker-compose -f docker-compose.prod.yml logs -f web-app

# Логи Telegram WebApp
docker-compose -f docker-compose.prod.yml logs -f telegram-webapp

# Логи Telegram бота
docker-compose -f docker-compose.prod.yml logs -f telegram-bot

# Логи Nginx
docker-compose -f docker-compose.prod.yml logs -f nginx
```

## 🎯 Результат

После успешного запуска у вас будет:

1. **Веб-сайт** с админкой для управления меню и баннерами (https://forelrest.com)
2. **Telegram WebApp** для заказов через Telegram (https://telegram.forelrest.com)
3. **API сервер** для единой базы данных (https://forelrest.com/api)
4. **Telegram бот** для обработки команд
5. **Nginx прокси** для маршрутизации

Все компоненты используют единую базу данных, поэтому изменения в админке сразу отображаются и на сайте, и в Telegram WebApp.

## 🛠️ Устранение неполадок

### Если что-то не работает
```bash
# Проверьте статус
./docker-status.sh

# Проверьте логи
docker-compose -f docker-compose.prod.yml logs

# Перезапустите
docker-compose -f docker-compose.prod.yml restart
```

### Если порты заняты
```bash
# Остановите конфликтующие сервисы
sudo systemctl stop nginx
sudo systemctl stop apache2
```

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs -f [service]`
2. Проверьте статус: `./docker-status.sh`
3. Обратитесь к документации: `README-DOCKER.md`
