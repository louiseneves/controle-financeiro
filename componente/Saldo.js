import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import { db } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function SaldoScreen() {
  const [receitas, setReceitas] = useState([]);
  const [dizimos, setDizimos] = useState([]);
  const [ofertas, setOfertas] = useState([]);
  const [investimentos, setInvestimentos] = useState([]);
  const [contas, setContas] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState('');

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [receitasSnapshot, dizimosSnapshot, ofertasSnapshot, investimentosSnapshot, contasSnapshot] = await Promise.all([
        getDocs(collection(db, 'receitas')),
        getDocs(collection(db, 'dizimo')),
        getDocs(collection(db, 'ofertas')),
        getDocs(collection(db, 'investimentos')),
        getDocs(collection(db, 'contas')),
      ]);

      const receitasArray = receitasSnapshot.docs.map((doc) => doc.data());
      const dizimosArray = dizimosSnapshot.docs.map((doc) => doc.data());
      const ofertasArray = ofertasSnapshot.docs.map((doc) => doc.data());
      const investimentosArray = investimentosSnapshot.docs.map((doc) => doc.data());
      const contasArray = contasSnapshot.docs.map((doc) => doc.data());

      const totalReceitas = receitasArray.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0);
      const totalDizimos = dizimosArray.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0);
      const totalOfertas = ofertasArray.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0);
      const totalInvestimentos = investimentosArray.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0);
      const totalContas = contasArray.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0);
      
      setReceitas(receitasArray);
      setDizimos(dizimosArray);
      setOfertas(ofertasArray);
      setInvestimentos(investimentosArray);
      setContas(contasArray);

      setSaldo(totalReceitas - totalDizimos - totalOfertas - totalInvestimentos - totalContas);
      setUltimaAtualizacao(new Date().toLocaleString());

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0099ff" />
      ) : (
        <>
          <Text style={styles.title}>Saldo Disponível</Text>
          <Text style={[styles.saldoText, { color: saldo >= 0 ? 'green' : 'red' }]}>
            R$ {saldo.toFixed(2)}
          </Text>

          <View style={styles.details}>
            <Text style={styles.detailText}>Total Receitas: R$ {receitas.reduce((acc, curr) => acc + parseFloat(curr.valor), 0).toFixed(2)}</Text>
            <Text style={styles.detailText}>Total Dízimos: R$ {dizimos.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0).toFixed(2)}</Text>
            <Text style={styles.detailText}>Total Ofertas: R$ {ofertas.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0).toFixed(2)}</Text>
            <Text style={styles.detailText}>Total Investimentos: R$ {investimentos.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0).toFixed(2)}</Text>
            <Text style={styles.detailText}>Total Contas: R$ {contas.reduce((acc, curr) => acc + (parseFloat(curr.valor) || 0), 0).toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={carregarDados}>
            <Text style={styles.buttonText}>Atualizar Dados</Text>
          </TouchableOpacity>
          <Text style={styles.lastUpdateText}>Última atualização: {ultimaAtualizacao}</Text>
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
  saldoText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  details: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#eef',
    borderRadius: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
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
  lastUpdateText: {
    textAlign: 'center',
    fontSize: Platform.Version >= 34 ? 14 : 12,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    color: '#555',
  },
});
