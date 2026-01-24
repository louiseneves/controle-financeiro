/**
 * Settings Navigator
 * Stack de navegação para telas de configurações e perfil
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from '../screens/settings/ProfileScreen';
import EditProfileScreen from '../screens/settings/EditProfileScreen';
import PremiumScreen from '../screens/settings/PremiumScreen';
import PlanningNavigator from './PlanningNavigator';
import BackupScreen from '../screens/settings/BackupScreen';
import SupportNavigator from './SupportNavigator';
import SettingsScreen from '../screens/settings/SettingsScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import {COLORS} from '../utils';

const Stack = createNativeStackNavigator();

const SettingsNavigator = () => {
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
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: 'Editar Perfil',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Goals"
        component={PlanningNavigator}
        options={{
          title: 'Metas',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Planning"
        component={PlanningNavigator}
        options={{
          title: 'Orçamento',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{
          title: 'Premium',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Backup"
        component={BackupScreen}
        options={{ title: 'Backup' }}
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