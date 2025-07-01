import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={"dark" === "dark" ? DarkTheme : DefaultTheme}>
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
    backgroundColor: "#FF5A5F",
    padding: 10,
    paddingTop: Platform.OS === "web" ? 20 : 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 999,
  },
  errorText: {
    color: "#fff",
    flex: 1,
    fontWeight: "bold",
  },
  dismiss: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
});
