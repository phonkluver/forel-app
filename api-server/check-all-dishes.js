const fs = require('fs');
const path = require('path');

console.log('🔍 ДЕТАЛЬНАЯ ПРОВЕРКА ВСЕХ БЛЮД...\n');

// Читаем категории
const categoriesPath = path.join(__dirname, 'categories_current.json');
const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));

// Читаем блюда
const dishesPath = path.join(__dirname, 'dishes_current.json');
const dishes = JSON.parse(fs.readFileSync(dishesPath, 'utf8'));

console.log(`📊 ОБЩАЯ СТАТИСТИКА:`);
console.log(`🏷️ Категорий: ${categories.length}`);
console.log(`🍽️ Блюд: ${dishes.length}`);

// Проверяем распределение блюд по категориям
console.log('\n📋 РАСПРЕДЕЛЕНИЕ БЛЮД ПО КАТЕГОРИЯМ:');
categories.forEach(cat => {
  const categoryDishes = dishes.filter(dish => dish.category_id === cat.id);
  const name = typeof cat.name === 'string' ? JSON.parse(cat.name) : cat.name;
  console.log(`\n🏷️ ${name.ru} (${name.zh}): ${categoryDishes.length} блюд`);
  
  if (categoryDishes.length > 0) {
    categoryDishes.forEach(dish => {
      const dishName = typeof dish.name === 'string' ? JSON.parse(dish.name) : dish.name;
      console.log(`  • ${dishName.ru} (${dishName.zh}) - ${dish.price} TJS`);
    });
  } else {
    console.log(`  ❌ Нет блюд в этой категории`);
  }
});

// Проверяем блюда без категории
const uncategorizedDishes = dishes.filter(dish => {
  const category = categories.find(cat => cat.id === dish.category_id);
  return !category;
});

if (uncategorizedDishes.length > 0) {
  console.log('\n❌ БЛЮДА БЕЗ КАТЕГОРИИ:');
  uncategorizedDishes.forEach(dish => {
    const dishName = typeof dish.name === 'string' ? JSON.parse(dish.name) : dish.name;
    console.log(`• ${dishName.ru} (category_id: ${dish.category_id})`);
  });
}

// Проверяем дубликаты
const dishNames = dishes.map(dish => {
  const dishName = typeof dish.name === 'string' ? JSON.parse(dish.name) : dish.name;
  return dishName.ru;
});

const duplicates = dishNames.filter((name, index) => dishNames.indexOf(name) !== index);
if (duplicates.length > 0) {
  console.log('\n⚠️ ДУБЛИКАТЫ БЛЮД:');
  [...new Set(duplicates)].forEach(name => {
    console.log(`• ${name}`);
  });
}

// Проверяем блюда без китайских переводов
const dishesWithoutChinese = dishes.filter(dish => {
  const dishName = typeof dish.name === 'string' ? JSON.parse(dish.name) : dish.name;
  return !dishName.zh || dishName.zh === 'undefined' || dishName.zh === '';
});

if (dishesWithoutChinese.length > 0) {
  console.log('\n❌ БЛЮДА БЕЗ КИТАЙСКИХ ПЕРЕВОДОВ:');
  dishesWithoutChinese.forEach(dish => {
    const dishName = typeof dish.name === 'string' ? JSON.parse(dish.name) : dish.name;
    console.log(`• ${dishName.ru}`);
  });
}

// Проверяем блюда с нулевыми ценами
const dishesWithZeroPrice = dishes.filter(dish => !dish.price || dish.price === '0' || dish.price === 0);
if (dishesWithZeroPrice.length > 0) {
  console.log('\n⚠️ БЛЮДА С НУЛЕВЫМИ ЦЕНАМИ:');
  dishesWithZeroPrice.forEach(dish => {
    const dishName = typeof dish.name === 'string' ? JSON.parse(dish.name) : dish.name;
    console.log(`• ${dishName.ru} - ${dish.price} TJS`);
  });
}

console.log('\n✅ ПРОВЕРКА ЗАВЕРШЕНА!');
