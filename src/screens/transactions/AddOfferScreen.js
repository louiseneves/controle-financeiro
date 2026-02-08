/**
 * Tela de Adicionar Oferta
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
import { OFFER_CATEGORIES} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';
import {  brToISO, isoToBR } from '../../utils/helpers/formatters';

const AddOfferScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {user} = useAuthStore();
  const {addTransaction} = useTransactionStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [churchName, setChurchName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [descriptionError, setDescriptionError] = useState('');
  const [amountError, setAmountError] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [loading, setLoading] = useState(false);

  // Validar campos
  const validateFields = () => {
    let isValid = true;

    setDescriptionError('');
    setAmountError('');
    setCategoryError('');

    if (!description.trim()) {
      setDescriptionError('Descrição é obrigatória');
      isValid = false;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setAmountError('Valor deve ser maior que zero');
      isValid = false;
    }

    if (!category) {
      setCategoryError('Selecione um tipo de oferta');
      isValid = false;
    }

    return isValid;
  };

  // Salvar oferta
  const handleSave = async () => {
    if (!validateFields()) return;
if (!user?.uid) {
          Alert.alert('Sessão expirada', 'Faça login novamente.');
          navigation.replace('Login');
          return;
        }

    try {
      setLoading(true);

      // Conversão segura da data
            const parsedDate = new Date(`${date}T00:00:00`);
      
            if (isNaN(parsedDate.getTime())) {
              Alert.alert('Erro', 'Data inválida');
              return;
      }

      const transactionData = {
        type: 'oferta',
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        churchName: churchName.trim() || null,
        date: parsedDate.toISOString(),
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result.success) {
        Alert.alert('Sucesso! ✅', 'Oferta registrada com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao registrar oferta');
      }
    } catch (error) {
      console.error('Erro ao salvar oferta:', error);
      Alert.alert('Erro', 'Não foi possível registrar a oferta');
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
          <Text style={styles.headerIcon}>🙏</Text>
          <Text style={styles.headerTitle}>Registrar Oferta</Text>
          <Text style={styles.headerSubtitle}>
            Contribua para a obra de Deus
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Input
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: Dízimo Dezembro, Oferta de Missões..."
            error={descriptionError}
            leftIcon={<Text style={styles.iconText}>📝</Text>}
          />

          <Input
            label="Valor "
            value={amount}
            onChangeText={setAmount}
            placeholder="0,00"
            keyboardType="numeric"
            error={amountError}
            leftIcon={<Text style={styles.iconText}>💰</Text>}
          />

          <Input
            label="Nome da Igreja (Opcional)"
            value={churchName}
            onChangeText={setChurchName}
            placeholder="Ex: Igreja Batista Central"
            leftIcon={<Text style={styles.iconText}>⛪</Text>}
          />

          <Input
            label="Data"
            value={isoToBR(date)}
            onChangeText={(text) => setDate(brToISO(text))}
            placeholder="DD/MM/AAAA"
            leftIcon={<Text style={styles.iconText}>📅</Text>}
          />

          {/* Tipo de Oferta */}
          <View style={styles.categorySection}>
            <Text style={styles.label}>
              Tipo de Oferta {categoryError && <Text style={styles.errorText}>*</Text>}
            </Text>
            <View style={styles.categoryGrid}>
              {OFFER_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.categoryCard,
                    category === cat.id && styles.categoryCardSelected,
                    {borderColor: cat.color},
                  ]}
                  onPress={() => setCategory(cat.id)}
                  activeOpacity={0.7}>
                  <Text style={styles.categoryIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryName,
                      category === cat.id && styles.categoryNameSelected,
                    ]}
                    numberOfLines={2}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {categoryError && (
              <Text style={styles.errorTextSmall}>{categoryError}</Text>
            )}
          </View>

          {/* Info sobre dízimo */}
          {category === 'dizimo' && (
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>ℹ️</Text>
              <Text style={styles.infoText}>
                O dízimo é 10% da sua renda. Você pode usar a calculadora de
                dízimo para calcular o valor automaticamente.
              </Text>
            </View>
          )}
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title="Registrar Oferta"
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
  categorySection: {
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  categoryCardSelected: {
    borderWidth: 3,
    backgroundColor: colors.offer + '10',
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  categoryNameSelected: {
    color: colors.offer,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.tithe + '10',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  errorTextSmall: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  actions: {
    gap: 12,
  },
  saveButton: {
    marginBottom: 12,
  },
});

export default AddOfferScreen;