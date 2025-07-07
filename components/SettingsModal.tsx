import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Switch, StyleSheet, Linking, Platform, Alert, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';
import { CURRENCIES, CurrencyOption } from '../utils/format';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onClearData?: () => Promise<void>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose, onClearData }) => {
  const { 
    theme, 
    isDarkMode, 
    toggleTheme, 
    followSystem, 
    toggleFollowSystem, 
    currency, 
    setCurrency, 
    currencyAfter, 
    toggleCurrencyPosition 
  } = useTheme();
  
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  
  const handleClearData = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to clear all data? This action cannot be undone.'
      );
      if (confirmed && onClearData) {
        onClearData();
      }
    } else {
      Alert.alert(
        'Clear All Data',
        'Are you sure you want to clear all data? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => onClearData?.(),
          },
        ]
      );
    }
  };

  // Get current currency display name
  const currentCurrency = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {/* Theme Settings */}
            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.label, { color: theme.text }]}>Follow Device Theme</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                  Match your device's theme
                </Text>
              </View>
              <Switch
                value={followSystem}
                onValueChange={toggleFollowSystem}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={followSystem ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor={theme.border}
              />
            </View>

            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                  Toggle light and dark theme
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor={theme.border}
                disabled={followSystem}
              />
            </View>

            {/* Currency Settings */}
            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.label, { color: theme.text }]}>Currency</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                  {currentCurrency.name} ({currentCurrency.symbol})
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCurrencySelector(!showCurrencySelector)}
                style={[styles.actionButton, { backgroundColor: theme.primary }]}
              >
                <Text style={styles.actionButtonText}>Change</Text>
              </TouchableOpacity>
            </View>

            {showCurrencySelector && (
              <View style={[styles.currencySelector, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
                <FlatList
                  data={CURRENCIES}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.currencyOption,
                        { 
                          borderBottomColor: theme.border,
                          backgroundColor: currency === item.code ? theme.primary + '30' : 'transparent'
                        }
                      ]}
                      onPress={() => {
                        setCurrency(item.code);
                        setShowCurrencySelector(false);
                      }}
                    >
                      <Text style={[styles.currencyText, { color: theme.text }]}>
                        {item.name} ({item.symbol})
                      </Text>
                      {currency === item.code && (
                        <Ionicons name="checkmark" size={20} color={theme.primary} />
                      )}
                    </TouchableOpacity>
                  )}
                  style={{ maxHeight: 200 }}
                />
              </View>
            )}

            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.label, { color: theme.text }]}>Currency Position</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                  {currencyAfter ? 'After amount (100 $)' : 'Before amount ($ 100)'}
                </Text>
              </View>
              <Switch
                value={currencyAfter}
                onValueChange={toggleCurrencyPosition}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={currencyAfter ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor={theme.border}
              />
            </View>

            {/* Clear Data Option */}
            {onClearData && (
              <View style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                <View>
                  <Text style={[styles.label, { color: theme.text }]}>Clear All Data</Text>
                  <Text style={[styles.description, { color: theme.textSecondary }]}>
                    Full Reset
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleClearData}
                  style={[styles.actionButton, { backgroundColor: theme.expenseColor }]}
                >
                  <Text style={styles.actionButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={[styles.creditsSection, { borderTopColor: theme.border }]}>
              <Text style={[styles.creditsText, { color: theme.textSecondary }]}>
                Developed by: Jack Seigerman, Alexander Fiodorov-Miller, Kartikeya Bomb and Michael Boyer
              </Text>
            </View>
          </ScrollView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: '80%',
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    marginTop: 4,
    opacity: 0.7,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  creditsSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  creditsText: {
    fontSize: 11,
    opacity: 0.6,
    textAlign: 'center',
  },
  currencySelector: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  currencyOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderBottomWidth: 1,
  },
  currencyText: {
    fontSize: 14,
  },
});

export default SettingsModal;