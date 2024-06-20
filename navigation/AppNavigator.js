import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useColorScheme } from "react-native";
import Colors from "../constants/Colors";

import TabOneScreen from "../screens/TabOneScreen";
import TabTwoScreen from "../screens/TabTwoScreen";
import TabThreeScreen from "../screens/TabThreeScreen";

const BottomTab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  return (
    <BottomTab.Navigator
      initialRouteName="TabOne"
      screenOptions={{ tabBarActiveTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="Find Bike Parking"
        component={TabOneNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="bicycle" color={color} size={30} />
          ),
        }}
      />
      <BottomTab.Screen
        name="Create Bike Entry"
        component={TabTwoNavigator}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Ionicons name="create" color={color} size={30} />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function TabOneNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabOneScreen"
        component={TabOneScreen}
        options={{ headerTitle: "Find Bike Parking" }}
      />
      <Stack.Screen
        name="TabThreeScreen"
        component={TabThreeScreen}
        options={{ headerTitle: "Parking Details" }}
      />
    </Stack.Navigator>
  );
}

function TabTwoNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TabTwoScreen"
        component={TabTwoScreen}
        options={{ headerTitle: "Create Bike Entry" }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
}
