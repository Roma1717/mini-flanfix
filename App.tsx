import React from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Main from './components/Tasks';
import Detail from './components/Detail';

type RootStackParamList = {
  Main: { token: string; apiUrl: string; method: 'GET' | 'POST' };
  Detail: { userId: string; token: string; apiUrl: string; method: 'GET' | 'POST' };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}>
        
        <Stack.Screen 
          name="Main" 
          component={Main} 
           />
        
        <Stack.Screen 
          name="Detail" 
          component={Detail} 
          />
      </Stack.Navigator>
    </NavigationContainer>
  );
}