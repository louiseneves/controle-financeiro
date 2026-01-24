/**
 * Transactions Navigator
 * Stack de navegação para telas de transações
 */

import React from 'react';
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

const Stack = createNativeStackNavigator();

// Tela temporária de Transações
const TransactionsListScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>
      <Text style={styles.subtitle}>Escolha uma ação:</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: COLORS.success + '20'}]}
          onPress={() => navigation.navigate('AddIncome')}>
          <Text style={styles.actionIcon}>💰</Text>
          <Text style={styles.actionText}>Adicionar Receita</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: COLORS.error + '20'}]}
          onPress={() => navigation.navigate('AddExpense')}>
          <Text style={styles.actionIcon}>💸</Text>
          <Text style={styles.actionText}>Adicionar Despesa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: COLORS.offer + '20'}]}
          onPress={() => navigation.navigate('AddOffer')}>
          <Text style={styles.actionIcon}>🙏</Text>
          <Text style={styles.actionText}>Registrar Oferta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: COLORS.tithe + '20'}]}
          onPress={() => navigation.navigate('TitheCalculator')}>
          <Text style={styles.actionIcon}>✝️</Text>
          <Text style={styles.actionText}>Calculadora de Dízimo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, {backgroundColor: COLORS.investment + '20'}]}
          onPress={() => navigation.navigate('InvestmentsList')}>
          <Text style={styles.actionIcon}>📈</Text>
          <Text style={styles.actionText}>Meus Investimentos</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
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
    color: COLORS.text,
  },
});

const TransactionsNavigator = () => {
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
        name="TransactionsList"
        component={TransactionsListScreen}
        options={{
          title: 'Transações',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddIncome"
        component={AddIncomeScreen}
        options={{
          title: 'Adicionar Receita',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          title: 'Adicionar Despesa',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddOffer"
        component={AddOfferScreen}
        options={{
          title: 'Adicionar Oferta',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TitheCalculator"
        component={TitheCalculatorScreen}
        options={{
          title: 'Calculadora de Dízimo',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="InvestmentsList"
        component={InvestmentsListScreen}
        options={{
          title: 'Investimentos',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="AddInvestment"
        component={AddInvestmentScreen}
        options={{
          title: 'Adicionar Investimento',
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{
          title: 'Detalhes da Transação',
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default TransactionsNavigator;