import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';

export default function PremiumScreen({ navigation }) {
  const scaleValue = new Animated.Value(1);

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.1,
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

  const navegarParaPacotesPremium = () => {
    animateButton();
    navigation.navigate('PacotesPremium');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Versão Premium</Text>
      <Text style={styles.description}>
        A versão premium oferece funcionalidades exclusivas para potencializar sua experiência:
      </Text>
      <View style={styles.featuresContainer}>
        <Text style={styles.feature}>✨ Relatórios detalhados</Text>
        <Text style={styles.feature}>✨ Suporte prioritário</Text>
        <Text style={styles.feature}>✨ Acesso antecipado a novas funcionalidades</Text>
        <Text style={styles.feature}>✨ Backup e sincronização na nuvem</Text>
        <Text style={styles.feature}>✨ Planejamento financeiro avançado</Text>
      </View>
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity style={styles.button} onPress={navegarParaPacotesPremium}>
          <Text style={styles.buttonText}>Assinar Premium</Text>
        </TouchableOpacity>
      </Animated.View>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007acc',
  },
  description: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    marginBottom: 30,
    paddingHorizontal: 10,
    lineHeight: 24,
  },
  featuresContainer: {
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  feature: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#0099ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: Platform.Version >= 34 ? 18 : 16,
        lineHeight: Platform.Version >= 34 ? 26 : 24,
        fontFamily: Platform.OS === 'android' ? 'Roboto' : 'System',
    fontWeight: 'bold',
  },
});

