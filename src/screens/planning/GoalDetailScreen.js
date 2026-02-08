/**
 * Tela de Detalhes da Meta
 */

import React, {useState,useMemo} from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {Button, Input} from '../../components/ui';
import {COLORS, formatDate} from '../../utils';
import useGoalsStore from '../../store/goalsStore';
import useSettingsStore from '../../store/settingsStore';
import { t } from '../../i18n';

const GoalDetailScreen = ({navigation, route}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const formatCurrency = useSettingsStore(state => state.formatCurrency);
  const {goal} = route.params;
  const {addToGoal, deleteGoal} = useGoalsStore();
  
  const [addAmount, setAddAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const currentAmount = goal.currentAmount || 0;
  const progress = Math.min((currentAmount / goal.targetAmount) * 100, 100);
  const remaining = Math.max(goal.targetAmount - currentAmount, 0);

  const getDaysRemaining = () => {
    const today = new Date();
    const deadlineDate = new Date(goal.deadline);
    const diff = deadlineDate - today;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const daysRemaining = getDaysRemaining();

  const handleAddAmount = async () => {
    const amount = parseFloat(addAmount);

    if (!amount || amount <= 0) {
      Alert.alert(t('goalDetail.alerts.invalidValue'));
      return;
    }

    try {
      setLoading(true);
      const result = await addToGoal(goal.id, amount);

      if (result.success) {
        Alert.alert(t('goalDetail.alerts.successAdd', {amount: formatCurrency(amount)}), [
          {
            text: t('ok'),
            onPress: () => {
              setAddAmount('');
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert(t('goalDetail.alerts.error'), result.error || t('goalDetail.alerts.errorAdd'));
      }
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert(t('goalDetail.alerts.error'), t('goalDetail.alerts.addError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      t('goalDetail.deleteConfirmTitle'),
      t('goalDetail.deleteConfirmMessage'),
      [
        {text: t('cancel'), style: 'cancel'},
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            const result = await deleteGoal(goal.id);
            if (result.success) {
              Alert.alert(t('goalDetail.alerts.successDelete'), t('goalDetail.alerts.deleteSuccess'), [
                {text: t('ok'), onPress: () => navigation.goBack()},
              ]);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>{goal.icon || '🎯'}</Text>
        <Text style={styles.headerTitle}>{goal.title}</Text>
        
        {progress >= 100 ? (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>{t('goalDetail.completed')}</Text>
          </View>
        ) : (
          <Text style={styles.headerDeadline}>
            {daysRemaining > 0
              ? t('goalDetail.daysRemaining', {count: daysRemaining})
              : daysRemaining === 0
              ? t('goalDetail.todayDeadline')
              : t('goalDetail.late', {count: Math.abs(daysRemaining)})}
          </Text>
        )}
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>{t('goalDetail.progress')}</Text>
          <Text style={styles.progressPercentage}>{progress.toFixed(0)}%</Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progress}%`,
                backgroundColor: progress >= 100 ? colors.success : colors.primary,
              },
            ]}
          />
        </View>

        <View style={styles.progressAmounts}>
          <View>
            <Text style={styles.amountLabel}>{t('goalDetail.amounts.current')}</Text>
            <Text style={styles.amountValue}>{formatCurrency(currentAmount)}</Text>
          </View>
          <View style={styles.amountDivider} />
          <View>
            <Text style={styles.amountLabel}>{t('goalDetail.amounts.target')}</Text>
            <Text style={styles.amountValue}>{formatCurrency(goal.targetAmount)}</Text>
          </View>
          <View style={styles.amountDivider} />
          <View>
            <Text style={styles.amountLabel}>{t('goalDetail.amounts.remaining')}</Text>
            <Text style={[styles.amountValue, {color: colors.warning}]}>
              {formatCurrency(remaining)}
            </Text>
          </View>
        </View>
      </View>

      {/* Detalhes */}
      <View style={styles.detailsCard}>
        <Text style={styles.detailsTitle}>{t('goalDetail.details')}</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('goalDetail.createdAt')}</Text>
          <Text style={styles.detailValue}>
            {formatDate(goal.createdAt?.toDate?.() || goal.createdAt)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('goalDetail.deadline')}</Text>
          <Text style={styles.detailValue}>{formatDate(goal.deadline)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>{t('goalDetail.targetAmount')}</Text>
          <Text style={styles.detailValue}>
            {formatCurrency(goal.targetAmount)}
          </Text>
        </View>
      </View>

      {/* Adicionar Valor */}
      {progress < 100 && (
        <View style={styles.addCard}>
          <Text style={styles.addTitle}>{t('goalDetail.addTitle')}</Text>
          
          <Input
            label={t('goalDetail.addLabel')}
            value={addAmount}
            onChangeText={setAddAmount}
            placeholder="0,00"
            keyboardType="numeric"
            leftIcon={<Text style={styles.iconText}>💰</Text>}
          />

          <Button
            title={t('goalDetail.addTitle')}
            onPress={handleAddAmount}
            loading={loading}
            disabled={!addAmount || parseFloat(addAmount) <= 0}
          />
        </View>
      )}

      {/* Botão Excluir */}
      <Button
        title={t('goalDetail.delete')}
        onPress={handleDelete}
        variant="error"
        style={styles.deleteButton}
      />
    </ScrollView>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  headerDeadline: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  completedBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  completedText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  progressBar: {
    height: 12,
    backgroundColor: COLORS.gray200,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  amountDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  detailsCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  addCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  iconText: {
    fontSize: 20,
  },
  deleteButton: {
    marginTop: 8,
  },
});

export default GoalDetailScreen;