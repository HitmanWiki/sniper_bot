import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

export const encryptData = (data) => {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key not configured');
  }
  return CryptoJS.AES.encrypt(data, ENCRYPTION_KEY).toString();
};

export const decryptData = (encryptedData) => {
  if (!ENCRYPTION_KEY) {
    throw new Error('Encryption key not configured');
  }
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const validateEncryptionKey = () => {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error('Invalid encryption key. Must be 32 characters long. Check your .env file.');
  }
  console.log('✅ Encryption key validated successfully');
};

export const generateBackupPhrase = (wallets) => {
  const backupData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    wallets: wallets.map(wallet => ({
      name: wallet.name,
      address: wallet.address,
      encryptedKey: wallet.encryptedKey,
      type: wallet.type
    }))
  };
  
  return encryptData(JSON.stringify(backupData));
};

export const restoreFromBackup = (backupPhrase) => {
  try {
    const decrypted = decryptData(backupPhrase);
    const backupData = JSON.parse(decrypted);
    
    if (backupData.version !== '1.0') {
      throw new Error('Invalid backup version');
    }
    
    return backupData.wallets;
  } catch (error) {
    throw new Error('Invalid backup phrase');
  }
};