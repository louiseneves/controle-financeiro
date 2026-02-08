/**
 * Tela de Adicionar Investimento
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
import { INVESTMENT_CATEGORIES} from '../../utils';
import useAuthStore from '../../store/authStore';
import useTransactionStore from '../../store/transactionStore';
import { isoToBR, brToISO } from '../../utils/helpers/formatters';

const AddInvestmentScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const {user} = useAuthStore();
  const {addTransaction} = useTransactionStore();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [profitability, setProfitability] = useState(''); // Rentabilidade % ao ano
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
      setCategoryError('Selecione um tipo de investimento');
      isValid = false;
    }

    return isValid;
  };

  // Salvar investimento
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
        type: 'investimento',
        description: description.trim(),
        amount: parseFloat(amount),
        category,
        profitability: profitability ? parseFloat(profitability) : 0,
        date: parsedDate.toISOString(),
        userId: user.uid,
      };

      const result = await addTransaction(transactionData);

      if (result.success) {
        Alert.alert('Sucesso! ✅', 'Investimento adicionado com sucesso!', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Erro ao adicionar investimento');
      }
    } catch (error) {
      console.error('Erro ao salvar investimento:', error);
      Alert.alert('Erro', 'Não foi possível adicionar o investimento');
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
          <Text style={styles.headerIcon}>📈</Text>
          <Text style={styles.headerTitle}>Novo Investimento</Text>
          <Text style={styles.headerSubtitle}>
            Registre seus investimentos e acompanhe rendimentos
          </Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          <Input
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            placeholder="Ex: CDB Banco X, Ações PETR4..."
            error={descriptionError}
            leftIcon={<Text style={styles.iconText}>📝</Text>}
          />

          <Input
            label="Valor Investido "
            value={amount}
            onChangeText={setAmount}
            placeholder="0,00"
            keyboardType="numeric"
            error={amountError}
            leftIcon={<Text style={styles.iconText}>💰</Text>}
          />

          <Input
            label="Rentabilidade (% ao ano) - Opcional"
            value={profitability}
            onChangeText={setProfitability}
            placeholder="Ex: 10.5"
            keyboardType="numeric"
            leftIcon={<Text style={styles.iconText}>📊</Text>}
          />

          <Input
            label="Data de Aplicação"
            value={isoToBR(date)}
            onChangeText={(text) => setDate(brToISO(text))}
            placeholder="DD/MM/AAAA"
            leftIcon={<Text style={styles.iconText}>📅</Text>}
          />

          {/* Tipo de Investimento */}
          <View style={styles.categorySection}>
            <Text style={styles.label}>
              Tipo de Investimento {categoryError && <Text style={styles.errorText}>*</Text>}
            </Text>
            <View style={styles.categoryGrid}>
              {INVESTMENT_CATEGORIES.map(cat => (
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

          {/* Info sobre rentabilidade */}
          {profitability && parseFloat(profitability) > 0 && (
            <View style={styles.infoBox}>
              <Text style={styles.infoIcon}>💡</Text>
              <Text style={styles.infoText}>
                Com {profitability}% ao ano, o rendimento estimado em 12 meses será de aproximadamente R${' '}
                {((parseFloat(amount) * parseFloat(profitability)) / 100).toFixed(2)}
              </Text>
            </View>
          )}
        </View>

        {/* Botões */}
        <View style={styles.actions}>
          <Button
            title="Salvar Investimento"
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
    backgroundColor: colors.investment + '10',
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
    color: colors.investment,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.investment + '10',
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

export default AddInvestmentScreen;