import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useStripe, CardField } from '@stripe/stripe-react-native';

export default function PagamentoScreen({ route }) {
  const { pacote } = route.params;
  const [email, setEmail] = useState('');
  const [isCardComplete, setIsCardComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const { confirmPayment } = useStripe();
  const navigation = useNavigation();

  const API_BASE_URL = 'http://10.0.2.2:3000';

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handlePayment = async () => {
    if (!email || !validarEmail(email)) {
      Alert.alert('Erro', 'Digite um e-mail válido para continuar.');
      return;
    }

    if (!isCardComplete) {
      Alert.alert('Erro', 'Os detalhes do cartão estão incompletos.');
      return;
    }

    setLoading(true);

    try {
      // Criação do Payment Intent no backend
      const response = await fetch(`${API_BASE_URL}/criar-payment-intent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: pacote.preco.replace(/[^\d]/g, '') * 100 }),
      });

      if (!response.ok) throw new Error(`Erro no servidor: ${response.status}`);
      const { clientSecret } = await response.json();

      // Confirmação do pagamento
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: { billingDetails: { email } },
      });

      if (error) {
        Alert.alert('Erro no pagamento', error.message);
        return;
      }

      // Atualizar status do usuário no backend
      const updateResponse = await fetch(`${API_BASE_URL}/atualizar-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.message || 'Erro ao atualizar status.');
      }

      Alert.alert('Sucesso', 'Pagamento realizado com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', error.message || 'Ocorreu um erro no pagamento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pagamento para o pacote {pacote.descricao}</Text>
      <Text style={styles.price}>Preço: {pacote.preco}</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu e-mail"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <CardField
        postalCodeEnabled={false}
        placeholders={{ number: 'Número do cartão' }}
        onCardChange={(details) => setIsCardComplete(details.complete)}
        style={styles.cardField}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#007acc" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handlePayment}>
          <Text style={styles.buttonText}>Pagar {pacote.preco}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#007acc',
  },
  price: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  cardField: {
    height: 50,
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#007acc',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

