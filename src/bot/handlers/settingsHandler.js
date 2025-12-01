import { settingsMenu, mainMenu } from '../keyboards/mainMenu.js';

export const settingsHandler = async (ctx, action = null) => {
  try {
    // Get action from callback data or set to 'menu' for button click
    let actionParam = action;
    
    if (ctx.match && ctx.match[1]) {
      actionParam = ctx.match[1];
    } else if (!actionParam) {
      actionParam = 'menu';
    }

    console.log('Settings handler called with action:', actionParam);

    switch (actionParam) {
      case 'menu':
        await showSettingsMenu(ctx);
        break;
      case 'gas':
        await gasSettings(ctx);
        break;
      case 'slippage':
        await slippageSettings(ctx);
        break;
      case 'notifications':
        await notificationSettings(ctx);
        break;
      case 'trading':
        await tradingSettings(ctx);
        break;
      case 'security':
        await securitySettings(ctx);
        break;
      case 'display':
        await displaySettings(ctx);
        break;
      case 'reset':
        await resetSettings(ctx);
        break;
      case 'preferences':
        await preferenceSettings(ctx);
        break;
      case 'back':
        // FIX: Properly return to main menu
        await ctx.editMessageText('🔙 Returning to main menu...');
        await ctx.reply('Main Menu:', {
          reply_markup: mainMenu.reply_markup
        });
        break;
      default:
        await showSettingsMenu(ctx);
    }
  } catch (error) {
    console.error('Error in settings handler:', error);
    await ctx.reply('❌ An error occurred. Please try again.', {
      reply_markup: mainMenu.reply_markup
    });
  }
};

async function showSettingsMenu(ctx) {
  const settings = ctx.session.settings || {};
  
  const menuMessage = `
⚙️ **Bot Settings**

**Current Configuration:**
• Slippage: ${settings.slippage || 3}%
• Gas Price: ${settings.gasPrice || 'standard'}
• Notifications: ${settings.notifications ? '🔔 On' : '🔕 Off'}
• Auto Buy: ${settings.autoBuy ? '🟢 Enabled' : '🔴 Disabled'}

Configure your trading preferences and bot behavior.
  `;

  await ctx.reply(menuMessage, {
    reply_markup: settingsMenu.reply_markup,
    parse_mode: 'Markdown'
  });
}

async function gasSettings(ctx) {
  const settings = ctx.session.settings || {};
  
  await ctx.reply(`
⚡ **Gas Settings**

**Current:** ${settings.gasPrice || 'standard'}

**Available Options:**
• 🐌 **Slow** - Lower cost, slower confirmation
• ⚡ **Standard** - Balanced speed and cost
• 🚀 **Fast** - Higher cost, faster confirmation
• 🎯 **Custom** - Set custom gas price

**Recommended:** Standard for most trades

Reply with your choice to change gas settings.
  `, { parse_mode: 'Markdown' });
  
  ctx.session.waitingForSettings = 'gas';
}

async function slippageSettings(ctx) {
  const settings = ctx.session.settings || {};
  
  await ctx.reply(`
📉 **Slippage Settings**

**Current:** ${settings.slippage || 3}%

**Recommended Settings:**
• **1-2%**: Established tokens (low volatility)
• **3-5%**: New tokens (medium volatility)  
• **5-10%**: Very new tokens (high volatility)

**Warning:** Higher slippage increases risk!

Reply with new slippage percentage (1-20):
  `, { parse_mode: 'Markdown' });
  
  ctx.session.waitingForSettings = 'slippage';
}

