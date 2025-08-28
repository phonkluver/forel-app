#!/bin/bash

case "$1" in
  "start")
    echo "🚀 Запускаем сервисы..."
    docker-compose -f docker-compose.prod.yml up -d
    ;;
  "stop")
    echo "⏹️ Останавливаем сервисы..."
    docker-compose -f docker-compose.prod.yml down
    ;;
  "restart")
    echo "🔄 Перезапускаем сервисы..."
    docker-compose -f docker-compose.prod.yml restart
    ;;
  "logs")
    echo "📋 Показываем логи..."
    docker-compose -f docker-compose.prod.yml logs -f
    ;;
  "status")
    echo "📊 Статус сервисов..."
    docker-compose -f docker-compose.prod.yml ps
    ;;
  "update")
    echo "🔄 Обновляем код..."
    git pull
    docker-compose -f docker-compose.prod.yml build --no-cache
    docker-compose -f docker-compose.prod.yml up -d
    ;;
  "backup")
    echo "💾 Создаем резервную копию данных..."
    mkdir -p backups
    cp -r api-server/dishes_current.json backups/dishes_$(date +%Y%m%d_%H%M%S).json
    cp -r api-server/categories_current.json backups/categories_$(date +%Y%m%d_%H%M%S).json
    cp -r api-server/banners_current.json backups/banners_$(date +%Y%m%d_%H%M%S).json
    echo "✅ Резервная копия создана в папке backups/"
    ;;
  *)
    echo "Использование: $0 {start|stop|restart|logs|status|update|backup}"
    echo ""
    echo "Команды:"
    echo "  start   - Запустить все сервисы"
    echo "  stop    - Остановить все сервисы"
    echo "  restart - Перезапустить все сервисы"
    echo "  logs    - Показать логи"
    echo "  status  - Показать статус сервисов"
    echo "  update  - Обновить код и перезапустить"
    echo "  backup  - Создать резервную копию данных"
    exit 1
    ;;
esac

