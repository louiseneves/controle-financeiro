/**
 * Card de Dízimo
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS, formatCurrency, calculateTithe} from '../../utils';

const TitheCard = ({income, paidTithe, onPress}) => {
  const expectedTithe = calculateTithe(income);
  const remaining = Math.max(0, expectedTithe - paidTithe);
  const percentage = expectedTithe > 0 ? (paidTithe / expectedTithe) * 100 : 0;
  const isPaid = paidTithe >= expectedTithe;

  return (
    <TouchableOpacity
      style={[styles.container, isPaid && styles.containerPaid]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>✝️</Text>
          <Text style={styles.title}>Dízimo do Mês</Text>
        </View>
        {isPaid && <Text style={styles.badge}>✓ Devolvido</Text>}
      </View>

      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.label}>Esperado (10%)</Text>
          <Text style={styles.value}>{formatCurrency(expectedTithe)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Devolvido</Text>
          <Text style={[styles.value, {color: COLORS.success}]}>
            {formatCurrency(paidTithe)}
          </Text>
        </View>

        {!isPaid && (
          <View style={styles.row}>
            <Text style={styles.label}>Restante</Text>
            <Text style={[styles.value, {color: COLORS.warning}]}>
              {formatCurrency(remaining)}
            </Text>
          </View>
        )}
      </View>

      {/* Barra de progresso */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: isPaid ? COLORS.success : COLORS.warning,
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(percentage)}%</Text>
      </View>

      {!isPaid && (
        <Text style={styles.actionText}>Toque para registrar oferta</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: COLORS.tithe,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  containerPaid: {
    backgroundColor: COLORS.success + '10',
    borderColor: COLORS.success,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  badge: {
    backgroundColor: COLORS.success,
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  content: {
    gap: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    minWidth: 40,
    textAlign: 'right',
  },
  actionText: {
    fontSize: 12,
    color: COLORS.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default TitheCard;