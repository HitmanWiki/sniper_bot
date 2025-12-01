import { walletMenu, mainMenu } from '../keyboards/mainMenu.js';
import { encryptData, decryptData } from '../../utils/encryption.js';
import { 
  getWalletBalance, 
  getTokenBalance, 
  getPortfolioValue
} from '../../services/monad/walletService.js';
import { generatePortfolioImage } from '../../utils/chartGenerator.js';
import { isValidPrivateKey } from '../../utils/validators.js';

export const walletHandler = async (ctx, action = null) => {
  try {
    // Get action from callback data or set to 'menu' for button click
    let actionParam = action;
    
    if (ctx.match && ctx.match[1]) {
      actionParam = ctx.match[1];
    } else if (!actionParam) {
      actionParam = 'menu';
    }

    console.log('Wallet handler called with action:', actionParam);

    switch (actionParam) {
      case 'menu':
        await showWalletMenu(ctx);
        break;
      case 'connect':
        await connectWallet(ctx);
        break;
      case 'balance':
        await showWalletBalance(ctx);
        break;
      case 'portfolio':
        await showPortfolioOverview(ctx);
        break;
      case 'performance':
        await showPerformance(ctx);
        break;
      case 'multi':
        await showMultiWallet(ctx);
        break;
      case 'import':
        await showImportExport(ctx);
        break;
      case 'quick':
        await showQuickActions(ctx);
        break;
      case 'advanced':
        await showAdvancedOptions(ctx);
        break;
      case 'back':
        await handleBackButton(ctx);
        break;
      default:
        await showWalletMenu(ctx);
    }
  } catch (error) {
    console.error('Error in wallet handler:', error);
    await ctx.reply('❌ An error occurred. Please try again.', {
      reply_markup: mainMenu.reply_markup
    });
  }
};

// Wallet Menu Display
async function showWalletMenu(ctx) {
  const userWallets = ctx.session.wallets || [];
  const totalBalance = await calculateTotalPortfolioValue(userWallets);

  const menuMessage = `
👛 **Wallet Management** 

**Total Portfolio:** $${totalBalance.totalUSD || '0'}
**Wallets Connected:** ${userWallets.length}
**Default Wallet:** ${userWallets.find(w => w.isDefault)?.address.slice(0, 8) || 'None'}

Choose an option below:
  `;

  await ctx.reply(menuMessage, {
    reply_markup: walletMenu.reply_markup,
    parse_mode: 'Markdown'
  });
}

// Connect Wallet
async function connectWallet(ctx) {
  await ctx.reply(`
🔗 **Connect Wallet**

You can connect your wallet in multiple ways:

1. **Private Key** (Encrypted & Secure)
2. **Seed Phrase** (12/24 words)
3. **Keystore File** (JSON)

Choose method or send private key:
  `, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔑 Private Key', callback_data: 'wallet_connect_private' },
          { text: '🌱 Seed Phrase', callback_data: 'wallet_connect_seed' }
        ],
        [
          { text: '📁 Keystore', callback_data: 'wallet_connect_keystore' },
          { text: '❌ Cancel', callback_data: 'wallet_back' }
        ]
      ]
    },
    parse_mode: 'Markdown'
  });
  
  ctx.session.waitingForPrivateKey = true;
}

// Show Wallet Balance
async function showWalletBalance(ctx) {
  const userWallets = ctx.session.wallets || [];
  
  if (userWallets.length === 0) {
    await ctx.reply('❌ No wallets connected. Please connect a wallet first.');
    return;
  }

  let balanceMessage = '💰 **Wallet Balances**\n\n';
  
  for (const wallet of userWallets) {
    try {
      const monBalance = await getWalletBalance(wallet.address);
      const portfolio = await getPortfolioValue(wallet.address);
      
      balanceMessage += `**👛 ${wallet.isDefault ? '⭐ ' : ''}${wallet.name || 'Wallet'}**\n`;
      balanceMessage += `📍 ${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}\n`;
      balanceMessage += `💎 **MON:** ${parseFloat(monBalance).toFixed(4)} MON\n`;
      balanceMessage += `💰 **Portfolio:** $${portfolio.totalUSD.toFixed(2)}\n`;
      balanceMessage += `📊 **Tokens:** ${portfolio.tokens.length}\n`;
      balanceMessage += `---\n`;
    } catch (error) {
      balanceMessage += `❌ Error fetching balance for ${wallet.address.slice(0, 8)}...\n`;
    }
  }

  await ctx.reply(balanceMessage, { parse_mode: 'Markdown' });
}

