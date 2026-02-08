/**
 * Tela de Criar/Editar Orçamento
 */

import React, {useState, useEffect,useMemo} from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {Button, Input} from '../../components/ui';
import {COLORS, EXPENSE_CATEGORIES, formatMonthYear} from '../../utils';
import useAuthStore from '../../store/authStore';
import useBudgetStore from '../../store/budgetStore';
import useSettingsStore from '../../store/settingsStore';
import {t} from '../../i18n';
import { getCurrencyPlaceholder, getCurrencySymbol } from '../../utils/helpers/formatters';

const CreateBudgetScreen = ({navigation, route}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const formatCurrency = useSettingsStore(state => state.formatCurrency);
  const {user} = useAuthStore();
  const {addBudget, updateBudget} = useBudgetStore();
  
  const existingBudget = route.params?.budget;
  const isEditing = !!existingBudget;

  const [categoryBudgets, setCategoryBudgets] = useState({});
  const [loading, setLoading] = useState(false);
const currencySymbol = getCurrencySymbol();

  useEffect(() => {
    if (isEditing && existingBudget.categories) {
      setCategoryBudgets(existingBudget.categories);
    }
  }, [isEditing, existingBudget]);

  const handleAmountChange = (category, value) => {
    setCategoryBudgets(prev => ({
      ...prev,
      [category]: value ? parseFloat(value) : 0,
    }));
  };

  const calculateTotal = () => {
    return Object.values(categoryBudgets).reduce((sum, amount) => sum + (amount || 0), 0);
  };

  const handleSave = async () => {
    const total = calculateTotal();

    if (total === 0) {
      Alert.alert(t('budget.alerts.error'), t('budget.alerts.minRequired'));
      return;
    }

    // Filtrar apenas categorias com valor > 0
    const filteredBudgets = Object.entries(categoryBudgets)
      .filter(([_, amount]) => amount > 0)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    try {
      setLoading(true);

      const now = new Date();
      const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

      const budgetData = {
        month,
        categories: filteredBudgets,
        userId: user.uid,
      };

      let result;
      if (isEditing) {
        result = await updateBudget(existingBudget.id, budgetData);
      } else {
        result = await addBudget(budgetData);
      }

      if (result.success) {
        Alert.alert(
          t('budget.alerts.successTitle'),
          isEditing ? t('budget.alerts.updated') : t('budget.alerts.created'),
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ],
        );
      } else {
        Alert.alert(t('budget.alerts.error'), result.error || t('budget.alerts.genericError'));
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      Alert.alert(t('budget.alerts.error'), t('budget.alerts.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    Alert.alert(
      t('budget.quickFill.title'),
      t('budget.quickFill.choose'),
      [
        {
          text: t('budget.quickFill.equal'),
          onPress: () => {
            const equalAmount = 500; // R$ 500 por categoria
            const budgets = {};
            EXPENSE_CATEGORIES.forEach(cat => {
              budgets[cat.id] = equalAmount;
            });
            setCategoryBudgets(budgets);
          },
        },
        {
          text: t('budget.quickFill.suggested'),
          onPress: () => {
            // Sugestões baseadas em prioridades
            const suggestions = {
              alimentacao: 800,
              moradia: 1200,
              transporte: 400,
              saude: 300,
              contas: 500,
              mercado: 600,
              combustivel: 300,
              telefone: 150,
            };
            setCategoryBudgets(suggestions);
          },
        },
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const totalBudget = calculateTotal();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>📊</Text>
          <Text style={styles.headerTitle}>
            {isEditing ? t('budget.editTitle') : t('budget.createTitle')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {t('budget.subtitle')}
          </Text>
          <Text style={styles.headerSubtitle}>
            {formatMonthYear(new Date())}
          </Text>
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>{t('budget.total')}</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalBudget)}</Text>
          
          <TouchableOpacity style={styles.quickFillButton} onPress={handleQuickFill}>
            <Text style={styles.quickFillText}>⚡ {t('budget.quickFill.title')}</Text>
          </TouchableOpacity>
        </View>

        {/* Categorias */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>{t('budget.categoryTitle')}</Text>

          {EXPENSE_CATEGORIES.map(category => (
            <View key={category.id} style={styles.categoryInput}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
              
              <Input
                value={categoryBudgets[category.id]?.toString() || ''}
                onChangeText={value => handleAmountChange(category.id, value)}
                placeholder={getCurrencyPlaceholder()}
                keyboardType="numeric"
                leftIcon={<Text style={styles.inputIcon}>{currencySymbol}</Text>}
                style={styles.input}
              />
            </View>
          ))}
        </View>

        {/* Dica */}
        <View style={styles.tipBox}>
          <Text style={styles.tipIcon}>💡</Text>
          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>{t('budget.tip.title')}</Text>
            <Text style={styles.tipText}>
              {t('budget.tip.text')}
            </Text>
          </View>
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title={isEditing ? t('budget.actions.save') : t('budget.actions.create')}
            onPress={handleSave}
            loading={loading}
            disabled={totalBudget === 0}
            style={styles.saveButton}
          />

          <Button
            title={t('budget.actions.cancel')}
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  totalCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.9,
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.card,
    marginBottom: 16,
  },
  quickFillButton: {
    backgroundColor: colors.card + '20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  quickFillText: {
    fontSize: 14,
    color: colors.card,
    fontWeight: '600',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  categoryInput: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    marginBottom: 0,
  },
  inputIcon: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: colors.info + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  tipIcon: {
    fontSize: 24,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 12,
  },
});

export default CreateBudgetScreen;