import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { db } from './Firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function HistoricoScreen() {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [dataFiltro, setDataFiltro] = useState('');

  const carregarHistorico = async () => {
    setLoading(true);
    try {
      const [receitasSnapshot, dizimosSnapshot, ofertasSnapshot, investimentosSnapshot, contasSnapshot] = await Promise.all([
        getDocs(collection(db, 'receitas')),
        getDocs(collection(db, 'dizimos')),
        getDocs(collection(db, 'ofertas')),
        getDocs(collection(db, 'investimentos')),
        getDocs(collection(db, 'contas')),
      ]);

      const mapData = (snapshot, tipo) =>
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return { ...data, tipo, data: data.data ? data.data.toDate() : null };
        });

      const historicoArray = [
        ...mapData(receitasSnapshot, 'Receita'),
        ...mapData(dizimosSnapshot, 'Dízimo'),
        ...mapData(ofertasSnapshot, 'Oferta'),
        ...mapData(investimentosSnapshot, 'Investimento'),
        ...mapData(contasSnapshot, 'Conta'),
      ].sort((a, b) => b.data - a.data);

      setHistorico(historicoArray);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar o histórico.');
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltro = () => {
    let filtered = [...historico];
    if (filtro) {
      filtered = filtered.filter((item) => item.tipo.toLowerCase().includes(filtro.toLowerCase()));
    }
    if (dataFiltro) {
      filtered = filtered.filter((item) =>
        item.data && item.data.toISOString().startsWith(dataFiltro)
      );
    }
    setHistorico(filtered);
  };

  useEffect(() => {
    carregarHistorico();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0099ff" />
      ) : (
        <>
          <Text style={styles.title}>Histórico</Text>

          {/* Filtro */}
          <View style={styles.filterContainer}>
            <TextInput
              style={styles.input}
              placeholder="Filtrar por tipo (ex: Receita)"
              value={filtro}
              onChangeText={setFiltro}
            />
            <TextInput
              style={styles.input}
              placeholder="Filtrar por data (ex: 2024-01)"
              value={dataFiltro}
              onChangeText={setDataFiltro}
            />
            <TouchableOpacity style={styles.button} onPress={aplicarFiltro}>
              <Text style={styles.buttonText}>Aplicar Filtro</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={historico}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.itemText}>
                  {item.tipo}: R$ {item.valor.toFixed(2)} -{' '}
                  {item.data ? item.data.toLocaleDateString() : 'Data indisponível'}
                </Text>
              </View>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007acc',
  },
  filterContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#0099ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eef',
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});

