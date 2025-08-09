# 🐳 Развертывание проекта Forel с помощью Docker

## 🎯 Обзор

Этот документ описывает развертывание проекта Forel с использованием Docker и Docker Compose. Docker значительно упрощает процесс развертывания и обеспечивает консистентность между различными средами.

## 📋 Требования

- Docker Engine 20.10+
- Docker Compose 2.0+
- Git
- Минимум 2GB RAM
- 10GB свободного места на диске

## 🚀 Быстрое развертывание

### 1. Подготовка сервера

```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Добавляем пользователя в группу docker
sudo usermod -aG docker $USER

# Устанавливаем Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагружаемся или перелогиниваемся
sudo reboot
```

### 2. Клонирование проекта

```bash
# Создаем директорию для проекта
sudo mkdir -p /var/www/forel
sudo chown $USER:$USER /var/www/forel
cd /var/www/forel

# Клонируем проект
git clone <your-repository-url> .
```

### 3. Настройка переменных окружения

```bash
# Переходим в папку deploy
cd deploy

# Создаем файл .env
nano .env
```

**Содержимое `deploy/.env`:**
```env
# Docker Environment Variables
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
```

### 4. Настройка SSL сертификатов (опционально)

```bash
# Создаем директорию для SSL
mkdir -p ssl

# Если у вас есть SSL сертификаты, скопируйте их:
# sudo cp /path/to/your/certificate.crt ssl/
# sudo cp /path/to/your/private.key ssl/
```

### 5. Запуск проекта

```bash
# Делаем скрипты исполняемыми
chmod +x *.sh

# Запускаем проект
./docker-start.sh
```

## 🔧 Управление проектом

### Запуск
```bash
cd /var/www/forel/deploy
./docker-start.sh
```

### Остановка
```bash
cd /var/www/forel/deploy
./docker-stop.sh
```

### Проверка статуса
```bash
cd /var/www/forel/deploy
./docker-status.sh
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

## 🏗️ Архитектура

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Web App       │    │  Telegram WebApp│
│   (Port 80/443) │    │   (Port 8080)   │    │  (Port 8081)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   API Server    │
                    │   (Port 3001)   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │  Telegram Bot   │
                    └─────────────────┘
```

## 📊 Мониторинг

### Проверка здоровья сервисов
```bash
# Проверяем статус всех контейнеров
docker-compose -f docker-compose.prod.yml ps

# Проверяем использование ресурсов
docker stats

# Проверяем логи
docker-compose -f docker-compose.prod.yml logs --tail=50
```

### Автоматический перезапуск
Все сервисы настроены на автоматический перезапуск при сбоях (`restart: unless-stopped`).

## 🔄 Обновление

### Обновление кода
```bash
# Останавливаем проект
cd /var/www/forel/deploy
./docker-stop.sh

# Обновляем код
cd /var/www/forel
git pull origin main

# Пересобираем и запускаем
cd deploy
./docker-start.sh
```

### Обновление образов
```bash
# Удаляем старые образы
docker-compose -f docker-compose.prod.yml down --rmi all

# Пересобираем образы
docker-compose -f docker-compose.prod.yml up --build -d
```

## 🛠️ Устранение неполадок

### Если контейнеры не запускаются
```bash
# Проверяем логи
docker-compose -f docker-compose.prod.yml logs

# Проверяем статус
docker-compose -f docker-compose.prod.yml ps

# Перезапускаем
docker-compose -f docker-compose.prod.yml restart
```

### Если порты заняты
```bash
# Проверяем занятые порты
sudo netstat -tlnp | grep -E ':(80|443|3001|8080|8081)'

# Останавливаем конфликтующие сервисы
sudo systemctl stop nginx  # если запущен
sudo systemctl stop apache2  # если запущен
```

### Если проблемы с правами доступа
```bash
# Исправляем права доступа
sudo chown -R $USER:$USER /var/www/forel
sudo chmod -R 755 /var/www/forel
```

## 📝 Чек-лист

- [ ] Docker установлен и работает
- [ ] Docker Compose установлен
- [ ] Проект склонирован
- [ ] Файл .env создан и настроен
- [ ] SSL сертификаты настроены (опционально)
- [ ] Контейнеры запущены
- [ ] Веб-сайт доступен
- [ ] Telegram WebApp доступен
- [ ] API работает
- [ ] Telegram бот работает
- [ ] Админка доступна

## 🎯 Результат

После выполнения всех шагов у вас будет:

1. **Веб-сайт** доступен по адресу `http://localhost` (или `https://forelrest.com`)
2. **Telegram WebApp** доступен по адресу `http://localhost:8081` (или `https://telegram.forelrest.com`)
3. **Админка** доступна по адресу `http://localhost/admin` (код: 0202)
4. **API сервер** работает на `http://localhost:3001/api`
5. **Telegram бот** работает и отвечает на команды

Все компоненты изолированы в Docker-контейнерах и используют единую базу данных.

## 🔒 Безопасность

- Все сервисы работают в изолированных контейнерах
- Nginx настроен с базовыми заголовками безопасности
- JWT токены используются для аутентификации
- SSL/TLS шифрование для HTTPS соединений
- Переменные окружения для чувствительных данных

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs -f [service]`
2. Проверьте статус контейнеров: `docker-compose -f docker-compose.prod.yml ps`
3. Проверьте использование ресурсов: `docker stats`
4. Обратитесь к документации Docker: https://docs.docker.com/
