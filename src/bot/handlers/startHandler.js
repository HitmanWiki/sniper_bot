import { mainMenu } from '../keyboards/mainMenu.js';

export const startHandler = (ctx) => {
  const welcomeMessage = `
🤖 **Welcome to Monad Sniper Bot!** 

**🚀 Advanced Features:**
• 🔐 **Secure Encrypted Wallets** - Military-grade encryption for your private keys
• 🎯 **Auto Sniping** - Buy tokens automatically when liquidity is added
• 📊 **Real-time Monitoring** - Track prices, liquidity, and volume
• ⚡ **Quick Trading** - Instant buy/sell with custom slippage
• 📈 **Advanced Analytics** - Portfolio tracking and performance metrics
• 🛡️ **Security First** - Local encryption, no data sharing

**📋 Available Commands:**
• Use menu buttons below for navigation
• Quick commands: /buy, /sell, /monitor, /snipe
• Type /help for detailed command list

**🔧 Getting Started:**
1. Connect your wallet (Encrypted & Secure)
2. Monitor tokens for opportunities  
3. Setup auto-snipe configurations
4. Execute trades with confidence

**⚠️ Important:**
• Always test with small amounts first
• Keep your backup phrases secure
• Monitor gas fees for optimal trading

Ready to start your Monad trading journey? Choose an option below! 🚀
  `;

  ctx.reply(welcomeMessage, {
    reply_markup: mainMenu.reply_markup,
    parse_mode: 'Markdown'
  });
};