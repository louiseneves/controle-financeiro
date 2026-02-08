/**
 * Planning Navigator
 * Stack de navegação para metas e planejamento
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';

// Telas
import GoalsScreen from '../screens/planning/GoalsScreen';
import AddGoalScreen from '../screens/planning/AddGoalScreen';
import GoalDetailScreen from '../screens/planning/GoalDetailScreen';
import BudgetScreen from '../screens/planning/BudgetScreen';
import CreateBudgetScreen from '../screens/planning/CreateBudgetScreen';

const Stack = createNativeStackNavigator();

const PlanningNavigator = () => {
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
        name="GoalsMain"
        component={GoalsScreen}
        options={{ title: 'Metas Financeiras' }}
      />

      <Stack.Screen
        name="AddGoal"
        component={AddGoalScreen}
        options={{ title: 'Nova Meta' }}
      />

      <Stack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={{ title: 'Detalhes da Meta' }}
      />

      <Stack.Screen
        name="Budget"
        component={BudgetScreen}
        options={{ title: 'Orçamento Mensal' }}
      />

      <Stack.Screen
        name="CreateBudget"
        component={CreateBudgetScreen}
        options={{ title: 'Criar Orçamento' }}
      />

      <Stack.Screen
        name="EditBudget"
        component={CreateBudgetScreen}
        options={{ title: 'Editar Orçamento' }}
      />
    </Stack.Navigator>
  );
};

export default PlanningNavigator;
