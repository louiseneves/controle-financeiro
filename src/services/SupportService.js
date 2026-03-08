// src/services/SupportService.js
/**
 * Serviço de Suporte
 * Gerencia FAQ, tickets de suporte e onboarding
 */

import {
  collection,
  doc,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from './firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations } from '../i18n/translations';

class SupportService {
  constructor() {
    this.userId = null;
  }

  // Inicializar serviço
  initialize() {
    const user = auth.currentUser;
    if (user) {
      this.userId = user.uid;
    }
  }

  // ==================== FAQ ====================

  // Dados do FAQ com traduções
  getFAQData() {
    // Get current language from settings or default to pt-BR
    return (language = 'pt-BR') => {
      const faqItems = translations[language]?.faq?.items || translations['pt-BR'].faq.items;
      return faqItems;
    };
  }

  // Buscar FAQ por categoria
  getFAQByCategory(category, language = 'pt-BR') {
    const faqItems = translations[language]?.faq?.items || translations['pt-BR'].faq.items;
    if (category === 'popular' || category === 'Populares') {
      return faqItems.filter(faq => faq.popular);
    }
    return faqItems.filter(faq => faq.category === category);
  }

  // Buscar FAQ (pesquisa)
  searchFAQ(searchTerm, language = 'pt-BR') {
    const faqItems = translations[language]?.faq?.items || translations['pt-BR'].faq.items;
    const term = searchTerm.toLowerCase();
    return faqItems.filter(
      faq =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );
  }

  // Obter categorias do FAQ
  getFAQCategories(language = 'pt-BR') {
    const categories = translations[language]?.faq?.categories || translations['pt-BR'].faq.categories;
    return [
      { id: 'all', name: categories.all, icon: 'format-list-bulleted' },
      { id: 'popular', name: categories.popular, icon: 'star' },
      { id: 'Geral', name: categories.general, icon: 'help-circle' },
      { id: 'Dízimo', name: categories.tithe, icon: 'hand-heart' },
      { id: 'Investimentos', name: categories.investments, icon: 'chart-line' },
      { id: 'Metas', name: categories.goals, icon: 'target' },
      { id: 'Planejamento', name: categories.planning, icon: 'calendar-check' },
      { id: 'Premium', name: categories.premium, icon: 'crown' },
      { id: 'Backup', name: categories.backup, icon: 'backup-restore' },
      { id: 'Conta', name: categories.account, icon: 'account' },
    ];
  }

  // ==================== TICKETS DE SUPORTE ====================

  // Criar ticket de suporte
  async createSupportTicket(data) {
    try {
      this.initialize();

      const ticketData = {
        userId: this.userId,
        userName: data.name,
        userEmail: data.email,
        subject: data.subject,
        category: data.category,
        message: data.message,
        status: 'open', // open, in_progress, resolved, closed
        priority: data.priority || 'medium', // low, medium, high
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'support_tickets'), ticketData);

      console.log('✅ Ticket criado:', docRef.id);
      return {
        success: true,
        ticketId: docRef.id,
      };
    } catch (error) {
      console.error('❌ Erro ao criar ticket:', error);
      throw error;
    }
  }

  // Listar tickets do usuário
  async getUserTickets() {
    try {
      this.initialize();

      const q = query(
        collection(db, 'support_tickets'),
        where('userId', '==', this.userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('❌ Erro ao buscar tickets:', error);
      throw error;
    }
  }

  // ==================== ONBOARDING ====================

  // Verificar se o onboarding foi concluído
  async isOnboardingCompleted() {
    try {
      const completed = await AsyncStorage.getItem('onboarding_completed');
      return completed === 'true';
    } catch (error) {
      return false;
    }
  }

  // Marcar onboarding como concluído
  async completeOnboarding() {
    try {
      await AsyncStorage.setItem('onboarding_completed', 'true');
      return { success: true };
    } catch (error) {
      console.error('Erro ao marcar onboarding:', error);
      throw error;
    }
  }

  // Resetar onboarding (para testes)
  async resetOnboarding() {
    try {
      await AsyncStorage.removeItem('onboarding_completed');
      return { success: true };
    } catch (error) {
      console.error('Erro ao resetar onboarding:', error);
      throw error;
    }
  }

  // Obter passos do onboarding
  getOnboardingSteps() {
    return [
      {
        id: 1,
        title: 'Bem-vindo ao Controle Financeiro! 🎉',
        description: 'Seu assistente financeiro pessoal com foco em gestão cristã do dinheiro.',
        image: 'wallet',
        color: '#2196F3',
      },
      {
        id: 2,
        title: 'Controle Suas Finanças 💰',
        description: 'Registre receitas e despesas facilmente. Acompanhe seu saldo em tempo real.',
        image: 'cash-multiple',
        color: '#4CAF50',
      },
      {
        id: 3,
        title: 'Gerencie Dízimos e Ofertas 🙏',
        description: 'Calcule automaticamente seu dízimo e registre todas as suas ofertas.',
        image: 'hand-heart',
        color: '#FF9800',
      },
      {
        id: 4,
        title: 'Alcance Suas Metas 🎯',
        description: 'Defina objetivos financeiros e acompanhe seu progresso até alcançá-los.',
        image: 'target',
        color: '#9C27B0',
      },
      {
        id: 5,
        title: 'Pronto para Começar! ✨',
        description: 'Vamos começar cadastrando sua primeira receita ou despesa.',
        image: 'check-circle',
        color: '#4CAF50',
      },
    ];
  }

  // ==================== CENTRAL DE AJUDA ====================

  // Obter artigos da central de ajuda
  getHelpArticles() {
    return [
      {
        id: '1',
        title: 'Primeiros Passos',
        icon: 'rocket-launch',
        color: '#2196F3',
        articles: [
          'Como criar sua primeira receita',
          'Como adicionar uma despesa',
          'Entendendo o Dashboard',
          'Configurando seu perfil',
        ],
      },
      {
        id: '2',
        title: 'Dízimos e Ofertas',
        icon: 'hand-heart',
        color: '#FF9800',
        articles: [
          'Como funciona o cálculo do dízimo',
          'Registrando ofertas',
          'Histórico de dízimos',
          'Relatório de ofertas',
        ],
      },
      {
        id: '3',
        title: 'Metas e Planejamento',
        icon: 'target',
        color: '#9C27B0',
        articles: [
          'Criando metas financeiras',
          'Acompanhando o progresso',
          'Planejamento de orçamento',
          'Dicas para economizar',
        ],
      },
      {
        id: '4',
        title: 'Investimentos',
        icon: 'chart-line',
        color: '#4CAF50',
        articles: [
          'Adicionando investimentos',
          'Tipos de investimento',
          'Calculando rentabilidade',
          'Acompanhando rendimentos',
        ],
      },
      {
        id: '5',
        title: 'Relatórios e Análises',
        icon: 'chart-bar',
        color: '#F44336',
        articles: [
          'Relatórios básicos',
          'Relatórios avançados (Premium)',
          'Exportando dados',
          'Interpretando gráficos',
        ],
      },
      {
        id: '6',
        title: 'Backup e Segurança',
        icon: 'shield-check',
        color: '#00BCD4',
        articles: [
          'Como fazer backup',
          'Restaurando dados',
          'Sincronizando dispositivos',
          'Segurança dos dados',
        ],
      },
    ];
  }

  // ==================== REDES SOCIAIS ====================

  // Obter links das redes sociais
  getSocialLinks() {
    return [
      {
        id: 'instagram',
        name: 'Instagram',
        icon: 'instagram',
        color: '#E4405F',
        url: 'https://instagram.com/caldizimo', // Substitua pelo seu link real
        description: 'Siga para dicas financeiras',
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'facebook',
        color: '#1877F2',
        url: 'https://facebook.com/caldizimo',
        description: 'Junte-se à comunidade',
      },
      {
        id: 'youtube',
        name: 'YouTube',
        icon: 'youtube',
        color: '#FF0000',
        url: 'https://youtube.com/@caldizimo',
        description: 'Tutoriais em vídeo',
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'whatsapp',
        color: '#25D366',
        url: 'https://wa.me/5527999493839', // Substitua pelo seu número
        description: 'Suporte direto',
      },
      {
        id: 'email',
        name: 'Email',
        icon: 'email',
        color: '#EA4335',
        url: 'mailto:suporte@caldizimo.com.br', // Substitua pelo seu email
        description: 'Envie uma mensagem',
      },
    ];
  }

  // ==================== CONTATO ====================

  // Categorias de contato
  getContactCategories() {
    return [
      { id: 'bug', label: 'Reportar Bug', icon: 'bug' },
      { id: 'suggestion', label: 'Sugestão', icon: 'lightbulb' },
      { id: 'help', label: 'Preciso de Ajuda', icon: 'help-circle' },
      { id: 'premium', label: 'Dúvida Premium', icon: 'crown' },
      { id: 'other', label: 'Outro', icon: 'message' },
    ];
  }
}

export default new SupportService();