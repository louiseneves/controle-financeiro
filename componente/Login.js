import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, Alert, ActivityIndicator } from 'react-native';
import { auth, signInWithEmailAndPassword } from './Firebase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Erro', 'Digite um e-mail válido.');
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login bem-sucedido!');
      navigation.navigate('Home');
    } catch (error) {
      let mensagemErro;
      switch (error.code) {
        case 'auth/invalid-email':
          mensagemErro = 'Formato de e-mail inválido.';
          break;
        case 'auth/user-not-found':
          mensagemErro = 'Usuário não encontrado.';
          break;
        case 'auth/wrong-password':
          mensagemErro = 'Senha incorreta.';
          break;
        default:
          mensagemErro = 'Erro desconhecido. Tente novamente.';
      }
      Alert.alert('Erro de login', mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.login}>
          <Text style={styles.loginText}>Login</Text>
          <View style={styles.loginContainer}>
            {/* Campo de E-mail */}
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Campo de Senha */}
            <Text style={styles.label}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.inputPassword}
                placeholder="Digite sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!senhaVisivel}
              />
              <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
                <Text style={styles.togglePassword}>{senhaVisivel ? 'Ocultar' : 'Mostrar'}</Text>
              </TouchableOpacity>
            </View>

            {/* Botão de Login */}
            {loading ? (
              <ActivityIndicator size="large" color="#007acc" />
            ) : (
              <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
                <Text style={styles.buttonText}>Entrar</Text>
              </TouchableOpacity>
            )}

            {/* Esqueci a Senha */}
            <TouchableOpacity style={styles.esqueciContainer} onPress={() => navigation.navigate('EsqueciSenha')}>
              <Text style={styles.esqueciTexto}>Esqueci minha senha</Text>
            </TouchableOpacity>

            {/* Botão de Cadastro */}
            <TouchableOpacity style={styles.cadastroButton} onPress={() => navigation.navigate('Cadastro')} activeOpacity={0.8}>
              <Text style={styles.cadastroButtonText}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  login: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    textAlign: 'center',
    color: '#333',
    fontSize: Platform.Version >= 34 ? 28 : 16,
    fontWeight: 'bold',
    marginBottom: 20,
    lineHeight: Platform.Version >= 34 ? 26 : 24,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  loginContainer: {
    width: '90%',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#007acc',
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    width: '100%',
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding:10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  inputPassword: {
    flex: 1,
    fontSize: 16,
  },
  togglePassword: {
    color: '#007acc',
    fontWeight: 'bold',
    fontSize: Platform.Version >= 34 ? 14 : 12,
    lineHeight: Platform.Version >= 34 ? 26 : 24,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  button: {
    marginVertical: 10,
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
  esqueciContainer: {
    padding: 10,
    alignItems: 'center',
  },
  esqueciTexto: {
    fontSize: Platform.Version >= 34 ? 16 : 14,
    lineHeight: Platform.Version >= 34 ? 26 : 24,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    color: '#007acc',
  },
  cadastroButton: {
    marginVertical: 10,
    backgroundColor: '#33ccef',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cadastroButtonText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 18 : 16,
    lineHeight: Platform.Version >= 34 ? 26 : 24,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
  },
});
