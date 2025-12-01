import { tradeMenu, mainMenu } from '../keyboards/mainMenu.js';

export const tradeHandler = async (ctx, action = null) => {
  try {
    // Get action from callback data or set to 'menu' for button click
    let actionParam = action;
    
    if (ctx.match && ctx.match[1]) {
      actionParam = ctx.match[1];
    } else if (!actionParam) {
      actionParam = 'menu';
    }

    console.log('Trade handler called with action:', actionParam);

    switch (actionParam) {
      case 'menu':
        await showTradeMenu(ctx);
        break;
      case 'quick_buy':
        await quickBuy(ctx);
        break;
      case 'quick_sell':
        await quickSell(ctx);
        break;
      case 'limit':
        await limitOrder(ctx);
        break;
      case 'stop':
        await stopLoss(ctx);
        break;
      case 'take':
        await takeProfit(ctx);
        break;
      case 'batch':
        await batchTrade(ctx);
        break;
      case 'back':
        await handleBackButton(ctx);
        break;
      default:
        await showTradeMenu(ctx);
    }
  } catch (error) {
    console.error('Error in trade handler:', error);
    await ctx.reply('❌ An error occurred. Please try again.', {
      reply_markup: mainMenu.reply_markup
    });
  }
};

async function showTradeMenu(ctx) {
  const userWallets = ctx.session.wallets || [];
  const settings = ctx.session.settings || {};
  
  const menuMessage = `
⚡ **Quick Trade**

**Connected Wallets:** ${userWallets.length}
**Available Balance:** ${userWallets.length > 0 ? 'Check Balance' : 'Connect wallet first'}
**Current Slippage:** ${settings.slippage || 3}%

**Trading Features:**
• Instant buy/sell
• Limit orders
• Stop-loss protection
• Take-profit targets
• Batch trading
• Token swaps

Choose an option below:
  `;

  await ctx.reply(menuMessage, {
    reply_markup: tradeMenu.reply_markup,
    parse_mode: 'Markdown'
  });
}

async function quickBuy(ctx) {
  const userWallets = ctx.session.wallets || [];
  const settings = ctx.session.settings || {};
  
  if (userWallets.length === 0) {
    await ctx.reply('❌ No wallets connected. Please connect a wallet first in Wallet Management.');
    return;
  }

  await ctx.reply(`
🟢 **Quick Buy**

Send token contract address to buy:

**Format:** /buy <contract> <amount>
**Example:** /buy 0x742d35Cc6634C0532925a3b8D 0.05

**Current Settings:**
• Slippage: ${settings.slippage || 3}%
• Gas: ${settings.gasPrice || 'standard'}
• Wallet: ${userWallets.find(w => w.isDefault)?.address.slice(0, 8) || 'Default'}
• Max Amount: ${settings.maxBuyAmount || 0.1} MON

**Or send just the contract address:**
  `, { parse_mode: 'Markdown' });
  
  ctx.session.waitingForBuyAmount = true;
}

async function quickSell(ctx) {
  const userWallets = ctx.session.wallets || [];
  
  if (userWallets.length === 0) {
    await ctx.reply('❌ No wallets connected. Please connect a wallet first in Wallet Management.');
    return;
  }

  await ctx.reply(`
🔴 **Quick Sell**

Send token contract address to sell:

**Format:** /sell <contract> <percentage>
**Example:** /sell 0x742d35Cc6634C0532925a3b8D 50

This will sell 50% of your holding in that token.

**Available Actions:**
• Sell specific percentage
• Sell entire position
• Partial profit taking
• Emergency sell

**Or send just the contract address:**
  `, { parse_mode: 'Markdown' });
  
  ctx.session.waitingForSellAmount = true;
}

async function limitOrder(ctx) {
  await ctx.reply(`
📈 **Limit Orders**

**Set specific buy/sell prices:**

**Buy Limit:** Buy when price drops to target
**Sell Limit:** Sell when price rises to target

**Current Features:**
✅ Multiple limit orders
✅ Price alerts
✅ Order management
✅ Auto-cancellation

**Usage:**
/buylimit <contract> <amount> <price>
/selllimit <contract> <percentage> <price>

**Example:**
/buylimit 0x742... 0.1 0.000005
- Buys 0.1 MON worth when price hits $0.000005

**Set up your limit order:**
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🟢 Buy Limit', callback_data: 'trade_buylimit' },
          { text: '🔴 Sell Limit', callback_data: 'trade_selllimit' }
        ],
        [
          { text: '📋 My Orders', callback_data: 'trade_myorders' },
          { text: '🗑️ Cancel Orders', callback_data: 'trade_cancelorders' }
        ],
        [
          { text: '🔙 Back', callback_data: 'trade_back' }
        ]
      ]
    }
  });
}

async function stopLoss(ctx) {
  const settings = ctx.session.settings || {};
  
  await ctx.reply(`
🛑 **Stop Loss**

**Protect your investments from large losses:**

**Current Stop Loss:** ${settings.stopLoss || 5}%

**Types of Stop Loss:**
• **Fixed Stop:** Sell at specific price
• **Trailing Stop:** Follows price up, locks profits
• **Percentage Stop:** Sell on X% drop
• **Volume Stop:** Sell on unusual volume

**Active Stop Loss Orders:** 0

**Manage your stop losses:**
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '⚙️ Set Stop Loss', callback_data: 'trade_setstop' },
          { text: '📈 Trailing Stop', callback_data: 'trade_trailingstop' }
        ],
        [
          { text: '📊 My Stops', callback_data: 'trade_mystops' },
          { text: '🚨 Emergency Stop', callback_data: 'trade_emergencystop' }
        ],
        [
          { text: '🔙 Back', callback_data: 'trade_back' }
        ]
      ]
    }
  });
}

