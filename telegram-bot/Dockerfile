FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Устанавливаем права доступа
RUN chown -R node:node /app
USER node

# Запускаем бота
CMD ["node", "bot.js"]
