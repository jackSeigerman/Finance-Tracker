import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import { formatCurrency } from '../utils/format';

interface Transaction {
  id: string;
  description: string;
  amount: string;
  type: 'income' | 'expense';
  category: string;
  date: string;
}

interface TransactionsListProps {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  food: 'restaurant',
  transport: 'car',
  shopping: 'bag',
  entertainment: 'game-controller',
  bills: 'receipt',
  health: 'medical',
  income: 'cash',
  other: 'ellipsis-horizontal',
};

const categoryLabels: Record<string, string> = {
  food: 'Food & Dining',
  transport: 'Transportation',
  shopping: 'Shopping',
  entertainment: 'Entertainment',
  bills: 'Bills & Utilities',
  health: 'Healthcare',
  income: 'Income',
  other: 'Other',
};

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions, onEdit, onDelete, onAdd }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Recent Transactions</Text>
        <TouchableOpacity onPress={onAdd}>
          <Ionicons name="add-circle" size={28} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="wallet-outline" size={64} color={theme.textTertiary} />
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No transactions yet</Text>
          <Text style={[styles.subText, { color: theme.textTertiary }]}>Tap the + button to add your first transaction</Text>
        </View>
      ) : (
        transactions.map(transaction => (
          <View key={transaction.id} style={[styles.item, { borderBottomColor: theme.border }]}>            
            <View style={styles.left}>
              <View
                style={[styles.icon, {
                  backgroundColor: transaction.type === 'income' ? '#e8f5e8' : '#ffebee',
                }]}
              >
                <Ionicons
                  name={categoryIcons[transaction.category] || 'ellipsis-horizontal'}
                  size={20}
                  color={transaction.type === 'income' ? theme.incomeColor : theme.expenseColor}
                />
              </View>
              <View style={styles.details}>
                <Text style={[styles.description, { color: theme.text }]}>{transaction.description}</Text>
                <Text style={[styles.category, { color: theme.textSecondary }]}>                  
                  {categoryLabels[transaction.category] || 'Other'} • {transaction.date}
                </Text>
              </View>
            </View>

            <View style={styles.right}>
              <Text
                style={[styles.amount, {
                  color: transaction.type === 'income' ? theme.incomeColor : theme.expenseColor,
                }]}
              >
                {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => onEdit(transaction)}>
                  <Ionicons name="pencil" size={16} color={theme.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onDelete(transaction.id)}>
                  <Ionicons name="trash" size={16} color={theme.expenseColor} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  subText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  category: {
    fontSize: 12,
  },
  right: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default TransactionsList;
