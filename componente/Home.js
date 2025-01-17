import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { auth, signOut } from './Firebase';
import { db, doc,onSnapshot } from './Firebase';

export default function Home() {
  const navigation = useNavigation();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStatus = () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
  
        // Listener para mudanças em tempo real
        const unsubscribe = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const userData = docSnap.data();
              setIsPremium(userData.isPremium || false);
            } else {
              console.warn('Documento do usuário não encontrado no Firestore.');
            }
            setLoading(false);
          },
          (error) => {
            console.error('Erro no listener:', error);
            setLoading(false);
          }
        );
  
        // Retorna a função de limpeza do listener ao desmontar o componente
        return unsubscribe;
      }
    };
  
    return fetchUserStatus();
  }, []);
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logout bem-sucedido!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro ao sair', error.message);
    }
  };

  const DATA = [
    { id: '1', title: 'Registrar Receita', screen: 'Receita', icon: 'attach-money' },
    { id: '2', title: 'Calcular Dízimo', screen: 'Dizimo', icon: 'money-off' },
    { id: '3', title: 'Registrar Oferta', screen: 'Oferta', icon: 'card-giftcard' },
    { id: '4', title: 'Calcular Investimento', screen: 'Investimento', icon: 'trending-up' },
    { id: '5', title: 'Gerenciar Contas', screen: 'Contas', icon: 'account-balance-wallet' },
    { id: '6', title: 'Gerenciar Saldo', screen: 'Saldo', icon: 'account-balance' },
    { id: '7', title: 'Ver Histórico', screen: 'Historico', icon: 'history' },
    ...(isPremium
      ? [
          { id: '8', title: 'Relatório Detalhado', screen: 'RelatorioDetalhado', icon: 'bar-chart' },
          { id: '9', title: 'Suporte Prioritário', screen: 'SuportePrioritario', icon: 'support-agent' },
          { id: '10', title: 'Planejamento Financeiro', screen: 'PlanejamentoFinanceiro', icon: 'event-note' },
          { id: '11', title: 'Backup Sincronização', screen: 'BackupSincronizacao', icon: 'sync' },
          { id: '12', title: 'Meta Financeira', screen: 'MetaFinanceira', icon: 'emoji-events' },
          { id: '13', title: 'Cancelar Assinatura', screen: 'CancelarAssinatura', icon: 'cancel' },
        ]
      : [
          { id: '8', title: 'Versão Premium', screen: 'Premium', icon: 'star-border' },
        ]),
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, item.screen === 'PremiumFeature' && styles.cardPremium]}
      onPress={() => navigation.navigate(item.screen)}
      activeOpacity={0.7}
    >
      <MaterialIcons name={item.icon} size={40} color="#fff" />
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007acc" />
      ) : (
        <FlatList
          data={DATA}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListHeaderComponent={(
            <View style={styles.header}>
              <Text style={styles.headerText}>Painel de Controle Financeiro</Text>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <MaterialIcons name="logout" size={28} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={(
            <View style={styles.footer}>
              <Text style={styles.footerText}>Trazei todos os dízimos à casa do Tesouro. Malaquias 3:10a</Text>
            </View>
          )}
        />
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  header: {
    padding: 20,
    backgroundColor: '#007acc',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: Platform.Version >= 34 ? 24 : 22,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    padding: 10,
  },
  dashboard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#0099ff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#0099ff',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
    elevation: 5,
  },
  cardPremium: {
    backgroundColor: '#FFD700',
  },
  cardText: {
   fontSize: Platform.Version >= 34 ? 18 : 16,
       lineHeight: Platform.Version >= 34 ? 26 : 24,
       fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: '#007acc',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerText: {
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    color: '#fff',
    textAlign: 'center',
  },
});
