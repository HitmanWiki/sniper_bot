import { Telegraf, session } from 'telegraf';
import dotenv from 'dotenv';

// Remove fileURLToPath imports - not needed
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// Adjust import paths - use correct relative paths
import { mainMenu, advancedMenu } from './keyboards/mainMenu.js';  // FIXED PATH
import { startHandler } from './handlers/startHandler.js';  // FIXED PATH
import { walletHandler } from './handlers/walletHandler.js';
import { monitorHandler } from './handlers/monitorHandler.js';
import { snipeHandler } from './handlers/snipeHandler.js';
import { tradeHandler } from './handlers/tradeHandler.js';
import { settingsHandler } from './handlers/settingsHandler.js';
import { analyticsHandler } from './handlers/analyticsHandler.js';
import { securityHandler } from './handlers/securityHandler.js';
// import { validateEncryptionKey } from './utils/encryption.js';
// import { initDatabase } from './utils/database.js';

dotenv.config();

// Comment out database init for now (Vercel serverless)
// validateEncryptionKey();
// initDatabase();

const bot = new Telegraf(process.env.BOT_TOKEN);

// Basic session
bot.use(session({ 
  defaultSession: () => ({ 
    wallets: [],
    monitoredTokens: [],
    settings: {
      slippage: 3,
      gasPrice: 'standard',
      notifications: true
    }
  }) 
}));

// Add logging for all updates
bot.use((ctx, next) => {
  console.log('📨 Received:', ctx.message?.text || ctx.callbackQuery?.data);
  return next();
});

// Start command
bot.start(startHandler);

// MAIN MENU HANDLERS - SEPARATE TEXT AND CALLBACKS
bot.hears('👛 Wallet Management', async (ctx) => {
    console.log('📱 TEXT: Wallet Management clicked');
    // Clear any callback context to prevent conflicts
    ctx.match = null; // Clear any previous match data
    await walletHandler(ctx, 'menu');
});

bot.hears('📊 Token Monitoring', async (ctx) => {
    console.log('📱 TEXT: Token Monitoring clicked');
    ctx.match = null;
    await monitorHandler(ctx, 'menu');
});

bot.hears('🎯 Auto Sniper', async (ctx) => {
    console.log('📱 TEXT: Auto Sniper clicked');
    ctx.match = null;
    await snipeHandler(ctx, 'menu');
});

bot.hears('⚡ Quick Trade', async (ctx) => {
    console.log('📱 TEXT: Quick Trade clicked');
    ctx.match = null;
    await tradeHandler(ctx, 'menu');
});

bot.hears('📈 Analytics', async (ctx) => {
    console.log('📱 TEXT: Analytics clicked');
    ctx.match = null;
    await analyticsHandler(ctx, 'menu');
});

bot.hears('⚙️ Settings', async (ctx) => {
    console.log('📱 TEXT: Settings clicked');
    ctx.match = null;
    await settingsHandler(ctx, 'menu');
});

bot.hears('🛡️ Security', async (ctx) => {
    console.log('📱 TEXT: Security clicked');
    ctx.match = null;
    await securityHandler(ctx, 'menu');
});

bot.hears('🔍 Advanced', async (ctx) => {
    await ctx.reply('🔍 Advanced Features', {
      reply_markup: advancedMenu.reply_markup
    });
});

bot.hears('📋 Portfolio', async (ctx) => {
    await analyticsHandler(ctx, 'portfolio');
});

bot.hears('🚀 Quick Actions', async (ctx) => {
    await ctx.reply(`
🚀 **Quick Actions**

**Available Quick Commands:**

💰 **Balance Check**
/balance - Check all wallet balances

📊 **Portfolio View** 
/portfolio - View portfolio summary

🎯 **Quick Trading**
/buy <contract> <amount> - Quick buy
/sell <contract> <percentage> - Quick sell

📈 **Monitoring**
/monitor <contract> - Add token to monitor

⚡ **Auto Sniping**
/snipe <contract> <amount> <trigger> - Setup quick snipe

**Use the commands above or menu buttons for full features!**
    `, { parse_mode: 'Markdown' });
});

