import moment from 'moment';

// Format numbers with commas
export const formatNumber = (num, decimals = 4) => {
  if (!num && num !== 0) return 'N/A';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return 'N/A';
  
  return number.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  });
};

// Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount && amount !== 0) return 'N/A';
  
  const number = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(number)) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(number);
};

// Format percentage
export const formatPercentage = (percentage, decimals = 2) => {
  if (!percentage && percentage !== 0) return 'N/A';
  
  const number = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
  
  if (isNaN(number)) return 'N/A';
  
  return `${number >= 0 ? '+' : ''}${number.toFixed(decimals)}%`;
};

// Format address for display
export const formatAddress = (address, startLength = 6, endLength = 4) => {
  if (!address || address.length < startLength + endLength) return address;
  
  return `${address.substring(0, startLength)}...${address.substring(address.length - endLength)}`;
};

// Format large numbers (K, M, B)
export const formatLargeNumber = (num) => {
  if (!num && num !== 0) return 'N/A';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return 'N/A';
  
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(2) + 'B';
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(2) + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(2) + 'K';
  }
  
  return number.toString();
};

// Calculate percentage change
export const calculatePercentageChange = (oldValue, newValue) => {
  if (!oldValue || !newValue) return 0;
  
  const oldNum = typeof oldValue === 'string' ? parseFloat(oldValue) : oldValue;
  const newNum = typeof newValue === 'string' ? parseFloat(newValue) : newValue;
  
  if (isNaN(oldNum) || isNaN(newNum) || oldNum === 0) return 0;
  
  return ((newNum - oldNum) / oldNum) * 100;
};

// Format timestamp
export const formatTimestamp = (timestamp, format = 'MMM DD, YYYY HH:mm') => {
  if (!timestamp) return 'N/A';
  
  return moment(timestamp).format(format);
};

// Calculate time ago
export const timeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  
  return moment(timestamp).fromNow();
};

// Generate random ID
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// Delay function
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Retry function with exponential backoff
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      const delayMs = baseDelay * Math.pow(2, attempt - 1);
      console.log(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`);
      await delay(delayMs);
    }
  }
};

// Validate amount
export const validateAmount = (amount, min = 0, max = Number.MAX_SAFE_INTEGER) => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return false;
  if (num < min) return false;
  if (num > max) return false;
  
  return true;
};

// Parse user input for numbers
export const parseUserInput = (input) => {
  if (!input) return null;
  
  // Remove commas and other non-numeric characters except decimal point
  const cleaned = input.replace(/[^\d.-]/g, '');
  const num = parseFloat(cleaned);
  
  return isNaN(num) ? null : num;
};

// Generate progress bar
export const generateProgressBar = (percentage, length = 10) => {
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  
  return '█'.repeat(filled) + '░'.repeat(empty);
};

// Calculate P&L
export const calculateProfitLoss = (buyPrice, currentPrice, quantity) => {
  const profitLoss = (currentPrice - buyPrice) * quantity;
  const percentage = ((currentPrice - buyPrice) / buyPrice) * 100;
  
  return {
    absolute: profitLoss,
    percentage: percentage,
    isProfit: profitLoss >= 0
  };
};

// Format trade size category
export const getTradeSizeCategory = (amount) => {
  if (amount < 100) return 'Small';
  if (amount < 1000) return 'Medium';
  if (amount < 10000) return 'Large';
  return 'Whale';
};

// Generate emoji based on percentage change
export const getChangeEmoji = (percentage) => {
  if (percentage > 20) return '🚀';
  if (percentage > 10) return '📈';
  if (percentage > 5) return '↗️';
  if (percentage > 0) return '⬆️';
  if (percentage === 0) return '➡️';
  if (percentage > -5) return '⬇️';
  if (percentage > -10) return '📉';
  return '💥';
};

// Safe JSON parse
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Get random element from array
export const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Shuffle array
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};