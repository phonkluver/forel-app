#!/bin/bash

# Скрипт остановки системы ресторана "Форель"

echo "🛑 Остановка системы ресторана 'Форель'..."

# Функция для остановки процесса по PID
stop_process() {
    local service_name=$1
    local pid_file=$2
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🛑 Остановка $service_name (PID: $pid)..."
            kill $pid
            sleep 2
            
            # Проверяем, что процесс остановлен
            if ps -p $pid > /dev/null 2>&1; then
                echo "⚠️  Принудительная остановка $service_name..."
                kill -9 $pid
            fi
            
            rm -f "$pid_file"
            echo "✅ $service_name остановлен"
        else
            echo "ℹ️  $service_name уже остановлен"
            rm -f "$pid_file"
        fi
    else
        echo "ℹ️  PID файл для $service_name не найден"
    fi
}

# Останавливаем все сервисы
stop_process "API сервер" "logs/api.pid"
stop_process "Telegram бот" "logs/bot.pid"
stop_process "Веб-сервер" "logs/web.pid"
stop_process "Telegram WebApp" "logs/telegram-web.pid"

# Удаляем общий файл с PIDs
rm -f logs/pids.txt

echo ""
echo "🎉 Все сервисы остановлены!"
echo ""
echo "📁 Логи сохранены в директории logs/"
echo "🚀 Для повторного запуска используйте: ./start.sh"
