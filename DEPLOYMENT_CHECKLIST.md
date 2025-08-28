# ✅ Чек-лист развертывания на TimeWeb

## 📋 Данные сервера
- [ ] **IP сервера**: `62.113.42.135`
- [ ] **SSH команда**: `ssh root@62.113.42.135`
- [ ] **Root пароль**: получен из панели TimeWeb

## 🔧 Подготовка сервера
- [ ] Подключился к серверу по SSH
- [ ] Обновил систему: `apt update && apt upgrade -y`
- [ ] Установил Docker: `curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh`
- [ ] Установил Docker Compose
- [ ] Установил certbot: `apt install certbot python3-certbot-nginx -y`

## 📁 Загрузка проекта
- [ ] Перешел в `/var/www`
- [ ] Склонировал проект: `git clone https://github.com/your-username/project-forel.git`
- [ ] Перешел в папку проекта: `cd project-forel`
- [ ] Создал файл `.env` с настройками

## 🌐 Настройка DNS
- [ ] Зашел в панель управления TimeWeb
- [ ] Добавил A-запись: `forelrest.com` → `62.113.42.135`
- [ ] Добавил A-запись: `www.forelrest.com` → `62.113.42.135`
- [ ] Добавил A-запись: `telegram.forelrest.com` → `62.113.42.135`
- [ ] Подождал обновления DNS (5-10 минут)

## 🚀 Развертывание
- [ ] Запустил развертывание: `./deploy-timeweb.sh`
- [ ] Проверил статус контейнеров: `docker-compose -f docker-compose.prod.yml ps`
- [ ] Проверил логи на ошибки: `docker-compose -f docker-compose.prod.yml logs`

## 🔐 Настройка SSL
- [ ] Запустил настройку SSL: `./setup-ssl.sh`
- [ ] Проверил получение сертификатов
- [ ] Проверил работу HTTPS

## 🤖 Настройка Telegram бота
- [ ] Нашел @BotFather в Telegram
- [ ] Отправил `/mybots`
- [ ] Выбрал бота
- [ ] Установил WebApp URL: `https://telegram.forelrest.com`
- [ ] Протестировал бота

## ✅ Тестирование
- [ ] Открыл `https://forelrest.com` - работает
- [ ] Открыл `https://telegram.forelrest.com` - работает
- [ ] Проверил API: `https://forelrest.com/api` - работает
- [ ] Протестировал Telegram бота - работает
- [ ] Проверил админ-панель - работает

## 🔧 Дополнительные настройки
- [ ] Настроил автоперезапуск: `systemctl enable forel.service`
- [ ] Настроил автоматическое обновление SSL
- [ ] Создал резервную копию конфигурации

## 📞 Если что-то не работает
- [ ] Проверил логи: `docker-compose -f docker-compose.prod.yml logs`
- [ ] Проверил порты: `netstat -tlnp | grep :80`
- [ ] Проверил DNS: `nslookup forelrest.com`
- [ ] Проверил SSL: `openssl s_client -connect forelrest.com:443`

---

## 🎉 Готово!

Ваши сайты работают:
- ✅ **forelrest.com** - основное веб-приложение
- ✅ **telegram.forelrest.com** - Telegram WebApp
- ✅ **Telegram бот** - для заказов и отзывов

## 🔧 Полезные команды для управления

```bash
# Статус всех сервисов
docker-compose -f docker-compose.prod.yml ps

# Просмотр логов
docker-compose -f docker-compose.prod.yml logs -f

# Перезапуск
docker-compose -f docker-compose.prod.yml restart

# Обновление приложения
git pull && docker-compose -f docker-compose.prod.yml up -d --build
```
