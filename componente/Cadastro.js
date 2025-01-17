import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth, createUserWithEmailAndPassword, setDoc, doc, db } from './Firebase';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarSenha = (senha) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/; // Mínimo de 8 caracteres, incluindo letras e números
    return regex.test(senha);
  };

  const handleCadastro = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }
    setLoading(true);
    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Por favor, insira um e-mail válido');
      return;
    }

    if (!validarSenha(senha)) {
      Alert.alert('Erro', 'A senha deve conter pelo menos 8 caracteres, incluindo letras e números');
      return;
    }

    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
      const user = userCredential.user;

      // Adiciona o usuário na coleção "users" no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        isPremium: false,
        nome: nome || '',
        dataCriacao: new Date(),
      });

      Alert.alert('Cadastro realizado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      // Mensagens de erro específicas
      let errorMessage;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Este e-mail já está em uso.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'O e-mail fornecido não é válido.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'A operação de cadastro foi desativada.';
          break;
        case 'auth/weak-password':
          errorMessage = 'A senha é muito fraca.';
          break;
        default:
          errorMessage = error.message;
      }
      Alert.alert('Erro no cadastro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
  <Text style={styles.titulo}>Cadastro</Text>
  <View style={styles.formulario}>
    <Text style={styles.label}>Nome</Text>
    <TextInput
      style={styles.input}
      placeholder="Digite seu nome"
      value={nome}
      onChangeText={setNome}
    />

    <Text style={styles.label}>E-mail</Text>
    <TextInput
      style={styles.input}
      placeholder="Digite seu e-mail"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
    />

    <Text style={styles.label}>Senha</Text>
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.inputPassword}
        placeholder="Digite sua senha"
        secureTextEntry={!senhaVisivel}
        value={senha}
        onChangeText={setSenha}
      />
      <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
        <Text style={styles.togglePassword}>{senhaVisivel ? 'Ocultar' : 'Mostrar'}</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.label}>Confirmar Senha</Text>
    <View style={styles.passwordContainer}>
      <TextInput
        style={styles.inputPassword}
        placeholder="Confirme sua senha"
        secureTextEntry={!confirmarSenhaVisivel}
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
      />
      <TouchableOpacity onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}>
        <Text style={styles.togglePassword}>{confirmarSenhaVisivel ? 'Ocultar' : 'Mostrar'}</Text>
      </TouchableOpacity>
    </View>

    {loading ? (
      <ActivityIndicator size="large" color="#007acc" />
    ) : (
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    )}

    <TouchableOpacity style={styles.link} onPress={() => navigation.navigate('Login')}>
      <Text style={styles.linkText}>Já tem uma conta? Faça login</Text>
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
    fontSize: 16,
    marginBottom: 15,
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
    padding:10,
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
    color: '#0099ff',
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
});
