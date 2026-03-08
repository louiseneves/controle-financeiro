/**
 * Tela de Adicionar Meta
 */

import React, {useState,useMemo} from 'react';
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
import useAuthStore from '../../store/authStore';
import useGoalsStore from '../../store/goalsStore';
import { isoToBR } from '../../utils/helpers/formatters';
import { t } from '../../i18n';

const AddGoalScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {user} = useAuthStore();
  const {addGoal} = useGoalsStore();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadlineBR, setDeadlineBR] = useState('');
const [deadlineISO, setDeadlineISO] = useState('');

  const [selectedIcon, setSelectedIcon] = useState('🎯');

  const [titleError, setTitleError] = useState('');
  const [targetAmountError, setTargetAmountError] = useState('');
  const [deadlineError, setDeadlineError] = useState('');
  const [loading, setLoading] = useState(false);

  const icons = [
    '🎯', '🏠', '🚗', '✈️', '💍', '🎓',
    '💰', '🏖️', '🎮', '📱', '💻', '🎸',
  ];

  // Validar campos
  const validateFields = () => {
    let isValid = true;

    setTitleError('');
    setTargetAmountError('');
    setDeadlineError('');

    if (!title.trim()) {
      setTitleError(t('addGoal.errors.titleRequired'));
      isValid = false;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      setTargetAmountError(t('addGoal.errors.targetAmountInvalid'));
      isValid = false;
    }

    if (!deadlineISO) {
      setDeadlineError(t('addGoal.errors.deadlineInvalid'));
      isValid = false;
    } else {
      const deadlineDate = new Date(`${deadlineISO}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        setDeadlineError(t('addGoal.errors.deadlineFuture'));
        isValid = false;
      }
    }


    return isValid;
  };

  // Salvar meta
  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      setLoading(true);

      const goalData = {
        title: title.trim(),
        targetAmount: parseFloat(targetAmount),
        currentAmount: currentAmount ? parseFloat(currentAmount) : 0,
        deadline: deadlineISO,
        icon: selectedIcon,
        userId: user.uid,
      };

      const result = await addGoal(goalData);

      if (result.success) {
        Alert.alert(t('addGoal.successTitle'), t('addGoal.success'), [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert(t('addGoal.errorTitle'), result.error || t('addGoal.errorGeneric'));
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      Alert.alert(t('addGoal.errorTitle'), t('addGoal.errorGeneric'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerIcon}>{selectedIcon}</Text>
          <Text style={styles.headerTitle}>{t('addGoal.title')}</Text>
          <Text style={styles.headerSubtitle}>
            {t('addGoal.subtitle')}
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Input
            label={t('addGoal.fields.title')}
            value={title}
            onChangeText={setTitle}
            placeholder={t('addGoal.placeholders.title')}
            error={titleError}
            leftIcon={<Text style={styles.iconText}>📝</Text>}
          />

          <Input
            label={t('addGoal.fields.targetAmount')}
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholder="0,00"
            keyboardType="numeric"
            error={targetAmountError}
            leftIcon={<Text style={styles.iconText}>💰</Text>}
          />

          <Input
            label={t('addGoal.fields.initialAmount')}
            value={currentAmount}
            onChangeText={setCurrentAmount}
            placeholder="0,00"
            keyboardType="numeric"
            leftIcon={<Text style={styles.iconText}>💵</Text>}
          />

          <Input
  label={t('addGoal.fields.deadline')}
  value={deadlineBR}
  onChangeText={value => {
    setDeadlineBR(value);

    // Converter de DD/MM/YYYY para YYYY-MM-DD
    const [day, month, year] = value.split('/');
    if (day && month && year) {
      const iso = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      setDeadlineISO(iso);
    }
  }}
  placeholder={t('addGoal.placeholders.date')}
  error={deadlineError}
  leftIcon={<Text style={styles.iconText}>📅</Text>}
/>


          {/* Seletor de Ícone */}
          <View style={styles.iconSection}>
            <Text style={styles.label}>{t('addGoal.fields.icon')}</Text>
            <View style={styles.iconGrid}>
              {icons.map(icon => (
                <TouchableOpacity
                  key={icon}
                  style={[
                    styles.iconButton,
                    selectedIcon === icon && styles.iconButtonSelected,
                  ]}
                  onPress={() => setSelectedIcon(icon)}
                  activeOpacity={0.7}>
                  <Text style={styles.iconButtonText}>{icon}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview */}
          {targetAmount && parseFloat(targetAmount) > 0 && (
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>{t('addGoal.preview')}</Text>
              <View style={styles.preview}>
                <Text style={styles.previewIcon}>{selectedIcon}</Text>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>
                    {title || t('addGoal.previewDefault')}
                  </Text>
                  <Text style={styles.previewAmount}>
                    R$ {parseFloat(targetAmount).toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title={t('addGoal.actions.create')}
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />

          <Button
            title={t('cancel')}
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
    marginBottom: 32,
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
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    marginBottom: 24,
  },
  iconText: {
    fontSize: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  iconSection: {
    marginBottom: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  iconButton: {
    width: 60,
    height: 60,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  iconButtonSelected: {
    borderColor: colors.primary,
    borderWidth: 3,
    backgroundColor: colors.primary + '10',
  },
  iconButtonText: {
    fontSize: 32,
  },
  previewCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  previewInfo: {
    flex: 1,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  previewAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actions: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 12,
  },
});

export default AddGoalScreen;