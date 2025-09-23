import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { db } from './Firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function OfertaScreen({ navigation }) {
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  const validarValor = (valor) => !isNaN(valor) && parseFloat(valor) > 0;

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  const salvarOferta = async () => {
    if (!valor) {
      Alert.alert('Erro', 'Digite o valor da oferta.');
      return;
    }

    if (!validarValor(valor)) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'ofertas'), {
        valor: parseFloat(valor),
        descricao: descricao || 'Sem descrição',
        data: new Date(),
      });
      Alert.alert('Oferta registrada!', `Valor: ${formatarMoeda(valor)} registrado com sucesso.`);
      setValor('');
      setDescricao('');
    } catch (error) {
      Alert.alert('Erro ao registrar oferta', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Oferta</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o valor da oferta"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição (opcional)"
        value={descricao}
        onChangeText={setDescricao}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0099ff" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={salvarOferta}>
            <Text style={styles.buttonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate('Historico')}>
            <Text style={styles.secondaryButtonText}>Ver Histórico</Text>
          </TouchableOpacity>
        </>
      )}
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
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
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
  button: {
    backgroundColor: '#0099ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 18 : 16,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: '#33ccef',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
  },
});

