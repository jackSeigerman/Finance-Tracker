import { useState, useEffect } from 'react';
import { Transaction } from '@/utils/Transaction';
import { storageManager } from '../utils/storage';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudgetState] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [currentTransaction, setCurrentTransaction] = useState<Transaction>({
    id: 0,
    description: '',
    amount: 0,
    type: 'expense',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
  });

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedTransactions, savedBudget] = await Promise.all([
          storageManager.loadTransactions(),
          storageManager.loadBudget(),
        ]);

        setTransactions(savedTransactions);
        setBudgetState(savedBudget);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save transactions whenever they change
  useEffect(() => {
    if (!isLoading) {
      storageManager.saveTransactions(transactions).catch(error => {
        console.error('Error saving transactions:', error);
      });
    }
  }, [transactions, isLoading]);

  // Save budget whenever it changes
  useEffect(() => {
    if (!isLoading) {
      storageManager.saveBudget(budget).catch(error => {
        console.error('Error saving budget:', error);
      });
    }
  }, [budget, isLoading]);

  const resetForm = () => {
    setCurrentTransaction({
      id: 0,
      description: '',
      amount: 0,
      type: 'expense',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const addOrUpdateTransaction = () => {
    if (!currentTransaction.description || !currentTransaction.amount) {
      alert('Please fill in all fields');
      return;
    }

    const amount = currentTransaction.amount;
    if (isNaN(amount) || amount <= 0 || amount === null || amount === undefined) {
      alert('Please enter a valid amount');
      return;
    }

    if (currentTransaction.id) {
      setTransactions(prev =>
        prev.map(t =>
          t.id === currentTransaction.id ? { ...currentTransaction, amount: amount } : t
        )
      );
    } else {
      const newTransaction = {
        ...currentTransaction,
        id: Date.now(),
        amount: amount,
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }

    setModalVisible(false);
    resetForm();
  };

  const editTransaction = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setModalVisible(true);
  };

  const deleteTransaction = (id: number) => {
    if (!id) return;
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const setBudget = (newBudget: number) => {
    setBudgetState(newBudget);
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      await storageManager.clearAll();
      setTransactions([]);
      setBudgetState(0);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return {
    transactions,
    setTransactions,
    budget,
    setBudget,
    modalVisible,
    setModalVisible,
    budgetModalVisible,
    setBudgetModalVisible,
    settingsModalVisible,
    setSettingsModalVisible,
    currentTransaction,
    setCurrentTransaction,
    addOrUpdateTransaction,
    editTransaction,
    deleteTransaction,
    resetForm,
    clearAllData,
    isLoading,
  };
};