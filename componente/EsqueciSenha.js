import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator,Platform } from 'react-native';
import { auth, sendPasswordResetEmail } from './Firebase';

export default function EsqueciSenha({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRecuperarSenha = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, insira um e-mail.');
      return;
    }

    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido.');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Verifique seu e-mail',
        'Um link para redefinir sua senha foi enviado para o seu e-mail.'
      );
      navigation.navigate('Login');
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Usuário não encontrado. Verifique o e-mail digitado.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'O e-mail fornecido não é válido.';
          break;
        default:
          errorMessage = 'Erro ao redefinir senha. Por favor, tente novamente mais tarde.';
      }
      Alert.alert('Erro ao redefinir senha', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Esqueci a Senha</Text>
      <View style={styles.formulario}>
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite o e-mail associado à sua conta"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TouchableOpacity style={styles.button} onPress={handleRecuperarSenha} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Enviar Instruções</Text>
          )}                                       
        </TouchableOpacity>
        <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  titulo: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007acc',
  },
  formulario: {
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
    color: '#007acc',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: Platform.Version >= 34 ? 16 : 14,
    lineHeight: Platform.Version >= 34 ? 26 : 24,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#0099ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 18 : 16,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
    alignItems: 'center',
  },
  linkText: {
    color: '#007acc',
    fontSize: Platform.Version >= 34 ? 14 : 12,
    lineHeight: Platform.Version >= 34 ? 26 : 24,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
});