bot.hears('📊 Market Data', async (ctx) => {
    await ctx.reply(`
📊 **Market Data**

**Coming Soon!**

**Planned Market Features:**
• Live price feeds
• Market trends
• Volume analysis
• Top gainers/losers
• New token alerts
• Liquidity tracking

**For now, use:**
• Token Monitoring for individual tokens
• Analytics for portfolio data
• Quick Trade for execution
    `, { parse_mode: 'Markdown' });
});

// CALLBACK HANDLERS - Only for inline keyboard actions
bot.action(/wallet_(.+)/, async (ctx) => {
    const action = ctx.match[1];
    console.log('🔘 CALLBACK: Wallet action:', action);
    await walletHandler(ctx, action);
    await ctx.answerCbQuery(); // Important: acknowledge callback
});

bot.action(/monitor_(.+)/, async (ctx) => {
    const action = ctx.match[1];
    console.log('🔘 CALLBACK: Monitor action:', action);
    await monitorHandler(ctx, action);
    await ctx.answerCbQuery();
});

bot.action(/snipe_(.+)/, async (ctx) => {
    const action = ctx.match[1];
    console.log('🔘 CALLBACK: Snipe action:', action);
    await snipeHandler(ctx, action);
    await ctx.answerCbQuery();
});

bot.action(/trade_(.+)/, async (ctx) => {
    const action = ctx.match[1];
    console.log('🔘 CALLBACK: Trade action:', action);
    await tradeHandler(ctx, action);
    await ctx.answerCbQuery();
});

bot.action(/settings_(.+)/, async (ctx) => {
    const action = ctx.match[1];
    console.log('🔘 CALLBACK: Settings action:', action);
    await settingsHandler(ctx, action);
    await ctx.answerCbQuery();
});

bot.action(/analytics_(.+)/, async (ctx) => {
    const action = ctx.match[1];
    console.log('🔘 CALLBACK: Analytics action:', action);
    await analyticsHandler(ctx, action);
    await ctx.answerCbQuery();
});

bot.action(/security_(.+)/, async (ctx) => {
    const action = ctx.match[1];
    console.log('🔘 CALLBACK: Security action:', action);
    await securityHandler(ctx, action);
    await ctx.answerCbQuery();
});

bot.action(/advanced_(.+)/, async (ctx) => {
    const action = ctx.match[1];
    await ctx.reply(`Advanced feature: ${action} - Coming soon!`);
});

// Handle quick commands
bot.on('text', async (ctx) => {
    const text = ctx.message.text.toLowerCase();
    
    if (text.startsWith('/buy ')) {
      await handleQuickBuy(ctx, text);
    } else if (text.startsWith('/sell ')) {
      await handleQuickSell(ctx, text);
    } else if (text.startsWith('/monitor ')) {
      await handleQuickMonitor(ctx, text);
    } else if (text.startsWith('/snipe ')) {
      await handleQuickSnipe(ctx, text);
    } else if (text.startsWith('/balance')) {
      await handleQuickBalance(ctx);
    } else if (text.startsWith('/portfolio')) {
      await handleQuickPortfolio(ctx);
    } else if (text === '/help') {
      await handleHelpCommand(ctx);
    }
    // Don't handle other messages - let them show main menu
});

// Quick command handlers
async function handleQuickBuy(ctx, text) {
    const [, contract, amount] = text.split(' ');
    if (!contract || !amount) {
      await ctx.reply('❌ Usage: /buy <contract> <amount>');
      return;
    }
    
    await ctx.reply(`
🟢 **Quick Buy Setup**

**Contract:** ${contract}
**Amount:** ${amount} MON

**Quick buying feature coming soon!**

For now, use the "⚡ Quick Trade" menu for trading.
    `, { parse_mode: 'Markdown' });
}

async function handleQuickSell(ctx, text) {
    const [, contract, percentage] = text.split(' ');
    if (!contract || !percentage) {
      await ctx.reply('❌ Usage: /sell <contract> <percentage>');
      return;
    }
    
    await ctx.reply(`
🔴 **Quick Sell Setup**

**Contract:** ${contract}
**Sell:** ${percentage}%

**Quick selling feature coming soon!**

For now, use the "⚡ Quick Trade" menu for trading.
    `, { parse_mode: 'Markdown' });
}

async function handleQuickMonitor(ctx, text) {
    const [, contract] = text.split(' ');
    if (!contract) {
      await ctx.reply('❌ Usage: /monitor <contract>');
      return;
    }
    
    await ctx.reply(`
📊 **Quick Monitor**

**Contract:** ${contract}

**Token monitoring feature coming soon!**

For now, use the "📊 Token Monitoring" menu.
    `, { parse_mode: 'Markdown' });
}

