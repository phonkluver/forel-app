# 🐳 Docker развертывание проекта Forel

## 🎯 Обзор

Этот проект теперь поддерживает развертывание с помощью Docker! Docker значительно упрощает процесс развертывания и обеспечивает консистентность между различными средами.

## 📁 Структура Docker файлов

```
project-forel/
├── docker-compose.yml                 # Основной docker-compose
├── .dockerignore                      # Исключения для Docker
├── api-server/
│   ├── Dockerfile                     # Production образ API
│   └── Dockerfile.dev                 # Development образ API
├── telegram-bot/
│   ├── Dockerfile                     # Production образ бота
│   └── Dockerfile.dev                 # Development образ бота
├── my-project-web/
│   ├── Dockerfile                     # Production образ веб-сайта
│   ├── Dockerfile.dev                 # Development образ веб-сайта
│   └── nginx.conf                     # Конфигурация nginx
├── my-project/
│   ├── Dockerfile                     # Production образ WebApp
│   ├── Dockerfile.dev                 # Development образ WebApp
│   └── nginx.conf                     # Конфигурация nginx
└── deploy/
    ├── docker-compose.prod.yml        # Production конфигурация
    ├── docker-compose.dev.yml         # Development конфигурация
    ├── docker-start.sh                # Скрипт запуска production
    ├── docker-stop.sh                 # Скрипт остановки
    ├── docker-status.sh               # Скрипт проверки статуса
    ├── docker-dev.sh                  # Скрипт запуска development
    └── README-DOCKER.md               # Подробная документация
```

## 🚀 Быстрый старт

### Production развертывание

1. **Клонируйте проект:**
```bash
git clone <your-repository-url>
cd project-forel
```

2. **Настройте переменные окружения:**
```bash
cd deploy
cp .env.example .env
# Отредактируйте .env файл
```

3. **Запустите проект:**
```bash
chmod +x *.sh
./docker-start.sh
```

### Development развертывание

1. **Клонируйте проект:**
```bash
git clone <your-repository-url>
cd project-forel
```

2. **Запустите в режиме разработки:**
```bash
cd deploy
chmod +x *.sh
./docker-dev.sh
```

## 🔧 Управление

### Production команды

```bash
# Запуск
cd deploy && ./docker-start.sh

# Остановка
cd deploy && ./docker-stop.sh

# Статус
cd deploy && ./docker-status.sh

# Логи
docker-compose -f deploy/docker-compose.prod.yml logs -f [service]
```

### Development команды

```bash
# Запуск
cd deploy && ./docker-dev.sh

# Остановка
docker-compose -f deploy/docker-compose.dev.yml down

# Статус
docker-compose -f deploy/docker-compose.dev.yml ps

# Логи
docker-compose -f deploy/docker-compose.dev.yml logs -f [service]
```

## 🌐 Доступные сервисы

### Production
- **Веб-сайт**: http://localhost (или https://forelrest.com)
- **Telegram WebApp**: http://localhost:8081 (или https://telegram.forelrest.com)
- **API**: http://localhost:3001/api
- **Админка**: http://localhost/admin (код: 0202)

### Development
- **Веб-сайт**: http://localhost:3000
- **Telegram WebApp**: http://localhost:8081
- **API**: http://localhost:3001/api
- **Админка**: http://localhost:3000/admin (код: 0202)

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
# Статус контейнеров
docker-compose -f deploy/docker-compose.prod.yml ps

# Использование ресурсов
docker stats

# Логи
docker-compose -f deploy/docker-compose.prod.yml logs --tail=50
```

## 🔄 Обновление

### Обновление кода
```bash
# Останавливаем проект
cd deploy && ./docker-stop.sh

# Обновляем код
git pull origin main

# Пересобираем и запускаем
./docker-start.sh
```

### Обновление образов
```bash
# Удаляем старые образы
docker-compose -f deploy/docker-compose.prod.yml down --rmi all

# Пересобираем образы
docker-compose -f deploy/docker-compose.prod.yml up --build -d
```

## 🛠️ Устранение неполадок

### Если контейнеры не запускаются
```bash
# Проверяем логи
docker-compose -f deploy/docker-compose.prod.yml logs

# Проверяем статус
docker-compose -f deploy/docker-compose.prod.yml ps

# Перезапускаем
docker-compose -f deploy/docker-compose.prod.yml restart
```

### Если порты заняты
```bash
# Проверяем занятые порты
sudo netstat -tlnp | grep -E ':(80|443|3001|8080|8081)'

# Останавливаем конфликтующие сервисы
sudo systemctl stop nginx  # если запущен
sudo systemctl stop apache2  # если запущен
```

## 🔒 Безопасность

- Все сервисы работают в изолированных контейнерах
- Nginx настроен с базовыми заголовками безопасности
- JWT токены используются для аутентификации
- SSL/TLS шифрование для HTTPS соединений
- Переменные окружения для чувствительных данных

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

## 🎯 Преимущества Docker

1. **Изоляция**: Каждый сервис работает в своем контейнере
2. **Консистентность**: Одинаковая среда на всех машинах
3. **Простота развертывания**: Один команда для запуска всего проекта
4. **Масштабируемость**: Легко добавлять новые экземпляры сервисов
5. **Версионирование**: Каждая версия приложения изолирована
6. **Откат**: Быстрый откат к предыдущей версии
7. **Мониторинг**: Встроенные инструменты для мониторинга

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи: `docker-compose -f deploy/docker-compose.prod.yml logs -f [service]`
2. Проверьте статус контейнеров: `docker-compose -f deploy/docker-compose.prod.yml ps`
3. Проверьте использование ресурсов: `docker stats`
4. Обратитесь к документации Docker: https://docs.docker.com/

## 🔗 Полезные ссылки

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Node.js Docker Images](https://hub.docker.com/_/node)
