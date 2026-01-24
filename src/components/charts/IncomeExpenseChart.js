/**
 * Gráfico de Receitas vs Despesas
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import {COLORS, formatCurrency} from '../../utils';

const IncomeExpenseChart = ({income, expense}) => {
  const total = income + expense;

  if (total === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Receitas vs Despesas</Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>Sem transações neste mês</Text>
        </View>
      </View>
    );
  }

  const data = [
    {
      value: income,
      color: COLORS.success,
      text: 'Receitas',
    },
    {
      value: expense,
      color: COLORS.error,
      text: 'Despesas',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Receitas vs Despesas</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          donut
          radius={90}
          innerRadius={60}
          showText
          textColor="#fff"
          textSize={14}
          focusOnPress
        />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: COLORS.success}]} />
          <View>
            <Text style={styles.legendLabel}>Receitas</Text>
            <Text style={styles.legendValue}>
              {formatCurrency(income)}
            </Text>
          </View>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: COLORS.error}]} />
          <View>
            <Text style={styles.legendLabel}>Despesas</Text>
            <Text style={styles.legendValue}>
              {formatCurrency(expense)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
});

export default IncomeExpenseChart;
