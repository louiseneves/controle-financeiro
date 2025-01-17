import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import { db } from './Firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function InvestimentoScreen({ navigation }) {
  const [receitas, setReceitas] = useState([]);
  const [totalReceita, setTotalReceita] = useState(0);
  const [percentual, setPercentual] = useState('');
  const [valorInvestimento, setValorInvestimento] = useState('');
  const [valorFinal, setValorFinal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const carregarReceitas = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'receitas'));
        const receitasArray = querySnapshot.docs.map((doc) => doc.data());

        // Cálculo de receitas válidas
        const receitasValidas = receitasArray.filter(
          (receita) => !isNaN(receita.valor) && parseFloat(receita.valor) > 0
        );
        const total = receitasValidas.reduce((acc, curr) => acc + parseFloat(curr.valor), 0);

        setReceitas(receitasValidas);
        setTotalReceita(total);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar as receitas.');
      }
    };

    carregarReceitas();
  }, []);

  const calcularInvestimento = () => {
    if (!percentual && !valorInvestimento) {
      Alert.alert('Erro', 'Por favor, insira um percentual ou valor de investimento.');
      return;
    }

    let valor = 0;
    if (percentual) {
      valor = totalReceita * (parseFloat(percentual) / 100);
    } else if (valorInvestimento) {
      valor = parseFloat(valorInvestimento);
    }

    setValorFinal(valor);
    Alert.alert('Cálculo realizado com sucesso', `Valor do Investimento: R$ ${valor.toFixed(2)}`);
  };

  const salvarInvestimento = async () => {
    if (valorFinal === null) {
      Alert.alert('Erro', 'Calcule o investimento antes de salvar.');
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'investimentos'), {
        valor: valorFinal,
        data: new Date(),
      });
      Alert.alert('Investimento registrado com sucesso!');
      setValorFinal(null);
      setPercentual('');
      setValorInvestimento('');
    } catch (error) {
      Alert.alert('Erro ao registrar investimento', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0099ff" />
      ) : (
        <>
          <Text style={styles.title}>Calcular Investimento</Text>
          <Text style={styles.totalReceita}>Total de Receitas: R$ {totalReceita.toFixed(2)}</Text>

          <TextInput
            style={styles.input}
            placeholder="Digite o percentual (%)"
            keyboardType="numeric"
            value={percentual}
            onChangeText={(text) => {
              setPercentual(text);
              setValorInvestimento('');
            }}
          />
          <Text style={styles.orText}>ou</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite o valor do investimento"
            keyboardType="numeric"
            value={valorInvestimento}
            onChangeText={(text) => {
              setValorInvestimento(text);
              setPercentual('');
            }}
          />
          <TouchableOpacity style={styles.button} onPress={calcularInvestimento}>
            <Text style={styles.buttonText}>Calcular Investimento</Text>
          </TouchableOpacity>
          {valorFinal !== null && (
            <Text style={styles.result}>
              Percentual: {percentual || 'N/A'}%{'\n'}
              Valor Calculado: R$ {valorFinal.toFixed(2)}
            </Text>
          )}
          <TouchableOpacity style={styles.button} onPress={salvarInvestimento}>
            <Text style={styles.buttonText}>Salvar Investimento</Text>
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
  totalReceita: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
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
  orText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
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
  result: {
    textAlign: 'center',
    fontSize: Platform.Version >= 34 ? 18 : 16,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 20,
  },
});


