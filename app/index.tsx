import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, View } from 'react-native';
import { ThemeProvider, useTheme } from '../styles/theme';
import FinanceManager from '../components/FinanceManager';

const AppWrapper = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.primary }]}>      
      <StatusBar
        barStyle="light-content"  // Force light content since your header is dark
        backgroundColor={theme.primary}
        translucent={false}  // Add this for better iOS behavior
      />
      <View style={[styles.content, { backgroundColor: theme.background }]}>
        <FinanceManager />
      </View>
    </SafeAreaView>
  );
};

const App = () => (
  <ThemeProvider>
    <AppWrapper />
  </ThemeProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  content: {
    flex: 1,
    marginBottom: -100, // Adjusted to avoid overlap with the bottom tab bar
  },
});

export default App;