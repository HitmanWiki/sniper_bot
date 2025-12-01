import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

async function setWebhook() {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  
  // CORRECT URL with /api/bot endpoint
  const webhookUrl = 'https://sniper-bot-seven.vercel.app/api/bot';
  
  try {
    console.log('🌐 Setting webhook to:', webhookUrl);
    
    // Delete old webhook first
    console.log('🗑️ Deleting old webhook...');
    await bot.telegram.deleteWebhook();
    
    // Set new webhook
    const result = await bot.telegram.setWebhook(webhookUrl);
    console.log('✅ Webhook set successfully!', result);
    
    // Verify webhook
    const webhookInfo = await bot.telegram.getWebhookInfo();
    console.log('📋 Webhook info:');
    console.log('- URL:', webhookInfo.url);
    console.log('- Has custom cert:', webhookInfo.has_custom_certificate);
    console.log('- Pending updates:', webhookInfo.pending_update_count);
    
    if (webhookInfo.url === webhookUrl) {
      console.log('🎯 Webhook correctly set to target URL!');
    } else {
      console.log('⚠️ Warning: Webhook URL mismatch!');
      console.log('   Expected:', webhookUrl);
      console.log('   Actual:', webhookInfo.url);
    }
    
  } catch (error) {
    console.error('❌ Error setting webhook:', error.message);
    console.error('Stack:', error.stack);
  }
}

setWebhook();