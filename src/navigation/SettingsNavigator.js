/**
 * Settings Navigator
 * Stack de navegação para telas de configurações e perfil
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';

import ProfileScreen from '../screens/settings/ProfileScreen';
import EditProfileScreen from '../screens/settings/EditProfileScreen';
import PremiumScreen from '../screens/settings/PremiumScreen';
import PlanningNavigator from './PlanningNavigator';
import BackupScreen from '../screens/settings/BackupScreen';
import SupportNavigator from './SupportNavigator';
import SettingsScreen from '../screens/settings/SettingsScreen';
import AboutScreen from '../screens/settings/AboutScreen';

const Stack = createNativeStackNavigator();

const SettingsNavigator = () => {
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
        name="ProfileMain"
        component={ProfileScreen}
        options={{ title: t('settingsNavigator.profile') }}
      />

      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: t('settingsNavigator.editProfile') }}
      />

      <Stack.Screen
        name="Planning"
        component={PlanningNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{ title: t('settingsNavigator.premium') }}
      />

      <Stack.Screen
        name="Backup"
        component={BackupScreen}
        options={{ title: t('settingsNavigator.backup') }}
      />

      <Stack.Screen
        name="Support"
        component={SupportNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
