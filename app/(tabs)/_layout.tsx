import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { MovieList } from '../components/MovieList';
import { MovieDetail } from '../components/MovieDetail';

const Stack = createStackNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (

  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="MovieList"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#65adf1',
        },
        headerTintColor: 'white',
        headerShown: true,
      }}
    >
      <Stack.Screen
        name="MovieList"
        component={MovieList}
        options={{ title: 'Softwares' }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{ title: 'Software Details' }}
      />
    </Stack.Navigator>
  </NavigationContainer>

  );
}
