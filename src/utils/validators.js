import { ethers } from 'ethers';

// Validate Ethereum address
export const isValidEthereumAddress = (address) => {
  if (!address || typeof address !== 'string') return false;
  
  // Basic format check
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return false;
  
  // Use ethers.js for proper validation
  return ethers.isAddress(address);
};

// Validate private key
export const isValidPrivateKey = (privateKey) => {
  if (!privateKey || typeof privateKey !== 'string') return false;
  
  // Basic format check
  if (!/^0x[0-9a-fA-F]{64}$/.test(privateKey)) return false;
  
  try {
    // Try to create wallet to validate
    new ethers.Wallet(privateKey);
    return true;
  } catch {
    return false;
  }
};

// Validate contract address with checksum
export const isValidContractAddress = async (address, provider) => {
  if (!isValidEthereumAddress(address)) return false;
  
  try {
    // Check if it's a contract (has code)
    const code = await provider.getCode(address);
    return code !== '0x';
  } catch {
    return false;
  }
};

// Validate amount
export const isValidAmount = (amount, options = {}) => {
  const {
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    allowZero = false,
    allowNegative = false
  } = options;

  if (amount === null || amount === undefined) return false;
  
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return false;
  if (!allowNegative && num < 0) return false;
  if (!allowZero && num === 0) return false;
  if (num < min) return false;
  if (num > max) return false;
  
  return true;
};

// Validate percentage
export const isValidPercentage = (percentage, options = {}) => {
  const {
    min = 0,
    max = 100,
    allowZero = false,
    allowOver100 = false
  } = options;

  if (!isValidAmount(percentage, { allowNegative: false })) return false;
  
  const num = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  
  if (!allowZero && num === 0) return false;
  if (!allowOver100 && num > 100) return false;
  if (num < min) return false;
  if (num > max) return false;
  
  return true;
};

// Validate slippage
export const isValidSlippage = (slippage) => {
  return isValidPercentage(slippage, { min: 0.1, max: 50, allowZero: false });
};

// Validate gas price
export const isValidGasPrice = (gasPrice) => {
  if (!isValidAmount(gasPrice, { min: 1, allowZero: false })) return false;
  
  const num = typeof gasPrice === 'string' ? parseFloat(gasPrice) : gasPrice;
  
  // Reasonable gas price limits (in gwei)
  return num >= 1 && num <= 1000;
};

// Validate transaction hash
export const isValidTransactionHash = (txHash) => {
  if (!txHash || typeof txHash !== 'string') return false;
  
  return /^0x[0-9a-fA-F]{64}$/.test(txHash);
};

// Validate token symbol
export const isValidTokenSymbol = (symbol) => {
  if (!symbol || typeof symbol !== 'string') return false;
  
  // Basic validation: 1-10 characters, alphanumeric
  return /^[A-Z0-9]{1,10}$/i.test(symbol);
};

// Validate token name
export const isValidTokenName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  // Basic validation: 1-50 characters, alphanumeric and spaces
  return /^[A-Z0-9\s]{1,50}$/i.test(name);
};

// Validate wallet name
export const isValidWalletName = (name) => {
  if (!name || typeof name !== 'string') return false;
  
  // 1-20 characters, alphanumeric and spaces
  return /^[A-Z0-9\s]{1,20}$/i.test(name);
};

// Validate URL
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate RPC URL
export const isValidRpcUrl = (url) => {
  if (!isValidUrl(url)) return false;
  
  // Basic RPC URL pattern check
  return /^https?:\/\/.+/i.test(url);
};

// Validate email (basic)
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone number (basic)
export const isValidPhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  
  // Basic international phone number validation
  const phoneRegex = /^\+?[\d\s-()]{10,}$/;
  return phoneRegex.test(phone);
};

// Validate seed phrase
export const isValidSeedPhrase = (phrase) => {
  if (!phrase || typeof phrase !== 'string') return false;
  
  const words = phrase.trim().split(/\s+/);
  
  // Standard seed phrase lengths
  const validLengths = [12, 15, 18, 21, 24];
  
  if (!validLengths.includes(words.length)) return false;
  
  // Basic word validation (should be BIP39 words in real implementation)
  const wordRegex = /^[a-z]+$/;
  return words.every(word => wordRegex.test(word) && word.length >= 3 && word.length <= 8);
};

// Validate JSON
export const isValidJson = (jsonString) => {
  if (!jsonString || typeof jsonString !== 'string') return false;
  
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
};

