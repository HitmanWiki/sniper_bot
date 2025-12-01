import { snipeMenu, mainMenu } from '../keyboards/mainMenu.js';

export const snipeHandler = async (ctx, action = null) => {
  try {
    // Get action from callback data or set to 'menu' for button click
    let actionParam = action;
    
    if (ctx.match && ctx.match[1]) {
      actionParam = ctx.match[1];
    } else if (!actionParam) {
      actionParam = 'menu';
    }

    console.log('Snipe handler called with action:', actionParam);

    switch (actionParam) {
      case 'menu':
        await showSnipeMenu(ctx);
        break;
      case 'setup':
        await setupSnipe(ctx);
        break;
      case 'list':
        await listActiveSnipes(ctx);
        break;
      case 'quick':
        await quickSnipe(ctx);
        break;
      case 'templates':
        await snipeTemplates(ctx);
        break;
      case 'safety':
        await safetyRules(ctx);
        break;
      case 'analytics':
        await snipeAnalytics(ctx);
        break;
      case 'back':
        await handleBackButton(ctx);
        break;
      default:
        await showSnipeMenu(ctx);
    }
  } catch (error) {
    console.error('Error in snipe handler:', error);
    await ctx.reply('❌ An error occurred. Please try again.', {
      reply_markup: mainMenu.reply_markup
    });
  }
};

async function showSnipeMenu(ctx) {
  const snipeConfigs = ctx.session.snipeConfigs || [];
  
  const menuMessage = `
🎯 **Auto Sniper**

**Active Snipes:** ${snipeConfigs.length}
**Successful Snipes:** ${ctx.session.tradeHistory?.filter(t => t.type === 'snipe').length || 0}

**Features:**
• Auto-buy on liquidity add
• Price trigger sniping
• Multi-token sniping
• Safety controls
• Snipe analytics

Choose an option below:
  `;

  await ctx.reply(menuMessage, {
    reply_markup: snipeMenu.reply_markup,
    parse_mode: 'Markdown'
  });
}

async function setupSnipe(ctx) {
  await ctx.reply(`
🎯 **Setup Auto Snipe**

Send token contract address to setup auto-snipe:

I will automatically buy when:
• Liquidity is added
• Price reaches target
• Volume conditions met

**Format:** /snipe <contract> <amount> <trigger_price>
**Example:** /snipe 0x742... 0.1 0.000005

Or send just the contract address to continue:
  `, { parse_mode: 'Markdown' });
  
  ctx.session.waitingForSnipeSetup = true;
}

async function listActiveSnipes(ctx) {
  const snipeConfigs = ctx.session.snipeConfigs || [];
  
  if (snipeConfigs.length === 0) {
    await ctx.reply('📋 No active snipes configured.\nUse "Setup Snipe" to create your first auto-snipe.');
    return;
  }

  let snipesMessage = '📋 **Active Snipes**\n\n';
  
  snipeConfigs.forEach((snipe, index) => {
    snipesMessage += `**${index + 1}. ${snipe.tokenName || 'Unknown'}**\n`;
    snipesMessage += `📍 ${snipe.contract.slice(0, 10)}...\n`;
    snipesMessage += `💰 Amount: ${snipe.amount} MON\n`;
    snipesMessage += `🎯 Trigger: $${snipe.triggerPrice}\n`;
    snipesMessage += `📊 Status: ${snipe.active ? '🟢 Active' : '🔴 Paused'}\n`;
    snipesMessage += `---\n`;
  });

  await ctx.reply(snipesMessage, { parse_mode: 'Markdown' });
}

async function quickSnipe(ctx) {
  await ctx.reply(`
⚡ **Quick Snipe**

Quick setup for experienced users:

**Usage:** /quicksnipe <contract> <amount> <condition>

**Conditions:**
• liquidity - Buy when liquidity added
• price_above <value> - Buy above price
• price_below <value> - Buy below price

**Example:** /quicksnipe 0x742... 0.1 liquidity

**Quick Setup:**
Send token contract address:
  `, { parse_mode: 'Markdown' });
  
  ctx.session.waitingForQuickSnipe = true;
}

async function snipeTemplates(ctx) {
  await ctx.reply(`
🔧 **Snipe Templates**

**Available Templates:**

1. **Liquidity Sniper**
   - Buys immediately when liquidity added
   - Max 1% slippage
   - Auto-sell at 2x

2. **Price Dip Sniper** 
   - Buys on 10%+ price dips
   - Stop-loss at -5%
   - Take-profit at +25%

3. **Volume Sniper**
   - Triggers on volume spikes
   - RSI-based entry
   - Trailing stop-loss

4. **Rug-pull Protection**
   - Monitors for malicious activity
   - Auto-sell on suspicious moves
   - Liquidity tracking

**Choose a template to apply:**
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '💧 Liquidity', callback_data: 'snipe_template_liquidity' },
          { text: '📉 Price Dip', callback_data: 'snipe_template_dip' }
        ],
        [
          { text: '📈 Volume', callback_data: 'snipe_template_volume' },
          { text: '🛡️ Protection', callback_data: 'snipe_template_protection' }
        ],
        [
          { text: '🔙 Back', callback_data: 'snipe_back' }
        ]
      ]
    }
  });
}

async function safetyRules(ctx) {
  await ctx.reply(`
🛡️ **Safety Rules**

**Active Safety Measures:**

✅ **Max Slippage:** 5% (configurable)
✅ **Max Buy Amount:** 0.1 MON per trade
✅ **Token Blacklist:** Auto-reject suspicious tokens
✅ **Gas Limit:** Prevents failed transactions
✅ **Rug-pull Detection:** Monitors for malicious activity
✅ **Liquidity Check:** Minimum $10,000 liquidity
✅ **Holder Check:** Minimum 100 holders

**Recommended Settings:**
• Start with small amounts (0.01-0.05 MON)
• Use 3-5% slippage for new tokens
• Enable stop-loss for all positions
• Monitor liquidity changes
• Set maximum investment per token

**Configure your safety rules:**
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '⚙️ Edit Rules', callback_data: 'snipe_edit_rules' },
          { text: '📊 Risk Settings', callback_data: 'snipe_risk_settings' }
        ],
        [
          { text: '🔙 Back', callback_data: 'snipe_back' }
        ]
      ]
    }
  });
}

