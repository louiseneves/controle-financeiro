/**
 * Planning Navigator
 * Stack de navegação para metas e planejamento
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GoalsScreen from '../screens/planning/GoalsScreen';
import AddGoalScreen from '../screens/planning/AddGoalScreen';
import GoalDetailScreen from '../screens/planning/GoalDetailScreen';
import BudgetScreen from '../screens/planning/BudgetScreen';
import CreateBudgetScreen from '../screens/planning/CreateBudgetScreen';
import {COLORS} from '../utils';

const Stack = createNativeStackNavigator();

const PlanningNavigator = () => {
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
        name="GoalsMain"
        component={GoalsScreen}
        options={{
          title: 'Metas Financeiras',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddGoal"
        component={AddGoalScreen}
        options={{
          title: 'Nova Meta',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={{
          title: 'Detalhes da Meta',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          title: 'Orçamento Mensal',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="CreateBudget"
        component={CreateBudgetScreen}
        options={{
          title: 'Criar Orçamento',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="EditBudget"
        component={CreateBudgetScreen}
        options={{
          title: 'Editar Orçamento',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default PlanningNavigator;