// Show Portfolio Overview
async function showPortfolioOverview(ctx) {
  const userWallets = ctx.session.wallets || [];
  
  if (userWallets.length === 0) {
    await ctx.reply('❌ No wallets connected.');
    return;
  }

  try {
    const portfolioText = await generatePortfolioImage(userWallets);
    await ctx.reply(portfolioText, { 
      parse_mode: 'Markdown',
      reply_markup: mainMenu.reply_markup
    });
  } catch (error) {
    console.error('Error showing portfolio:', error);
    // Fallback to text portfolio
    await sendTextPortfolio(ctx, userWallets);
  }
}

// Text-based Portfolio Fallback
async function sendTextPortfolio(ctx, wallets) {
  let portfolioMessage = '📊 **Portfolio Summary**\n\n';
  let totalValue = 0;

  for (const wallet of wallets) {
    try {
      const portfolio = await getPortfolioValue(wallet.address);
      totalValue += portfolio.totalUSD;

      portfolioMessage += `**${wallet.name || 'Wallet'}**\n`;
      portfolioMessage += `Value: $${portfolio.totalUSD.toFixed(2)}\n`;
      
      // Show top 3 tokens
      const topTokens = portfolio.tokens.slice(0, 3);
      topTokens.forEach(token => {
        portfolioMessage += `• ${token.symbol}: $${token.valueUSD.toFixed(2)}\n`;
      });
      
      portfolioMessage += `---\n`;
    } catch (error) {
      portfolioMessage += `❌ Error fetching portfolio for ${wallet.address.slice(0, 8)}...\n`;
    }
  }

  portfolioMessage += `**Total Portfolio Value: $${totalValue.toFixed(2)}**`;

  await ctx.reply(portfolioMessage, { parse_mode: 'Markdown' });
}

// Show Performance
async function showPerformance(ctx) {
  const userWallets = ctx.session.wallets || [];
  
  if (userWallets.length === 0) {
    await ctx.reply('❌ No wallets connected.');
    return;
  }

  let performanceMessage = '📈 **Trading Performance**\n\n';
  
  // This would typically come from trade history
  performanceMessage += `**Overall Stats:**\n`;
  performanceMessage += `Total Trades: ${ctx.session.tradeHistory?.length || 0}\n`;
  performanceMessage += `Win Rate: 65%\n`;
  performanceMessage += `Total P&L: +$125.50\n`;
  performanceMessage += `Best Trade: +$45.20\n`;
  performanceMessage += `Worst Trade: -$12.30\n\n`;
  
  performanceMessage += `**Recent Activity:**\n`;
  const recentTrades = ctx.session.tradeHistory?.slice(-5) || [];
  recentTrades.forEach(trade => {
    performanceMessage += `• ${trade.type.toUpperCase()} ${trade.token}: ${trade.profit >= 0 ? '🟢' : '🔴'} $${trade.profit}\n`;
  });

  await ctx.reply(performanceMessage, { parse_mode: 'Markdown' });
}

// Multi-Wallet Management
async function showMultiWallet(ctx) {
  const userWallets = ctx.session.wallets || [];
  
  let multiMessage = '👛 **Multi-Wallet Management**\n\n';
  
  if (userWallets.length === 0) {
    multiMessage += 'No wallets connected.';
  } else {
    userWallets.forEach((wallet, index) => {
      multiMessage += `**${index + 1}. ${wallet.name}** ${wallet.isDefault ? '⭐' : ''}\n`;
      multiMessage += `📍 ${wallet.address}\n`;
      multiMessage += `---\n`;
    });
  }
  
  multiMessage += '\nUse buttons to manage your wallets.';

  await ctx.reply(multiMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🔄 Set Default', callback_data: 'wallet_setdefault' },
          { text: '✏️ Rename', callback_data: 'wallet_rename' }
        ],
        [
          { text: '🗑️ Remove', callback_data: 'wallet_remove' },
          { text: '📊 Balance All', callback_data: 'wallet_balanceall' }
        ],
        [
          { text: '🔙 Back', callback_data: 'wallet_back' }
        ]
      ]
    }
  });
}

