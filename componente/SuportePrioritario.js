import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { db, collection, addDoc, onSnapshot } from './Firebase';

export default function SuportePrioritario() {
  const [mensagem, setMensagem] = useState('');
  const [mensagens, setMensagens] = useState([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // Escuta as mudanças na coleção "suporte" em tempo real
    const unsubscribe = onSnapshot(collection(db, 'suporte'), (snapshot) => {
      const dados = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMensagens(dados);
    });

    // Limpar o listener quando o componente desmontar
    return () => unsubscribe();
  }, []);

  const enviarMensagem = async () => {
    if (!mensagem.trim()) {
      Alert.alert('Erro', 'A mensagem não pode estar vazia.');
      return;
    }

    if (mensagem.length < 10) {
      Alert.alert('Erro', 'A mensagem deve ter pelo menos 10 caracteres.');
      return;
    }

    setEnviando(true);
    try {
      await addDoc(collection(db, 'suporte'), {
        mensagem: mensagem.trim(),
        dataEnvio: new Date().toISOString(),
        resposta: '', // Campo para a resposta do suporte
        respondido: false, // Indica que a mensagem ainda não foi respondida
      });
      Alert.alert('Sucesso', 'Mensagem enviada com sucesso!');
      setMensagem('');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar sua mensagem.');
      console.error('Erro ao enviar mensagem:', error);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Suporte Prioritário</Text>

      {/* Campo de entrada para mensagem */}
      <TextInput
        style={styles.input}
        placeholder="Digite sua mensagem (mín. 10 caracteres)"
        multiline
        maxLength={500}
        value={mensagem}
        onChangeText={setMensagem}
      />
      <TouchableOpacity style={styles.button} onPress={enviarMensagem} disabled={enviando}>
        {enviando ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enviar Mensagem</Text>
        )}
      </TouchableOpacity>

      {/* Mensagens enviadas */}
      <Text style={styles.subTitle}>Suas Mensagens</Text>
      <FlatList
        data={mensagens}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.mensagemContainer}>
            <Text style={styles.mensagemText}>
              <Text style={styles.bold}>Você:</Text> {item.mensagem}
            </Text>
            <Text style={styles.respostaText}>
              <Text style={styles.bold}>Suporte:</Text> {item.respondido ? item.resposta : 'Aguardando resposta...'}
            </Text>
          </View>
        )}
      />
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
    textAlign: 'center',
    color: '#007acc',
    marginBottom: 20,
  },
  input: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007acc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 15,
    color: '#555',
  },
  mensagemContainer: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
    elevation: 2,
  },
  mensagemText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  respostaText: {
    fontSize: 16,
    color: '#007acc',
  },
  bold: {
    fontWeight: 'bold',
  },
});

