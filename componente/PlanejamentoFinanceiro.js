import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal} from 'react-native';
import { db, collection, addDoc, getDocs, updateDoc, doc } from './Firebase';

export default function PlanejamentoFinanceiro() {
  const [categoria, setCategoria] = useState('');
  const [limite, setLimite] = useState('');
  const [orcamentos, setOrcamentos] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoGasto, setNovoGasto] = useState('');
  const [idAtualizando, setIdAtualizando] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarOrcamentos();
  }, []);

  const carregarOrcamentos = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'orcamentos'));
      const dados = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrcamentos(dados);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os orçamentos.');
    } finally {
      setLoading(false);
    }
  };

  const salvarOrcamento = async () => {
    if (!categoria || !limite || isNaN(parseFloat(limite)) || parseFloat(limite) <= 0) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'orcamentos'), {
        categoria,
        limite: parseFloat(limite),
        gastoAtual: 0,
      });
      Alert.alert('Sucesso', 'Orçamento adicionado com sucesso!');
      setCategoria('');
      setLimite('');
      carregarOrcamentos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o orçamento.');
    } finally {
      setLoading(false);
    }
  };

  const atualizarGasto = async () => {
    if (!novoGasto || isNaN(parseFloat(novoGasto)) || parseFloat(novoGasto) < 0) {
      Alert.alert('Erro', 'Digite um valor válido para o gasto.');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'orcamentos', idAtualizando);
      await updateDoc(docRef, { gastoAtual: parseFloat(novoGasto) });
      Alert.alert('Sucesso', 'Gasto atualizado com sucesso!');
      setModalVisible(false);
      setNovoGasto('');
      carregarOrcamentos();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o gasto.');
    } finally {
      setLoading(false);
    }
  };

  const calcularResumo = () => {
    const totalGasto = orcamentos.reduce((acc, curr) => acc + curr.gastoAtual, 0);
    const totalLimite = orcamentos.reduce((acc, curr) => acc + curr.limite, 0);
    return {
      totalGasto,
      totalLimite,
      percentualUsado: ((totalGasto / totalLimite) * 100).toFixed(1),
    };
  };

  const { totalGasto, totalLimite, percentualUsado } = calcularResumo();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planejamento Financeiro</Text>

      <View style={styles.resumoContainer}>
        <Text style={styles.resumoText}>Gasto Total: R$ {totalGasto.toFixed(2)}</Text>
        <Text style={styles.resumoText}>Limite Total: R$ {totalLimite.toFixed(2)}</Text>
        <Text style={[styles.resumoText, totalGasto > totalLimite && { color: 'red' }]}>
          Usado: {percentualUsado}%
        </Text>
        {totalGasto > totalLimite && (
          <Text style={[styles.resumoText, { color: 'red' }]}>
            Aviso: O limite total foi excedido!
          </Text>
        )}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Categoria (ex: Alimentação)"
        value={categoria}
        onChangeText={setCategoria}
      />
      <TextInput
        style={styles.input}
        placeholder="Limite (R$)"
        value={limite}
        onChangeText={setLimite}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={salvarOrcamento}>
        <Text style={styles.buttonText}>Adicionar Orçamento</Text>
      </TouchableOpacity>

      <FlatList
        data={orcamentos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.orcamentoItem, item.gastoAtual > item.limite && styles.orcamentoItemExcedido]}>
            <Text style={styles.orcamentoText}>Categoria: {item.categoria}</Text>
            <Text style={styles.orcamentoText}>
              Gasto Atual: R$ {item.gastoAtual?.toFixed(2)} / Limite: R$ {item.limite?.toFixed(2)}
            </Text>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => {
                setIdAtualizando(item.id);
                setNovoGasto(String(item.gastoAtual || 0));
                setModalVisible(true);
              }}
            >
              <Text style={styles.alertButtonText}>Atualizar Gasto</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atualizar Gasto</Text>
            <TextInput
              style={styles.input}
              placeholder="Novo Gasto (R$)"
              value={novoGasto}
              onChangeText={setNovoGasto}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={atualizarGasto}>
              <Text style={styles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#ff4d4d' }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    backgroundColor: '#f5f5f5' 
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#007acc' 
  },
  resumoContainer: { 
    marginBottom: 20 
  },
  resumoText: { 
    fontSize: 16, 
    marginBottom: 5 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 10, 
    backgroundColor: '#fff' 
  },
  button: { 
    backgroundColor: '#007acc', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center', 
    marginVertical: 10 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold' 
  },
  orcamentoItem: { 
    padding: 15, 
    backgroundColor: '#fff', 
    borderRadius: 5, 
    marginBottom: 10, 
    elevation: 5 
  },
  orcamentoItemExcedido: { 
    backgroundColor: '#ffd6d6' 
  },
  orcamentoText: { 
    fontSize: 16, 
    marginBottom: 5 
  },
  alertButton: { 
    backgroundColor: '#ffa726', 
    padding: 10, 
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 10 
  },
  alertButtonText: { 
    color: '#fff', 
    fontSize: Platform.Version >= 34 ? 14 : 12,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System', 
  },
  modalContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalContent: { 
    width: 300, 
    padding: 20, 
    backgroundColor: '#fff', 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  modalTitle: { 
    fontSize: Platform.Version >= 34 ? 20 : 18,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System', 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
});
