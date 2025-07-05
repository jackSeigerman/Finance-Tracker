import React from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import { Transaction, formatCents } from '@/utils/Transaction';

interface TransactionModalProps {
  visible: boolean;
  onClose: () => void;
  currentTransaction: Transaction;
  setCurrentTransaction: (tx: Transaction) => void;
  onSave: () => void;
}

const categories = [
  { key: 'food', label: 'Food & Dining', icon: 'restaurant' },
  { key: 'transport', label: 'Transportation', icon: 'car' },
  { key: 'shopping', label: 'Shopping', icon: 'bag' },
  { key: 'entertainment', label: 'Entertainment', icon: 'game-controller' },
  { key: 'bills', label: 'Bills & Utilities', icon: 'receipt' },
  { key: 'health', label: 'Healthcare', icon: 'medical' },
  // Removed 'income' from categories
  { key: 'other', label: 'Other', icon: 'ellipsis-horizontal' },
];

const TransactionModal: React.FC<TransactionModalProps> = ({
  visible,
  onClose,
  currentTransaction,
  setCurrentTransaction,
  onSave,
}) => {
  const { theme } = useTheme();

  // Local state for amount input as string, display from cents
  const [amountInput, setAmountInput] = React.useState('');

  // When modal opens or transaction changes externally, set amountInput from cents
  React.useEffect(() => {
    setAmountInput(
      currentTransaction.amountCents === 0 || currentTransaction.amountCents === undefined
        ? ''
        : (currentTransaction.amountCents / 100).toString()
    );
  }, [visible, currentTransaction.id]);

  // If type is 'income', always set category to 'income'
  React.useEffect(() => {
    if (currentTransaction.type === 'income' && currentTransaction.category !== 'income') {
      setCurrentTransaction({ ...currentTransaction, category: 'income' });
    }
    // If type is 'expense' and category was 'income', reset to 'other'
    if (currentTransaction.type === 'expense' && currentTransaction.category === 'income') {
      setCurrentTransaction({ ...currentTransaction, category: 'other' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTransaction.type]);

  return (
   <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>        
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>          
          <View style={[styles.header, { borderBottomColor: theme.border }]}>            
            <Text style={[styles.title, { color: theme.text }]}>              
              {currentTransaction.id ? 'Edit Transaction' : 'Add Transaction'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <Text style={[styles.label, { color: theme.text }]}>Description</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
              value={currentTransaction.description}
              onChangeText={text => setCurrentTransaction({ ...currentTransaction, description: text })}
              placeholder="Enter description"
              placeholderTextColor={theme.textTertiary}
            />

            <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
              value={amountInput}
              onChangeText={text => {
                // Allow empty string, numbers, and decimal points
                if (/^\d*\.?\d{0,2}$/.test(text)) {
                  setAmountInput(text);
                  // Only update amountCents if valid number
                  if (text === '' || text === '.') {
                    setCurrentTransaction({
                      ...currentTransaction,
                      amountCents: 0,
                    });
                  } else {
                    const floatVal = parseFloat(text.replace(',', '.'));
                    if (!isNaN(floatVal)) {
                      setCurrentTransaction({
                        ...currentTransaction,
                        amountCents: Math.round(floatVal * 100),
                      });
                    }
                  }
                }
              }}
              placeholder="0.00"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numeric"
              inputMode="decimal"
            />

            <Text style={[styles.label, { color: theme.text }]}>Type</Text>
            <View style={styles.typeContainer}>
              {['expense', 'income'].map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    currentTransaction.type === type && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => setCurrentTransaction({ ...currentTransaction, type: type as 'income' | 'expense' })}
                >
                  <Text
                    style={{
                      color: currentTransaction.type === type ? 'white' : theme.textSecondary,
                      fontWeight: currentTransaction.type === type ? '600' : '400',
                    }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Only show Category if type is 'expense' */}
            {currentTransaction.type === 'expense' && (
              <>
                <Text style={[styles.label, { color: theme.text }]}>Category</Text>
                <View style={styles.categoryContainer}>
                  {categories.map(cat => (
                    <TouchableOpacity
                      key={cat.key}
                      style={[
                        styles.categoryButton,
                        currentTransaction.category === cat.key && { backgroundColor: theme.primary, borderColor: theme.primary },
                      ]}
                      onPress={() => setCurrentTransaction({ ...currentTransaction, category: cat.key })}
                    >
                      <Ionicons
                        name={cat.icon as any}
                        size={20}
                        color={currentTransaction.category === cat.key ? 'white' : theme.textSecondary}
                      />
                      <Text
                        style={{
                          color: currentTransaction.category === cat.key ? 'white' : theme.textSecondary,
                          fontWeight: currentTransaction.category === cat.key ? '600' : '400',
                          marginLeft: 8,
                        }}
                      >
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <Text style={[styles.label, { color: theme.text }]}>Date</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.border }]}
              value={currentTransaction.date}
              onChangeText={text => setCurrentTransaction({ ...currentTransaction, date: text })}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.textTertiary}
            />
          </ScrollView>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={onSave}>
            <Text style={styles.saveText}>{currentTransaction.id ? 'Update' : 'Add'} Transaction</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxHeight: '90%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
    maxHeight: 400,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-start',
    paddingHorizontal: 0, // add if you want edge spacing, e.g. 4 or 8
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    minWidth: '48%',
    flexBasis: '48%',
    flexGrow: 1,
    marginBottom: 8, // add vertical spacing between rows
  },
  saveButton: {
    padding: 16,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TransactionModal;
