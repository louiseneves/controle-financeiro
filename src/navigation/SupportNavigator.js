import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';

// Telas
import SupportScreen from '../screens/support/SupportScreen';
import FAQScreen from '../screens/support/FAQScreen';
import CreateTicketScreen from '../screens/support/CreateTicketScreen';
import TicketDetailsScreen from '../screens/support/TicketDetailsScreen';
import TicketListScreen from '../screens/support/TicketListScreen';
import TutorialsScreen from '../screens/support/TutorialsScreen';

const Stack = createNativeStackNavigator();

const SupportNavigator = () => {
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
        name="SupportHome"
        component={SupportScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{ title: t('supportNavigator.faq') }}
      />

      <Stack.Screen
        name="CreateTicket"
        component={CreateTicketScreen}
        options={{ title: t('supportNavigator.newTicket') }}
      />

      <Stack.Screen
        name="TicketDetails"
        component={TicketDetailsScreen}
        options={{ title: t('supportNavigator.ticketDetails') }}
      />

      <Stack.Screen
        name="TicketList"
        component={TicketListScreen}
        options={{ title: t('supportNavigator.myTickets') }}
      />

      <Stack.Screen
        name="Tutorials"
        component={TutorialsScreen}
        options={{ title: t('supportNavigator.tutorials') }}
      />
    </Stack.Navigator>
  );
};

export default SupportNavigator;