// Validate date string
export const isValidDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return false;
  
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Validate time frame
export const isValidTimeFrame = (timeFrame) => {
  const validTimeFrames = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];
  return validTimeFrames.includes(timeFrame);
};

// Validate order type
export const isValidOrderType = (orderType) => {
  const validOrderTypes = ['market', 'limit', 'stop', 'stop_limit'];
  return validOrderTypes.includes(orderType);
};

// Validate trade side
export const isValidTradeSide = (side) => {
  const validSides = ['buy', 'sell'];
  return validSides.includes(side);
};

// Validate alert condition
export const isValidAlertCondition = (condition) => {
  const validConditions = ['above', 'below', 'equals', 'percent_change'];
  return validConditions.includes(condition);
};

// Validate notification type
export const isValidNotificationType = (type) => {
  const validTypes = ['price', 'volume', 'liquidity', 'trade', 'system'];
  return validTypes.includes(type);
};

// Composite validator for trade parameters
export const validateTradeParameters = (params) => {
  const errors = [];

  if (!isValidEthereumAddress(params.tokenAddress)) {
    errors.push('Invalid token address');
  }

  if (!isValidAmount(params.amount, { min: 0.001, allowZero: false })) {
    errors.push('Invalid amount');
  }

  if (!isValidSlippage(params.slippage)) {
    errors.push('Invalid slippage percentage');
  }

  if (params.gasPrice && !isValidGasPrice(params.gasPrice)) {
    errors.push('Invalid gas price');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Composite validator for snipe setup
export const validateSnipeSetup = (params) => {
  const errors = [];

  if (!isValidEthereumAddress(params.tokenAddress)) {
    errors.push('Invalid token address');
  }

  if (!isValidAmount(params.amount, { min: 0.001, allowZero: false })) {
    errors.push('Invalid amount');
  }

  if (!isValidAmount(params.triggerPrice, { min: 0.000001, allowZero: false })) {
    errors.push('Invalid trigger price');
  }

  if (!isValidSlippage(params.slippage)) {
    errors.push('Invalid slippage percentage');
  }

  if (params.gasLimit && !isValidAmount(params.gasLimit, { min: 21000, allowZero: false })) {
    errors.push('Invalid gas limit');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Composite validator for wallet connection
export const validateWalletConnection = (params) => {
  const errors = [];

  if (params.privateKey && !isValidPrivateKey(params.privateKey)) {
    errors.push('Invalid private key');
  }

  if (params.seedPhrase && !isValidSeedPhrase(params.seedPhrase)) {
    errors.push('Invalid seed phrase');
  }

  if (params.walletName && !isValidWalletName(params.walletName)) {
    errors.push('Invalid wallet name');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and >
    .substring(0, 1000); // Limit length
};

// Sanitize contract address (convert to checksum)
export const sanitizeContractAddress = (address) => {
  if (!isValidEthereumAddress(address)) return address;
  
  try {
    return ethers.getAddress(address);
  } catch {
    return address;
  }
};

// Validate and sanitize all inputs
export const validateAndSanitize = (input, type = 'text') => {
  const sanitized = sanitizeInput(input);
  
  switch (type) {
    case 'address':
      return isValidEthereumAddress(sanitized) ? sanitizeContractAddress(sanitized) : null;
    
    case 'amount':
      return isValidAmount(sanitized) ? parseFloat(sanitized) : null;
    
    case 'percentage':
      return isValidPercentage(sanitized) ? parseFloat(sanitized) : null;
    
    case 'email':
      return isValidEmail(sanitized) ? sanitized : null;
    
    case 'json':
      return isValidJson(sanitized) ? sanitized : null;
    
    default:
      return sanitized;
  }
};

// Export all validators
export default {
  isValidEthereumAddress,
  isValidPrivateKey,
  isValidContractAddress,
  isValidAmount,
  isValidPercentage,
  isValidSlippage,
  isValidGasPrice,
  isValidTransactionHash,
  isValidTokenSymbol,
  isValidTokenName,
  isValidWalletName,
  isValidUrl,
  isValidRpcUrl,
  isValidEmail,
  isValidPhoneNumber,
  isValidSeedPhrase,
  isValidJson,
  isValidDate,
  isValidTimeFrame,
  isValidOrderType,
  isValidTradeSide,
  isValidAlertCondition,
  isValidNotificationType,
  validateTradeParameters,
  validateSnipeSetup,
  validateWalletConnection,
  sanitizeInput,
  sanitizeContractAddress,
  validateAndSanitize
};