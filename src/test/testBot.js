import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Add logging for all updates
bot.use((ctx, next) => {
  console.log('📨 Update received:', ctx.updateType);
  console.log('👤 From user:', ctx.from?.id, ctx.from?.username);
  return next();
});

// Simple start command
bot.start((ctx) => {
  console.log('✅ Start command received!');
  ctx.reply('🎉 Bot is working! Welcome to Monad Sniper Bot!');
});

// Handle text messages
bot.on('text', (ctx) => {
  console.log('📝 Text message:', ctx.message.text);
  ctx.reply(`You said: ${ctx.message.text}`);
});

console.log('🚀 Starting bot test...');
console.log('🤖 Bot token:', process.env.BOT_TOKEN ? '✅ Present' : '❌ Missing');

bot.launch()
  .then(() => {
    console.log('✅ Bot launched successfully!');
    console.log('📱 Go to Telegram and send /start to your bot');
  })
  .catch((error) => {
    console.log('❌ Bot launch failed:', error.message);
  });

// Keep running
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));