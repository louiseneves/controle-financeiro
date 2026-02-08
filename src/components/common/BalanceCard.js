/**
 * Card de Saldo
 */

import React,{useMemo} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import useSettingsStore from '../../store/settingsStore';
import { useTheme } from '../../context/ThemeContext';
import {t} from '../../i18n';

const BalanceCard = ({ balance, income, expense }) => {
  const { colors, dark } = useTheme();
  const formatCurrency = useSettingsStore(state => state.formatCurrency);
    const styles = useMemo(() => createStyles(colors, dark), [colors, dark]);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('balance.title')}</Text>
      <Text style={styles.amount}>{formatCurrency(balance)}</Text>
      
      <View style={styles.details}>
        <View style={styles.detailItem}>
          <View
            style={[
              styles.indicator,
              { backgroundColor: colors.successDark }
            ]}
          />
          <View>
            <Text style={styles.detailLabel}>{t('balance.income')}</Text>
            <Text
              style={[
                styles.detailValue,
                { color: colors.successDark }
              ]}
            >
              {formatCurrency(income)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailItem}>
          <View
            style={[
              styles.indicator,
              { backgroundColor: colors.errorDark }
            ]}
          />
          <View>
            <Text style={styles.detailLabel}>{t('balance.expense')}</Text>
            <Text
              style={[
                styles.detailValue,
                { color: colors.errorDark }
              ]}
            >
              {formatCurrency(expense)}
            </Text>
          </View>
        </View>

      </View>
    </View>
  );
};

const createStyles = (colors,dark) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 24,
      marginBottom: 20,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: dark ? 0.1 : 0.2,
      shadowRadius: 8,
      elevation: 5,
    },

    label: {
      fontSize: 14,
      color: colors.onPrimary,
      marginBottom: 8,
    },

    amount: {
      fontSize: 36,
      fontWeight: 'bold',
      color: colors.onPrimary,
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
      color: colors.onPrimary,
      marginBottom: 4,
    },

    detailValue: {
      fontSize: 16,
      fontWeight: '600',
    },

    divider: {
      width: 1,
      height: 40,
      backgroundColor: dark ? colors.borderDark : colors.border,
      opacity: 0.3,
      marginHorizontal: 16,
    },
  });


export default BalanceCard;
