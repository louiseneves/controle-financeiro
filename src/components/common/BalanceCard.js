/**
 * Card de Saldo
 */

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {COLORS, formatCurrency} from '../../utils';

const BalanceCard = ({balance, income, expense}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Saldo Atual</Text>
      <Text style={styles.amount}>{formatCurrency(balance)}</Text>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <View style={[styles.indicator, {backgroundColor: COLORS.success}]} />
          <View>
            <Text style={styles.detailLabel}>Receitas</Text>
            <Text style={[styles.detailValue, {color: COLORS.success}]}>
              {formatCurrency(income)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailItem}>
          <View style={[styles.indicator, {backgroundColor: COLORS.error}]} />
          <View>
            <Text style={styles.detailLabel}>Despesas</Text>
            <Text style={[styles.detailValue, {color: COLORS.error}]}>
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
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: 8,
  },
  amount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  detailItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  indicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.white,
    opacity: 0.3,
    marginHorizontal: 16,
  },
});

export default BalanceCard;
