import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync, existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '../../data');
const file = join(dataDir, 'db.json');

// Ensure data directory exists
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}

const adapter = new JSONFile(file);
const db = new Low(adapter, {
  users: {},
  tokens: {},
  transactions: {},
  analytics: {},
  system: {
    startupCount: 0,
    lastStartup: ''
  }
});

export async function initDatabase() {
  try {
    await db.read();
    
    // Initialize with default structure if db.data is undefined
    if (!db.data) {
      db.data = {
        users: {},
        tokens: {},
        transactions: {},
        analytics: {},
        system: {
          startupCount: 0,
          lastStartup: new Date().toISOString()
        }
      };
    }
    
    // Ensure system object exists
    if (!db.data.system) {
      db.data.system = {
        startupCount: 0,
        lastStartup: new Date().toISOString()
      };
    }
    
    // Update system stats
    db.data.system.startupCount += 1;
    db.data.system.lastStartup = new Date().toISOString();
    
    await db.write();
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw new Error('Failed to initialize database');
  }
}

export function getUserData(userId) {
  return db.data?.users?.[userId] || null;
}

export function saveUserData(userId, data) {
  if (!db.data) {
    console.error('Database not initialized');
    return Promise.resolve();
  }
  
  if (!db.data.users) {
    db.data.users = {};
  }
  
  db.data.users[userId] = { 
    ...db.data.users[userId], 
    ...data,
    lastUpdated: new Date().toISOString()
  };
  return db.write();
}

export function saveTransaction(userId, transaction) {
  if (!db.data) {
    console.error('Database not initialized');
    return Promise.resolve();
  }
  
  if (!db.data.transactions) {
    db.data.transactions = {};
  }
  
  if (!db.data.transactions[userId]) {
    db.data.transactions[userId] = [];
  }
  
  db.data.transactions[userId].push({
    ...transaction,
    id: Date.now().toString(),
    timestamp: new Date().toISOString()
  });
  return db.write();
}

export function getTransactionHistory(userId, limit = 50) {
  const transactions = db.data?.transactions?.[userId] || [];
  return transactions.slice(-limit).reverse();
}

export function saveTokenData(tokenAddress, data) {
  if (!db.data) {
    console.error('Database not initialized');
    return Promise.resolve();
  }
  
  if (!db.data.tokens) {
    db.data.tokens = {};
  }
  
  db.data.tokens[tokenAddress] = {
    ...db.data.tokens[tokenAddress],
    ...data,
    lastUpdated: new Date().toISOString()
  };
  return db.write();
}

export function getTokenData(tokenAddress) {
  return db.data?.tokens?.[tokenAddress] || null;
}

export function saveAnalytics(userId, analytics) {
  if (!db.data) {
    console.error('Database not initialized');
    return Promise.resolve();
  }
  
  if (!db.data.analytics) {
    db.data.analytics = {};
  }
  
  if (!db.data.analytics[userId]) {
    db.data.analytics[userId] = [];
  }
  
  db.data.analytics[userId].push({
    ...analytics,
    timestamp: new Date().toISOString()
  });
  return db.write();
}

export function getSystemStats() {
  return db.data?.system || {};
}

// Export db for direct access if needed
export { db };