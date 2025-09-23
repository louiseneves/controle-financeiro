import express from 'express';
import stripe from 'stripe';
import bodyParser from 'body-parser';
import cors from 'cors';
import { db, doc, updateDoc, collection, query, where, getDocs } from './Firebase.js' // Certifique-se de que o caminho está correto

// Inicialização do Stripe e Express
const app = express();
const stripeInstance = stripe('sk_test_51OD7zLHn21NxuraNUXARi3qwWa8suZkVTqYwagm9aRcmpwxxqpqWxdp11CoZjVv4RBcWXqbyA1MwZVdHOmurOlEN00HGdoKGeM');

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Endpoint: Criar PaymentIntent
app.post('/criar-payment-intent', async (req, res) => {
  const { amount } = req.body;

  if (!amount || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Valor inválido. Certifique-se de que é um número.' });
  }

  try {
    console.log(`Criando PaymentIntent para o valor: ${amount}`);
    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: amount,
      currency: 'brl',
      payment_method_types: ['card'],
    });

    console.log('PaymentIntent criado:', paymentIntent.id);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Erro ao criar PaymentIntent:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint: Atualizar Status do Usuário
app.post('/atualizar-status', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'E-mail não fornecido.' });
  }

  try {
    console.log(`Procurando usuário com e-mail: ${email}`);
    const userQuery = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.log('Usuário não encontrado no Firestore.');
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    const userDocRef = querySnapshot.docs[0].ref;
    console.log(`Atualizando status do usuário: ${userDocRef.id}`);
    await updateDoc(userDocRef, { isPremium: true });

    console.log('Status do usuário atualizado com sucesso.');
    res.json({ success: true, message: 'Status atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar status no Firestore:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar status.',
      error: error.message,
    });
  }
});
// Endpoint: Cancelar Assinatura
app.post('/cancelar-assinatura', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: 'E-mail não fornecido.' });
  }

  try {
    console.log(`Procurando usuário com e-mail: ${email}`);
    const userQuery = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(userQuery);

    if (querySnapshot.empty) {
      console.log('Usuário não encontrado no Firestore.');
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    // Pega o documento do usuário
    const userDoc = querySnapshot.docs[0];
    const userDocRef = userDoc.ref;
    const userData = userDoc.data();

    if (!userData.subscriptionId) {
      return res.status(400).json({ success: false, message: 'Usuário não possui assinatura ativa no Stripe.' });
    }

    // Cancela a assinatura no Stripe
    console.log(`Cancelando assinatura no Stripe: ${userData.subscriptionId}`);
    await stripe.subscriptions.cancel(userData.subscriptionId);

    // Atualiza Firestore
    console.log(`Removendo status premium do usuário: ${userDocRef.id}`);
    await updateDoc(userDocRef, { isPremium: false, subscriptionId: null });

    console.log('Assinatura cancelada com sucesso.');
    res.json({ success: true, message: 'Assinatura cancelada com sucesso.' });
  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error.message);
    res.status(500).json({
      success: false,
      message: 'Erro ao cancelar assinatura.',
      error: error.message,
    });
  }
});

app.post('/cancelar-renovacao', async (req, res) => {
  const { subscriptionId } = req.body;

  try {
    const deletedSubscription = await stripeInstance.subscriptions.del(subscriptionId);
    res.json({ success: true, message: 'Renovação cancelada.', subscription: deletedSubscription });
  } catch (error) {
    console.error('Erro ao cancelar renovação automática:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});
app.post('/responder-mensagem', async (req, res) => {
  const { mensagemId, resposta } = req.body;

  if (!mensagemId || !resposta) {
    return res.status(400).json({ success: false, message: 'Dados inválidos.' });
  }

  try {
    const mensagemRef = doc(db, 'suporte', mensagemId);
    await updateDoc(mensagemRef, {
      resposta,
      respondido: true,
    });
    res.json({ success: true, message: 'Resposta enviada com sucesso.' });
  } catch (error) {
    console.error('Erro ao responder mensagem:', error);
    res.status(500).json({ success: false, message: 'Erro ao responder mensagem.' });
  }
});
// Inicialização do Servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
