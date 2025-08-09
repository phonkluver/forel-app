const TelegramBot = require('node-telegram-bot-api');

// Test configuration
const token = '8489499457:AAEYJsk8jN3qynY2J4DoPSlqU1ghMdwlbSQ';

console.log('🧪 Testing Telegram bot...');

// Create bot instance
const bot = new TelegramBot(token, { polling: false });

// Test bot info
async function testBot() {
  try {
    const botInfo = await bot.getMe();
    console.log('✅ Bot connection successful!');
    console.log('🤖 Bot info:', {
      id: botInfo.id,
      name: botInfo.first_name,
      username: botInfo.username,
      can_join_groups: botInfo.can_join_groups,
      can_read_all_group_messages: botInfo.can_read_all_group_messages,
      supports_inline_queries: botInfo.supports_inline_queries
    });
    
    console.log('\n📋 Bot is ready to use!');
    console.log('🔗 Bot username: @' + botInfo.username);
    console.log('💬 Users can start the bot with: /start');
    
  } catch (error) {
    console.error('❌ Bot connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check if the token is correct');
    console.log('2. Make sure the bot is not already running');
    console.log('3. Verify internet connection');
  }
}

// Run test
testBot(); 