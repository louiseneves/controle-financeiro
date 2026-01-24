/**
 * Tela de Recuperação de Senha
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
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import {Button, Input} from '../../components/ui';
import {COLORS} from '../../utils';
import useAuthStore from '../../store/authStore';

const ForgotPasswordScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  // ✅ CORRETO: usar selectors
  const resetPassword = useAuthStore(state => state.resetPassword);
  const loading = useAuthStore(state => state.loading);

  // Validar email
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar campos
  const validateFields = () => {
    setEmailError('');

    if (!email) {
      setEmailError('Email é obrigatório');
      return false;
    }

    if (!validateEmail(email)) {
      setEmailError('Email inválido');
      return false;
    }

    return true;
  };

  // Enviar email de recuperação
  const handleResetPassword = async () => {
    if (!validateFields()) return;

    const result = await resetPassword(email);

    if (result.success) {
      setEmailSent(true);
      Alert.alert(
        'Email Enviado! ✅',
        'Verifique sua caixa de entrada para redefinir sua senha.',
      );
    } else {
      Alert.alert('Erro', result.error || 'Erro ao enviar email');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="lock" size={64} color="black" />
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            {emailSent
              ? 'Email enviado com sucesso!'
              : 'Digite seu email para receber as instruções'}
          </Text>
        </View>

        {!emailSent ? (
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={emailError}
              leftIcon={<MaterialIcons name="email" size={24} color="black" />}
            />

            <Button
              title="Enviar Email de Recuperação"
              onPress={handleResetPassword}
              loading={loading}
              style={styles.submitButton}
            />

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Text style={styles.backButtonText}>
                ← Voltar para o login
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successIcon}>✅</Text>
            <Text style={styles.successText}>
              Enviamos um link de recuperação para:
            </Text>
            <Text style={styles.emailText}>{email}</Text>

            <Text style={styles.instructionsText}>
              Verifique sua caixa de entrada e spam.
            </Text>

            <Button
              title="Voltar para o Login"
              onPress={() => navigation.navigate('Login')}
              style={styles.backToLoginButton}
            />

            <TouchableOpacity
              onPress={() => setEmailSent(false)}
              style={styles.resendButton}>
              <Text style={styles.resendText}>
                Não recebeu? Enviar novamente
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  form: {
    width: '100%',
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  backButton: {
    alignSelf: 'center',
  },
  backButtonText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: 24,
  },
  successText: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 12,
  },
  emailText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 24,
  },
  instructionsText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 32,
  },
  backToLoginButton: {
    width: '100%',
    marginBottom: 16,
  },
  resendButton: {
    padding: 12,
  },
  resendText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
