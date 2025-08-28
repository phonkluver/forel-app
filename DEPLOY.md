# 🚀 Деплой проекта Forel

## 📋 Быстрая инструкция

### 1. Подключение к серверу
```bash
ssh root@62.113.42.135
cd /var/www/project-forel
```

### 2. Обновление кода
```bash
git pull origin main
```

### 3. Настройка SSL (если еще не настроен)
```bash
chmod +x setup-ssl-auto.sh
./setup-ssl-auto.sh
```

### 4. Пересборка и запуск
```bash
# Остановка контейнеров
docker-compose -f docker-compose.prod.yml down

# Пересборка с новыми настройками
docker-compose -f docker-compose.prod.yml build --no-cache

# Запуск
docker-compose -f docker-compose.prod.yml up -d

# Проверка статуса
docker-compose -f docker-compose.prod.yml ps
```

### 5. Проверка работы
```bash
# Проверка HTTPS
curl -I https://forelrest.com
curl -I https://telegram.forelrest.com

# Проверка логов
docker logs forel-nginx
```

## ✅ Результат
- 🌐 **https://forelrest.com** - основной сайт
- 🌐 **https://telegram.forelrest.com** - Telegram WebApp  
- 🔐 **https://forelrest.com/admin** - админ-панель (код: 0202)
- 🔒 **HTTP → HTTPS** - автоматическое перенаправление

## 🔧 Если что-то не работает
```bash
# Проверка логов
docker logs forel-nginx
docker logs forel-api-server
docker logs forel-web-app

# Перезапуск nginx
docker-compose -f docker-compose.prod.yml restart nginx

# Проверка SSL сертификатов
openssl s_client -connect forelrest.com:443 -servername forelrest.com
```

## 📞 Данные сервера
- **IP**: 62.113.42.135
- **SSH**: `ssh root@62.113.42.135`
- **Пароль**: из панели TimeWeb
