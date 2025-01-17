import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db, auth } from './Firebase'; // Ajuste o caminho conforme necessário
import { doc, updateDoc } from 'firebase/firestore'; // Para atualizar os dados no Firestore

export default function ContaScreen() {
  const [isPremium, setIsPremium] = useState(false); // Estado inicial do status premium
  const user = auth.currentUser; // Usuário autenticado

  // Carregar status do usuário
  useEffect(() => {
    carregarStatusUsuario();
  }, []);

  const carregarStatusUsuario = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setIsPremium(docSnap.data().isPremium || false);
    } else {
      Alert.alert('Erro', 'Dados do usuário não encontrados.');
    }
  };

  // Função para cancelar a assinatura
  const cancelarAssinatura = async () => {
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { isPremium: false });

      Alert.alert('Sucesso', 'Assinatura cancelada com sucesso.'); 
      setIsPremium(false); // Atualiza o estado localmente
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      Alert.alert('Erro', 'Não foi possível cancelar a assinatura.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conta</Text>
      <Text style={styles.status}>Status: {isPremium ? 'Premium' : 'Gratuito'}</Text>
      
      {isPremium ? (
        <TouchableOpacity style={styles.button} onPress={cancelarAssinatura}>
          <Text style={styles.buttonText}>Cancelar Assinatura</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.text}>Conta gratuita. Considera promover para Premium!</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#007acc',
  },
  status: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#ff4d4d',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});
