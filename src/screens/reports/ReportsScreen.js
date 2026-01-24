/**
 * Tela de Relatórios
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {BarChart, PieChart} from 'react-native-gifted-charts';
import {
  COLORS,
  formatCurrency,
  formatMonthYear,
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = ({navigation}) => {
  const {user} = useAuthStore();
  const {transactions, loadTransactions, getCurrentMonthTransactions} = useTransactionStore();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month'); // month, 3months, year

  useEffect(() => {
    if (user?.uid) {
      loadTransactions(user.uid);
    }
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (user?.uid) {
      await loadTransactions(user.uid);
    }
    setRefreshing(false);
  };

  // Filtrar transações por período
  const getTransactionsByPeriod = () => {
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'month':
        return getCurrentMonthTransactions();
      
      case '3months':
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
        return transactions.filter(t => new Date(t.date) >= threeMonthsAgo);
      
      case 'year':
        const yearStart = new Date(now.getFullYear(), 0, 1);
        return transactions.filter(t => new Date(t.date) >= yearStart);
      
      default:
        return getCurrentMonthTransactions();
    }
  };

  const periodTransactions = getTransactionsByPeriod();

  // Calcular totais
  const income = periodTransactions
    .filter(t => t.type === 'receita')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = periodTransactions
    .filter(t => t.type === 'despesa')
    .reduce((sum, t) => sum + t.amount, 0);

  const investment = periodTransactions
    .filter(t => t.type === 'investimento')
    .reduce((sum, t) => sum + t.amount, 0);

  const offer = periodTransactions
    .filter(t => t.type === 'oferta')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense - investment - offer;

  // Agrupar despesas por categoria
  const expensesByCategory = () => {
    const grouped = {};
    
    periodTransactions
      .filter(t => t.type === 'despesa')
      .forEach(t => {
        if (!grouped[t.category]) {
          grouped[t.category] = 0;
        }
        grouped[t.category] += t.amount;
      });

    return Object.entries(grouped)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: expense > 0 ? (amount / expense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  };

  const categoryData = expensesByCategory();

  // Dados para gráfico de pizza (top 5 categorias)
  const pieData = categoryData.slice(0, 5).map((item, index) => {
    const colors = [COLORS.error, COLORS.warning, COLORS.investment, COLORS.offer, COLORS.primary];
    return {
      x: item.category,
      y: item.amount,
      color: colors[index],
    };
  });

  // Dados para gráfico de barras (receitas vs despesas)
  const barData = [
    {type: 'Receitas', amount: income, color: COLORS.success},
    {type: 'Despesas', amount: expense, color: COLORS.error},
    {type: 'Investimentos', amount: investment, color: COLORS.investment},
    {type: 'Ofertas', amount: offer, color: COLORS.offer},
  ];

  const periods = [
    {id: 'month', label: 'Este Mês'},
    {id: '3months', label: 'Últimos 3 Meses'},
    {id: 'year', label: 'Este Ano'},
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* Botão Histórico */}
      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
        activeOpacity={0.7}>
        <Text style={styles.historyButtonIcon}>📋</Text>
        <Text style={styles.historyButtonText}>Ver Histórico Completo</Text>
        <Text style={styles.historyButtonArrow}>›</Text>
      </TouchableOpacity>

            {/* Botão Relatórios Avançados (Premium) */}
      <TouchableOpacity
        style={[styles.historyButton, {backgroundColor: COLORS.warning + '10', borderWidth: 2, borderColor: COLORS.warning}]}
        onPress={() => navigation.navigate('AdvancedReports')}
        activeOpacity={0.7}>
        <Text style={styles.historyButtonIcon}>⭐</Text>
        <Text style={[styles.historyButtonText, {color: COLORS.warning}]}>Relatórios Avançados Premium</Text>
        <Text style={[styles.historyButtonArrow, {color: COLORS.warning}]}>›</Text>
      </TouchableOpacity>
      {/* Seletor de período */}
      <View style={styles.periodSelector}>
        {periods.map(period => (
          <TouchableOpacity
            key={period.id}
            style={[
              styles.periodButton,
              selectedPeriod === period.id && styles.periodButtonActive,
            ]}
            onPress={() => setSelectedPeriod(period.id)}
            activeOpacity={0.7}>
            <Text
              style={[
                styles.periodButtonText,
                selectedPeriod === period.id && styles.periodButtonTextActive,
              ]}>
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cards de resumo */}
      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, {backgroundColor: COLORS.success + '20'}]}>
          <Text style={styles.summaryCardLabel}>Receitas</Text>
          <Text style={[styles.summaryCardValue, {color: COLORS.success}]}>
            {formatCurrency(income)}
          </Text>
        </View>

        <View style={[styles.summaryCard, {backgroundColor: COLORS.error + '20'}]}>
          <Text style={styles.summaryCardLabel}>Despesas</Text>
          <Text style={[styles.summaryCardValue, {color: COLORS.error}]}>
            {formatCurrency(expense)}
          </Text>
        </View>
      </View>

      <View style={styles.summaryCards}>
        <View style={[styles.summaryCard, {backgroundColor: COLORS.investment + '20'}]}>
          <Text style={styles.summaryCardLabel}>Investimentos</Text>
          <Text style={[styles.summaryCardValue, {color: COLORS.investment}]}>
            {formatCurrency(investment)}
          </Text>
        </View>

        <View style={[styles.summaryCard, {backgroundColor: COLORS.offer + '20'}]}>
          <Text style={styles.summaryCardLabel}>Ofertas</Text>
          <Text style={[styles.summaryCardValue, {color: COLORS.offer}]}>
            {formatCurrency(offer)}
          </Text>
        </View>
      </View>

      {/* Saldo */}
      <View style={[
        styles.balanceCard,
        {backgroundColor: balance >= 0 ? COLORS.success : COLORS.error}
      ]}>
        <Text style={styles.balanceLabel}>Saldo do Período</Text>
        <Text style={styles.balanceValue}>{formatCurrency(balance)}</Text>
      </View>

      {/* Gráfico de Barras */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Visão Geral</Text>
        {barData.some(d => d.amount > 0) ? (
          <BarChart
            data={barData.map(item => ({
                value: item.amount,
                label: item.type,
                frontColor: item.color,
            }))}
            height={250}
            barWidth={28}
            spacing={32}
            hideRules
            yAxisThickness={0}
            xAxisThickness={0}
            noOfSections={4}
            yAxisLabelPrefix="R$ "
            />
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyChartText}>Sem dados para exibir</Text>
          </View>
        )}
      </View>

      {/* Gráfico de Pizza - Despesas por Categoria */}
      {categoryData.length > 0 && (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Despesas por Categoria</Text>
          
          {pieData.length > 0 ? (
            <>
                <PieChart
                data={pieData.map(item => ({
                    value: item.y,
                    color: item.color,
                    text: `${((item.y / expense) * 100).toFixed(0)}%`,
                }))}
                donut
                radius={90}
                innerRadius={60}
                showText
                textColor="white"
                textSize={12}
                />
              {/* Legenda */}
              <View style={styles.legend}>
                {categoryData.slice(0, 5).map((item, index) => {
                  const colors = [COLORS.error, COLORS.warning, COLORS.investment, COLORS.offer, COLORS.primary];
                  return (
                    <View key={item.category} style={styles.legendItem}>
                      <View style={[styles.legendDot, {backgroundColor: colors[index]}]} />
                      <View style={styles.legendContent}>
                        <Text style={styles.legendLabel}>{item.category}</Text>
                        <Text style={styles.legendValue}>
                          {formatCurrency(item.amount)} ({item.percentage.toFixed(0)}%)
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>Sem despesas para categorizar</Text>
            </View>
          )}
        </View>
      )}

      {/* Lista de categorias */}
      {categoryData.length > 0 && (
        <View style={styles.categoryList}>
          <Text style={styles.sectionTitle}>Todas as Categorias</Text>
          {categoryData.map((item, index) => (
            <View key={item.category} style={styles.categoryItem}>
              <View style={styles.categoryRank}>
                <Text style={styles.categoryRankText}>#{index + 1}</Text>
              </View>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{item.category}</Text>
                <View style={styles.categoryBar}>
                  <View
                    style={[
                      styles.categoryBarFill,
                      {width: `${item.percentage}%`},
                    ]}
                  />
                </View>
              </View>
              <View style={styles.categoryValues}>
                <Text style={styles.categoryAmount}>
                  {formatCurrency(item.amount)}
                </Text>
                <Text style={styles.categoryPercentage}>
                  {item.percentage.toFixed(1)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Estado vazio */}
      {periodTransactions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>Sem transações neste período</Text>
          <Text style={styles.emptySubtext}>
            Adicione transações para visualizar relatórios
          </Text>
        </View>
      )}
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
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  historyButtonText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  historyButtonArrow: {
    fontSize: 24,
    color: COLORS.textLight,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: COLORS.gray200,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: COLORS.white,
  },
  periodButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
  },
  periodButtonTextActive: {
    color: COLORS.primary,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
  },
  summaryCardLabel: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 8,
  },
  summaryCardValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  balanceCard: {
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  balanceValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  emptyChart: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  legend: {
    marginTop: 16,
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendContent: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 2,
  },
  legendValue: {
    fontSize: 13,
    color: COLORS.textLight,
  },
  categoryList: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  categoryRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryRankText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  categoryBar: {
    height: 6,
    backgroundColor: COLORS.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoryBarFill: {
    height: '100%',
    backgroundColor: COLORS.error,
  },
  categoryValues: {
    alignItems: 'flex-end',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  categoryPercentage: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: COLORS.white,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default ReportsScreen;