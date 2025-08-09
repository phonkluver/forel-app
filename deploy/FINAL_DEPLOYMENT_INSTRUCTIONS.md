# 🚀 Финальная инструкция по развертыванию проекта Forel

## 🎯 Обзор проекта

Проект Forel - это система ресторана с единой базой данных, состоящая из 5 компонентов:

1. **API Server** - Единая база данных и API для всех сервисов
2. **Telegram Bot** - Бот для обработки команд в Telegram
3. **Web Application** - Основной веб-сайт с админкой (forelrest.com)
4. **Telegram WebApp** - WebApp для заказов через Telegram (telegram.forelrest.com)
5. **Nginx Reverse Proxy** - Прокси для маршрутизации

## 🐳 Требования к серверу

### Минимальные требования:
- **ОС**: Ubuntu 20.04+ или CentOS 8+
- **RAM**: 4GB+
- **CPU**: 2 ядра+
- **Диск**: 20GB+
- **Домены**: forelrest.com и telegram.forelrest.com

### Необходимое ПО:
- Docker 20.10+
- Docker Compose 2.0+
- Git

## 🚀 Пошаговая инструкция развертывания

### Шаг 1: Подготовка сервера

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Устанавливаем Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагружаемся или перелогиниваемся
sudo reboot
```

### Шаг 2: Клонирование проекта

```bash
# Клонируем проект
git clone <your-repository-url>
cd project-forel

# Переходим в папку deploy
cd deploy
```

### Шаг 3: Настройка переменных окружения

```bash
# Создаем файл .env с необходимыми переменными
cat > .env << EOF
# Docker Environment Variables
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
EOF

# ВАЖНО: Замените значения на реальные:
# - JWT_SECRET: сгенерируйте случайную строку
# - TELEGRAM_BOT_TOKEN: токен вашего бота
# - TELEGRAM_ADMIN_CHAT_ID: ID чата администратора
```

### Шаг 4: Настройка SSL сертификатов (опционально)

```bash
# Создаем директории для SSL
mkdir -p ssl

# Если у вас есть SSL сертификаты, поместите их в папку ssl:
# - forelrest.com.crt и forelrest.com.key для основного сайта
# - telegram.forelrest.com.crt и telegram.forelrest.com.key для Telegram WebApp

# Если нет сертификатов, можно использовать самоподписанные для тестирования:
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/forelrest.com.key -out ssl/forelrest.com.crt \
  -subj "/C=RU/ST=State/L=City/O=Organization/CN=forelrest.com"

sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ssl/telegram.forelrest.com.key -out ssl/telegram.forelrest.com.crt \
  -subj "/C=RU/ST=State/L=City/O=Organization/CN=telegram.forelrest.com"
```

### Шаг 5: Запуск всех компонентов

```bash
# Делаем скрипты исполняемыми
chmod +x *.sh

# Запускаем все сервисы
./docker-start.sh
```

### Шаг 6: Проверка статуса

```bash
# Проверяем статус всех сервисов
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

### Основные команды:

```bash
# Проверка статуса
./docker-status.sh

# Остановка всех сервисов
./docker-stop.sh

# Перезапуск
./docker-stop.sh && ./docker-start.sh

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f [service]
```

### Просмотр логов конкретных сервисов:

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

1. **API Server** (порт 3001):
   - Создает базу данных SQLite
   - Инициализирует таблицы для меню, баннеров, категорий
   - Настраивает CORS для всех доменов

2. **Telegram Bot**:
   - Подключается к API серверу
   - Обрабатывает команды в Telegram
   - Отправляет уведомления

3. **Web Application** (forelrest.com):
   - Собирает React приложение
   - Запускает на nginx (порт 8080)
   - Подключается к API серверу

4. **Telegram WebApp** (telegram.forelrest.com):
   - Собирает React приложение
   - Запускает на nginx (порт 8081)
   - Подключается к API серверу

5. **Nginx Reverse Proxy**:
   - Маршрутизирует запросы к соответствующим сервисам
   - Обрабатывает SSL
   - Проксирует API запросы

## 🛠️ Устранение неполадок

### Если сервисы не запускаются:

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

### Если порты заняты:

```bash
# Проверьте занятые порты
sudo netstat -tlnp | grep -E ':(80|443|3001|8080|8081)'

# Остановите конфликтующие сервисы
sudo systemctl stop nginx
sudo systemctl stop apache2
```

### Если проблемы с правами доступа:

```bash
# Исправьте права доступа
sudo chown -R $USER:$USER .
sudo chmod -R 755 .
```

## 📊 Мониторинг

### Проверка здоровья сервисов:
```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Использование ресурсов
docker stats

# Логи
docker-compose -f docker-compose.prod.yml logs --tail=50
```

## 🔄 Обновление

### Обновление кода:
```bash
# Остановите проект
./docker-stop.sh

# Обновите код
git pull origin main

# Перезапустите
./docker-start.sh
```

### Обновление образов:
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

## ✅ Чек-лист готовности

- [ ] Docker установлен и работает
- [ ] Docker Compose установлен
- [ ] Проект склонирован
- [ ] Файл .env создан и настроен
- [ ] SSL сертификаты подготовлены (опционально)
- [ ] Все скрипты исполняемы
- [ ] Сервисы запущены
- [ ] Статус проверен
- [ ] Доступность сервисов проверена
- [ ] Логи проверены на ошибки

## 🎉 Готово!

Система готова к работе! Все компоненты запущены и используют единую базу данных.
