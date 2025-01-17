import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { auth } from './Firebase'; // Certifique-se de importar corretamente o `auth`
export default function CancelarAssinaturaScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  

  const usuarioAtual = auth.currentUser;
  
  if (usuarioAtual) {
    const email = usuarioAtual.email;
    console.log('E-mail do usuário autenticado:', email);
  } else {
    console.log('Nenhum usuário autenticado.');
  }
  
  const cancelarAssinatura = async () => {
    const usuarioAtual = auth.currentUser;
  
    if (!usuarioAtual) {
      Alert.alert('Erro', 'Nenhum usuário autenticado. Por favor, faça login novamente.');
      return;
    }
  
    const email = usuarioAtual.email;
  
    try {
      setLoading(true);
      const response = await fetch('http://10.0.2.2:3000/cancelar-assinatura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Usa o e-mail do usuário autenticado
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Erro ao cancelar assinatura.');
      }
  
      Alert.alert('Sucesso', 'Sua assinatura foi cancelada com sucesso.');
      navigation.navigate('Home'); // Redirecione após o cancelamento
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error.message);
      Alert.alert('Erro', 'Não foi possível cancelar a assinatura.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cancelar Assinatura Premium</Text>
      <Text style={styles.description}>
        Ao cancelar a assinatura, você perderá acesso às funcionalidades premium.
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007acc" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={cancelarAssinatura}>
          <Text style={styles.buttonText}>Cancelar Assinatura</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007acc',
  },
  description: {
    textAlign: 'center',
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
  },
});
