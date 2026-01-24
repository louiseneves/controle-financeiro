/**
 * Atalhos Rápidos
 */

import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {COLORS} from '../../utils';

const QuickActions = ({onPress}) => {
  const actions = [
    {id: 'receita', title: 'Receita', icon: '💰', color: COLORS.success},
    {id: 'despesa', title: 'Despesa', icon: '💸', color: COLORS.error},
    {id: 'investimento', title: 'Investimento', icon: '📈', color: COLORS.investment},
    {id: 'oferta', title: 'Oferta', icon: '🙏', color: COLORS.offer},
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ações Rápidas</Text>
      
      <View style={styles.grid}>
        {actions.map(action => (
          <TouchableOpacity
            key={action.id}
            style={[styles.actionCard, {borderColor: action.color}]}
            onPress={() => onPress(action.id)}
            activeOpacity={0.7}>
            <Text style={styles.actionIcon}>{action.icon}</Text>
            <Text style={styles.actionTitle}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },
});

export default QuickActions;