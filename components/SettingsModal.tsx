import React from 'react';
import { Modal, View, Text, TouchableOpacity, Switch, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../styles/theme';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {
  const { theme, isDarkMode, toggleTheme } = useTheme();

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <View style={[styles.container, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.label, { color: theme.text }]}>Dark Mode</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                  Switch between light and dark themes
                </Text>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={isDarkMode ? '#ffffff' : '#f4f3f4'}
                ios_backgroundColor={theme.border}
              />
            </View>
          </View>
          <View style={styles.content}>
            <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.label, { color: theme.text }]}>Github</Text>
                <Text style={[styles.description, { color: theme.textSecondary }]}>
                  See more on my Github
                </Text>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  // Open Github link
                    try {
                        const supported = await Linking.canOpenURL("github://user?username=jackSeigerman");
                        if (supported) {
                        return Linking.openURL("github://user?username=jackSeigerman");
                        } else {
                        return Linking.openURL("https://www.github.com/jackSeigerman");
                        }
                        } catch (error) {
                        console.error('Error opening link:', error);
                        }
                }}
                style={{ paddingHorizontal: 16, paddingVertical: 8, backgroundColor: theme.primary, borderRadius: 6 }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Github</Text>
              </TouchableOpacity>
            </View>
          </View>
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
});

export default SettingsModal;