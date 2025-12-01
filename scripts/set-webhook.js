import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

async function setWebhook() {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  
  // Your Vercel URL (update after deployment)
  const webhookUrl = 'https://sniper-bot-seven.vercel.app/';
  
  try {
    console.log('🌐 Setting webhook to:', webhookUrl);
    
    const result = await bot.telegram.setWebhook(webhookUrl);
    console.log('✅ Webhook set successfully!', result);
    
    // Verify webhook
    const webhookInfo = await bot.telegram.getWebhookInfo();
    console.log('📋 Webhook info:');
    console.log('- URL:', webhookInfo.url);
    console.log('- Has custom cert:', webhookInfo.has_custom_certificate);
    console.log('- Pending updates:', webhookInfo.pending_update_count);
    
  } catch (error) {
    console.error('❌ Error setting webhook:', error.message);
  }
}

setWebhook();