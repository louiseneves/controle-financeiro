/**
 * Planning Navigator
 * Stack de navegação para metas e planejamento
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { t } from '../i18n';

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
        options={{ title: t('planningNavigator.goals') }}
      />

      <Stack.Screen
        name="AddGoal"
        component={AddGoalScreen}
        options={{ title: t('planningNavigator.newGoal') }}
      />

      <Stack.Screen
        name="GoalDetail"
        component={GoalDetailScreen}
        options={{ title: t('planningNavigator.goalDetails') }}
      />

      <Stack.Screen
        name="Budget"
        component={BudgetScreen}
        options={{ title: t('planningNavigator.monthlyBudget') }}
      />

      <Stack.Screen
        name="CreateBudget"
        component={CreateBudgetScreen}
        options={{ title: t('planningNavigator.createBudget') }}
      />

      <Stack.Screen
        name="EditBudget"
        component={CreateBudgetScreen}
        options={{ title: t('planningNavigator.editBudget') }}
      />
    </Stack.Navigator>
  );
};

export default PlanningNavigator;
