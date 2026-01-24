/**
 * Tela Home - Dashboard
 */

import React, {useEffect, useState,useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';
import {COLORS, formatMonthYear} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';
import BalanceCard from '../../components/common/BalanceCard';
import QuickActions from '../../components/common/QuickActions';
import IncomeExpenseChart from '../../components/charts/IncomeExpenseChart';
import TransactionItem from '../../components/common/TransactionItem';
import TitheCard from '../../components/common/TitheCard';

const HomeScreen = ({navigation}) => {
  const {user} = useAuthStore();
  const {
    transactions,
    loading,
    loadTransactions,
    getSummary,
    getCurrentMonthTransactions,
    getRecentTransactions,
  } = useTransactionStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      loadTransactions(user.uid);
    }
  }, [user]);

  // Calcular resumo
  const summary = useMemo(() => getSummary(), [transactions]);
  const monthTransactions = useMemo(
    () => getCurrentMonthTransactions(),
    [transactions],
  );
  const recentTransactions = useMemo(
    () => getRecentTransactions(5),
    [transactions],
  );

  // Calcular receitas e despesas do mês
  const calculateTotalByType = (transactions, type, category) =>
    transactions
      .filter(t => t.type === type && (!category || t.category === category))
      .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthIncome = calculateTotalByType(monthTransactions, 'receita');
  const monthExpense = calculateTotalByType(monthTransactions, 'despesa');
  const paidTithe = calculateTotalByType(
    monthTransactions,
    'oferta',
    'dizimo',
  );




  // Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.uid) {
      await loadTransactions(user.uid);
    }
    setRefreshing(false);
  };

  // Ação rápida
  const ACTION_ROUTES = {
  receita: {screen: 'AddIncome'},
  despesa: {screen: 'AddExpense'},
  oferta: {screen: 'AddOffer'},
  investimento: {screen: 'InvestmentsList'},
};

const handleQuickAction = actionId => {
  const route = ACTION_ROUTES[actionId];
  if (!route) return;

  navigation.navigate('TransactionsTab', route);
};


  // Ver transação
  const handleTransactionPress = transaction => {
    navigation.navigate('TransactionsTab', {
      screen: 'TransactionDetail',
      params: {transaction},
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Saudação */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá!</Text>
        <Text style={styles.userName}>
          {user?.displayName || user?.email?.split('@')[0]}
        </Text>
        <Text style={styles.currentMonth}>{formatMonthYear(new Date())}</Text>
      </View>

      {/* Saldo */}
      <BalanceCard
        balance={summary.balance}
        income={summary.income}
        expense={summary.expense}
      />

      {/* Ações */}
      <QuickActions onPress={handleQuickAction} />

      {/* Gráfico */}
      <IncomeExpenseChart income={monthIncome} expense={monthExpense} />

      {/* Card de Dízimo */}
      <TitheCard
        income={monthIncome}
        paidTithe={paidTithe}
        onPress={() =>
          navigation.navigate('TransactionsTab', {
            screen: 'TitheCalculator',
          })
        }
      />

      {/* Últimas Transações */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Últimas Transações</Text>
          {transactions.length > 5 && (
            <Text style={styles.seeAll} onPress={() => navigation.navigate("ReportsTab")}>Ver todas</Text>
          )}
        </View>

        {recentTransactions.length > 0 ? (
          recentTransactions.map(transaction => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              onPress={() => handleTransactionPress(transaction)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📝</Text>
            <Text style={styles.emptyText}>Nenhuma transação ainda</Text>
            <Text style={styles.emptySubtext}>
              Use as ações rápidas para adicionar
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    paddingTop: 12,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 4,
    paddingTop: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  currentMonth: {
    fontSize: 14,
    color: COLORS.textLight,
    textTransform: 'capitalize',
  },

  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 40,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.textLight,
  },
    emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default HomeScreen;