async function notificationSettings(ctx) {
  const settings = ctx.session.settings || {};
  
  await ctx.reply(`
🔔 **Notification Settings**

**Current:** ${settings.notifications ? '🔔 Enabled' : '🔕 Disabled'}

**Notification Types:**
• Trade executions
• Price alerts
• Snipe triggers
• Wallet activities
• System updates

Toggle notifications on/off:
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔔 Enable', callback_data: 'settings_notifications_on' },
          { text: '🔕 Disable', callback_data: 'settings_notifications_off' }
        ],
        [
          { text: '🔙 Back', callback_data: 'settings_back' }
        ]
      ]
    }
  });
}

async function tradingSettings(ctx) {
  const settings = ctx.session.settings || {};
  
  await ctx.reply(`
🎯 **Trading Settings**

**Current Configuration:**
• Auto Buy: ${settings.autoBuy ? '🟢 Enabled' : '🔴 Disabled'}
• Stop Loss: ${settings.stopLoss || 5}%
• Take Profit: ${settings.takeProfit || 20}%
• Max Buy Amount: ${settings.maxBuyAmount || 0.1} MON

**Advanced Features:**
• Auto-compounding
• Portfolio rebalancing
• Risk management
• Trading strategies

Configure your automated trading rules.
  `, { parse_mode: 'Markdown' });
}

async function securitySettings(ctx) {
  await ctx.reply(`
🛡️ **Security Settings**

**Current Status:**
• Wallet Encryption: 🔐 Active
• Session Timeout: 60 minutes
• 2FA: 🔴 Not configured
• Login Alerts: 🟢 Enabled

**Security Features:**
• Encrypted private keys
• Session management
• Transaction signing
• Suspicious activity monitoring

For detailed security settings, use the Security menu.
  `, { parse_mode: 'Markdown' });
}

async function displaySettings(ctx) {
  await ctx.reply(`
📊 **Display Settings**

**Available Options:**
• **Currency**: USD, EUR, MON
• **Price Format**: Decimal, Scientific
• **Chart Style**: Light, Dark
• **Notifications**: Popup, Silent

**Coming Soon:**
• Custom themes
• Price alerts display
• Portfolio visualization
• Trading view customization

These features will be available in the next update.
  `, { parse_mode: 'Markdown' });
}

async function resetSettings(ctx) {
  await ctx.reply(`
🔄 **Reset Settings**

**Warning:** This will reset all your settings to defaults.

**What will be reset:**
• Trading preferences
• Notification settings
• Display options
• Gas and slippage settings

**What will NOT be reset:**
• Connected wallets
• Monitored tokens
• Trade history
• Snipe configurations

Are you sure you want to reset all settings?
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '✅ Yes, Reset', callback_data: 'settings_reset_confirm' },
          { text: '❌ Cancel', callback_data: 'settings_back' }
        ]
      ]
    }
  });
}

async function preferenceSettings(ctx) {
  await ctx.reply(`
📝 **User Preferences**

**Available Preferences:**

**Trading Style:**
• Conservative (Low risk)
• Balanced (Medium risk) 
• Aggressive (High risk)

**Notification Frequency:**
• Minimal (Critical only)
• Normal (Important events)
• Detailed (All activities)

**Interface:**
• Simple (Beginner)
• Advanced (Expert)
• Custom (Manual configuration)

Choose your preferred trading style for optimized settings.
  `, { parse_mode: 'Markdown' });
}

export const handleSettingsInput = async (ctx) => {
  if (ctx.session.waitingForSettings) {
    const settingType = ctx.session.waitingForSettings;
    const value = ctx.message.text.trim();
    
    if (!ctx.session.settings) {
      ctx.session.settings = {};
    }
    
    switch (settingType) {
      case 'gas':
        if (['slow', 'standard', 'fast'].includes(value.toLowerCase())) {
          ctx.session.settings.gasPrice = value.toLowerCase();
          await ctx.reply(`✅ Gas settings updated to: ${value}`);
        } else {
          await ctx.reply('❌ Invalid gas option. Use: slow, standard, or fast');
        }
        break;
        
      case 'slippage':
        const slippage = parseInt(value);
        if (slippage >= 1 && slippage <= 20) {
          ctx.session.settings.slippage = slippage;
          await ctx.reply(`✅ Slippage updated to: ${slippage}%`);
        } else {
          await ctx.reply('❌ Slippage must be between 1-20%');
        }
        break;
    }
    
    ctx.session.waitingForSettings = false;
  }
};