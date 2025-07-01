import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { checkTagStatus } from '../utils/versionChecker';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Alert } from 'react-native';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkForUpdates() {
      const status = await checkTagStatus();
      if (status === 1) {
        if (Platform.OS === 'web') {
          setErrorMessage('A new version of The Finance Tracker is available.');
        }
        else {
          Alert.alert('A new version of The Finance Tracker is available. Please update the app.');
        }
        console.log(status);
      } else if (status === 2) {
        if (Platform.OS === 'web') {
          setErrorMessage('Error checking for updates. Check your internet connection.');
        } else {
          Alert.alert('Error checking for updates. Check your internet connection and try again later.');
        }
        console.log(status);
      }
    }

    checkForUpdates();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={'dark' === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={{ flex: 1 }}>
        {errorMessage && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity onPress={() => setErrorMessage(null)}>
              <Text style={styles.dismiss}>✕</Text>
            </TouchableOpacity>
          </View>
        )}
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  errorBox: {
    backgroundColor: '#FF5A5F',
    padding: 10,
    paddingTop: Platform.OS === 'web' ? 20 : 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 999,
  },
  errorText: {
    color: '#fff',
    flex: 1,
    fontWeight: 'bold',
  },
  dismiss: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
  },
});
