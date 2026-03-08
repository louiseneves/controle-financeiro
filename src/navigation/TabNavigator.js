/**
 * Tab Navigator
 * Navegação por abas (Bottom Tabs)
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';
import { Text } from 'react-native';

import HomeScreen from '../screens/home/HomeScreen';
import TransactionsNavigator from './TransactionsNavigator';
import ReportsNavigator from './ReportsNavigator';
import SettingsNavigator from './SettingsNavigator';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  

  return (
    <Tab.Navigator
  screenOptions={{
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.textSecondary,

    tabBarStyle: {
      backgroundColor: colors.card,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      height: 60 + insets.bottom,
      paddingBottom: insets.bottom,
      paddingTop: 8,
    },

    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '600',
    },

    sceneContainerStyle: {
      backgroundColor: colors.background,
    },

    headerStyle: {
      backgroundColor: colors.card,
    },
    headerTintColor: colors.text,
    headerTitleStyle: {
      fontWeight: '600',
    },
    headerShadowVisible: false,
  }}
>

      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          title: t('tabNavigator.home'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
  name="TransactionsTab"
  component={TransactionsNavigator}
  options={{
    title: t('tabNavigator.transactions'),
    headerShown: false,
    tabBarIcon: ({ color, size }) => (
     <FontAwesome name="exchange" size={size} color={color} />
    ),
  }}
/>


      <Tab.Screen
        name="ReportsTab"
        component={ReportsNavigator}
        options={{
          title: t('tabNavigator.reports'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bar-chart" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={SettingsNavigator}
        options={{
          title: t('tabNavigator.profile'),
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

