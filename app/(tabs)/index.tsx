import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const FinanceManagerApp = () => {
  const [transactions, setTransactions] = useState<{ 
    id: string | null; 
    description: string; 
    amount: string; 
    type: string; 
    category: string; 
    date: string; 
  }[]>([]);
  const [budget, setBudget] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<{
      id: string | null;
      description: string;
      amount: string;
      type: string;
      category: string;
      date: string;
  }>({
      id: null,
      description: '',
      amount: '',
      type: 'expense',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
  });
  const [budgetInput, setBudgetInput] = useState('');

  const categories: { key: string; label: string; icon: React.ComponentProps<typeof Ionicons>['name'] }[] = [
    { key: 'food', label: 'Food & Dining', icon: 'restaurant' },
    { key: 'transport', label: 'Transportation', icon: 'car' },
    { key: 'shopping', label: 'Shopping', icon: 'bag' },
    { key: 'entertainment', label: 'Entertainment', icon: 'game-controller' },
    { key: 'bills', label: 'Bills & Utilities', icon: 'receipt' },
    { key: 'health', label: 'Healthcare', icon: 'medical' },
    { key: 'income', label: 'Income', icon: 'cash' },
    { key: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ];

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat ? cat.icon : 'ellipsis-horizontal';
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat ? cat.label : 'Other';
  };

  const calculateTotals = () => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    
    const balance = income - expenses;
    const budgetRemaining = budget - expenses;
    
    return { income, expenses, balance, budgetRemaining };
  };

  const addOrUpdateTransaction = () => {
    if (!currentTransaction.description || !currentTransaction.amount) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const amount = parseFloat(currentTransaction.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (currentTransaction.id) {
      // Update existing transaction
      setTransactions(prev => 
        prev.map(t => 
          t.id === currentTransaction.id 
            ? { ...currentTransaction, amount: amount.toString() }
            : t
        )
      );
    } else {
      // Add new transaction
      const newTransaction = {
        ...currentTransaction,
        id: Date.now().toString(),
        amount: amount.toString(),
      };
      setTransactions(prev => [newTransaction, ...prev]);
    }

    setModalVisible(false);
    resetForm();
  };

  const editTransaction = (transaction: { id: string | null; description: string; amount: string; type: string; category: string; date: string; }) => {
      setCurrentTransaction(transaction);
      setModalVisible(true);
  };

  const deleteTransaction = (id: string | null) => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setTransactions(prev => prev.filter(t => t.id !== id))
        },
      ]
    );
  };

  const resetForm = () => {
    setCurrentTransaction({
      id: null,
      description: '',
      amount: '',
      type: 'expense',
      category: 'other',
      date: new Date().toISOString().split('T')[0],
    });
  };

  const setBudgetAmount = () => {
    const amount = parseFloat(budgetInput);
    if (isNaN(amount) || amount < 0) {
      Alert.alert('Error', 'Please enter a valid budget amount');
      return;
    }
    setBudget(amount);
    setBudgetModalVisible(false);
    setBudgetInput('');
  };

  const { income, expenses, balance, budgetRemaining } = calculateTotals();

  const formatCurrency = (amount: string | number) => {
    return `$${parseFloat(amount.toString()).toFixed(2)}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2E7D32" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Manager</Text>
        <TouchableOpacity 
          style={styles.budgetButton}
          onPress={() => setBudgetModalVisible(true)}
        >
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Financial Overview */}
        <View style={styles.overviewContainer}>
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          
          <View style={styles.overviewGrid}>
            <View style={[styles.overviewCard, styles.incomeCard]}>
              <Ionicons name="trending-up" size={24} color="#4CAF50" />
              <Text style={styles.overviewLabel}>Income</Text>
              <Text style={[styles.overviewAmount, { color: '#4CAF50' }]}>
                {formatCurrency(income)}
              </Text>
            </View>
            
            <View style={[styles.overviewCard, styles.expenseCard]}>
              <Ionicons name="trending-down" size={24} color="#f44336" />
              <Text style={styles.overviewLabel}>Expenses</Text>
              <Text style={[styles.overviewAmount, { color: '#f44336' }]}>
                {formatCurrency(expenses)}
              </Text>
            </View>
          </View>

          <View style={styles.balanceContainer}>
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={[
                styles.balanceAmount, 
                { color: balance >= 0 ? '#4CAF50' : '#f44336' }
              ]}>
                {formatCurrency(balance)}
              </Text>
            </View>
          </View>

          {budget > 0 && (
            <View style={styles.budgetContainer}>
              <Text style={styles.budgetLabel}>
                Budget: {formatCurrency(budget)}
              </Text>
              <Text style={[
                styles.budgetRemaining,
                { color: budgetRemaining >= 0 ? '#4CAF50' : '#f44336' }
              ]}>
                Remaining: {formatCurrency(budgetRemaining)}
              </Text>
              <View style={styles.budgetBar}>
                <View 
                  style={[
                    styles.budgetProgress,
                    { 
                      width: `${Math.min((expenses / budget) * 100, 100)}%`,
                      backgroundColor: expenses > budget ? '#f44336' : '#4CAF50'
                    }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={28} color="#2E7D32" />
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="wallet-outline" size={64} color="#ccc" />
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Tap the + button to add your first transaction
              </Text>
            </View>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.categoryIcon,
                    { backgroundColor: transaction.type === 'income' ? '#e8f5e8' : '#ffebee' }
                  ]}>
                    <Ionicons 
                      name={getCategoryIcon(transaction.category)} 
                      size={20} 
                      color={transaction.type === 'income' ? '#4CAF50' : '#f44336'} 
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={styles.transactionCategory}>
                      {getCategoryLabel(transaction.category)} • {transaction.date}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.transactionRight}>
                  <Text style={[
                    styles.transactionAmount,
                    { color: transaction.type === 'income' ? '#4CAF50' : '#f44336' }
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                  <View style={styles.transactionActions}>
                    <TouchableOpacity 
                      onPress={() => editTransaction(transaction)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="pencil" size={16} color="#666" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => deleteTransaction(transaction.id)}
                      style={styles.actionButton}
                    >
                      <Ionicons name="trash" size={16} color="#f44336" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Transaction Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {currentTransaction.id ? 'Edit Transaction' : 'Add Transaction'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.input}
                value={currentTransaction.description}
                onChangeText={(text) => 
                  setCurrentTransaction(prev => ({ ...prev, description: text }))
                }
                placeholder="Enter description"
              />

              <Text style={styles.inputLabel}>Amount</Text>
              <TextInput
                style={styles.input}
                value={currentTransaction.amount}
                onChangeText={(text) => 
                  setCurrentTransaction(prev => ({ ...prev, amount: text }))
                }
                placeholder="0.00"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Type</Text>
              <View style={styles.typeContainer}>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    currentTransaction.type === 'expense' && styles.typeButtonActive
                  ]}
                  onPress={() => 
                    setCurrentTransaction(prev => ({ ...prev, type: 'expense' }))
                  }
                >
                  <Text style={[
                    styles.typeButtonText,
                    currentTransaction.type === 'expense' && styles.typeButtonTextActive
                  ]}>Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.typeButton,
                    currentTransaction.type === 'income' && styles.typeButtonActive
                  ]}
                  onPress={() => 
                    setCurrentTransaction(prev => ({ ...prev, type: 'income' }))
                  }
                >
                  <Text style={[
                    styles.typeButtonText,
                    currentTransaction.type === 'income' && styles.typeButtonTextActive
                  ]}>Income</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      styles.categoryButton,
                      currentTransaction.category === category.key && styles.categoryButtonActive
                    ]}
                    onPress={() => 
                      setCurrentTransaction(prev => ({ ...prev, category: category.key }))
                    }
                  >
                    <Ionicons 
                      name={category.icon} 
                      size={20} 
                      color={currentTransaction.category === category.key ? 'white' : '#666'} 
                    />
                    <Text style={[
                      styles.categoryButtonText,
                      currentTransaction.category === category.key && styles.categoryButtonTextActive
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={currentTransaction.date}
                onChangeText={(text) => 
                  setCurrentTransaction(prev => ({ ...prev, date: text }))
                }
                placeholder="YYYY-MM-DD"
              />
            </ScrollView>

            <TouchableOpacity 
              style={styles.saveButton}
              onPress={addOrUpdateTransaction}
            >
              <Text style={styles.saveButtonText}>
                {currentTransaction.id ? 'Update Transaction' : 'Add Transaction'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Budget Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={budgetModalVisible}
        onRequestClose={() => setBudgetModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Set Monthly Budget</Text>
              <TouchableOpacity onPress={() => setBudgetModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <View style={styles.budgetModalContent}>
              <Text style={styles.inputLabel}>Monthly Budget Amount</Text>
              <TextInput
                style={styles.input}
                value={budgetInput}
                onChangeText={setBudgetInput}
                placeholder="Enter budget amount"
                keyboardType="numeric"
              />
              
              {budget > 0 && (
                <Text style={styles.currentBudgetText}>
                  Current Budget: {formatCurrency(budget)}
                </Text>
              )}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={setBudgetAmount}>
              <Text style={styles.saveButtonText}>Set Budget</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  incomeCard: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  expenseCard: {
    borderColor: '#f44336',
    borderWidth: 1,
  },
  header: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  budgetButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  overviewContainer: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  overviewGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    marginBottom: 4,
  },
  overviewAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceContainer: {
    marginTop: 8,
  },
  balanceCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  budgetContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  budgetLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  budgetRemaining: {
    fontSize: 14,
    marginBottom: 12,
  },
  budgetBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  budgetProgress: {
    height: '100%',
    borderRadius: 4,
  },
  transactionsContainer: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  addButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  transactionCategory: {
    fontSize: 12,
    color: '#666',
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  transactionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  modalForm: {
    padding: 20,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  typeButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  typeButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    minWidth: '48%',
  },
  categoryButtonActive: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  categoryButtonTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  budgetModalContent: {
    padding: 20,
  },
  currentBudgetText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
});

export default FinanceManagerApp;