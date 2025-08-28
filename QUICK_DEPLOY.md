# 🚀 Быстрое развертывание на TimeWeb

## 📋 Данные вашего сервера:
- **Публичный IP**: `62.113.42.135`
- **SSH подключение**: `ssh root@62.113.42.135`
- **Root пароль**: `********` (указан в панели TimeWeb)

## 🔧 Что нужно сделать на сервере TimeWeb:

### 1. Подключение к серверу
```bash
ssh root@62.113.42.135
```
Введите root пароль из панели TimeWeb.

### 2. Установка необходимого ПО
```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установка Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Установка certbot для SSL
apt install certbot python3-certbot-nginx -y
```

### 3. Загрузка проекта
```bash
cd /var/www
git clone https://github.com/your-username/project-forel.git
cd project-forel
```

### 4. Настройка DNS в TimeWeb
В панели управления TimeWeb добавьте A-записи:
- `forelrest.com` → `62.113.42.135`
- `www.forelrest.com` → `62.113.42.135`  
- `telegram.forelrest.com` → `62.113.42.135`

### 5. Быстрое развертывание
```bash
# Запуск развертывания
./deploy-timeweb.sh

# Настройка SSL (после настройки DNS)
./setup-ssl.sh
```

### 6. Настройка Telegram бота
1. Найдите @BotFather в Telegram
2. Отправьте `/mybots`
3. Выберите вашего бота
4. Нажмите "Bot Settings" → "Menu Button"
5. Установите URL: `https://telegram.forelrest.com`

## ✅ Готово!

Ваши сайты будут доступны:
- **forelrest.com** - основное веб-приложение
- **telegram.forelrest.com** - Telegram WebApp
- **forelrest.com/api** - API сервер

## 🔧 Полезные команды

```bash
# Статус контейнеров
docker-compose -f docker-compose.prod.yml ps

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Перезапуск
docker-compose -f docker-compose.prod.yml restart

# Обновление
git pull && docker-compose -f docker-compose.prod.yml up -d --build
```

## 🆘 Если что-то не работает

1. Проверьте логи: `docker-compose -f docker-compose.prod.yml logs`
2. Убедитесь, что DNS настроен правильно
3. Проверьте, что порты 80 и 443 открыты
4. Убедитесь, что SSL сертификаты получены

---

**🎉 Ваше приложение готово к работе!**
