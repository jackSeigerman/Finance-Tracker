import React from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet } from 'react-native';
import Header from "./Header";
import Overview from './Overview';
import TransactionsList from './TransactionsList';
import TransactionModal from './TransactionModal';
import BudgetModal from './BudgetModal';
import SettingsModal from './SettingsModal';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../styles/theme';

const FinanceManager = () => {
  const { theme, isLoading: themeLoading, currency, currencyAfter } = useTheme();
  const {
    transactions,
    budget,
    modalVisible,
    setModalVisible,
    budgetModalVisible,
    setBudgetModalVisible,
    settingsModalVisible,
    setSettingsModalVisible,
    isLoading: dataLoading,
    ...transactionHandlers
  } = useTransactions();

  // Show loading indicator while data is being loaded
  if (themeLoading || dataLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <>
      <Header
        onOpenSettings={() => setSettingsModalVisible(true)}
        onOpenBudget={() => setBudgetModalVisible(true)}
      />

      <ScrollView>
        <Overview transactions={transactions} budget={budget} />
        <TransactionsList
          transactions={transactions}
          onEdit={transactionHandlers.editTransaction}
          onDelete={transactionHandlers.deleteTransaction}
          onAdd={() => setModalVisible(true)}
          currency={currency}
          currencyAfter={currencyAfter}
        />
      </ScrollView>

      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        {...transactionHandlers}
        onSave={transactionHandlers.addOrUpdateTransaction}
        currency={currency}
        currencyAfter={currencyAfter}
      />

      <BudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        setBudget={transactionHandlers.setBudget}
        currentBudget={budget}
      />

      <SettingsModal
        visible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
        onClearData={transactionHandlers.clearAllData}
      />
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FinanceManager;