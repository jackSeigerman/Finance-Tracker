import { useState, useEffect } from 'react';
import { Transaction } from '@/utils/Transaction';
import { storageManager } from '../utils/storage';
import { addDays, addWeeks, addMonths, addYears, isBefore, parseISO, format } from 'date-fns';

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

  const [currentDate, setCurrentDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  // Debug: allow manual override of current date
  // const [debugDate, setDebugDate] = useState<string | null>(null); // Hide debug

  useEffect(() => {
    // Always use the real date
    const interval = setInterval(() => {
      const now = format(new Date(), 'yyyy-MM-dd');
      setCurrentDate(prev => {
        if (prev !== now) return now;
        return prev;
      });
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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

  // Recurring transaction logic (run on date change as well)
  useEffect(() => {
    if (isLoading) return;
    console.log('[Recurring Debug] Running processRecurring for date:', currentDate);
    const processRecurring = async () => {
      let updated = false;
      let updatedTransactions = [...transactions];
      const today = currentDate; // Use simulated date for all logic
      for (const t of transactions) {
        if (t.isRecurring && t.nextOccurrence && (!t.recurrenceEndDate || isBefore(parseISO(t.nextOccurrence), parseISO(t.recurrenceEndDate) || new Date('9999-12-31')))) {
          let next = t.nextOccurrence;
          console.log('[Recurring Debug] Checking transaction:', t.description, t);
          while (next && next <= today) {
            console.log('[Recurring Debug] Generating new transaction for', t.description, 'on', next);
            // Generate a new transaction for this occurrence
            const newTx = {
              ...t,
              id: Date.now() + Math.floor(Math.random() * 10000),
              date: next,
              isRecurring: true, // ensure recurring icon is always shown
              recurrence: undefined,
              recurrenceEndDate: undefined,
              nextOccurrence: undefined,
            };
            updatedTransactions = [newTx, ...updatedTransactions];
            // Calculate next occurrence
            let nextDate = parseISO(next);
            switch (t.recurrence) {
              case 'daily':
                nextDate = addDays(nextDate, 1);
                break;
              case 'weekly':
                nextDate = addWeeks(nextDate, 1);
                break;
              case 'monthly':
                nextDate = addMonths(nextDate, 1);
                break;
              case 'yearly':
                nextDate = addYears(nextDate, 1);
                break;
              default:
                break;
            }
            next = nextDate ? format(nextDate, 'yyyy-MM-dd') : '';
            // Update the recurring transaction's nextOccurrence
            t.nextOccurrence = next;
            updated = true;
          }
        }
      }
      if (updated) {
        console.log('[Recurring Debug] setTransactions with new transactions:', updatedTransactions);
        setTransactions(updatedTransactions);
      } else {
        console.log('[Recurring Debug] No new recurring transactions generated.');
      }
    };
    processRecurring();
    // eslint-disable-next-line
  }, [isLoading, currentDate]);

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
    // Debug feature (hidden)
    // setDebugDate,
    // debugDate,
    // currentDate,
  };
};