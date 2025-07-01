import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { ThemeProvider, useTheme } from '../styles/theme';
import FinanceManager from '../components/FinanceManager';

const AppWrapper = () => {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>      
      <StatusBar
        barStyle={theme.text === '#ffffff' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.primary}
      />
      <FinanceManager />
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
});

export default App;
