/**
 * Support Store - Zustand
 * Gerenciamento de tickets de suporte
 */

import { create } from 'zustand';
import { saveData, getData, STORAGE_KEYS } from '../services/storage/asyncStorage';
import { auth } from '../services/firebase/config';
import {
  addDocument,
  getDocuments,
  updateDocument,
} from '../services/firebase/firestore';
import { COLLECTIONS } from '../services/firebase/config';

const useSupportStore = create((set, get) => ({
  // =====================
  // ESTADO
  // =====================
  tickets: [],
  faqs: [],
  loading: false,

  // =====================
  // FAQs
  // =====================
  loadFAQs: () => {
    set({
      faqs: [
        {
          id: '1',
          category: 'Geral',
          question: 'Como funciona o app?',
          answer:
            'O app permite controlar receitas, despesas, investimentos e metas financeiras, com relatórios e backup dos dados.',
        },
        {
          id: '2',
          category: 'Geral',
          question: 'Como criar uma transação?',
          answer:
            'Vá em Transações, toque em "+", escolha o tipo, preencha os campos e salve.',
        },
        {
          id: '3',
          category: 'Premium',
          question: 'O que está incluído no Premium?',
          answer:
            'Relatórios avançados, metas ilimitadas, backup ilimitado e exportação de dados.',
        },
        {
          id: '4',
          category: 'Backup',
          question: 'Como funciona o backup?',
          answer:
            'O backup salva seus dados com segurança na nuvem. Você pode criar backups manuais ou automáticos.',
        },
        {
          id: '5',
          category: 'Conta',
          question: 'Como excluir minha conta?',
          answer:
            'Envie um ticket solicitando a exclusão da conta.',
        },
      ],
    });
  },

  // =====================
  // CARREGAR TICKETS
  // =====================
  loadTickets: async () => {
    const user = auth.currentUser;
    if (!user) return;

    set({ loading: true });

    try {
      const tickets = await getDocuments(
        COLLECTIONS.SUPPORT_TICKETS,
        { field: 'userId', operator: '==', value: user.uid },
        { field: 'createdAt', direction: 'desc' }
      );

      set({ tickets, loading: false });
      await saveData(STORAGE_KEYS.SUPPORT_TICKETS, tickets);
    } catch (error) {
      console.error('Erro ao carregar tickets:', error);

      const localTickets = await getData(STORAGE_KEYS.SUPPORT_TICKETS);
      set({ tickets: localTickets || [], loading: false });
    }
  },

  // =====================
  // CRIAR TICKET
  // =====================
  createTicket: async ticketData => {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    set({ loading: true });

    try {
      const now = new Date().toISOString();

const ticket = {
  userId: user.uid,
  userEmail: user.email,
  userName: user.displayName || 'Usuário',
  subject: ticketData.subject,
  category: ticketData.category,
  description: ticketData.description,
  priority: ticketData.priority || 'medium',
  status: 'open',

  createdAt: now,
  updatedAt: now,

  messages: [
    {
      id: Date.now().toString(),
      sender: 'user',
      senderName: user.displayName || 'Você',
      text: ticketData.description,
      createdAt: now,
    },
  ],
  rating: null,
};


      const id = await addDocument(COLLECTIONS.SUPPORT_TICKETS, ticket);

      const newTicket = { id, ...ticket };

      set(state => ({
        tickets: [newTicket, ...state.tickets],
        loading: false,
      }));

      await saveData(STORAGE_KEYS.SUPPORT_TICKETS, get().tickets);

      return { success: true, ticket: newTicket };
    } catch (error) {
      console.error('Erro ao criar ticket:', error);
      set({ loading: false });
      return { success: false, error: error.message };
    }
  },

  // =====================
  // ADICIONAR MENSAGEM
  // =====================
  addMessage: async (ticketId, messageText) => {
    const user = auth.currentUser;
    if (!user) return { success: false };

    try {
      const message = {
        id: Date.now().toString(),
        sender: 'user',
        senderName: user.displayName || 'Você',
        text: messageText,
        createdAt: new Date().toISOString(),
      };

      const ticket = get().tickets.find(t => t.id === ticketId);
      if (!ticket) return { success: false };

      const updatedMessages = [...ticket.messages, message];

      await updateDocument(COLLECTIONS.SUPPORT_TICKETS, ticketId, {
        messages: updatedMessages,
        updatedAt: new Date().toISOString(),
      });

      set(state => ({
        tickets: state.tickets.map(t =>
          t.id === ticketId ? { ...t, messages: updatedMessages } : t
        ),
      }));

      await saveData(STORAGE_KEYS.SUPPORT_TICKETS, get().tickets);

      return { success: true };
    } catch (error) {
      console.error('Erro ao adicionar mensagem:', error);
      return { success: false, error: error.message };
    }
  },

  // =====================
  // REAL‑TIME SUBSCRIPTION
  // =====================
  subscribeToTicket: (ticketId, callback) => {
    // returns unsubscribe function
    const { db } = require('../services/firebase/config');
    const { doc, onSnapshot } = require('firebase/firestore');
    const ref = doc(db, COLLECTIONS.SUPPORT_TICKETS, ticketId);
    const unsub = onSnapshot(ref, snap => {
      const data = snap.data();
      if (data) {
        callback(data);
      }
    });
    return unsub;
  },

  // =====================
  // AVALIAR TICKET
  // =====================
  rateTicket: async (ticketId, rating, feedback) => {
    try {
      await updateDocument(COLLECTIONS.SUPPORT_TICKETS, ticketId, {
        rating,
        ratingFeedback: feedback || null,
      });

      set(state => ({
        tickets: state.tickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, rating, ratingFeedback: feedback }
            : ticket
        ),
      }));

      await saveData(STORAGE_KEYS.SUPPORT_TICKETS, get().tickets);

      return { success: true };
    } catch (error) {
      console.error('Erro ao avaliar ticket:', error);
      return { success: false, error: error.message };
    }
  },

  // =====================
  // FECHAR TICKET
  // =====================
  closeTicket: async ticketId => {
    try {
      await updateDocument(COLLECTIONS.SUPPORT_TICKETS, ticketId, {
        status: 'closed',
        closedAt: new Date().toISOString(),
      });

      set(state => ({
        tickets: state.tickets.map(ticket =>
          ticket.id === ticketId
            ? { ...ticket, status: 'closed' }
            : ticket
        ),
      }));

      await saveData(STORAGE_KEYS.SUPPORT_TICKETS, get().tickets);

      return { success: true };
    } catch (error) {
      console.error('Erro ao fechar ticket:', error);
      return { success: false, error: error.message };
    }
  },
}));

export default useSupportStore;
