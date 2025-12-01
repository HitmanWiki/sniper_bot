import { monitorMenu, mainMenu } from '../keyboards/mainMenu.js';
import { getTokenPrice, getTokenInfo } from '../../services/monad/dexService.js';
import { isValidContractAddress } from '../../utils/validators.js';

export const monitorHandler = async (ctx, action = null) => {
  try {
    // Get action from callback data or set to 'menu' for button click
    let actionParam = action;
    
    if (ctx.match && ctx.match[1]) {
      actionParam = ctx.match[1];
    } else if (!actionParam) {
      actionParam = 'menu';
    }

    console.log('Monitor handler called with action:', actionParam);

    switch (actionParam) {
      case 'menu':
        await showMonitorMenu(ctx);
        break;
      case 'add':
        await addTokenToMonitor(ctx);
        break;
      case 'remove':
        await removeTokenFromMonitor(ctx);
        break;
      case 'list':
        await listMonitoredTokens(ctx);
        break;
      case 'info':
        await showTokenInfo(ctx);
        break;
      case 'alerts':
        await managePriceAlerts(ctx);
        break;
      case 'chart':
        await showTokenChart(ctx);
        break;
      case 'quick':
        await quickMonitor(ctx);
        break;
      case 'advanced':
        await advancedMonitor(ctx);
        break;
      case 'back':
        await handleBackButton(ctx);
        break;
      default:
        await showMonitorMenu(ctx);
    }
  } catch (error) {
    console.error('Error in monitor handler:', error);
    await ctx.reply('❌ An error occurred. Please try again.', {
      reply_markup: mainMenu.reply_markup
    });
  }
};

// Monitor Menu Display
async function showMonitorMenu(ctx) {
  const monitoredTokens = ctx.session.monitoredTokens || [];
  
  const menuMessage = `
📊 **Token Monitoring**

**Tokens Being Monitored:** ${monitoredTokens.length}
**Active Alerts:** ${ctx.session.priceAlerts?.length || 0}

**Features:**
• Real-time price tracking
• Liquidity monitoring
• Price alerts
• Volume analysis
• Token analytics

Choose an option below:
  `;

  await ctx.reply(menuMessage, {
    reply_markup: monitorMenu.reply_markup,
    parse_mode: 'Markdown'
  });
}

// Add Token to Monitor
async function addTokenToMonitor(ctx) {
  await ctx.reply(`
➕ **Add Token to Monitor**

Send the token contract address:

**Format:** 0x...
**Example:** 0x742d35Cc6634C0532925a3b8D...

I will start monitoring:
• Price changes
• Liquidity
• Volume
• Holder count
  `, { parse_mode: 'Markdown' });
  
  ctx.session.waitingForTokenAddress = true;
}

// Remove Token from Monitor
async function removeTokenFromMonitor(ctx) {
  const monitoredTokens = ctx.session.monitoredTokens || [];
  
  if (monitoredTokens.length === 0) {
    await ctx.reply('❌ No tokens being monitored.');
    return;
  }

  let tokenList = '🗑️ **Remove Token from Monitoring**\n\n';
  monitoredTokens.forEach((token, index) => {
    tokenList += `${index + 1}. ${token.name || 'Unknown'} - ${token.address.slice(0, 10)}...\n`;
  });

  tokenList += '\nReply with the number of the token to remove:';

  await ctx.reply(tokenList, { parse_mode: 'Markdown' });
  ctx.session.waitingForTokenRemove = true;
}

