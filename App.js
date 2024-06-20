import "react-native-gesture-handler";
import React from 'react';
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AppNavigator colorScheme={colorScheme} />
      <StatusBar />
    </SafeAreaProvider>
  );
}
