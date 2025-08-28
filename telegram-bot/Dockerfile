FROM node:18-alpine

# Создаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --only=production

# Копируем исходный код
COPY . .

# Открываем порт (если нужно)
EXPOSE 3000

# Запускаем бота
CMD ["npm", "start"]

