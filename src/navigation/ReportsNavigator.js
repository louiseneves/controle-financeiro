/**
 * Reports Navigator
 * Stack de navegação para telas de relatórios
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';

import HistoryScreen from '../screens/reports/HistoryScreen';
import ReportsScreen from '../screens/reports/ReportsScreen';
import AdvancedReportsScreen from '../screens/reports/AdvancedReportsScreen';

const Stack = createNativeStackNavigator();

const ReportsNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="ReportsMain"
        component={ReportsScreen}
        options={{ title: t('reportsNavigator.reports') }}
      />

      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: t('reportsNavigator.history') }}
      />

      <Stack.Screen
        name="AdvancedReports"
        component={AdvancedReportsScreen}
        options={{ title: t('reportsNavigator.advancedReports') }}
      />
    </Stack.Navigator>
  );
};

export default ReportsNavigator;
