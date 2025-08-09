#!/bin/bash

# Скрипт проверки статуса системы ресторана "Форель"

echo "📊 Статус системы ресторана 'Форель'"
echo "=================================="

# Функция для проверки статуса процесса
check_status() {
    local service_name=$1
    local pid_file=$2
    local port=$3
    local url=$4
    
    echo ""
    echo "🔍 Проверка $service_name:"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "   ✅ Процесс запущен (PID: $pid)"
            
            # Проверяем порт если указан
            if [ ! -z "$port" ]; then
                if netstat -tuln 2>/dev/null | grep ":$port " > /dev/null; then
                    echo "   ✅ Порт $port активен"
                else
                    echo "   ⚠️  Порт $port не активен"
                fi
            fi
            
            # Проверяем URL если указан
            if [ ! -z "$url" ]; then
                if curl -s "$url" > /dev/null 2>&1; then
                    echo "   ✅ URL доступен: $url"
                else
                    echo "   ⚠️  URL недоступен: $url"
                fi
            fi
            
        else
            echo "   ❌ Процесс не запущен (PID файл устарел)"
            rm -f "$pid_file"
        fi
    else
        echo "   ❌ Процесс не запущен (PID файл не найден)"
    fi
}

# Проверяем статус всех сервисов
check_status "API сервер" "logs/api.pid" "3001" "http://localhost:3001/health"
check_status "Telegram бот" "logs/bot.pid"
check_status "Веб-сервер" "logs/web.pid" "8080" "http://localhost:8080"
check_status "Telegram WebApp" "logs/telegram-web.pid" "8081" "http://localhost:8081"

echo ""
echo "📁 Логи:"
if [ -d "logs" ]; then
    for log_file in logs/*.log; do
        if [ -f "$log_file" ]; then
            local size=$(du -h "$log_file" | cut -f1)
            local lines=$(wc -l < "$log_file")
            echo "   📄 $(basename "$log_file"): $size, $lines строк"
        fi
    done
else
    echo "   📁 Директория logs не найдена"
fi

echo ""
echo "💾 Использование диска:"
if [ -d "data" ]; then
    local data_size=$(du -sh data 2>/dev/null | cut -f1)
    echo "   📊 База данных: $data_size"
fi

if [ -d "uploads" ]; then
    local uploads_size=$(du -sh uploads 2>/dev/null | cut -f1)
    echo "   📁 Загрузки: $uploads_size"
fi

echo ""
echo "🔧 Управление:"
echo "   🚀 Запуск: ./start.sh"
echo "   🛑 Остановка: ./stop.sh"
echo "   📋 Статус: ./status.sh"
