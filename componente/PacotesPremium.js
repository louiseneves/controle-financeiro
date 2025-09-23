import React, { useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Animated, Platform } from 'react-native';

export default function PacotesPremiumScreen({ navigation }) {
  const pacotes = [
    { id: '1', descricao: 'Mensal', preco: 'R$ 29,90' },
    { id: '2', descricao: 'Trimestral', preco: 'R$ 79,90' },
    { id: '3', descricao: 'Anual', preco: 'R$ 299,90' },
  ];

  // Animação
  const scaleValue = useRef(new Animated.Value(1)).current;

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (pacote) => {
    animateButton();
    Alert.alert(
      'Confirmar Compra',
      `Deseja comprar o pacote ${pacote.descricao} por ${pacote.preco}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Comprar', onPress: () => realizarCompra(pacote) },
      ]
    );
  };

  const realizarCompra = (pacote) => {
    navigation.navigate('Pagamento', { pacote });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Escolha seu Pacote Premium</Text>
      <View style={styles.cardContainer}>
        {pacotes.map((pacote) => (
          <Animated.View
            key={pacote.id}
            style={[
              styles.card,
              { transform: [{ scale: scaleValue }] },
            ]}
          >
            <TouchableOpacity onPress={() => handlePress(pacote)} activeOpacity={0.8}>
              <Text style={styles.cardText}>{pacote.descricao}</Text>
              <Text style={styles.cardPrice}>{pacote.preco}</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
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
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#0099ff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '45%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 16 : 14,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

