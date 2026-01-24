/**
 * Reports Navigator
 * Stack de navegação para telas de relatórios
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from '../screens/reports/HistoryScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import AdvancedReportsScreen from '../screens/reports/AdvancedReportsScreen';
import {COLORS} from '../utils';

const Stack = createNativeStackNavigator();

const ReportsNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.white,
        },
        headerTintColor: COLORS.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="ReportsMain"
        component={ReportsScreen}
        options={{
          title: 'Relatórios',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{
          title: 'Histórico',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AdvancedReports"
        component={AdvancedReportsScreen}
        options={{
          title: 'Relatórios Avançados',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default ReportsNavigator;