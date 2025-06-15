import { useState } from 'react';
import { useTheme } from '../styles/theme';
import { Transaction } from '@/utils/Transaction';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [currentTransaction, setCurrentTransaction] = useState<Transaction>({
    id: 0,
    description: '',
    amount: 0,
    type: 'expense',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
  });

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
    if (isNaN(amount) || amount <= 0) {
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

  const theme = isDarkMode ? useTheme().colors.dark : useTheme().colors.light;

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
    isDarkMode,
    setIsDarkMode,
    currentTransaction,
    setCurrentTransaction,
    addOrUpdateTransaction,
    editTransaction,
    deleteTransaction,
    resetForm,
    theme,
  };
};
