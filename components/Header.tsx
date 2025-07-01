import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenBudget: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings, onOpenBudget }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { backgroundColor: theme.primary }]}>      
      <Text style={styles.headerTitle}>Finance Manager</Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity style={styles.headerButton} onPress={onOpenSettings}>
          <Ionicons name="settings" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton} onPress={onOpenBudget}>
          <Ionicons name="wallet" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
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
});

export default Header;