// Import/Export
async function showImportExport(ctx) {
  await ctx.reply(`
🔄 **Import/Export Wallets**

**Export:** Get encrypted backup of your wallets
**Import:** Restore wallets from backup

Choose an option:
  `, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📤 Export Wallets', callback_data: 'wallet_export' },
          { text: '📥 Import Wallets', callback_data: 'wallet_import' }
        ],
        [
          { text: '🔐 Backup Keys', callback_data: 'wallet_backup' },
          { text: '🔄 Sync', callback_data: 'wallet_sync' }
        ],
        [
          { text: '🔙 Back', callback_data: 'wallet_back' }
        ]
      ]
    }
  });
}

// Quick Actions
async function showQuickActions(ctx) {
  await ctx.reply(`
⚡ **Quick Wallet Actions**

Choose a quick action:
  `, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '💰 Check Balance', callback_data: 'wallet_balance' },
          { text: '📊 Portfolio', callback_data: 'wallet_portfolio' }
        ],
        [
          { text: '🔄 Receive Funds', callback_data: 'wallet_receive' },
          { text: '📤 Send Funds', callback_data: 'wallet_send' }
        ],
        [
          { text: '🔙 Back', callback_data: 'wallet_back' }
        ]
      ]
    }
  });
}

// Advanced Options
async function showAdvancedOptions(ctx) {
  await ctx.reply(`
🔧 **Advanced Wallet Options**

**Advanced Features:**
• Transaction history
• Gas optimization
• Custom RPC settings
• Wallet analytics

Choose an option:
  `, {
    reply_markup: {
      inline_keyboard: [
        [
          { text: '📋 Transaction History', callback_data: 'wallet_history' },
          { text: '⚡ Gas Settings', callback_data: 'wallet_gas' }
        ],
        [
          { text: '🔗 Custom RPC', callback_data: 'wallet_rpc' },
          { text: '📈 Wallet Analytics', callback_data: 'wallet_analytics' }
        ],
        [
          { text: '🔙 Back', callback_data: 'wallet_back' }
        ]
      ]
    }
  });
}

// Handle Private Key Input
export const handlePrivateKeyInput = async (ctx) => {
  if (ctx.session.waitingForPrivateKey) {
    const privateKey = ctx.message.text.trim();
    
    try {
      // Enhanced private key validation
      if (!isValidPrivateKey(privateKey)) {
        throw new Error('Invalid private key format');
      }

      // Encrypt and store
      const encryptedKey = encryptData(privateKey);
      const { ethers } = await import('ethers');
      const wallet = new ethers.Wallet(privateKey);
      
      if (!ctx.session.wallets) {
        ctx.session.wallets = [];
      }

      const walletData = {
        name: `Wallet ${ctx.session.wallets.length + 1}`,
        address: wallet.address,
        encryptedKey: encryptedKey,
        isDefault: ctx.session.wallets.length === 0,
        addedAt: new Date().toISOString(),
        type: 'private_key'
      };

      ctx.session.wallets.push(walletData);
      ctx.session.waitingForPrivateKey = false;

      await ctx.reply(`
✅ **Wallet Connected Successfully!**

**Name:** ${walletData.name}
**Address:** ${wallet.address}
**Type:** 🔐 Encrypted Private Key
**Status:** 🟢 Active

You can now use this wallet for trading and monitoring.
      `, {
        parse_mode: 'Markdown',
        reply_markup: mainMenu.reply_markup
      });

    } catch (error) {
      await ctx.reply(`
❌ **Invalid Private Key**

Please ensure:
• Starts with 0x
• 64 hexadecimal characters
• Valid Ethereum private key

Try again or use a different method:
      `, {
        parse_mode: 'Markdown'
      });
    }
  }
};

// Calculate Total Portfolio Value
async function calculateTotalPortfolioValue(wallets) {
  let totalMON = 0;
  let totalUSD = 0;

  for (const wallet of wallets) {
    try {
      const balance = await getWalletBalance(wallet.address);
      totalMON += parseFloat(balance);
      // In real implementation, convert MON to USD using price feed
      totalUSD += parseFloat(balance) * 1.5; // Example price
    } catch (error) {
      console.error(`Error calculating portfolio for ${wallet.address}:`, error);
    }
  }

  return { totalMON, totalUSD };
}

// Back button handler
async function handleBackButton(ctx) {
  console.log('Back button clicked in wallet');
  
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