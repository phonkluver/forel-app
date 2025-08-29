#!/bin/bash

echo "🔧 Исправление кодировки файлов фронтенда..."

# Функция для конвертации файла в UTF-8
convert_file_to_utf8() {
    local file="$1"
    if [ -f "$file" ]; then
        echo "🔄 Конвертируем $file..."
        
        # Создаем резервную копию
        cp "$file" "$file.backup"
        
        # Пытаемся конвертировать из Windows-1251 в UTF-8
        if iconv -f windows-1251 -t utf-8 "$file" -o "$file.utf8" 2>/dev/null; then
            mv "$file.utf8" "$file"
            echo "✅ $file успешно конвертирован из Windows-1251"
        else
            # Если не получилось, пробуем как UTF-8
            if iconv -f utf-8 -t utf-8 "$file" -o "$file.utf8" 2>/dev/null; then
                mv "$file.utf8" "$file"
                echo "✅ $file уже в UTF-8"
            else
                echo "❌ Ошибка конвертации $file"
            fi
        fi
    fi
}

# Находим все TypeScript/JavaScript файлы и конвертируем их
echo "📁 Поиск файлов для конвертации..."

# Конвертируем файлы в my-project-web
if [ -d "my-project-web" ]; then
    echo "🔄 Обрабатываем my-project-web..."
    find my-project-web -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read file; do
        convert_file_to_utf8 "$file"
    done
fi

# Конвертируем файлы в my-project
if [ -d "my-project" ]; then
    echo "🔄 Обрабатываем my-project..."
    find my-project -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" | while read file; do
        convert_file_to_utf8 "$file"
    done
fi

echo "✅ Конвертация завершена!"
echo "📝 Проверьте файлы в редакторе - теперь они должны отображаться корректно"