// List Monitored Tokens
async function listMonitoredTokens(ctx) {
  const monitoredTokens = ctx.session.monitoredTokens || [];
  
  if (monitoredTokens.length === 0) {
    await ctx.reply('📋 No tokens being monitored.\nUse "Add Token" to start monitoring.');
    return;
  }

  let tokensMessage = '📋 **Monitored Tokens**\n\n';
  
  for (const token of monitoredTokens) {
    try {
      const price = await getTokenPrice(token.address);
      const info = await getTokenInfo(token.address);
      
      tokensMessage += `**${token.name || 'Unknown Token'}**\n`;
      tokensMessage += `📍 ${token.address.slice(0, 10)}...${token.address.slice(-8)}\n`;
      tokensMessage += `💰 **Price:** $${price || 'N/A'}\n`;
      tokensMessage += `💧 **Liquidity:** $${info.liquidity || 'N/A'}\n`;
      tokensMessage += `📈 **Volume (24h):** $${info.volume24h || 'N/A'}\n`;
      tokensMessage += `---\n`;
    } catch (error) {
      tokensMessage += `❌ Error fetching data for ${token.address.slice(0, 10)}...\n`;
    }
  }

  await ctx.reply(tokensMessage, { parse_mode: 'Markdown' });
}

// Show Token Info
async function showTokenInfo(ctx) {
  await ctx.reply('🔍 **Token Information**\n\nSend token contract address for detailed information:');
  ctx.session.waitingForTokenInfo = true;
}

// Manage Price Alerts
async function managePriceAlerts(ctx) {
  const priceAlerts = ctx.session.priceAlerts || [];
  
  let alertsMessage = '🔔 **Price Alerts**\n\n';
  
  if (priceAlerts.length === 0) {
    alertsMessage += 'No active price alerts.';
  } else {
    priceAlerts.forEach((alert, index) => {
      alertsMessage += `${index + 1}. ${alert.token} - ${alert.condition} $${alert.price}\n`;
    });
  }

  alertsMessage += '\nChoose an action:';

  await ctx.reply(alertsMessage, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '➕ Add Alert', callback_data: 'monitor_addalert' },
          { text: '🗑️ Remove Alert', callback_data: 'monitor_removealert' }
        ],
        [
          { text: '🔙 Back', callback_data: 'monitor_back' }
        ]
      ]
    }
  });
}

// Show Token Chart
async function showTokenChart(ctx) {
  await ctx.reply('📈 **Token Charts**\n\nChart feature coming soon!');
}

// Quick Monitor
async function quickMonitor(ctx) {
  await ctx.reply('⚡ **Quick Monitor**\n\nSend token contract address to quickly add to monitoring:');
  ctx.session.waitingForQuickMonitor = true;
}

// Advanced Monitor
async function advancedMonitor(ctx) {
  await ctx.reply(`
🔧 **Advanced Monitoring**

**Advanced Features:**
• Custom alert conditions
• Volume spike detection
• Liquidity tracking
• Whale movement alerts
• Social sentiment (coming soon)

Choose an option:
  `, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📊 Volume Alerts', callback_data: 'monitor_volume' },
          { text: '💧 Liquidity Alerts', callback_data: 'monitor_liquidity' }
        ],
        [
          { text: '🐋 Whale Tracking', callback_data: 'monitor_whale' },
          { text: '📈 Technical Analysis', callback_data: 'monitor_ta' }
        ],
        [
          { text: '🔙 Back', callback_data: 'monitor_back' }
        ]
      ]
    }
  });
}

