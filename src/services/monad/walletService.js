import { ethers } from 'ethers';
import dotenv from 'dotenv';

dotenv.config();

// Initialize provider
const provider = new ethers.JsonRpcProvider(process.env.MONAD_RPC_URL);

export const getWalletBalance = async (address) => {
  try {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    throw new Error(`Failed to get balance: ${error.message}`);
  }
};

export const getTokenBalance = async (tokenAddress, walletAddress) => {
  try {
    // Basic ERC-20 ABI for balanceOf
    const abi = [
      'function balanceOf(address) view returns (uint256)',
      'function decimals() view returns (uint8)',
      'function symbol() view returns (string)',
      'function name() view returns (string)'
    ];
    
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    const [balance, decimals, symbol, name] = await Promise.all([
      tokenContract.balanceOf(walletAddress),
      tokenContract.decimals(),
      tokenContract.symbol(),
      tokenContract.name()
    ]);
    
    return {
      balance: ethers.formatUnits(balance, decimals),
      decimals,
      symbol,
      name
    };
  } catch (error) {
    console.error('Error getting token balance:', error);
    throw new Error(`Failed to get token balance: ${error.message}`);
  }
};

export const getPortfolioValue = async (walletAddress) => {
  try {
    const monBalance = await getWalletBalance(walletAddress);
    
    // For now, return mock data for tokens
    // In real implementation, you would scan for tokens
    const mockTokens = [
      {
        address: '0x123...',
        symbol: 'TEST',
        name: 'Test Token',
        balance: '1000',
        valueUSD: '150.00'
      }
    ];
    
    const monValueUSD = parseFloat(monBalance) * 1.5; // Example price
    const totalValueUSD = mockTokens.reduce((sum, token) => sum + parseFloat(token.valueUSD), monValueUSD);
    
    return {
      totalUSD: totalValueUSD,
      monBalance: parseFloat(monBalance),
      monValueUSD,
      tokens: mockTokens
    };
  } catch (error) {
    console.error('Error getting portfolio value:', error);
    throw new Error(`Failed to get portfolio: ${error.message}`);
  }
};

export const getTransactionHistory = async (address, limit = 10) => {
  try {
    // This would typically use a block explorer API
    // For now, return mock data
    return [
      {
        hash: '0xabc...',
        type: 'swap',
        amount: '100',
        token: 'MON',
        timestamp: new Date().toISOString(),
        status: 'confirmed'
      }
    ];
  } catch (error) {
    console.error('Error getting transaction history:', error);
    throw new Error(`Failed to get transaction history: ${error.message}`);
  }
};

export const createWallet = () => {
  const wallet = ethers.Wallet.createRandom();
  return {
    address: wallet.address,
    privateKey: wallet.privateKey,
    mnemonic: wallet.mnemonic.phrase
  };
};

export const isValidAddress = (address) => {
  return ethers.isAddress(address);
};