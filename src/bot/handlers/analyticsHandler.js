import { analyticsMenu, mainMenu } from '../keyboards/mainMenu.js';

export const analyticsHandler = async (ctx, action = null) => {
  const actionParam = action || (ctx.match ? ctx.match[1] : 'menu');

  switch (actionParam) {
    case 'menu':
      await showAnalyticsMenu(ctx);
      break;
    case 'portfolio':
      await portfolioAnalytics(ctx);
      break;
    case 'performance':
      await performanceAnalytics(ctx);
      break;
    case 'pnl':
      await pnlReport(ctx);
      break;
    case 'history':
      await tradeHistory(ctx);
      break;
    case 'risk':
      await riskAnalysis(ctx);
      break;
    case 'export':
      await exportData(ctx);
      break;
    case 'back':
  await ctx.editMessageText('🔙 Returning to main menu...');
  await ctx.reply('Main Menu:', {
    reply_markup: mainMenu.reply_markup
  });
  break;
    default:
      await ctx.reply('❌ Unknown analytics action.');
  }
};

async function showAnalyticsMenu(ctx) {
  const tradeHistory = ctx.session.tradeHistory || [];
  const userWallets = ctx.session.wallets || [];
  
  const menuMessage = `
📈 **Analytics & Reports**

**Overview:**
• Total Trades: ${tradeHistory.length}
• Connected Wallets: ${userWallets.length}
• Monitored Tokens: ${ctx.session.monitoredTokens?.length || 0}

**Available Reports:**
• Portfolio performance
• Trade analytics
• Profit & loss
• Risk assessment
• Export data

Choose an option below:
  `;

  await ctx.reply(menuMessage, {
    reply_markup: analyticsMenu.reply_markup,
    parse_mode: 'Markdown'
  });
}

async function portfolioAnalytics(ctx) {
  const userWallets = ctx.session.wallets || [];
  
  if (userWallets.length === 0) {
    await ctx.reply('❌ No wallets connected. Connect a wallet to view portfolio analytics.');
    return;
  }

  // Mock portfolio data
  let portfolioMessage = '📊 **Portfolio Analytics**\n\n';
  
  userWallets.forEach((wallet, index) => {
    const portfolioValue = (Math.random() * 1000).toFixed(2);
    const dailyChange = (Math.random() * 20 - 10).toFixed(2);
    const changeEmoji = parseFloat(dailyChange) >= 0 ? '🟢' : '🔴';
    
    portfolioMessage += `**${wallet.name || `Wallet ${index + 1}`}**\n`;
    portfolioMessage += `📍 ${wallet.address.slice(0, 8)}...\n`;
    portfolioMessage += `💰 Value: $${portfolioValue}\n`;
    portfolioMessage += `📈 Daily: ${changeEmoji} ${dailyChange}%\n`;
    portfolioMessage += `---\n`;
  });

  portfolioMessage += '\n**Coming Soon:**\n';
  portfolioMessage += '• Detailed asset allocation\n';
  portfolioMessage += '• Historical performance\n';
  portfolioMessage += '• Portfolio charts\n';
  portfolioMessage += '• Risk metrics';

  await ctx.reply(portfolioMessage, { parse_mode: 'Markdown' });
}

async function performanceAnalytics(ctx) {
  const tradeHistory = ctx.session.tradeHistory || [];
  
  let performanceMessage = '📈 **Performance Analytics**\n\n';
  
  if (tradeHistory.length === 0) {
    performanceMessage += 'No trading data available yet.\n\n';
  } else {
    const winningTrades = tradeHistory.filter(t => t.profit > 0).length;
    const totalTrades = tradeHistory.length;
    const winRate = ((winningTrades / totalTrades) * 100).toFixed(1);
    
    performanceMessage += `**Trading Performance:**\n`;
    performanceMessage += `Total Trades: ${totalTrades}\n`;
    performanceMessage += `Winning Trades: ${winningTrades}\n`;
    performanceMessage += `Win Rate: ${winRate}%\n`;
    performanceMessage += `Best Trade: +$45.20\n`;
    performanceMessage += `Worst Trade: -$12.30\n\n`;
  }

  performanceMessage += '**Advanced Metrics:**\n';
  performanceMessage += '• Sharpe Ratio\n';
  performanceMessage += '• Maximum Drawdown\n';
  performanceMessage += '• Profit Factor\n';
  performanceMessage += '• Risk-Adjusted Returns';

  await ctx.reply(performanceMessage, { parse_mode: 'Markdown' });
}

