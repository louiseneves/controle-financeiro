import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

// Importar telas
import SupportScreen from '../screens/support/SupportScreen';
import FAQScreen from '../screens/support/FAQScreen';
import CreateTicketScreen from '../screens/support/CreateTicketScreen';
import TicketDetailsScreen from '../screens/support/TicketDetailsScreen';
import TicketListScreen from '../screens/support/TicketListScreen';
import TutorialsScreen from '../screens/support/TutorialsScreen';

const Stack = createNativeStackNavigator();

const SupportNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#2196F3' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
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
        options={{ title: 'Perguntas Frequentes' }}
      />
      <Stack.Screen
        name="CreateTicket"
        component={CreateTicketScreen}
        options={{ title: 'Novo Ticket' }}
      />
      <Stack.Screen
        name="TicketDetails"
        component={TicketDetailsScreen}
        options={{ title: 'Detalhes do Ticket' }}
      />
      <Stack.Screen
        name="TicketList"
        component={TicketListScreen}
        options={{ title: 'Meus Tickets' }}
      />
      <Stack.Screen
        name="Tutorials"
        component={TutorialsScreen}
        options={{ title: 'Tutoriais' }}
      />
    </Stack.Navigator>
  );
};

export default SupportNavigator;