# 🚀 Быстрое развертывание проекта Forel

## 🎯 Что запускается

- **Веб-сайт**: https://forelrest.com (с админкой)
- **Telegram WebApp**: https://telegram.forelrest.com
- **API**: https://forelrest.com/api
- **Telegram Bot**: для обработки команд

## 🚀 Быстрый старт (5 минут)

### 1. Подготовка сервера
```bash
# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезагрузка
sudo reboot
```

### 2. Клонирование и настройка
```bash
# Клонируем проект
git clone <your-repository-url>
cd project-forel/deploy

# Создаем .env файл
cat > .env << EOF
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
TELEGRAM_BOT_TOKEN=8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ
TELEGRAM_ADMIN_CHAT_ID=your-admin-chat-id
EOF

# Делаем скрипты исполняемыми
chmod +x *.sh
```

### 3. Запуск
```bash
# Запускаем все сервисы
./docker-start.sh

# Проверяем статус
./docker-status.sh
```

## 🌐 Результат

После запуска доступны:
- **Сайт**: https://forelrest.com
- **Telegram WebApp**: https://telegram.forelrest.com
- **Админка**: https://forelrest.com/admin (код: 0202)

## 🔧 Управление

```bash
# Статус
./docker-status.sh

# Остановка
./docker-stop.sh

# Логи
docker-compose -f docker-compose.prod.yml logs -f [service]
```

## ✅ Готово!

Система запущена и готова к работе!
