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

  useEffect(() => {
    if (isLoading) return;
    console.log('[Recurring Debug] Running processRecurring for date:', currentDate);
    
    const processRecurring = () => {
      const today = currentDate;
      
      // Identify recurring transactions that need processing
      const recurringTransactions = transactions.filter(t => 
        t.isRecurring && 
        t.nextOccurrence && 
        (!t.recurrenceEndDate || isBefore(parseISO(t.nextOccurrence), parseISO(t.recurrenceEndDate) || new Date('9999-12-31')))
      );
      
      if (recurringTransactions.length === 0) {
        console.log('[Recurring Debug] No recurring transactions to process.');
        return;
      }
      
      // Create lookup map for faster duplicate checking
      const existingTransactionMap = new Map();
      
      // Create unique key for each transaction to check for duplicates
      transactions.forEach(tx => {
        if (tx.isRecurring && tx.recurrence === undefined) {
          const key = `${tx.date}|${tx.description}|${tx.amount}|${tx.type}|${tx.category}`;
          existingTransactionMap.set(key, true);
        }
      });
      
      // Process recurring transactions
      const newTransactions = [];
      const updatedTemplates = new Map();
      
      recurringTransactions.forEach(template => {
        console.log('[Recurring Debug] Checking transaction:', template.description, template);
        let next = template.nextOccurrence;
        let nextOccurrence = next;
        
        // Process all occurrences up to today
        while (next && next <= today) {
          // Check if this occurrence already exists using the map lookup
          const key = `${next}|${template.description}|${template.amount}|${template.type}|${template.category}`;
          
          if (!existingTransactionMap.has(key)) {
            console.log('[Recurring Debug] Generating new transaction for', template.description, 'on', next);
            const newTransaction = {
              ...template,
              id: crypto.randomUUID(),
              date: next,
              isRecurring: true,
              recurrence: undefined,
              recurrenceEndDate: undefined,
              nextOccurrence: undefined,
            };
            
            newTransactions.push(newTransaction);
            // Add to map to prevent duplicates if multiple occurrences on same day
            existingTransactionMap.set(key, true);
          }
          
          // Calculate next occurrence date
          let nextDate = parseISO(next);
          switch (template.recurrence) {
            case 'daily': nextDate = addDays(nextDate, 1); break;
            case 'weekly': nextDate = addWeeks(nextDate, 1); break;
            case 'monthly': nextDate = addMonths(nextDate, 1); break;
            case 'yearly': nextDate = addYears(nextDate, 1); break;
            default: break;
          }
          
          next = nextDate ? format(nextDate, 'yyyy-MM-dd') : '';
          nextOccurrence = next;
        }
        
        // Only update templates that changed
        if (template.nextOccurrence !== nextOccurrence) {
          updatedTemplates.set(template.id, { ...template, nextOccurrence });
        }
      });
      
      // Update state only if changes were made
      if (newTransactions.length > 0 || updatedTemplates.size > 0) {
        console.log('[Recurring Debug] Generated', newTransactions.length, 'new transactions');
        
        // Create updated transaction list
        const updatedTransactions = transactions.map(t => {
          // Replace recurring templates with updated versions
          return updatedTemplates.has(t.id) ? updatedTemplates.get(t.id) : t;
        });
        
        // Add new transactions
        setTransactions([...newTransactions, ...updatedTransactions]);
        console.log('[Recurring Debug] setTransactions with new transactions');
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