// Handle Token Address Input
export const handleTokenAddressInput = async (ctx) => {
  if (ctx.session.waitingForTokenAddress) {
    const tokenAddress = ctx.message.text.trim();
    
    try {
      // Validate contract address using imported validator
      if (!isValidContractAddress(tokenAddress)) {
        throw new Error('Invalid contract address');
      }

      // Get token info
      const tokenInfo = await getTokenInfo(tokenAddress);
      
      // Initialize monitored tokens array if not exists
      if (!ctx.session.monitoredTokens) {
        ctx.session.monitoredTokens = [];
      }

      const tokenData = {
        address: tokenAddress,
        name: tokenInfo.name || 'Unknown',
        symbol: tokenInfo.symbol || 'N/A',
        addedAt: new Date().toISOString(),
        lastPrice: tokenInfo.price,
        lastUpdate: new Date().toISOString()
      };

      ctx.session.monitoredTokens.push(tokenData);
      ctx.session.waitingForTokenAddress = false;

      await ctx.reply(`
✅ **Token Added to Monitoring!**

**Token:** ${tokenInfo.name || 'Unknown'} (${tokenInfo.symbol || 'N/A'})
**Contract:** ${tokenAddress}
**Current Price:** $${tokenInfo.price || 'N/A'}
**Liquidity:** $${tokenInfo.liquidity || 'N/A'}

I will now track this token's price and notify you of significant changes.
      `, {
        parse_mode: 'Markdown',
        reply_markup: mainMenu.reply_markup
      });

    } catch (error) {
      await ctx.reply(`
❌ **Invalid Contract Address**

Please ensure:
• Starts with 0x
• 42 hexadecimal characters
• Valid Monad contract address

Try again:
      `, {
        parse_mode: 'Markdown'
      });
    }
  }
};

// Handle Price Alert Input
export const handlePriceAlertInput = async (ctx) => {
  if (ctx.session.waitingForPriceAlert) {
    // Implementation for price alert setup
    ctx.session.waitingForPriceAlert = false;
  }
};

// Handle Token Remove Input
export const handleTokenRemoveInput = async (ctx) => {
  if (ctx.session.waitingForTokenRemove) {
    const input = ctx.message.text.trim();
    const index = parseInt(input) - 1;
    const monitoredTokens = ctx.session.monitoredTokens || [];
    
    if (index >= 0 && index < monitoredTokens.length) {
      const removedToken = monitoredTokens.splice(index, 1)[0];
      await ctx.reply(`✅ Removed token: ${removedToken.name || 'Unknown'} (${removedToken.address.slice(0, 10)}...)`);
    } else {
      await ctx.reply('❌ Invalid token number. Please try again.');
    }
    
    ctx.session.waitingForTokenRemove = false;
  }
};

// Handle Token Info Input
export const handleTokenInfoInput = async (ctx) => {
  if (ctx.session.waitingForTokenInfo) {
    const tokenAddress = ctx.message.text.trim();
    
    try {
      if (!isValidContractAddress(tokenAddress)) {
        throw new Error('Invalid contract address');
      }

      const tokenInfo = await getTokenInfo(tokenAddress);
      
      let infoMessage = `🔍 **Token Information**\n\n`;
      infoMessage += `**Name:** ${tokenInfo.name || 'N/A'}\n`;
      infoMessage += `**Symbol:** ${tokenInfo.symbol || 'N/A'}\n`;
      infoMessage += `**Address:** ${tokenAddress}\n`;
      infoMessage += `**Decimals:** ${tokenInfo.decimals || 'N/A'}\n`;
      infoMessage += `**Total Supply:** ${tokenInfo.totalSupply || 'N/A'}\n`;
      infoMessage += `**Price:** $${tokenInfo.price || 'N/A'}\n`;
      infoMessage += `**Liquidity:** $${tokenInfo.liquidity || 'N/A'}\n`;
      infoMessage += `**24h Volume:** $${tokenInfo.volume24h || 'N/A'}\n`;

      await ctx.reply(infoMessage, { parse_mode: 'Markdown' });

    } catch (error) {
      await ctx.reply('❌ Error fetching token information. Please check the contract address.');
    }
    
    ctx.session.waitingForTokenInfo = false;
  }
};

// Back button handler
async function handleBackButton(ctx) {
  console.log('Back button clicked in monitor');
  
  try {
    await ctx.deleteMessage();
  } catch (error) {
    console.log('Could not delete message:', error.message);
  }
  
  await ctx.reply('🔙 Returning to main menu...\n\n🤖 Main Menu:', {
    reply_markup: mainMenu.reply_markup,
    parse_mode: 'Markdown'
  });
}