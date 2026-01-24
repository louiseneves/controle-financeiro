/**
 * Item de Transação
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, formatCurrency, formatDate} from '../../utils';

const TransactionItem = ({transaction, onPress}) => {
  const getTypeColor = type => {
    switch (type) {
      case 'receita':
        return COLORS.success;
      case 'despesa':
        return COLORS.error;
      case 'investimento':
        return COLORS.investment;
      case 'oferta':
        return COLORS.offer;
      default:
        return COLORS.gray500;
    }
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'receita':
        return '💰';
      case 'despesa':
        return '💸';
      case 'investimento':
        return '📈';
      case 'oferta':
        return '🙏';
      default:
        return '💵';
    }
  };

  const typeColor = getTypeColor(transaction.type);
  const isNegative = transaction.type !== 'receita';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.iconContainer, {backgroundColor: typeColor + '20'}]}>
        <Text style={styles.icon}>{getTypeIcon(transaction.type)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description} numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text style={styles.category}>{transaction.category}</Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, {color: typeColor}]}>
          {isNegative ? '- ' : '+ '}
          {formatCurrency(transaction.amount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: COLORS.gray400,
  },
  amountContainer: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionItem;