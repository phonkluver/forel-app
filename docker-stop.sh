#!/bin/bash

echo "🛑 Остановка проекта Forel..."

docker compose -f docker-compose.prod.yml down

echo "✅ Проект остановлен!"

