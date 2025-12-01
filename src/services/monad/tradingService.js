import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { decryptData } from '../../utils/encryption.js';
import { getTradeQuote } from './dexService.js';
import { saveTransaction } from '../../utils/database.js';

dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);

export class TradingService {
  constructor() {
    this.pendingTransactions = new Map();
  }

  async executeBuy(walletData, tokenAddress, amount, slippage = 3) {
    try {
      // Decrypt private key
      const privateKey = decryptData(walletData.encryptedKey);
      const wallet = new ethers.Wallet(privateKey, provider);

      // Get trade quote
      const quote = await getTradeQuote(
        '0x0000000000000000000000000000000000000000', // NATIVE token
        tokenAddress,
        amount
      );

      // Validate sufficient balance
      const balance = await provider.getBalance(wallet.address);
      if (ethers.parseEther(amount) > balance) {
        throw new Error('Insufficient balance');
      }

      // Mock transaction - in real implementation, you'd interact with DEX router
      const transaction = {
        from: wallet.address,
        to: tokenAddress,
        value: ethers.parseEther(amount),
        gasLimit: 300000,
        gasPrice: await provider.getGasPrice(),
        data: '0x' // Mock calldata
      };

      // Simulate transaction (in real scenario, you'd sign and send)
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      const tradeResult = {
        success: true,
        txHash,
        amountIn: amount,
        amountOut: quote.toAmount,
        tokenAddress,
        timestamp: new Date().toISOString(),
        gasUsed: '0.001',
        status: 'completed'
      };

      // Save transaction to database
      await saveTransaction(walletData.userId, {
        type: 'buy',
        ...tradeResult
      });

      return tradeResult;

    } catch (error) {
      console.error('Buy execution error:', error);
      throw new Error(`Buy failed: ${error.message}`);
    }
  }

  async executeSell(walletData, tokenAddress, percentage, slippage = 3) {
    try {
      const privateKey = decryptData(walletData.encryptedKey);
      const wallet = new ethers.Wallet(privateKey, provider);

      // Get token balance
      const tokenBalance = await this.getTokenBalance(tokenAddress, wallet.address);
      const sellAmount = (tokenBalance.balance * percentage) / 100;

      // Get trade quote
      const quote = await getTradeQuote(
        tokenAddress,
        '0x0000000000000000000000000000000000000000', // NATIVE token
        sellAmount.toString()
      );

      // Mock transaction
      const txHash = `0x${Math.random().toString(16).substr(2, 64)}`;
      
      const tradeResult = {
        success: true,
        txHash,
        amountIn: sellAmount.toString(),
        amountOut: quote.toAmount,
        tokenAddress,
        timestamp: new Date().toISOString(),
        gasUsed: '0.001',
        status: 'completed'
      };

      // Save transaction
      await saveTransaction(walletData.userId, {
        type: 'sell',
        ...tradeResult
      });

      return tradeResult;

    } catch (error) {
      console.error('Sell execution error:', error);
      throw new Error(`Sell failed: ${error.message}`);
    }
  }

  async getTokenBalance(tokenAddress, walletAddress) {
    const abi = [
      'function balanceOf(address) view returns (uint256)',
      'function decimals() view returns (uint8)'
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    const [balance, decimals] = await Promise.all([
      tokenContract.balanceOf(walletAddress),
      tokenContract.decimals()
    ]);
    
    return {
      balance: parseFloat(ethers.formatUnits(balance, decimals)),
      decimals
    };
  }

  async setStopLoss(walletData, tokenAddress, triggerPrice, amount) {
    // Implementation for stop loss
    const stopLossConfig = {
      tokenAddress,
      triggerPrice,
      amount,
      active: true,
      createdAt: new Date().toISOString()
    };

    return stopLossConfig;
  }

  async setTakeProfit(walletData, tokenAddress, triggerPrice, amount) {
    // Implementation for take profit
    const takeProfitConfig = {
      tokenAddress,
      triggerPrice,
      amount,
      active: true,
      createdAt: new Date().toISOString()
    };

    return takeProfitConfig;
  }

  async cancelOrder(orderId) {
    // Implementation for order cancellation
    return { success: true, orderId, cancelledAt: new Date().toISOString() };
  }

  async getTradeHistory(walletAddress, limit = 50) {
    // Implementation to fetch trade history
    return [];
  }

  async estimateGas(transaction) {
    try {
      const gasEstimate = await provider.estimateGas(transaction);
      const gasPrice = await provider.getGasPrice();
      
      return {
        gasLimit: gasEstimate.toString(),
        gasPrice: ethers.formatUnits(gasPrice, 'gwei'),
        estimatedCost: ethers.formatEther(gasEstimate * gasPrice)
      };
    } catch (error) {
      throw new Error(`Gas estimation failed: ${error.message}`);
    }
  }

  async getTransactionStatus(txHash) {
    try {
      const receipt = await provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return { status: 'pending' };
      }
      
      return {
        status: receipt.status === 1 ? 'confirmed' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        confirmations: receipt.confirmations || 0
      };
    } catch (error) {
      throw new Error(`Failed to get transaction status: ${error.message}`);
    }
  }
}

export const tradingService = new TradingService();