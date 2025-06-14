import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Transaction = {
  id: string | null;
  description: string;
  amount: string;
  type: string;
  category: string;
  date: string;
};

const FinanceManagerApp = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction>({
    id: null,
    description: '',
    amount: '',
    type: 'expense',
    category: 'other',
    date: new Date().toISOString().split('T')[0],
  });
  const [budgetInput, setBudgetInput] = useState('');

  const categories = [
    { key: 'food', label: 'Food & Dining', icon: 'restaurant' },
    { key: 'transport', label: 'Transportation', icon: 'car' },
    { key: 'shopping', label: 'Shopping', icon: 'bag' },
    { key: 'entertainment', label: 'Entertainment', icon: 'game-controller' },
    { key: 'bills', label: 'Bills & Utilities', icon: 'receipt' },
    { key: 'health', label: 'Healthcare', icon: 'medical' },
    { key: 'income', label: 'Income', icon: 'cash' },
    { key: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
  ];

  // Color schemes
  const colors = {
    light: {
      primary: '#64748b', // Primary color for light mode
      background: '#f5f5f5', // background color for light mode
      cardBackground: '#ffffff', // Card background color for light mode
      text: '#333333',
      textSecondary: '#666666',
      textTertiary: '#999999',
      border: '#e0e0e0',
      inputBackground: '#fafafa',
      incomeColor: '#4CAF50', // Green for income
      expenseColor: '#f44336', // Red for expenses
      success: '#4CAF50',
      error: '#f44336',
      warning: '#ff9800',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    dark: {
      primary: '#6b7280', // Primary color for dark mode
      background: '#121212', // Background color for dark mode
      cardBackground: '#1e1e1e', // Card background color for dark mode
      text: '#ffffff',
      textSecondary: '#b3b3b3',
      textTertiary: '#808080',
      border: '#333333',
      inputBackground: '#2a2a2a',
      incomeColor: '#4CAF50', // Green for income
      expenseColor: '#f44336', // Red for expenses
      success: '#4CAF50',
      error: '#f44336',
      warning: '#ff9800',
      overlay: 'rgba(0, 0, 0, 0.7)',
    }
  };

  const theme = isDarkMode ? colors.dark : colors.light;

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

  const editTransaction = (transaction: Transaction) => {
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

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.primary,
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
    headerButtons: {
      flexDirection: 'row',
      gap: 10,
    },
    headerButton: {
      padding: 5,
    },
    overviewContainer: {
      backgroundColor: theme.cardBackground,
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
      color: theme.text,
      marginBottom: 16,
    },
    overviewGrid: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 16,
    },
    overviewCard: {
      flex: 1,
      backgroundColor: theme.inputBackground,
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    overviewLabel: {
      fontSize: 14,
      color: theme.textSecondary,
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
      backgroundColor: theme.inputBackground,
      padding: 20,
      borderRadius: 8,
      alignItems: 'center',
    },
    balanceLabel: {
      fontSize: 16,
      color: theme.textSecondary,
      marginBottom: 8,
    },
    balanceAmount: {
      fontSize: 28,
      fontWeight: 'bold',
    },
    budgetContainer: {
      marginTop: 16,
      padding: 16,
      backgroundColor: theme.inputBackground,
      borderRadius: 8,
    },
    budgetLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 4,
    },
    budgetRemaining: {
      fontSize: 14,
      marginBottom: 12,
    },
    budgetBar: {
      height: 8,
      backgroundColor: theme.border,
      borderRadius: 4,
      overflow: 'hidden',
    },
    budgetProgress: {
      height: '100%',
      borderRadius: 4,
    },
    transactionsContainer: {
      backgroundColor: theme.cardBackground,
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
      color: theme.textSecondary,
      marginTop: 16,
    },
    emptyStateSubtext: {
      fontSize: 14,
      color: theme.textTertiary,
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
      borderBottomColor: theme.border,
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
      color: theme.text,
      marginBottom: 4,
    },
    transactionCategory: {
      fontSize: 12,
      color: theme.textSecondary,
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
      backgroundColor: theme.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: theme.cardBackground,
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
      borderBottomColor: theme.border,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.text,
    },
    modalForm: {
      padding: 20,
      maxHeight: 400,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.text,
      marginBottom: 8,
      marginTop: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: theme.inputBackground,
      color: theme.text,
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
      borderColor: theme.border,
      alignItems: 'center',
      backgroundColor: theme.inputBackground,
    },
    typeButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    typeButtonText: {
      fontSize: 16,
      color: theme.textSecondary,
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
      borderColor: theme.border,
      backgroundColor: theme.inputBackground,
      minWidth: '48%',
    },
    categoryButtonActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    categoryButtonText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginLeft: 8,
    },
    categoryButtonTextActive: {
      color: 'white',
      fontWeight: '600',
    },
    saveButton: {
      backgroundColor: theme.primary,
      padding: 16,
      alignItems: 'center',
    },
    saveButtonText: {
      color: 'white',
      fontSize: 18,
      fontWeight: 'bold',
    },
    settingsModalContent: {
      padding: 20,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingLabel: {
      fontSize: 16,
      color: theme.text,
      fontWeight: '500',
    },
    settingDescription: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 4,
    },
    currentBudgetText: {
      fontSize: 14,
      color: theme.textSecondary,
      marginTop: 12,
      textAlign: 'center',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <StatusBar 
        barStyle={isDarkMode ? "light-content" : "light-content"} 
        backgroundColor={theme.primary} 
      />
      
      {/* Header */}
      <View style={dynamicStyles.header}>
        <Text style={dynamicStyles.headerTitle}>Finance Manager</Text>
        <View style={dynamicStyles.headerButtons}>
          <TouchableOpacity 
            style={dynamicStyles.headerButton}
            onPress={() => setSettingsModalVisible(true)}
          >
            <Ionicons name="settings" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={dynamicStyles.headerButton}
            onPress={() => setBudgetModalVisible(true)}
          >
            <Ionicons name="wallet" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Financial Overview */}
        <View style={dynamicStyles.overviewContainer}>
          <Text style={dynamicStyles.sectionTitle}>Financial Overview</Text>
          
          <View style={dynamicStyles.overviewGrid}>
            <View style={dynamicStyles.overviewCard}>
              <Ionicons name="trending-up" size={24} color={theme.incomeColor} />
              <Text style={dynamicStyles.overviewLabel}>Income</Text>
              <Text style={[dynamicStyles.overviewAmount, { color: theme.incomeColor }]}>
                {formatCurrency(income)}
              </Text>
            </View>
            
            <View style={dynamicStyles.overviewCard}>
              <Ionicons name="trending-down" size={24} color={theme.expenseColor} />
              <Text style={dynamicStyles.overviewLabel}>Expenses</Text>
              <Text style={[dynamicStyles.overviewAmount, { color: theme.expenseColor }]}>
                {formatCurrency(expenses)}
              </Text>
            </View>
          </View>

          <View style={dynamicStyles.balanceContainer}>
            <View style={dynamicStyles.balanceCard}>
              <Text style={dynamicStyles.balanceLabel}>Current Balance</Text>
              <Text style={[
                dynamicStyles.balanceAmount, 
                { color: balance >= 0 ? theme.incomeColor : theme.expenseColor }
              ]}>
                {formatCurrency(balance)}
              </Text>
            </View>
          </View>

          {budget > 0 && (
            <View style={dynamicStyles.budgetContainer}>
              <Text style={dynamicStyles.budgetLabel}>
                Budget: {formatCurrency(budget)}
              </Text>
              <Text style={[
                dynamicStyles.budgetRemaining,
                { color: budgetRemaining >= 0 ? theme.incomeColor : theme.expenseColor }
              ]}>
                Remaining: {formatCurrency(budgetRemaining)}
              </Text>
              <View style={dynamicStyles.budgetBar}>
                <View 
                  style={[
                    dynamicStyles.budgetProgress,
                    { 
                      width: `${Math.min((expenses / budget) * 100, 100)}%`,
                      backgroundColor: expenses > budget ? theme.expenseColor : theme.incomeColor
                    }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>

        {/* Recent Transactions */}
        <View style={dynamicStyles.transactionsContainer}>
          <View style={dynamicStyles.transactionsHeader}>
            <Text style={dynamicStyles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity 
              style={dynamicStyles.addButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle" size={28} color={theme.primary} />
            </TouchableOpacity>
          </View>

          {transactions.length === 0 ? (
            <View style={dynamicStyles.emptyState}>
              <Ionicons name="wallet-outline" size={64} color={theme.textTertiary} />
              <Text style={dynamicStyles.emptyStateText}>No transactions yet</Text>
              <Text style={dynamicStyles.emptyStateSubtext}>
                Tap the + button to add your first transaction
              </Text>
            </View>
          ) : (
            transactions.map((transaction) => (
              <View key={transaction.id} style={dynamicStyles.transactionItem}>
                <View style={dynamicStyles.transactionLeft}>
                  <View style={[
                    dynamicStyles.categoryIcon,
                    { backgroundColor: transaction.type === 'income' ? '#e8f5e8' : '#ffebee' }
                  ]}>
                    <Ionicons 
                      name={getCategoryIcon(transaction.category) as React.ComponentProps<typeof Ionicons>['name']} 
                      size={20} 
                      color={transaction.type === 'income' ? theme.incomeColor : theme.expenseColor} 
                    />
                  </View>
                  <View style={dynamicStyles.transactionDetails}>
                    <Text style={dynamicStyles.transactionDescription}>
                      {transaction.description}
                    </Text>
                    <Text style={dynamicStyles.transactionCategory}>
                      {getCategoryLabel(transaction.category)} • {transaction.date}
                    </Text>
                  </View>
                </View>
                
                <View style={dynamicStyles.transactionRight}>
                  <Text style={[
                    dynamicStyles.transactionAmount,
                    { color: transaction.type === 'income' ? theme.incomeColor : theme.expenseColor }
                  ]}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </Text>
                  <View style={dynamicStyles.transactionActions}>
                    <TouchableOpacity 
                      onPress={() => editTransaction(transaction)}
                      style={dynamicStyles.actionButton}
                    >
                      <Ionicons name="pencil" size={16} color={theme.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      onPress={() => deleteTransaction(transaction.id)}
                      style={dynamicStyles.actionButton}
                    >
                      <Ionicons name="trash" size={16} color={theme.expenseColor} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Settings Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={settingsModalVisible}
        onRequestClose={() => setSettingsModalVisible(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Settings</Text>
              <TouchableOpacity onPress={() => setSettingsModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={dynamicStyles.settingsModalContent}>
              <View style={dynamicStyles.settingItem}>
                <View>
                  <Text style={dynamicStyles.settingLabel}>Dark Mode</Text>
                  <Text style={dynamicStyles.settingDescription}>
                    Switch between light and dark themes
                  </Text>
                </View>
                <Switch 
                  value={isDarkMode}
                  onValueChange={setIsDarkMode}
                  trackColor={{ false: theme.border, true: theme.primary }}
                  thumbColor={isDarkMode ? 'white' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

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
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>
                {currentTransaction.id ? 'Edit Transaction' : 'Add Transaction'}
              </Text>
              <TouchableOpacity 
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}
              >
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={dynamicStyles.modalForm}>
              <Text style={dynamicStyles.inputLabel}>Description</Text>
              <TextInput
                style={dynamicStyles.input}
                value={currentTransaction.description}
                onChangeText={(text) => 
                  setCurrentTransaction(prev => ({ ...prev, description: text }))
                }
                placeholder="Enter description"
                placeholderTextColor={theme.textTertiary}
              />

              <Text style={dynamicStyles.inputLabel}>Amount</Text>
              <TextInput
                style={dynamicStyles.input}
                value={currentTransaction.amount}
                onChangeText={(text) => 
                  setCurrentTransaction(prev => ({ ...prev, amount: text }))
                }
                placeholder="0.00"
                placeholderTextColor={theme.textTertiary}
                keyboardType="numeric"
              />

              <Text style={dynamicStyles.inputLabel}>Type</Text>
              <View style={dynamicStyles.typeContainer}>
                <TouchableOpacity
                  style={[
                    dynamicStyles.typeButton,
                    currentTransaction.type === 'expense' && dynamicStyles.typeButtonActive
                  ]}
                  onPress={() => 
                    setCurrentTransaction(prev => ({ ...prev, type: 'expense' }))
                  }
                >
                  <Text style={[
                    dynamicStyles.typeButtonText,
                    currentTransaction.type === 'expense' && dynamicStyles.typeButtonTextActive
                  ]}>Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    dynamicStyles.typeButton,
                    currentTransaction.type === 'income' && dynamicStyles.typeButtonActive
                  ]}
                  onPress={() => 
                    setCurrentTransaction(prev => ({ ...prev, type: 'income' }))
                  }
                >
                  <Text style={[
                    dynamicStyles.typeButtonText,
                    currentTransaction.type === 'income' && dynamicStyles.typeButtonTextActive
                  ]}>Income</Text>
                </TouchableOpacity>
              </View>

              <Text style={dynamicStyles.inputLabel}>Category</Text>
              <View style={dynamicStyles.categoryContainer}>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.key}
                    style={[
                      dynamicStyles.categoryButton,
                      currentTransaction.category === category.key && dynamicStyles.categoryButtonActive
                    ]}
                    onPress={() => 
                      setCurrentTransaction(prev => ({ ...prev, category: category.key }))
                    }
                  >
                    <Ionicons 
                      name={category.icon as any} 
                      size={20} 
                      color={currentTransaction.category === category.key ? 'white' : theme.textSecondary} 
                    />
                    <Text style={[
                      dynamicStyles.categoryButtonText,
                      currentTransaction.category === category.key && dynamicStyles.categoryButtonTextActive
                    ]}>
                      {category.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={dynamicStyles.inputLabel}>Date</Text>
              <TextInput
                style={dynamicStyles.input}
                value={currentTransaction.date}
                onChangeText={(text) => 
                  setCurrentTransaction(prev => ({ ...prev, date: text }))
                }
                placeholder="YYYY-MM-DD"
                placeholderTextColor={theme.textTertiary}
              />
            </ScrollView>

            <TouchableOpacity 
              style={dynamicStyles.saveButton}
              onPress={addOrUpdateTransaction}
            >
              <Text style={dynamicStyles.saveButtonText}>
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
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Set Monthly Budget</Text>
              <TouchableOpacity onPress={() => setBudgetModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={dynamicStyles.settingsModalContent}>
              <Text style={dynamicStyles.inputLabel}>Monthly Budget Amount</Text>
              <TextInput
                style={dynamicStyles.input}
                value={budgetInput}
                onChangeText={setBudgetInput}
                placeholder="Enter budget amount"
                placeholderTextColor={theme.textTertiary}
                keyboardType="numeric"
              />
              
              {budget > 0 && (
                <Text style={dynamicStyles.currentBudgetText}>
                  Current Budget: {formatCurrency(budget)}
                </Text>
              )}
            </View>

            <TouchableOpacity style={dynamicStyles.saveButton} onPress={setBudgetAmount}>
              <Text style={dynamicStyles.saveButtonText}>Set Budget</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default FinanceManagerApp;