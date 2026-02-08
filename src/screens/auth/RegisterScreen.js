/**
 * Tela de Cadastro
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
  Image,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {Button, Input} from '../../components/ui';
import useAuthStore from '../../store/authStore';
import {t} from '../../i18n';

const RegisterScreen = ({navigation}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  // ✅ CORRETO: selectors do Zustand
  const register = useAuthStore(state => state.register);
  const loading = useAuthStore(state => state.loading);

  // Validar email
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validar campos
  const validateFields = () => {
    let isValid = true;

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!name) {
      setNameError(t('register.errors.nameRequired'));
      isValid = false;
    } else if (name.length < 3) {
      setNameError(t('register.errors.nameMin'));
      isValid = false;
    }

    if (!email) {
      setEmailError(t('register.errors.emailRequired'));
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(t('register.errors.emailInvalid'));
      isValid = false;
    }

    if (!password) {
      setPasswordError(t('register.errors.passwordRequired'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('register.errors.passwordMin'));
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError(t('register.errors.confirmPasswordRequired'));
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('register.errors.passwordMismatch'));
      isValid = false;
    }

    return isValid;
  };

  // Fazer cadastro
  const handleRegister = async () => {
    if (!validateFields()) return;

    const result = await register(email, password, name);

    if (result.success) {
      Alert.alert(
        t('register.alerts.successTitle'),
        t('register.alerts.successMessage'),
      );
    } else {
      Alert.alert(t('register.alerts.errorTitle'), result.error || t('register.alerts.errorGeneric'));
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
          <Image
            source={require('../../assets/icons/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>{t('register.title')}</Text>
          <Text style={styles.subtitle}>
            {t('register.subtitle')}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Input
            label={t('register.name')}
            value={name}
            onChangeText={setName}
            placeholder={t('register.namePlaceholder')}
            autoCapitalize="words"
            error={nameError}
            leftIcon={<FontAwesome name="user" size={24} color={colors.textSecondary}
 />}
          />

          <Input
            label={t('register.email')}
            value={email}
            onChangeText={setEmail}
            placeholder={t('register.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            leftIcon={<MaterialIcons name="email" size={24} color={colors.textSecondary} />}
          />

          <Input
            label={t('register.password')}
            value={password}
            onChangeText={setPassword}
            placeholder={t('register.passwordPlaceholder')}
            secureTextEntry
            error={passwordError}
            showPasswordToggle
            leftIcon={<MaterialIcons name="lock" size={24} color={colors.textSecondary} />}
          />

          <Input
            label={t('register.confirmPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder={t('register.confirmPasswordPlaceholder')}
            secureTextEntry
            error={confirmPasswordError}
            showPasswordToggle
            leftIcon={<MaterialIcons name="lock" size={24} color={colors.textSecondary} />}
          />

          <Button
            title={t('register.button')}
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>{t('register.alreadyAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.loginLink}>{t('register.login')}</Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});

export default RegisterScreen;
