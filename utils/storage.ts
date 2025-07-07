import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Transaction } from './Transaction';

// Storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_manager_transactions',
  BUDGET: 'finance_manager_budget',
  THEME: 'finance_manager_theme',
  FOLLOW_SYSTEM: 'finance_manager_follow_system',
  CURRENCY: 'finance_manager_currency',
  CURRENCY_AFTER: 'finance_manager_currency_after',
};

// Cross-platform storage utility
class StorageManager {
  private async setItem(key: string, value: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  private async getItem(key: string): Promise<string | null> {
    try {
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      return null;
    }
  }

  private async removeItem(key: string): Promise<void> {
    try {
      if (Platform.OS === 'web') {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  // Transaction methods
  async saveTransactions(transactions: Transaction[]): Promise<void> {
    await this.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }

  async loadTransactions(): Promise<Transaction[]> {
    const data = await this.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Error parsing transactions:', error);
      }
    }
    return [];
  }

  // Budget methods
  async saveBudget(budget: number): Promise<void> {
    await this.setItem(STORAGE_KEYS.BUDGET, budget.toString());
  }

  async loadBudget(): Promise<number> {
    const data = await this.getItem(STORAGE_KEYS.BUDGET);
    return data ? parseFloat(data) || 0 : 0;
  }

  // Theme methods
  async saveTheme(isDarkMode: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDarkMode));
  }

  async loadTheme(): Promise<boolean> {
    const data = await this.getItem(STORAGE_KEYS.THEME);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Error parsing theme:', error);
      }
    }
    // Default to system preference or false
    return false;
  }

  // Follow system theme methods
  async saveFollowSystem(follow: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.FOLLOW_SYSTEM, JSON.stringify(follow));
  }

  async loadFollowSystem(): Promise<boolean> {
    const data = await this.getItem(STORAGE_KEYS.FOLLOW_SYSTEM);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Error parsing follow system:', error);
      }
    }
    return true; // Default to true
  }

  // Currency methods
  async saveCurrency(currency: string): Promise<void> {
    await this.setItem(STORAGE_KEYS.CURRENCY, currency);
  }

  async loadCurrency(): Promise<string> {
    const data = await this.getItem(STORAGE_KEYS.CURRENCY);
    return data || 'USD'; // Default to USD
  }

  // Currency placement methods
  async saveCurrencyAfter(after: boolean): Promise<void> {
    await this.setItem(STORAGE_KEYS.CURRENCY_AFTER, JSON.stringify(after));
  }

  async loadCurrencyAfter(): Promise<boolean> {
    const data = await this.getItem(STORAGE_KEYS.CURRENCY_AFTER);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Error parsing currency placement:', error);
      }
    }
    return false; // Default to currency before amount
  }

  // Clear all data
  async clearAll(): Promise<void> {
    await Promise.all([
      this.removeItem(STORAGE_KEYS.TRANSACTIONS),
      this.removeItem(STORAGE_KEYS.BUDGET),
      this.removeItem(STORAGE_KEYS.THEME),
      this.removeItem(STORAGE_KEYS.FOLLOW_SYSTEM),
      this.removeItem(STORAGE_KEYS.CURRENCY),
      this.removeItem(STORAGE_KEYS.CURRENCY_AFTER),
    ]);
  }
}

export const storageManager = new StorageManager();
export { STORAGE_KEYS };