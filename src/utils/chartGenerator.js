import { getWalletBalance, getPortfolioValue } from '../services/monad/walletService.js';
import { formatCurrency, formatNumber, generateProgressBar } from './helpers.js';

/**
 * Generate text-based portfolio summary (fallback when canvas is not available)
 */
export async function generatePortfolioImage(wallets) {
    try {
        let portfolioText = '📊 **Portfolio Overview**\n\n';
        let totalValue = 0;
        const walletData = [];

        // Get wallet data
        for (const wallet of wallets) {
            try {
                const portfolio = await getPortfolioValue(wallet.address);
                totalValue += portfolio.totalUSD;
                walletData.push({
                    name: wallet.name,
                    address: wallet.address,
                    value: portfolio.totalUSD,
                    monBalance: portfolio.monBalance
                });
            } catch (error) {
                console.error(`Error getting portfolio for ${wallet.address}:`, error);
                walletData.push({
                    name: wallet.name,
                    address: wallet.address,
                    value: 0,
                    monBalance: 0
                });
            }
        }

        // Total value
        portfolioText += `💰 **Total Portfolio Value:** ${formatCurrency(totalValue)}\n\n`;

        // Wallet details
        walletData.forEach((wallet, index) => {
            const percentage = totalValue > 0 ? (wallet.value / totalValue) * 100 : 0;
            const progressBar = generateProgressBar(percentage, 10);
            
            portfolioText += `**${wallet.name || `Wallet ${index + 1}`}** ${wallet.isDefault ? '⭐' : ''}\n`;
            portfolioText += `📍 ${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}\n`;
            portfolioText += `💵 Value: ${formatCurrency(wallet.value)}\n`;
            portfolioText += `💎 MON: ${formatNumber(wallet.monBalance)}\n`;
            portfolioText += `📊 ${progressBar} ${percentage.toFixed(1)}%\n`;
            portfolioText += `---\n`;
        });

        // Footer
        portfolioText += `\n_Generated on ${new Date().toLocaleDateString()} | Monad Sniper Bot_`;

        return portfolioText;

    } catch (error) {
        console.error('Error generating portfolio summary:', error);
        return '❌ Error generating portfolio summary. Please try again.';
    }
}

/**
 * Generate text-based price chart
 */
export async function generatePriceChart(tokenData, timeFrame = '24h') {
    try {
        // Mock price data
        const prices = generateMockPriceData(10);
        const currentPrice = prices[prices.length - 1];
        const priceChange = ((currentPrice - prices[0]) / prices[0]) * 100;
        
        let chartText = `📈 **${tokenData.symbol} Price Chart (${timeFrame})**\n\n`;
        
        // Simple ASCII chart
        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);
        const range = maxPrice - minPrice;
        
        for (let i = 0; i < 5; i++) {
            const priceLevel = maxPrice - (i * range / 4);
            const bar = '█'.repeat(Math.round((prices[i] - minPrice) / range * 10));
            chartText += `$${priceLevel.toFixed(4)} ${bar}\n`;
        }
        
        chartText += `\n💰 **Current Price:** ${formatCurrency(currentPrice)}\n`;
        chartText += `📉 **Change:** ${priceChange >= 0 ? '🟢' : '🔴'} ${priceChange.toFixed(2)}%\n`;
        
        return chartText;

    } catch (error) {
        console.error('Error generating price chart:', error);
        return '❌ Error generating price chart. Please try again.';
    }
}

/**
 * Generate text-based performance chart
 */
export async function generatePerformanceChart(tradeHistory) {
    try {
        if (!tradeHistory || tradeHistory.length === 0) {
            return '📊 **Trading Performance**\n\nNo trading data available yet.';
        }

        let performanceText = '📊 **Trading Performance**\n\n';

        // Calculate stats
        const totalTrades = tradeHistory.length;
        const winningTrades = tradeHistory.filter(t => (t.profit || 0) > 0).length;
        const losingTrades = tradeHistory.filter(t => (t.profit || 0) < 0).length;
        const winRate = (winningTrades / totalTrades) * 100;
        
        let totalProfit = 0;
        let bestTrade = 0;
        let worstTrade = 0;
        
        tradeHistory.forEach(trade => {
            const profit = trade.profit || 0;
            totalProfit += profit;
            if (profit > bestTrade) bestTrade = profit;
            if (profit < worstTrade) worstTrade = profit;
        });

        // Performance stats
        performanceText += `📈 **Total Trades:** ${totalTrades}\n`;
        performanceText += `🎯 **Win Rate:** ${winRate.toFixed(1)}%\n`;
        performanceText += `💰 **Total P&L:** ${formatCurrency(totalProfit)}\n`;
        performanceText += `🚀 **Best Trade:** ${formatCurrency(bestTrade)}\n`;
        performanceText += `📉 **Worst Trade:** ${formatCurrency(worstTrade)}\n\n`;

        // Win/Loss ratio visualization
        const winBar = '🟢'.repeat(Math.round((winningTrades / totalTrades) * 10));
        const lossBar = '🔴'.repeat(Math.round((losingTrades / totalTrades) * 10));
        
        performanceText += `**Win/Loss Ratio:**\n`;
        performanceText += `${winBar}${lossBar}\n`;
        performanceText += `${winningTrades}W / ${losingTrades}L\n`;

        return performanceText;

    } catch (error) {
        console.error('Error generating performance chart:', error);
        return '❌ Error generating performance summary. Please try again.';
    }
}

/**
 * Generate mock price data
 */
function generateMockPriceData(points = 10) {
    const prices = [];
    let currentPrice = 1.0 + Math.random() * 10;
    
    for (let i = 0; i < points; i++) {
        const change = (Math.random() - 0.4) * 0.1;
        currentPrice = Math.max(0.01, currentPrice * (1 + change));
        prices.push(currentPrice);
    }
    
    return prices;
}

/**
 * Alias for text-based portfolio
 */
export function generateTextPortfolio(wallets) {
    return generatePortfolioImage(wallets);
}

export default {
    generatePortfolioImage,
    generatePriceChart,
    generatePerformanceChart,
    generateTextPortfolio
};