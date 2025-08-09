# 🚀 Инструкция по запуску проекта Forel

## 🎯 Обзор

Этот проект включает в себя 5 основных компонентов:

1. **API Server** - Единая база данных и API для всех сервисов
2. **Telegram Bot** - Бот для обработки команд в Telegram
3. **Web Application** - Основной веб-сайт с админкой (forelrest.com)
4. **Telegram WebApp** - WebApp для заказов через Telegram (telegram.forelrest.com)
5. **Nginx Reverse Proxy** - Прокси для маршрутизации

## 🐳 Запуск с помощью Docker (Рекомендуется)

### Шаг 1: Подготовка

```bash
# Клонируйте проект
git clone <your-repository-url>
cd project-forel

# Перейдите в папку deploy
cd deploy
```

### Шаг 2: Настройка переменных окружения

```bash
# Создайте файл .env
cat > .env << EOF
# Docker Environment Variables
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
EOF
```

### Шаг 3: Запуск всех компонентов

```bash
# Сделайте скрипты исполняемыми
chmod +x *.sh

# Запустите все сервисы
./docker-start.sh
```

### Шаг 4: Проверка статуса

```bash
# Проверьте статус всех сервисов
./docker-status.sh
```

## 🌐 Доступные сервисы

После успешного запуска будут доступны:

| Сервис | URL | Описание |
|--------|-----|----------|
| **Веб-сайт** | https://forelrest.com | Основной сайт с админкой |
| **Telegram WebApp** | https://telegram.forelrest.com | WebApp для заказов |
| **API** | https://forelrest.com/api | API сервер |
| **Админка** | https://forelrest.com/admin | Админка (код: 0202) |

## 🔧 Управление сервисами

### Проверка статуса
```bash
./docker-status.sh
```

### Остановка всех сервисов
```bash
./docker-stop.sh
```

### Перезапуск
```bash
# Остановить
./docker-stop.sh

# Запустить
./docker-start.sh
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

## 🎯 Что происходит при запуске

1. **API Server** запускается на порту 3001
   - Создает базу данных SQLite
   - Инициализирует таблицы для меню, баннеров, категорий
   - Настраивает CORS для всех доменов

2. **Telegram Bot** запускается
   - Подключается к API серверу
   - Обрабатывает команды в Telegram
   - Отправляет уведомления

3. **Web Application** собирается и запускается
   - Собирает React приложение
   - Запускает на nginx (порт 8080)
   - Подключается к API серверу
   - Доступен по адресу https://forelrest.com

4. **Telegram WebApp** собирается и запускается
   - Собирает React приложение
   - Запускает на nginx (порт 8081)
   - Подключается к API серверу
   - Доступен по адресу https://telegram.forelrest.com

5. **Nginx Reverse Proxy** запускается
   - Маршрутизирует запросы к соответствующим сервисам
   - Обрабатывает SSL (если настроен)
   - Проксирует API запросы

## 🛠️ Устранение неполадок

### Если сервисы не запускаются

1. **Проверьте Docker:**
```bash
docker --version
docker-compose --version
```

2. **Проверьте статус:**
```bash
./docker-status.sh
```

3. **Проверьте логи:**
```bash
docker-compose -f docker-compose.prod.yml logs
```

4. **Перезапустите:**
```bash
./docker-stop.sh
sleep 5
./docker-start.sh
```

### Если порты заняты

```bash
# Проверьте занятые порты
sudo netstat -tlnp | grep -E ':(80|443|3001|8080|8081)'

# Остановите конфликтующие сервисы
sudo systemctl stop nginx
sudo systemctl stop apache2
```

### Если проблемы с правами доступа

```bash
# Исправьте права доступа
sudo chown -R $USER:$USER /var/www/forel
sudo chmod -R 755 /var/www/forel
```

## 📊 Мониторинг

### Проверка здоровья сервисов
```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats

# Логи
docker-compose -f docker-compose.prod.yml logs --tail=50
```

## 🔄 Обновление

### Обновление кода
```bash
# Остановите проект
./docker-stop.sh

# Обновите код
git pull origin main

# Перезапустите
./docker-start.sh
```

### Обновление образов
```bash
# Удалите старые образы
docker-compose -f docker-compose.prod.yml down --rmi all

# Пересоберите образы
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🎯 Результат

После успешного запуска у вас будет полностью функциональная система ресторана "Форель" с:

1. **Веб-сайтом** с админкой для управления меню и баннерами (https://forelrest.com)
2. **Telegram WebApp** для заказов через Telegram (https://telegram.forelrest.com)
3. **API сервером** для единой базы данных (https://forelrest.com/api)
4. **Telegram ботом** для обработки команд
5. **Nginx прокси** для маршрутизации

Все компоненты используют единую базу данных, поэтому изменения в админке сразу отображаются и на сайте, и в Telegram WebApp.

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs -f [service]`
2. Проверьте статус: `./docker-status.sh`
3. Обратитесь к документации: `README-DOCKER.md`
4. Проверьте требования: Docker 20.10+, Docker Compose 2.0+
