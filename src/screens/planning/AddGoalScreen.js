/**
 * Tela de Adicionar Meta
 */

import React, {useState} from 'react';
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
import {COLORS} from '../../utils';
import useAuthStore from '../../store/authStore';
import useGoalsStore from '../../store/goalsStore';

const AddGoalScreen = ({navigation}) => {
  const {user} = useAuthStore();
  const {addGoal} = useGoalsStore();

  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');
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
      setTitleError('Título é obrigatório');
      isValid = false;
    }

    if (!targetAmount || parseFloat(targetAmount) <= 0) {
      setTargetAmountError('Valor alvo deve ser maior que zero');
      isValid = false;
    }

    if (!deadline) {
      setDeadlineError('Data limite é obrigatória');
      isValid = false;
    } else {
      const deadlineDate = new Date(deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        setDeadlineError('Data limite deve ser futura');
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
        deadline: new Date(deadline).toISOString(),
        icon: selectedIcon,
        userId: user.uid,
      };

      const result = await addGoal(goalData);

      if (result.success) {
        Alert.alert('Sucesso! ✅', 'Meta criada com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao criar meta');
      }
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      Alert.alert('Erro', 'Não foi possível criar a meta');
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
          <Text style={styles.headerTitle}>Nova Meta Financeira</Text>
          <Text style={styles.headerSubtitle}>
            Defina seus objetivos e acompanhe seu progresso
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Input
            label="Título da Meta"
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Viagem para Europa, Carro Novo..."
            error={titleError}
            leftIcon={<Text style={styles.iconText}>📝</Text>}
          />

          <Input
            label="Valor Alvo (R$)"
            value={targetAmount}
            onChangeText={setTargetAmount}
            placeholder="0,00"
            keyboardType="numeric"
            error={targetAmountError}
            leftIcon={<Text style={styles.iconText}>💰</Text>}
          />

          <Input
            label="Valor Inicial (Opcional)"
            value={currentAmount}
            onChangeText={setCurrentAmount}
            placeholder="0,00"
            keyboardType="numeric"
            leftIcon={<Text style={styles.iconText}>💵</Text>}
          />

          <Input
            label="Data Limite"
            value={deadline}
            onChangeText={setDeadline}
            placeholder="YYYY-MM-DD"
            error={deadlineError}
            leftIcon={<Text style={styles.iconText}>📅</Text>}
          />

          {/* Seletor de Ícone */}
          <View style={styles.iconSection}>
            <Text style={styles.label}>Ícone da Meta</Text>
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
              <Text style={styles.previewLabel}>Preview da Meta</Text>
              <View style={styles.preview}>
                <Text style={styles.previewIcon}>{selectedIcon}</Text>
                <View style={styles.previewInfo}>
                  <Text style={styles.previewTitle}>
                    {title || 'Sua meta'}
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
            title="Criar Meta"
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />

          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
    color: COLORS.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textLight,
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
    color: COLORS.text,
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
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  iconButtonSelected: {
    borderColor: COLORS.primary,
    borderWidth: 3,
    backgroundColor: COLORS.primary + '10',
  },
  iconButtonText: {
    fontSize: 32,
  },
  previewCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  previewLabel: {
    fontSize: 13,
    color: COLORS.textLight,
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
    color: COLORS.text,
    marginBottom: 4,
  },
  previewAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  actions: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 12,
  },
});

export default AddGoalScreen;