async function handleQuickSnipe(ctx, text) {
    const [, contract, amount, trigger] = text.split(' ');
    if (!contract || !amount) {
      await ctx.reply('❌ Usage: /snipe <contract> <amount> <trigger>');
      return;
    }
    
    await ctx.reply(`
🎯 **Quick Snipe Setup**

**Contract:** ${contract}
**Amount:** ${amount} MON
**Trigger:** ${trigger || 'Not specified'}

**Auto snipe feature coming soon!**

For now, use the "🎯 Auto Sniper" menu.
    `, { parse_mode: 'Markdown' });
}

async function handleQuickBalance(ctx) {
    const userWallets = ctx.session.wallets || [];
    
    if (userWallets.length === 0) {
      await ctx.reply('❌ No wallets connected. Use "👛 Wallet Management" to connect a wallet.');
      return;
    }

    let balanceMessage = '💰 **Quick Balance**\n\n';
    
    userWallets.forEach((wallet, index) => {
      balanceMessage += `**${wallet.name || `Wallet ${index + 1}`}**\n`;
      balanceMessage += `📍 ${wallet.address.slice(0, 8)}...\n`;
      balanceMessage += `💎 MON: Checking...\n`;
      balanceMessage += `---\n`;
    });

    balanceMessage += '\n*Use "👛 Wallet Management" for detailed balances*';

    await ctx.reply(balanceMessage, { parse_mode: 'Markdown' });
}

async function handleQuickPortfolio(ctx) {
    await analyticsHandler(ctx, 'portfolio');
}

async function handleHelpCommand(ctx) {
    const helpMessage = `
🤖 **Monad Sniper Bot - Complete Help**

**Main Menu Features:**

👛 **Wallet Management**
• Connect encrypted wallets
• Check balances
• Portfolio overview
• Multi-wallet support

📊 **Token Monitoring**
• Add tokens to monitor
• Price tracking
• Liquidity alerts
• Volume analysis

🎯 **Auto Sniper**
• Setup auto-buy triggers
• Liquidity sniping
• Safety rules
• Snipe analytics

⚡ **Quick Trade**
• Instant buy/sell
• Limit orders
• Stop-loss protection
• Take-profit targets

📈 **Analytics**
• Portfolio performance
• Trade history
• P&L reports
• Risk analysis

⚙️ **Settings**
• Gas settings
• Slippage configuration
• Notifications
• Trading preferences

🛡️ **Security**
• Encryption status
• Session management
• Security alerts
• Access logs

**Quick Commands:**
/balance - Check balances
/portfolio - View portfolio
/buy <contract> <amount> - Quick buy
/sell <contract> <percentage> - Quick sell
/monitor <contract> - Add to monitoring
/snipe <contract> <amount> <trigger> - Setup snipe
/help - Show this help

Use the menu buttons for full features!
    `;

    await ctx.reply(helpMessage, { 
      parse_mode: 'Markdown',
      reply_markup: mainMenu.reply_markup
    });
}

// Help command
bot.help((ctx) => {
    ctx.reply('Use the menu buttons to navigate through all features.', {
      reply_markup: mainMenu.reply_markup
    });
});

// Error handling
bot.catch((err, ctx) => {
    console.error('Bot error:', err);
    ctx.reply('❌ An error occurred. Please try again.', {
      reply_markup: mainMenu.reply_markup
    });
});

// VERCEL SERVERLESS FUNCTION HANDLER
export default async function handler(req, res) {
  // For health checks
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: '🤖 Monad Sniper Bot is running!',
      timestamp: new Date().toISOString(),
      note: 'Send POST requests from Telegram webhook'
    });
  }

  // Handle Telegram webhook updates
  if (req.method === 'POST') {
    try {
      console.log('📨 Incoming webhook update');
      await bot.handleUpdate(req.body);
      return res.status(200).json({ status: 'OK' });
    } catch (error) {
      console.error('❌ Error handling update:', error);
      return res.status(500).json({ 
        status: 'ERROR', 
        error: error.message,
        stack: error.stack 
      });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}

// Graceful shutdown (optional for Vercel)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));