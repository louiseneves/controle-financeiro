/**
 * Gráfico de Receitas vs Despesas
 */

import React, {useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import useSettingsStore from '../../store/settingsStore';
import { useTheme } from '../../context/ThemeContext';
import { t } from '../../i18n';

const IncomeExpenseChart = ({ income, expense }) => {
  const { colors } = useTheme();
  const formatCurrency = useSettingsStore(state => state.formatCurrency);
    const styles = useMemo(() => createStyles(colors), [colors]);
  const total = income + expense;

  if (total === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{t('incomeExpenseChart.title')}</Text>

        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyText}>{t('incomeExpenseChart.empty')}</Text>
        </View>
      </View>
    );
  }

  const data = [
    {
      value: income,
      color: colors.success,
      text: t('incomeExpenseChart.income'),
    },
    {
      value: expense,
      color: colors.error,
      text: t('incomeExpenseChart.expense'),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('incomeExpenseChart.title')}</Text>

      <View style={styles.chartContainer}>
        <PieChart
          data={data}
          donut
          radius={90}
          innerRadius={60}
          innerCircleColor={colors.card}
          showText
          textColor={colors.onPrimary}
          textSize={14}
          focusOnPress
        />
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: colors.success}]} />
          <View>
            <Text style={styles.legendLabel}>{t('incomeExpenseChart.income')}</Text>
            <Text style={styles.legendValue}>
              {formatCurrency(income)}
            </Text>
          </View>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: colors.error}]} />
          <View>
            <Text style={styles.legendLabel}>{t('incomeExpenseChart.expense')}</Text>
            <Text style={styles.legendValue}>
              {formatCurrency(expense)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
    color: colors.textSecondary,
  },
  legendValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
    color: colors.textSecondary,
  },
});

export default IncomeExpenseChart;
