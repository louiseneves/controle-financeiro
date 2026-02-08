/**
 * Transactions Navigator
 * Stack de navegação para telas de transações
 */

import React, { useMemo } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import AddIncomeScreen from '../screens/transactions/AddIncomeScreen';
import AddExpenseScreen from '../screens/transactions/AddExpenseScreen';
import AddOfferScreen from '../screens/transactions/AddOfferScreen';
import AddInvestmentScreen from '../screens/transactions/AddInvestmentScreen';
import InvestmentsListScreen from '../screens/transactions/InvestmentsListScreen';
import TitheCalculatorScreen from '../screens/transactions/TitheCalculatorScreen';
import TransactionDetailScreen from '../screens/transactions/TransactionDetailScreen';
import {COLORS} from '../utils';
import { useTheme } from '../context/ThemeContext';
const Stack = createNativeStackNavigator();

// Tela temporária de Transações
const TransactionsListScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>
      <Text style={styles.subtitle}>Escolha uma ação:</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.success + '30' }]}
          onPress={() => navigation.navigate('AddIncome')}
        >
          <Text style={styles.actionIcon}>💰</Text>
          <Text style={styles.actionText}>Adicionar Receita</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.error + '30' }]}
          onPress={() => navigation.navigate('AddExpense')}
        >
          <Text style={styles.actionIcon}>💸</Text>
          <Text style={styles.actionText}>Adicionar Despesa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.offer + '30' }]}
          onPress={() => navigation.navigate('AddOffer')}
        >
          <Text style={styles.actionIcon}>🙏</Text>
          <Text style={styles.actionText}>Registrar Oferta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.tithe + '30' }]}
          onPress={() => navigation.navigate('TitheCalculator')}
        >
          <Text style={styles.actionIcon}>✝️</Text>
          <Text style={styles.actionText}>Calculadora de Dízimo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.investment + '30' }]}
          onPress={() => navigation.navigate('InvestmentsList')}
        >
          <Text style={styles.actionIcon}>📈</Text>
          <Text style={styles.actionText}>Meus Investimentos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    actions: {
      gap: 16,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderRadius: 16,
      gap: 16,
    },
    actionIcon: {
      fontSize: 32,
    },
    actionText: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
  });

const TransactionsNavigator = () => {
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
        name="TransactionsList"
        component={TransactionsListScreen}
        options={{ title: 'Transações' }}
      />

      <Stack.Screen
        name="AddIncome"
        component={AddIncomeScreen}
        options={{ title: 'Adicionar Receita' }}
      />

      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: 'Adicionar Despesa' }}
      />

      <Stack.Screen
        name="AddOffer"
        component={AddOfferScreen}
        options={{ title: 'Adicionar Oferta' }}
      />

      <Stack.Screen
        name="TitheCalculator"
        component={TitheCalculatorScreen}
        options={{ title: 'Calculadora de Dízimo' }}
      />

      <Stack.Screen
        name="InvestmentsList"
        component={InvestmentsListScreen}
        options={{ title: 'Investimentos' }}
      />

      <Stack.Screen
        name="AddInvestment"
        component={AddInvestmentScreen}
        options={{ title: 'Adicionar Investimento' }}
      />

      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ title: 'Detalhes da Transação' }}
      />
    </Stack.Navigator>
  );
};

export default TransactionsNavigator;