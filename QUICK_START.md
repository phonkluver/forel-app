# 🚀 Быстрый запуск системы ресторана "Форель"

## 📋 Что получится

✅ **Единая система** с общей базой данных  
✅ **Админка** с кодом доступа 0202  
✅ **Telegram бот** для заказов  
✅ **Веб-сайт** и **Telegram WebApp**  
✅ **Автоматическая синхронизация** данных  

## ⚡ Быстрый запуск (5 минут)

### 1. Подготовка сервера
```bash
# Обновляем систему
sudo apt update && sudo apt upgrade -y

# Устанавливаем Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Устанавливаем Python3
sudo apt install python3 -y
```

### 2. Загрузка проекта
```bash
# Создаем директорию
mkdir -p /var/www/forel
cd /var/www/forel

# Загружаем проект (замените на ваш репозиторий)
git clone https://github.com/your-username/project-forel.git .

# Переходим в директорию развертывания
cd deploy
```

### 3. Автоматическое развертывание
```bash
# Делаем скрипт исполняемым
chmod +x quick-deploy.sh

# Запускаем автоматическое развертывание
./quick-deploy.sh
```

### 4. Проверка работы
```bash
# Проверяем статус всех сервисов
./status.sh

# Открываем в браузере:
# - Веб-сайт: http://YOUR_SERVER_IP:8080
# - Админка: http://YOUR_SERVER_IP:8080/admin (код: 0202)
# - API: http://YOUR_SERVER_IP:3001/health
```

## 🌐 Настройка доменов

### В панели Timeweb Cloud:
1. **Домены** → **Добавить домен**
   - `forelrest.com` (основной сайт)
   - `telegram.forelrest.com` (Telegram WebApp)

2. **SSL сертификаты**:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d forelrest.com -d www.forelrest.com
sudo certbot --nginx -d telegram.forelrest.com
```

3. **Nginx** (копируем конфигурацию):
```bash
sudo cp nginx.conf /etc/nginx/sites-available/forel
sudo ln -s /etc/nginx/sites-available/forel /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

## 🔧 Управление системой

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
```

## 📱 Telegram бот

1. **Найдите бота**: @your_bot_name
2. **Отправьте**: `/start`
3. **Нажмите**: "🍽 Открыть меню"

## 🔐 Админка

1. **Откройте**: https://forelrest.com/admin
2. **Введите код**: `0202`
3. **Управляйте**: меню и баннерами

## ✅ Результат

🎉 **Готово!** Теперь у вас есть:
- 🌐 Веб-сайт с админкой
- 🤖 Telegram бот для заказов  
- 📱 Telegram WebApp
- 🔄 Автоматическая синхронизация данных
- 🔐 Защищенная админка

## 🆘 Если что-то не работает

```bash
# Перезапуск всех сервисов
./stop.sh && ./start.sh

# Проверка логов
tail -f logs/api.log
tail -f logs/bot.log

# Проверка портов
netstat -tuln | grep :3001
netstat -tuln | grep :8080
```

## 📞 Поддержка

При проблемах:
1. Проверьте логи: `./status.sh`
2. Перезапустите: `./stop.sh && ./start.sh`  
3. Проверьте конфигурацию в `config.env`

---

**Успешного запуска! 🚀**