async function pnlReport(ctx) {
  const tradeHistory = ctx.session.tradeHistory || [];
  
  let pnlMessage = '💰 **Profit & Loss Report**\n\n';
  
  if (tradeHistory.length === 0) {
    pnlMessage += 'No P&L data available yet.\n\n';
  } else {
    const totalProfit = tradeHistory.reduce((sum, trade) => sum + (trade.profit || 0), 0);
    const avgProfit = (totalProfit / tradeHistory.length).toFixed(2);
    
    pnlMessage += `**Overall P&L:** $${totalProfit.toFixed(2)}\n`;
    pnlMessage += `**Average per Trade:** $${avgProfit}\n`;
    pnlMessage += `**Total Trades:** ${tradeHistory.length}\n\n`;
    
    pnlMessage += '**Recent Trades:**\n';
    const recentTrades = tradeHistory.slice(-5);
    recentTrades.forEach(trade => {
      const emoji = trade.profit >= 0 ? '🟢' : '🔴';
      pnlMessage += `${emoji} ${trade.type.toUpperCase()} ${trade.token}: $${trade.profit}\n`;
    });
  }

  pnlMessage += '\n**Detailed Reports:**\n';
  pnlMessage += '• Daily/weekly/monthly P&L\n';
  pnlMessage += '• Asset-specific performance\n';
  pnlMessage += '• Tax reporting\n';
  pnlMessage += '• Export to CSV';

  await ctx.reply(pnlMessage, { parse_mode: 'Markdown' });
}

async function tradeHistory(ctx) {
  const tradeHistory = ctx.session.tradeHistory || [];
  
  let historyMessage = '📋 **Trade History**\n\n';
  
  if (tradeHistory.length === 0) {
    historyMessage += 'No trade history yet.\n\n';
  } else {
    historyMessage += `**Last ${Math.min(10, tradeHistory.length)} Trades:**\n\n`;
    
    const recentTrades = tradeHistory.slice(-10).reverse();
    recentTrades.forEach((trade, index) => {
      const emoji = trade.profit >= 0 ? '🟢' : '🔴';
      historyMessage += `${index + 1}. ${trade.type.toUpperCase()} ${trade.token}\n`;
      historyMessage += `   ${emoji} $${trade.profit} - ${new Date(trade.timestamp).toLocaleDateString()}\n`;
      if (index < recentTrades.length - 1) historyMessage += `---\n`;
    });
  }

  historyMessage += '\n**History Features:**\n';
  historyMessage += '• Filter by date range\n';
  historyMessage += '• Search by token\n';
  historyMessage += '• Export to spreadsheet\n';
  historyMessage += '• Trade analysis';

  await ctx.reply(historyMessage, { parse_mode: 'Markdown' });
}

async function riskAnalysis(ctx) {
  await ctx.reply(`
📉 **Risk Analysis**

**Portfolio Risk Assessment:**

🟢 **Low Risk (0-20%)**
• Established tokens
• High liquidity
• Stable price action

🟡 **Medium Risk (21-60%)**
• Newer tokens
• Medium liquidity
• Moderate volatility

🔴 **High Risk (61-100%)**
• Very new tokens
• Low liquidity
• High volatility

**Your Current Risk Profile:**
• Portfolio Risk: Medium (45%)
• Concentration Risk: Low
• Liquidity Risk: Medium

**Recommendations:**
• Diversify across more tokens
• Set stop-losses for high-risk positions
• Monitor liquidity regularly
  `, { parse_mode: 'Markdown' });
}

async function exportData(ctx) {
  await ctx.reply(`
🔄 **Export Data**

**Available Exports:**

📊 **Portfolio Data**
• Current holdings
• Historical values
• Performance metrics

💹 **Trade History**
• All executed trades
• Profit/loss data
• Transaction details

📈 **Analytics Reports**
• Performance analysis
• Risk assessment
• Trading statistics

🔔 **Alert History**
• Price alerts triggered
• Notification logs
• System events

**Export Formats:**
• CSV (Spreadsheet)
• JSON (API integration)
• PDF (Reports)

**Coming in next update with file attachment support.**
  `, { parse_mode: 'Markdown' });
}