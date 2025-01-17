import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { db } from './Firebase';
import { collection, getDocs,addDoc } from 'firebase/firestore';

export default function DizimoScreen({ navigation }) {
  const [receitas, setReceitas] = useState([]);
  const [totalReceita, setTotalReceita] = useState(0);
  const [dizimo, setDizimo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarReceitas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'receitas'));
        const receitasArray = querySnapshot.docs.map((doc) => doc.data());
        const receitasValidas = receitasArray.filter(
          (receita) => !isNaN(receita.valor) && parseFloat(receita.valor) > 0
        );
        const total = receitasValidas.reduce((acc, curr) => acc + parseFloat(curr.valor), 0);

        setReceitas(receitasValidas);
        setTotalReceita(total);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as receitas.');
      } finally {
        setLoading(false);
      }
    };

    carregarReceitas();
  }, []);

  const calcularDizimo = async () => {
    const valorDizimo = totalReceita * 0.1;
    setDizimo(valorDizimo);
  
    try {
      await addDoc(collection(db, 'dizimo'), {
        valor: valorDizimo,
        data: new Date(),
      });
      Alert.alert('Sucesso', 'Dízimo registrado com sucesso no sistema!');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível registrar o dízimo.');
    }
  };
  

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  if (!loading && receitas.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Calcular Dízimo</Text>
        <Text style={styles.result}>Nenhuma receita encontrada. Adicione uma receita primeiro.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#0099ff" />
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Carregando receitas...</Text>
        </>
      ) : (
        <>
          <Text style={styles.title}>Calcular Dízimo</Text>
          <Text style={styles.totalReceita}>
            Total de Receitas: {formatarMoeda(totalReceita)}
          </Text>
          <TouchableOpacity style={styles.button} onPress={calcularDizimo}>
            <Text style={styles.buttonText}>Calcular Dízimo</Text>
          </TouchableOpacity>
          {dizimo !== null && (
            <View>
              <Text style={styles.result}>Dízimo: {formatarMoeda(dizimo)}</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Oferta')}
              >
                <Text style={styles.buttonText}>Registrar Oferta</Text>
              </TouchableOpacity>
            </View>
          )}
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
  totalReceita: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#0099ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 18 : 16,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
  },
  result: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4caf50',
    marginVertical: 20,
  },
});

