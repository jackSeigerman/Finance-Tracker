// Note: You'll need to install @react-native-async-storage/async-storage
// Run: npx expo install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { Transaction } from './Transaction';

// Storage keys
const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_manager_transactions',
  BUDGET: 'finance_manager_budget',
  THEME: 'finance_manager_theme',
  RECURRING_TRANSACTIONS: 'finance_manager_recurring_transactions',
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

  // Clear all data
  async clearAll(): Promise<void> {
    await Promise.all([
      this.removeItem(STORAGE_KEYS.TRANSACTIONS),
      this.removeItem(STORAGE_KEYS.BUDGET),
      this.removeItem(STORAGE_KEYS.THEME),
    ]);
  }
}

export const storageManager = new StorageManager();
export { STORAGE_KEYS };