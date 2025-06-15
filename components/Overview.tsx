import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/format';
import { useTheme } from '../styles/theme';

interface Transaction {
  type: 'income' | 'expense';
  amount: string;
}

interface OverviewProps {
  transactions: Transaction[];
  budget: number;
  theme?: ReturnType<typeof useTheme>["theme"];
}

const Overview: React.FC<OverviewProps> = ({ transactions, budget }) => {
  const { theme } = useTheme();

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = income - expenses;
  const budgetRemaining = budget - expenses;

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>      
      <Text style={[styles.title, { color: theme.text }]}>Financial Overview</Text>

      <View style={styles.grid}>
        <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>          
          <Ionicons name="trending-up" size={24} color={theme.incomeColor} />
          <Text style={[styles.label, { color: theme.textSecondary }]}>Income</Text>
          <Text style={[styles.amount, { color: theme.incomeColor }]}>{formatCurrency(income)}</Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.inputBackground }]}>          
          <Ionicons name="trending-down" size={24} color={theme.expenseColor} />
          <Text style={[styles.label, { color: theme.textSecondary }]}>Expenses</Text>
          <Text style={[styles.amount, { color: theme.expenseColor }]}>{formatCurrency(expenses)}</Text>
        </View>
      </View>

      <View style={[styles.balanceCard, { backgroundColor: theme.inputBackground }]}>        
        <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Current Balance</Text>
        <Text
          style={[styles.balanceAmount, {
            color: balance >= 0 ? theme.incomeColor : theme.expenseColor,
          }]}
        >
          {formatCurrency(balance)}
        </Text>
      </View>

      {budget > 0 && (
        <View style={[styles.budgetContainer, { backgroundColor: theme.inputBackground }]}>          
          <Text style={[styles.budgetLabel, { color: theme.text }]}>Budget: {formatCurrency(budget)}</Text>
          <Text
            style={{
              color: budgetRemaining >= 0 ? theme.incomeColor : theme.expenseColor,
              marginBottom: 12,
            }}
          >
            Remaining: {formatCurrency(budgetRemaining)}
          </Text>
          <View style={[styles.budgetBar, { backgroundColor: theme.border }]}>            
            <View
              style={{
                height: '100%',
                width: `${Math.min((expenses / budget) * 100, 100)}%`,
                backgroundColor: expenses > budget ? theme.expenseColor : theme.incomeColor,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceCard: {
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  budgetContainer: {
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
  },
  budgetLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  budgetBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
});

export default Overview;