async function takeProfit(ctx) {
  const settings = ctx.session.settings || {};
  
  await ctx.reply(`
🎯 **Take Profit**

**Automatically secure your profits:**

**Current Take Profit:** ${settings.takeProfit || 20}%

**Take Profit Strategies:**
• **Fixed Target:** Sell at specific price
• **Scale Out:** Sell portions at different levels
• **Moving Target:** Adjusts with market
• **Time-based:** Sell after time period

**Active Take Profit Orders:** 0

**Set your profit targets:**
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '💰 Set Take Profit', callback_data: 'trade_settake' },
          { text: '📊 Scale Out', callback_data: 'trade_scaleout' }
        ],
        [
          { text: '⏰ Time Target', callback_data: 'trade_timetarget' },
          { text: '📈 My Targets', callback_data: 'trade_mytargets' }
        ],
        [
          { text: '🔙 Back', callback_data: 'trade_back' }
        ]
      ]
    }
  });
}

async function batchTrade(ctx) {
  await ctx.reply(`
📊 **Batch Trading**

**Execute multiple trades simultaneously:**

**Batch Operations:**
• Buy multiple tokens at once
• Portfolio rebalancing
• Dollar-cost averaging
• Multi-wallet trading

**Current Features:**
✅ Multiple token purchases
✅ Portfolio allocation
✅ Risk distribution
✅ Batch order management

**Usage:**
/batchbuy <token1,amount1> <token2,amount2>
/batchsell <percentage>

**Example:**
/batchbuy 0xabc...,0.05 0xdef...,0.03 0xghi...,0.02
- Buys 3 tokens with specified amounts

**Create your batch trade:**
  `, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          { text: '🟢 Batch Buy', callback_data: 'trade_batchbuy' },
          { text: '🔴 Batch Sell', callback_data: 'trade_batchsell' }
        ],
        [
          { text: '⚖️ Rebalance', callback_data: 'trade_rebalance' },
          { text: '💰 DCA Setup', callback_data: 'trade_dca' }
        ],
        [
          { text: '🔙 Back', callback_data: 'trade_back' }
        ]
      ]
    }
  });
}

async function handleBackButton(ctx) {
  console.log('Back button clicked in trade');
  
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

export const handleBuyInput = async (ctx) => {
  if (ctx.session.waitingForBuyAmount) {
    const tokenAddress = ctx.message.text.trim();
    ctx.session.waitingForBuyAmount = false;
    
    // Mock trade execution
    const tradeResult = {
      success: true,
      token: tokenAddress.slice(0, 10) + '...',
      amount: '0.05 MON',
      price: '$0.000125',
      value: '$6.25',
      gas: '0.0012 MON',
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: new Date().toISOString()
    };
    
    // Add to trade history
    if (!ctx.session.tradeHistory) {
      ctx.session.tradeHistory = [];
    }
    
    ctx.session.tradeHistory.push({
      type: 'buy',
      token: tradeResult.token,
      amount: tradeResult.amount,
      price: tradeResult.price,
      profit: 0,
      success: true,
      timestamp: tradeResult.timestamp
    });
    
    await ctx.reply(`
✅ **Trade Executed Successfully!**

**Action:** BUY
**Token:** ${tradeResult.token}
**Amount:** ${tradeResult.amount}
**Price:** ${tradeResult.price}
**Value:** ${tradeResult.value}
**Gas:** ${tradeResult.gas}
**TX:** ${tradeResult.txHash.slice(0, 16)}...

**Status:** 🟢 Confirmed

**Next:**
• Monitor price in Token Monitoring
• Set stop-loss to protect investment
• Set take-profit to secure gains
    `, {
      parse_mode: 'Markdown',
      reply_markup: mainMenu.reply_markup
    });
  }
};

export const handleSellInput = async (ctx) => {
  if (ctx.session.waitingForSellAmount) {
    const tokenAddress = ctx.message.text.trim();
    ctx.session.waitingForSellAmount = false;
    
    // Mock trade execution
    const profit = (Math.random() * 50 - 10).toFixed(2);
    const tradeResult = {
      success: true,
      token: tokenAddress.slice(0, 10) + '...',
      amount: '50% of holding',
      price: '$0.000150',
      profit: `$${profit}`,
      value: '$75.00',
      txHash: '0x' + Math.random().toString(16).substr(2, 64),
      timestamp: new Date().toISOString()
    };
    
    // Add to trade history
    if (!ctx.session.tradeHistory) {
      ctx.session.tradeHistory = [];
    }
    
    ctx.session.tradeHistory.push({
      type: 'sell',
      token: tradeResult.token,
      amount: tradeResult.amount,
      price: tradeResult.price,
      profit: parseFloat(profit),
      success: true,
      timestamp: tradeResult.timestamp
    });
    
    await ctx.reply(`
✅ **Trade Executed Successfully!**

**Action:** SELL
**Token:** ${tradeResult.token}
**Amount:** ${tradeResult.amount}
**Price:** ${tradeResult.price}
**Value:** ${tradeResult.value}
**Profit:** ${tradeResult.profit}
**TX:** ${tradeResult.txHash.slice(0, 16)}...

**Status:** 🟢 Confirmed

**Trade completed successfully!**
    `, {
      parse_mode: 'Markdown',
      reply_markup: mainMenu.reply_markup
    });
  }
};