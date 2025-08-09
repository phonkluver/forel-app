const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config({ path: './config.env' });

// Bot configuration
const token = process.env.BOT_TOKEN || '8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ';
const webappUrl = process.env.WEBAPP_URL || 'https://telegram.forelrest.com';

// Create bot instance
const bot = new TelegramBot(token, { polling: true });

console.log('🤖 Telegram bot started...');

// Handle /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const firstName = msg.from.first_name || 'Гость';
  const username = msg.from.username || 'Не указан';
  
  // Log user info for admin setup
  console.log(`👤 User started bot: ${firstName} (@${username}) - Chat ID: ${chatId}`);
  
  try {
    await bot.sendMessage(chatId, 
      `Ассаляму Алейкум, ${firstName}! 👋\n\nДобро пожаловать в наш ресторан! 🍽\n\nЗдесь вы можете:\n• Просмотреть меню 📋\n• Сделать заказ 🛒\n• Забронировать столик 🍽\n• Узнать о нас ℹ️\n\nНажмите кнопку ниже, чтобы открыть приложение:`, 
      {
        reply_markup: {
          inline_keyboard: [
            [{
              text: '🍽 Открыть меню',
              web_app: { url: webappUrl }
            }],
            [{
              text: '⭐ Оставить отзыв',
              callback_data: 'leave_review'
            }]
          ]
        }
      }
    );
    
    console.log(`✅ Welcome message sent to chat ${chatId}`);
  } catch (error) {
    console.error('❌ Error sending welcome message:', error);
  }
});

// Store user states for review collection
const userStates = new Map();