async function snipeAnalytics(ctx) {
  const snipeHistory = ctx.session.tradeHistory?.filter(t => t.type === 'snipe') || [];
  
  let analyticsMessage = '📊 **Snipe Analytics**\n\n';
  
  if (snipeHistory.length === 0) {
    analyticsMessage += 'No snipe history yet.\n\n';
  } else {
    const successful = snipeHistory.filter(t => t.success).length;
    const total = snipeHistory.length;
    const successRate = ((successful / total) * 100).toFixed(1);
    const totalProfit = snipeHistory.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    
    analyticsMessage += `**Overall Performance:**\n`;
    analyticsMessage += `Total Snipes: ${total}\n`;
    analyticsMessage += `Successful: ${successful}\n`;
    analyticsMessage += `Success Rate: ${successRate}%\n`;
    analyticsMessage += `Total Profit: $${totalProfit.toFixed(2)}\n\n`;
    
    analyticsMessage += `**Recent Snipes:**\n`;
    const recentSnipes = snipeHistory.slice(-3);
    recentSnipes.forEach(snipe => {
      const emoji = snipe.profit >= 0 ? '🟢' : '🔴';
      analyticsMessage += `${emoji} ${snipe.token}: $${snipe.profit}\n`;
    });
  }

  analyticsMessage += '\n**Advanced Analytics:**\n';
  analyticsMessage += '• Detailed profit/loss tracking\n';
  analyticsMessage += '• Performance charts\n';
  analyticsMessage += '• Risk analysis\n';
  analyticsMessage += '• Optimization suggestions\n';
  analyticsMessage += '• Token performance comparison';

  await ctx.reply(analyticsMessage, { parse_mode: 'Markdown' });
}

async function handleBackButton(ctx) {
  console.log('Back button clicked in snipe');
  
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.log('Could not delete message:', error.message);
  }
  
  await ctx.reply('🔙 Returning to main menu...\n\nMain Menu:', {
    reply_markup: mainMenu.reply_markup,
    parse_mode: 'Markdown'
  });
}

export const handleSnipeSetupInput = async (ctx) => {
  if (ctx.session.waitingForSnipeSetup) {
    const tokenAddress = ctx.message.text.trim();
    ctx.session.waitingForSnipeSetup = false;
    
    // Create mock snipe config
    if (!ctx.session.snipeConfigs) {
      ctx.session.snipeConfigs = [];
    }
    
    const snipeConfig = {
      contract: tokenAddress,
      tokenName: 'Snipe Target ' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      amount: '0.1',
      triggerPrice: '0.000005',
      condition: 'liquidity_add',
      active: true,
      createdAt: new Date().toISOString()
    };
    
    ctx.session.snipeConfigs.push(snipeConfig);
    
    await ctx.reply(`
✅ **Auto Snipe Configured!**

**Token:** ${snipeConfig.tokenName}
**Contract:** ${tokenAddress.slice(0, 10)}...
**Amount:** ${snipeConfig.amount} MON
**Trigger:** Liquidity Added
**Status:** 🟢 Active

I will automatically buy when liquidity is detected.

**Next Steps:**
• Monitor token in Token Monitoring
• Check Active Snipes for status
• Adjust settings in Safety Rules
    `, {
      parse_mode: 'Markdown',
      reply_markup: mainMenu.reply_markup
    });
  }
};

export const handleQuickSnipeInput = async (ctx) => {
  if (ctx.session.waitingForQuickSnipe) {
    const tokenAddress = ctx.message.text.trim();
    ctx.session.waitingForQuickSnipe = false;
    
    // Create quick snipe config
    if (!ctx.session.snipeConfigs) {
      ctx.session.snipeConfigs = [];
    }
    
    const snipeConfig = {
      contract: tokenAddress,
      tokenName: 'Quick Snipe ' + Math.random().toString(36).substr(2, 5).toUpperCase(),
      amount: '0.05',
      triggerPrice: 'auto',
      condition: 'quick_liquidity',
      active: true,
      quickSetup: true,
      createdAt: new Date().toISOString()
    };
    
    ctx.session.snipeConfigs.push(snipeConfig);
    
    await ctx.reply(```
🚀 **Quick Snipe Activated!**

**Token:** ${snipeConfig.tokenName}
**Contract:** ${tokenAddress.slice(0, 10)}...
**Amount:** ${snipeConfig.amount} MON
**Strategy:** Quick Liquidity Snipe
**Status:** 🟢 Monitoring

**Quick Snipe Features:**
• Faster execution
• Lower gas settings
• Auto-optimized parameters
• Quick exit strategy

Ready to catch the next opportunity!
    `, {
      parse_mode: 'Markdown',
      reply_markup: mainMenu.reply_markup
    });
  }
};