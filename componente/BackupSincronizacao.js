import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { db, auth } from './Firebase';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function BackupSincronizacao() {
  const [dadosLocais, setDadosLocais] = useState({});
  const [dadosSincronizados, setDadosSincronizados] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDadosLocais();
  }, []);

  const carregarDadosLocais = async () => {
    setLoading(true);
    try {
      const receitasSnapshot = await getDocs(collection(db, 'receitas'));
  
      const receitasArray = receitasSnapshot.docs.map(doc => ({
        descricao: doc.data().descricao || 'Sem descrição',
        valor: parseFloat(doc.data().valor) || 0,
      }));
  
      const dados = {
        receitas: receitasArray,
      };
      setDadosLocais(dados);
    } catch (error) {
      console.error('Erro ao carregar dados locais:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados locais.');
    } finally {
      setLoading(false);
    }
  };

  const salvarBackup = async () => {
    const usuario = auth.currentUser;
    if (!usuario) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    Alert.alert(
      'Confirmação',
      'Tem certeza que deseja salvar o backup?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salvar',
          onPress: async () => {
            try {
              setLoading(true);
              const docRef = doc(db, 'backups', usuario.uid);
              await setDoc(docRef, dadosLocais);
              Alert.alert('Sucesso', 'Backup salvo na nuvem com sucesso!');
            } catch (error) {
              console.error('Erro ao salvar backup:', error);
              Alert.alert('Erro', 'Não foi possível salvar o backup.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const restaurarBackup = async () => {
    const usuario = auth.currentUser;
    if (!usuario) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }

    try {
      setLoading(true);
      const docRef = doc(db, 'backups', usuario.uid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const dados = snapshot.data();
        setDadosSincronizados(dados);
        Alert.alert('Sucesso', 'Dados sincronizados com sucesso!');
      } else {
        Alert.alert('Nenhum backup encontrado.');
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      Alert.alert('Erro', 'Não foi possível restaurar o backup.');
    } finally {
      setLoading(false);
    }
  };

  const isDataSynced = JSON.stringify(dadosLocais) === JSON.stringify(dadosSincronizados);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backup e Sincronização</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007acc" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={salvarBackup}>
            <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}> Salvar Backup</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={restaurarBackup}>
            <Ionicons name="cloud-download-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}> Restaurar Backup</Text>
          </TouchableOpacity>

          <Text style={{ color: isDataSynced ? 'green' : 'red', textAlign: 'center', marginTop: 10 }}>
            {isDataSynced ? 'Dados sincronizados' : 'Dados diferentes'}
          </Text>
        </>
      )}

      <ScrollView style={styles.section}>
        <Text style={styles.subtitle}>Dados Locais:</Text>
        <View style={styles.dataContainer}>
          {dadosLocais.receitas?.map((item, index) => (
            <Text key={index} style={styles.dataItem}>- {item.descricao}: R$ {item.valor.toFixed(2)}</Text>
          )) || <Text style={styles.dataItem}>Nenhum dado local disponível</Text>}
        </View>
      </ScrollView>

      <ScrollView style={styles.section}>
        <Text style={styles.subtitle}>Dados Sincronizados:</Text>
        <View style={styles.dataContainer}>
          {dadosSincronizados.receitas?.map((item, index) => (
            <Text key={index} style={styles.dataItem}>- {item.descricao}: R$ {item.valor.toFixed(2)}</Text>
          )) || <Text style={styles.dataItem}>Nenhum dado sincronizado disponível</Text>}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007acc',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    elevation: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dataContainer: {
    padding: 10,
  },
  dataItem: {
    fontSize: 16,
    marginBottom: 5,
  },
});


