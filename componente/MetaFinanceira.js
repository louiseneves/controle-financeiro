import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, Modal, ActivityIndicator } from 'react-native';
import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from './Firebase';

export default function MetaFinanceiraScreen() {
  const [descricao, setDescricao] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [prazo, setPrazo] = useState('');
  const [economizado, setEconomizado] = useState('');
  const [metas, setMetas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [novoEconomizado, setNovoEconomizado] = useState('');
  const [idAtualizando, setIdAtualizando] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarMetas(); 
  }, []);

  const validarPrazo = (data) => {
    const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
    const hoje = new Date();
    const dataPrazo = new Date(data);

    return regex.test(data) && dataPrazo >= hoje;
  };

  const carregarMetas = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'metasFinanceiras'));
      const dados = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMetas(dados);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as metas.');
    } finally {
      setLoading(false);
    }
  };

  const salvarMeta = async () => {
    if (!descricao || !objetivo || !prazo) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }

    if (!validarPrazo(prazo)) {
      Alert.alert('Erro', 'Insira uma data válida no formato AAAA-MM-DD e que seja futura.');
      return;
    }

    if (isNaN(parseFloat(objetivo)) || parseFloat(objetivo) <= 0) {
      Alert.alert('Erro', 'Insira um valor válido e positivo para o objetivo.');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'metasFinanceiras'), {
        descricao,
        objetivo: parseFloat(objetivo),
        prazo,
        economizado: parseFloat(economizado) || 0,
      });
      Alert.alert('Sucesso', 'Meta adicionada com sucesso!');
      setDescricao('');
      setObjetivo('');
      setPrazo('');
      setEconomizado('');
      carregarMetas();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      Alert.alert('Erro', 'Não foi possível salvar a meta.');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalAtualizar = (id) => {
    setIdAtualizando(id);
    setModalVisible(true);
  };

  const atualizarEconomizado = async () => {
    if (!novoEconomizado || isNaN(parseFloat(novoEconomizado)) || parseFloat(novoEconomizado) <= 0) {
      Alert.alert('Erro', 'Digite um valor válido e positivo para o economizado.');
      return;
    }

    setLoading(true);
    try {
      const docRef = doc(db, 'metasFinanceiras', idAtualizando);
      await updateDoc(docRef, { economizado: parseFloat(novoEconomizado) });
      Alert.alert('Sucesso', 'Economizado atualizado com sucesso!');
      setModalVisible(false);
      setNovoEconomizado('');
      carregarMetas();
    } catch (error) {
      console.error('Erro ao atualizar economizado:', error);
      Alert.alert('Erro', 'Não foi possível atualizar o valor economizado.');
    } finally {
      setLoading(false);
    }
  };

  const excluirMeta = (id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza de que deseja excluir esta meta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const docRef = doc(db, 'metasFinanceiras', id);
              await deleteDoc(docRef);
              Alert.alert('Sucesso', 'Meta excluída com sucesso!');
              carregarMetas();
            } catch (error) {
              console.error('Erro ao excluir meta:', error);
              Alert.alert('Erro', 'Não foi possível excluir a meta.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Metas Financeiras</Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição da Meta"
        value={descricao}
        onChangeText={setDescricao}
      />
      <TextInput
        style={styles.input}
        placeholder="Objetivo (R$)"
        value={objetivo}
        onChangeText={setObjetivo}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Prazo (ex: 2025-12-31)"
        value={prazo}
        onChangeText={setPrazo}
      />
      <TouchableOpacity style={styles.button} onPress={salvarMeta}>
        <Text style={styles.buttonText}>Adicionar Meta</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#007acc" />
      ) : (
        <FlatList
          data={metas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const progresso = (item.economizado / item.objetivo) * 100;
            const concluido = progresso >= 100;

            return (
              <View style={[styles.metaItem, concluido && styles.metaConcluida]}>
                <Text style={styles.metaText}>Descrição: {item.descricao}</Text>
                <Text style={styles.metaText}>
                  Progresso: {progresso.toFixed(2)}% (R$ {item.economizado.toFixed(2)} de R$ {item.objetivo.toFixed(2)})
                </Text>
                <Text style={styles.metaText}>Prazo: {item.prazo}</Text>
                {!concluido && (
                  <TouchableOpacity
                    style={styles.updateButton}
                    onPress={() => abrirModalAtualizar(item.id)}
                  >
                    <Text style={styles.updateButtonText}>Atualizar Economizado</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => excluirMeta(item.id)}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atualizar Economizado</Text>
            <TextInput
              style={styles.input}
              placeholder="Novo Valor Economizado (R$)"
              value={novoEconomizado}
              onChangeText={setNovoEconomizado}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={atualizarEconomizado}>
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
  metaItem: { 
    padding: 15, 
    backgroundColor: '#fff', 
    borderRadius: 5, 
    marginBottom: 10, 
    elevation: 5 
  },
  metaConcluida: { 
    backgroundColor: '#d4edda', 
    borderColor: '#c3e6cb', 
    borderWidth: 1 
  },
  metaText: { 
    fontSize: 16, 
    marginBottom: 5 
  },
  updateButton: { 
    backgroundColor: '#ffa726', 
    padding: 10, 
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 10 
  },
  updateButtonText: { 
    color: '#fff', 
    fontSize: Platform.Version >= 34 ? 14 : 12,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System', 
  },
  deleteButton: { 
    backgroundColor: '#ff4d4d', 
    padding: 10, 
    borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 10 
  },
  deleteButtonText: { 
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
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 15 
  },
});