// Handle callback queries
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'leave_review') {
    try {
      // Set user state to waiting for review
      userStates.set(chatId, 'waiting_for_review');
      
      await bot.sendMessage(chatId, 
        `Спасибо за желание оставить отзыв! 🌟\n\nПожалуйста, напишите ваш отзыв о нашем ресторане. Мы ценим каждое мнение наших гостей! 🙏\n\nВаш отзыв поможет нам стать еще лучше.\n\nПросто напишите ваш отзыв в следующем сообщении.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{
                text: '❌ Отменить',
                callback_data: 'cancel_review'
              }]
            ]
          }
        }
      );
      
      console.log(`✅ Review request sent to chat ${chatId}`);
    } catch (error) {
      console.error('❌ Error sending review request:', error);
    }
  }
  
  if (data === 'cancel_review') {
    try {
      // Clear user state
      userStates.delete(chatId);
      
      await bot.sendMessage(chatId, 
        `Отзыв отменен. Если захотите оставить отзыв позже, просто нажмите кнопку "⭐ Оставить отзыв" в главном меню.`,
        {
          reply_markup: {
            inline_keyboard: [
              [{
                text: '🍽 Открыть меню',
                web_app: { url: webappUrl }
              }]
            ]
          }
        }
      );
      
      console.log(`✅ Review cancelled for chat ${chatId}`);
    } catch (error) {
      console.error('❌ Error cancelling review:', error);
    }
  }
});

// Handle text messages (for reviews)
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Skip if it's a command or web app data
  if (msg.text && msg.text.startsWith('/')) return;
  if (msg.web_app_data) return;
  
  // Check if user is waiting for review
  const userState = userStates.get(chatId);
  
  if (userState === 'waiting_for_review' && text) {
    try {
      // Clear user state
      userStates.delete(chatId);
      
      // Send confirmation to user
      await bot.sendMessage(chatId, 
        `✅ Спасибо за ваш отзыв! 🌟\n\nВаш отзыв:\n"${text}"\n\nМы обязательно учтем ваше мнение и постараемся стать еще лучше! 🙏\n\nСпасибо, что выбрали наш ресторан! ❤️`,
        {
          reply_markup: {
            inline_keyboard: [
              [{
                text: '🍽 Открыть меню',
                web_app: { url: webappUrl }
              }]
            ]
          }
        }
      );
      
      // Send review to admin
      await sendReviewToAdmin(chatId, msg.from, text);
      
      console.log(`✅ Review received from chat ${chatId}`);
    } catch (error) {
      console.error('❌ Error processing review:', error);
      await bot.sendMessage(chatId, '❌ Произошла ошибка при отправке отзыва. Попробуйте еще раз.');
    }
  }
});

// Handle web app data (when user submits order from mini-app)
bot.on('web_app_data', async (msg) => {
  const chatId = msg.chat.id;
  const webAppData = msg.web_app_data;
  
  try {
    console.log('📱 Received web app data:', webAppData);
    
    // Parse the data (assuming it's JSON)
    const orderData = JSON.parse(webAppData.data);
    
    // Send order confirmation to user
    await sendOrderConfirmation(chatId, orderData);
    
  } catch (error) {
    console.error('❌ Error processing web app data:', error);
    await bot.sendMessage(chatId, '❌ Произошла ошибка при обработке заказа. Попробуйте еще раз.');
  }
});

// Function to send order confirmation to user
async function sendOrderConfirmation(chatId, orderData) {
  try {
    const { items, total, delivery_method, delivery_address, customer_name, payment_method, comment } = orderData;
    
    let message = `✅ <b>Заказ успешно оформлен!</b>\n\n`;
    message += `👤 <b>Имя:</b> ${customer_name || 'Не указано'}\n`;
    message += `📦 <b>Способ доставки:</b> ${delivery_method}\n`;
    
    if (delivery_address) {
      message += `📍 <b>Адрес доставки:</b> ${delivery_address}\n`;
    }
    
    message += `💳 <b>Способ оплаты:</b> ${payment_method}\n`;
    
    if (comment) {
      message += `💬 <b>Комментарий:</b> ${comment}\n`;
    }
    
    message += `\n🍽 <b>Заказанные блюда:</b>\n`;
    
    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      message += `• ${getRussianDishName(item.name)} x${item.quantity} - ${itemTotal} TJS\n`;
    });
    
    message += `\n💰 <b>Итого к оплате:</b> ${total} TJS\n\n`;
    message += `⏰ <b>Время заказа:</b> ${new Date().toLocaleString('ru-RU')}\n\n`;
    message += `Спасибо за заказ! Мы свяжемся с вами в ближайшее время. 🙏`;
    
    await bot.sendMessage(chatId, message, { parse_mode: 'HTML' });
    console.log(`✅ Order confirmation sent to chat ${chatId}`);
    
  } catch (error) {
    console.error('❌ Error sending order confirmation:', error);
    await bot.sendMessage(chatId, '❌ Произошла ошибка при отправке подтверждения заказа.');
  }
}

// Function to send review to admin
async function sendReviewToAdmin(userChatId, user, reviewText) {
  try {
    // Admin chat ID - replace with actual admin chat ID
    const adminChatId = process.env.ADMIN_CHAT_ID || '123456789'; // Replace with actual admin chat ID
    
    const userName = user.first_name || 'Неизвестный';
    const userLastName = user.last_name || '';
    const userUsername = user.username ? `@${user.username}` : 'Не указан';
    
    let adminMessage = `📝 <b>НОВЫЙ ОТЗЫВ ОТ КЛИЕНТА</b>\n\n`;
    adminMessage += `👤 <b>Имя:</b> ${userName} ${userLastName}\n`;
    adminMessage += `🆔 <b>Username:</b> ${userUsername}\n`;
    adminMessage += `💬 <b>Chat ID:</b> ${userChatId}\n`;
    adminMessage += `📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}\n\n`;
    adminMessage += `💭 <b>Отзыв:</b>\n"${reviewText}"\n\n`;
    adminMessage += `━━━━━━━━━━━━━━━━━━━━`;
    
    await bot.sendMessage(adminChatId, adminMessage, { parse_mode: 'HTML' });
    console.log(`✅ Review sent to admin from chat ${userChatId}`);
    
  } catch (error) {
    console.error('❌ Error sending review to admin:', error);
  }
}

// Function to get Russian dish name
function getRussianDishName(dishName) {
  const englishToRussian = {
    'Grilled Trout': 'Форель на гриле',
    'Salmon Steak': 'Стейк из лосося',
    'Salt-Baked Dorado': 'Дорадо в соли',
    'Sea Bass': 'Морской окунь',
    'Seafood Paella': 'Паэлья с морепродуктами',
    'Shrimp Ceviche': 'Севиче из креветок',
    'Tuna Tartare': 'Тартар из тунца',
    'Trout Salad': 'Салат с форелью',
    'Caesar with Shrimp': 'Цезарь с креветками',
    'Fresh Juice': 'Свежевыжатый сок',
    'Lemonade': 'Лимонад',
    'Caesar with Chicken': 'Цезарь с курицей',
    'Greek Salad': 'Греческий салат',
    'Caprese': 'Капрезе',
    'Olivier': 'Оливье',
    'Beetroot Salad': 'Салат из свеклы',
    'Crab Salad': 'Салат с крабом',
    'Shrimp Salad': 'Салат с креветками',
    'Tuna Salad': 'Салат с тунцом',
    'Salmon Salad': 'Салат с лососем',
    'Avocado Salad': 'Салат с авокадо',
    'Quinoa Salad': 'Салат с киноа',
    'Fruit Salad': 'Фруктовый салат',
    'Vegetable Salad': 'Овощной салат',
    'Chicken Salad': 'Салат с курицей',
    'Beef Salad': 'Салат с говядиной',
    'Lamb Salad': 'Салат с бараниной',
    'Duck Salad': 'Салат с уткой',
    'Turkey Salad': 'Салат с индейкой',
    'Pork Salad': 'Салат со свининой',
    'Fish Soup': 'Уха',
    'Borsch': 'Борщ',
    'Kharcho': 'Харчо',
    'Lentil Soup': 'Чечевичный суп',
    'Mushroom Soup': 'Грибной суп',
    'Chicken Soup': 'Куриный суп',
    'Beef Soup': 'Говяжий суп',
    'Lamb Soup': 'Бараний суп',
    'Duck Soup': 'Утиный суп',
    'Turkey Soup': 'Индюшиный суп',
    'Pork Soup': 'Свиной суп',
    'Meat Fillet with Mushrooms': 'Мясное филе с грибами',
    'Beef Steak': 'Говяжий стейк',
    'Lamb Chops': 'Бараньи отбивные',
    'Pork Cutlet': 'Свиная отбивная',
    'Chicken Breast': 'Куриная грудка',
    'Duck Breast': 'Утиная грудка',
    'Turkey Breast': 'Индюшиная грудка',
    'Veal Cutlet': 'Телячья отбивная',
    'Lamb Fillet': 'Бараний филей',
    'Pork Fillet': 'Свиной филей',
    'Beef Fillet': 'Говяжий филей',
    'Chicken Fillet': 'Куриный филей',
    'Duck Fillet': 'Утиный филей',
    'Turkey Fillet': 'Индюшиный филей',
    'Veal Fillet': 'Телячий филей',
    'Lamb Steak': 'Бараний стейк',
    'Pork Steak': 'Свиной стейк',
    'Chicken Steak': 'Куриный стейк',
    'Duck Steak': 'Утиный стейк',
    'Turkey Steak': 'Индюшиный стейк',
    'Veal Steak': 'Телячий стейк',
    'Grilled Salmon': 'Лосось на гриле',
    'Baked Trout': 'Запеченная форель',
    'Fried Dorado': 'Жареная дорадо',
    'Steamed Sea Bass': 'Морской окунь на пару',
    'Smoked Salmon': 'Копченый лосось',
    'Caviar': 'Икра',
    'Oysters': 'Устрицы',
    'Mussels': 'Мидии',
    'Carbonara': 'Карбонара',
    'Bolognese': 'Болоньезе',
    'Alfredo': 'Альфредо',
    'Pesto': 'Песто',
    'Marinara': 'Маринара',
    'Bruschetta': 'Брускетта',
    'Carpaccio': 'Карпаччо',
    'Tartare': 'Тартар',
    'Rice': 'Рис',
    'Buckwheat': 'Гречка',
    'Mashed Potatoes': 'Картофельное пюре',
    'French Fries': 'Картофель фри',
    'Grilled Vegetables': 'Овощи на гриле',
    'Steamed Vegetables': 'Овощи на пару',
    'Roasted Potatoes': 'Жареный картофель',
    'Boiled Potatoes': 'Отварной картофель',
    'Beef Cutlet': 'Говяжья котлета',
    'Chicken Cutlet': 'Куриная котлета',
    'Pork Cutlet': 'Свиная котлета',
    'Lamb Cutlet': 'Баранья котлета',
    'Beef Ribs': 'Говяжьи ребра',
    'Pork Ribs': 'Свиные ребра',
    'Lamb Ribs': 'Бараньи ребра',
    'Beef Kaila': 'Говяжья кайла',
    'Pork Kaila': 'Свиная кайла',
    'Lamb Kaila': 'Баранья кайла',
    'Beef Steak': 'Говяжий стейк',
    'Chicken Steak': 'Куриный стейк',
    'Pork Steak': 'Свиной стейк',
    'Lamb Steak': 'Бараний стейк',
    'Duck Steak': 'Утиный стейк',
    'Turkey Steak': 'Индюшиный стейк',
    'Veal Steak': 'Телячий стейк',
    'Fish Steak': 'Рыбный стейк',
    'Beef Kebab': 'Говяжий шашлык',
    'Lamb Kebab': 'Бараний шашлык',
    'Chicken Kebab': 'Куриный шашлык',
    'Pork Kebab': 'Свиной шашлык',
    'Fish Kebab': 'Рыбный шашлык',
    'Shrimp Kebab': 'Креветочный шашлык',
    'Vegetable Kebab': 'Овощной шашлык',
    'Mushroom Kebab': 'Грибной шашлык',
    'Special Order': 'Спецзаказ',
    'Custom Dish': 'Индивидуальное блюдо',
    'Chef Special': 'Фирменное блюдо шеф-повара'
  };

  // If name is already in Russian, return as is
  if (Object.values(englishToRussian).includes(dishName)) {
    return dishName;
  }

  // If it's English name, translate to Russian
  return englishToRussian[dishName] || dishName;
}

// Handle errors
bot.on('error', (error) => {
  console.error('❌ Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('❌ Polling error:', error);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down bot...');
  bot.stopPolling();
  process.exit(0);
});

console.log('✅ Bot is running and listening for messages...'); 