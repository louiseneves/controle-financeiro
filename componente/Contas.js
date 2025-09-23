import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList, Platform } from 'react-native';
import { db } from './Firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function ContasScreen() {
  const [conta, setConta] = useState('');
  const [valor, setValor] = useState('');
  const [contas, setContas] = useState([]);
  const [loading, setLoading] = useState(false);

  const validarValor = (valor) => !isNaN(valor) && parseFloat(valor) > 0;

  const salvarConta = async () => {
    if (!conta || conta.length < 3 || !valor) {
      Alert.alert('Erro', 'O nome da conta deve ter pelo menos 3 caracteres e o valor deve ser preenchido.');
      return;
    }

    if (!validarValor(valor)) {
      Alert.alert('Erro', 'Por favor, insira um valor válido.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'contas'), {
        conta,
        valor: parseFloat(valor),
        data: new Date(),
      });
      Alert.alert('Conta salva com sucesso!');
      setConta('');
      setValor('');
      carregarContas();
    } catch (error) {
      Alert.alert('Erro ao salvar conta', error.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarContas = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'contas'));
      const contasArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setContas(contasArray);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as contas.');
    } finally {
      setLoading(false);
    }
  };

  const excluirConta = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'contas', id));
      Alert.alert('Conta excluída com sucesso!');
      carregarContas();
    } catch (error) {
      Alert.alert('Erro ao excluir conta', error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmarExclusao = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', onPress: () => excluirConta(id), style: 'destructive' },
      ]
    );
  };

  useEffect(() => {
    carregarContas();
  }, []);

  const calcularTotalContas = () => {
    return contas.reduce((total, item) => total + item.valor, 0).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Contas</Text>
      <Text style={styles.totalContas}>Total das Contas: R$ {calcularTotalContas()}</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome da conta"
        value={conta}
        onChangeText={setConta}
      />
      <TextInput
        style={styles.input}
        placeholder="Valor da conta"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0099ff" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={salvarConta}>
            <Text style={styles.buttonText}>Salvar Conta</Text>
          </TouchableOpacity>

          <FlatList
            data={contas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.contaItem,
                  { backgroundColor: item.valor > 500 ? '#ffe5e5' : '#e5ffe5' },
                ]}
              >
                <Text style={styles.contaText}>
                  {item.conta}: R$ {item.valor.toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => confirmarExclusao(item.id)}>
                  <Text style={styles.excluirText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
            style={styles.listaContas}
          />
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
    paddingTop: 40,
    backgroundColor: '#f5f5f5',
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007acc',
  },
  totalContas: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
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
  contaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  contaText: {
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    color: '#333',
  },
  excluirText: {
    color: '#ff0000',
    fontWeight: 'bold',
    fontSize: Platform.Version >= 34 ? 18 : 16,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  listaContas: {
    marginTop: 20,
  },
});

