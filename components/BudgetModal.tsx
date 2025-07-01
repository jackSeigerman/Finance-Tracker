import React, { useState } from 'react';
import {
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import { formatCurrency } from '../utils/format';

interface BudgetModalProps {
  visible: boolean;
  onClose: () => void;
  setBudget: (value: number) => void;
  currentBudget: number;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ visible, onClose, setBudget, currentBudget }) => {
  const { theme } = useTheme();
  const [budgetInput, setBudgetInput] = useState('');

  const handleSetBudget = () => {
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount >= 0) {
      setBudget(amount);
      onClose();
      setBudgetInput('');
    } else {
      alert('Please enter a valid budget amount');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>        
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>          
          <View style={[styles.header, { borderBottomColor: theme.border }]}>            
            <Text style={[styles.title, { color: theme.text }]}>Set Monthly Budget</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={[styles.label, { color: theme.text }]}>Monthly Budget Amount</Text>
            <TextInput
              style={[styles.input, {
                backgroundColor: theme.inputBackground,
                color: theme.text,
                borderColor: theme.border,
              }]}
              value={budgetInput}
              onChangeText={setBudgetInput}
              placeholder="Enter budget amount"
              placeholderTextColor={theme.textTertiary}
              keyboardType="numeric"
            />
            {currentBudget > 0 && (
              <Text style={[styles.currentBudget, { color: theme.textSecondary }]}>                
                Current Budget: {formatCurrency(currentBudget)}
              </Text>
            )}
          </View>

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.primary }]} onPress={handleSetBudget}>
            <Text style={styles.saveText}>Set Budget</Text>
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
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  currentBudget: {
    fontSize: 14,
    marginTop: 12,
    textAlign: 'center',
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

export default BudgetModal;
