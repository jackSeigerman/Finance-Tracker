import React from 'react';
import { ScrollView, View, ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import Header from "./Header";
import Overview from './Overview';
import TransactionsList from './TransactionsList';
import TransactionModal from './TransactionModal';
import BudgetModal from './BudgetModal';
import SettingsModal from './SettingsModal';
import { useTransactions } from '../hooks/useTransactions';
import { useTheme } from '../styles/theme';

const FinanceManager = () => {
  const { theme, isLoading: themeLoading } = useTheme();
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
    setDebugDate,
    debugDate,
    currentDate,
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

  // Debug panel for date override (only in development)
  const isDev = __DEV__ || process.env.NODE_ENV === 'development';

  return (
    <>
      {isDev && (
        <View style={{ padding: 12, backgroundColor: theme.cardBackground, borderBottomWidth: 1, borderColor: theme.border }}>
          <Text style={{ color: theme.text, fontWeight: 'bold', marginBottom: 4 }}>Debug: Set Current Date</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: theme.border,
                borderRadius: 6,
                padding: 8,
                color: theme.text,
                backgroundColor: theme.inputBackground,
                minWidth: 120,
                marginRight: 8,
              }}
              value={debugDate || currentDate}
              onChangeText={setDebugDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textTertiary}
            />
            <TouchableOpacity
              onPress={() => setDebugDate(null)}
              style={{ marginLeft: 8, padding: 8, backgroundColor: theme.primary, borderRadius: 6 }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Reset</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ color: theme.textSecondary, marginTop: 4 }}>Current simulated date: {currentDate}</Text>
        </View>
      )}

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
        />
      </ScrollView>

      <TransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        {...transactionHandlers}
        onSave={transactionHandlers.addOrUpdateTransaction}
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