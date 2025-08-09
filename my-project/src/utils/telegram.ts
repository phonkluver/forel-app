// Сервис для отправки уведомлений в Telegram

const BOT_TOKEN = '8448547384:AAEiORI0JIrXoo6LYubHDdEHTeH3fTXCdVs';
const ADMIN_CHAT_ID = '7347563606';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

interface TelegramMessage {
  text: string;
  parse_mode?: 'HTML' | 'Markdown';
}

async function sendTelegramMessage(message: TelegramMessage): Promise<boolean> {
  try {
    console.log('📤 Отправляем сообщение в Telegram...');
    
    const params = new URLSearchParams({
      chat_id: ADMIN_CHAT_ID,
      text: message.text,
      parse_mode: message.parse_mode || 'HTML',
    });

    const response = await fetch(`${TELEGRAM_API_URL}/sendMessage?${params}`, {
      method: 'GET',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Ошибка отправки в Telegram:', response.status, response.statusText, errorText);
      return false;
    }

    const result = await response.json();
    console.log('✅ Сообщение отправлено в Telegram:', result);
    return true;
  } catch (error) {
    console.error('❌ Ошибка при отправке сообщения в Telegram:', error);
    return false;
  }
}

// Форматирование заказа для Telegram
export async function sendOrderToTelegram(orderData: {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  address?: string;
  comment?: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}): Promise<boolean> {
  const itemsList = orderData.items
    .map(item => `• ${item.name} × ${item.quantity} = ${item.price * item.quantity} TJS`)
    .join('\n');

  const deliveryInfo = orderData.deliveryMethod === 'delivery' 
    ? '🚚 Доставка' 
    : '📦 Самовывоз';

  const message = {
    text: `
🆕 <b>НОВЫЙ ЗАКАЗ #${orderData.orderId}</b>

👤 <b>Клиент:</b> ${orderData.customerName}
📞 <b>Телефон:</b> ${orderData.customerPhone}
${deliveryInfo}
${orderData.address ? `📍 <b>Адрес:</b> ${orderData.address}` : ''}
${orderData.comment ? `💬 <b>Комментарий:</b> ${orderData.comment}` : ''}

📋 <b>ЗАКАЗ:</b>
${itemsList}

💰 <b>ИТОГО: ${orderData.total} TJS</b>

⏰ Время заказа: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Dushanbe' })}
    `.trim(),
    parse_mode: 'HTML' as const,
  };

  return await sendTelegramMessage(message);
}

// Форматирование бронирования для Telegram
export async function sendReservationToTelegram(reservationData: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  date: string;
  time: string;
  guests: number;
  comment?: string;
}): Promise<boolean> {
  const message = {
    text: `
🎉 <b>НОВОЕ БРОНИРОВАНИЕ</b>

👤 <b>Клиент:</b> ${reservationData.customerName}
📞 <b>Телефон:</b> ${reservationData.customerPhone}
${reservationData.customerEmail ? `📧 <b>Email:</b> ${reservationData.customerEmail}` : ''}

📅 <b>Дата:</b> ${reservationData.date}
🕐 <b>Время:</b> ${reservationData.time}
👥 <b>Количество гостей:</b> ${reservationData.guests}
${reservationData.comment ? `💬 <b>Комментарий:</b> ${reservationData.comment}` : ''}

⏰ Время бронирования: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Dushanbe' })}
    `.trim(),
    parse_mode: 'HTML' as const,
  };

  return await sendTelegramMessage(message);
}

// Форматирование контактной формы для Telegram
export async function sendContactFormToTelegram(contactData: {
  name: string;
  phone?: string;
  email?: string;
  subject?: string;
  message: string;
}): Promise<boolean> {
  const message = {
    text: `
📝 <b>НОВОЕ СООБЩЕНИЕ</b>

👤 <b>Имя:</b> ${contactData.name}
${contactData.phone ? `📞 <b>Телефон:</b> ${contactData.phone}` : ''}
${contactData.email ? `📧 <b>Email:</b> ${contactData.email}` : ''}
${contactData.subject ? `📌 <b>Тема:</b> ${contactData.subject}` : ''}

💬 <b>Сообщение:</b>
${contactData.message}

⏰ Время отправки: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Dushanbe' })}
    `.trim(),
    parse_mode: 'HTML' as const,
  };

  return await sendTelegramMessage(message);
}

// Форматирование заявки на свадебный зал для Telegram
export async function sendWeddingHallRequestToTelegram(weddingData: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  eventDate: string;
  eventTime: string;
  guestCount: number;
  eventType: string;
  budget?: string;
  additionalServices?: string[];
  comment?: string;
}): Promise<boolean> {
  const servicesList = weddingData.additionalServices && weddingData.additionalServices.length > 0
    ? weddingData.additionalServices.map(service => `• ${service}`).join('\n')
    : 'Не указаны';

  const message = {
    text: `
💒 <b>НОВАЯ ЗАЯВКА НА СВАДЕБНЫЙ ЗАЛ</b>

👤 <b>Клиент:</b> ${weddingData.customerName}
📞 <b>Телефон:</b> ${weddingData.customerPhone}
${weddingData.customerEmail ? `📧 <b>Email:</b> ${weddingData.customerEmail}` : ''}

📅 <b>Дата мероприятия:</b> ${weddingData.eventDate}
🕐 <b>Время:</b> ${weddingData.eventTime}
👥 <b>Количество гостей:</b> ${weddingData.guestCount}
🎉 <b>Тип мероприятия:</b> ${weddingData.eventType}
${weddingData.budget ? `💰 <b>Бюджет:</b> ${weddingData.budget}` : ''}

🛎️ <b>Дополнительные услуги:</b>
${servicesList}

${weddingData.comment ? `💬 <b>Комментарий:</b> ${weddingData.comment}` : ''}

⏰ Время заявки: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Dushanbe' })}
    `.trim(),
    parse_mode: 'HTML' as const,
  };

  return await sendTelegramMessage(message);
}

// Функция для звонка (оставляем как есть)
export function callPhone() {
  const phoneNumber = '+992111307777';
  
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    window.Telegram.WebApp.openTelegramLink(`tel:${phoneNumber}`);
  } else {
    window.open(`tel:${phoneNumber}`, '_blank');
  }
}

export const telegramService = {
  sendOrderToTelegram,
  sendReservationToTelegram,
  sendContactFormToTelegram,
  sendWeddingHallRequestToTelegram,
  callPhone,
}; 