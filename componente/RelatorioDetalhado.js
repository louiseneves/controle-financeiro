import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import { db, collection, getDocs, deleteDoc, doc } from './Firebase';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function RelatorioConsolidado() {
  const [dados, setDados] = useState({
    receitas: [],
    investimentos: [],
    ofertas: [],
    dizimos: [],
    contas: [],
  });
  const [totais, setTotais] = useState({
    receitas: 0,
    investimentos: 0,
    ofertas: 0,
    dizimos: 0,
    contas: 0,
    saldo: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const categorias = ['receitas', 'investimentos', 'ofertas', 'dizimo', 'contas'];
      const novosDados = {};
      const novosTotais = { receitas: 0, investimentos: 0, ofertas: 0, dizimo: 0, contas: 0 };
  
      for (const categoria of categorias) {
        const querySnapshot = await getDocs(collection(db, categoria));
        const itens = [];
        let total = 0;
  
        querySnapshot.forEach((doc) => {
          const item = doc.data();
          itens.push({ id: doc.id, ...item });
          total += parseFloat(item.valor) || 0;
        });
  
        if (categoria === 'dizimo') {
          novosDados['dizimos'] = itens;
          novosTotais['dizimos'] = total;
        } else {
          novosDados[categoria] = itens;
          novosTotais[categoria] = total;
        }
      }
  
      novosTotais.saldo =
        novosTotais.receitas - 
        (novosTotais.investimentos + 
         novosTotais.ofertas + 
         novosTotais.dizimos + 
         novosTotais.contas);
  
      setDados(novosDados);
      setTotais(novosTotais);
      console.log('Totais Calculados:', novosTotais);
      console.log('Dízimos:', novosTotais.dizimos);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };
  
  const excluirItem = async (categoria, id) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza de que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          onPress: async () => {
            try {
              await deleteDoc(doc(db, categoria, id));
              Alert.alert('Sucesso', 'Item excluído com sucesso!');
              carregarDados();
            } catch (error) {
              Alert.alert('Erro', 'Não foi possível excluir o item.');
              console.log(error);
            }
          },
        },
      ]
    );
  };

  const gerarRelatorioPdf = async () => {
    const htmlContent = `
      <html>
        <body>
          <h1>Relatório Consolidado</h1>
          <h2>Saldos Totais</h2>
          <p>Receitas: R$ ${totais.receitas.toFixed(2)}</p>
          <p>Investimentos: R$ ${totais.investimentos.toFixed(2)}</p>
          <p>Ofertas: R$ ${totais.ofertas.toFixed(2)}</p>
          <p>Dízimos: R$ ${totais.dizimos.toFixed(2)}</p>
          <p>Contas: R$ ${totais.contas.toFixed(2)}</p>
          <p><strong>Saldo Total: R$ ${totais.saldo.toFixed(2)}</strong></p>

          <h2>Detalhamento</h2>
          ${Object.keys(dados)
            .map(
              (categoria) => `
                <h3>${categoria.charAt(0).toUpperCase() + categoria.slice(1)}</h3>
                <table border="1" style="width: 100%; text-align: left;">
                  <thead>
                    <tr>
                      <th>Descrição</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${dados[categoria]
                      .map(
                        (item) => `
                          <tr>
                            <td>${item.descricao || 'Sem descrição'}</td>
                            <td>R$ ${item.valor?.toFixed(2) || '0.00'}</td>
                          </tr>
                        `
                      )
                      .join('')}
                  </tbody>
                </table>
              `
            )
            .join('')}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Relatório Consolidado</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007acc" />
      ) : (
        <>
          <View style={styles.totaisContainer}>
            <Text style={styles.totalText}>Receitas: R$ {totais.receitas.toFixed(2)}</Text>
            <Text style={styles.totalText}>Investimentos: R$ {totais.investimentos.toFixed(2)}</Text>
            <Text style={styles.totalText}>Ofertas: R$ {totais.ofertas.toFixed(2)}</Text>
            <Text style={styles.totalText}>Dízimos: R$ {totais.dizimos.toFixed(2)}</Text>
            <Text style={styles.totalText}>Contas: R$ {totais.contas.toFixed(2)}</Text>
            <Text style={styles.totalText}>Saldo Total: R$ {totais.saldo.toFixed(2)}</Text>
          </View>
          <FlatList
            data={dados.receitas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.item}>
                <Text style={styles.descText}>Descrição: {item.descricao}</Text>
                <Text>Valor: R$ {item.valor?.toFixed(2)}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => excluirItem('receitas', item.id)}
                >
                  <Text style={styles.deleteButtonText}>Excluir</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.button} onPress={gerarRelatorioPdf}>
            <Text style={styles.buttonText}>Gerar Relatório em PDF</Text>
          </TouchableOpacity>
        </>
      )}
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
    textAlign: 'center', 
    marginBottom: 20 
  },
  totaisContainer: { 
    marginBottom: 20 
  },
  totalText: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  item: { 
    padding: 15,
    borderWidth: 1, 
    borderColor: '#ccc', 
    borderRadius: 5, 
    marginBottom: 10 
  },
  deleteButton: { 
    backgroundColor: '#ff4d4d', 
    padding: 10, 
    borderRadius: 5, 
    alignItems: 'center' 
  },
  deleteButtonText: { 
    color: '#fff', 
    fontSize: Platform.Version >= 34 ? 14 : 12,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System', 
  },
  button: { 
    backgroundColor: '#007acc', 
    padding: 15, borderRadius: 5, 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System', 
    fontWeight: 'bold' 
  },
  descText:{
    fontSize: Platform.Version >= 34 ? 14 : 12,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
  }
});
