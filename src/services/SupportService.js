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

  // Dados do FAQ (pode vir do Firestore também)
  getFAQData() {
    return [
      {
        id: '1',
        category: 'Geral',
        question: 'Como criar minha primeira receita?',
        answer: 'Para criar uma receita, vá na tela inicial e toque no botão "+" ou "Nova Receita". Preencha o valor, categoria, data e descrição. Depois é só salvar!',
        popular: true,
      },
      {
        id: '2',
        category: 'Geral',
        question: 'Como adicionar uma despesa?',
        answer: 'Na tela inicial, toque no botão "+" ou "Nova Despesa". Escolha a categoria, informe o valor, data e descrição. Você também pode marcar como despesa recorrente se for uma conta que se repete todo mês.',
        popular: true,
      },
      {
        id: '3',
        category: 'Dízimo',
        question: 'Como funciona o cálculo do dízimo?',
        answer: 'O dízimo é calculado automaticamente como 10% de suas receitas. Você pode acessar a Calculadora de Dízimo no menu e ver quanto deve ofertar baseado em suas receitas do mês.',
        popular: true,
      },
      {
        id: '4',
        category: 'Dízimo',
        question: 'Posso registrar ofertas além do dízimo?',
        answer: 'Sim! Além do dízimo, você pode registrar ofertas de missões, construção, ajuda humanitária e outras causas. Basta ir em "Ofertas" e cadastrar cada doação separadamente.',
        popular: false,
      },
      {
        id: '5',
        category: 'Investimentos',
        question: 'Como adicionar meus investimentos?',
        answer: 'Vá em "Investimentos" no menu e clique em "Novo Investimento". Escolha o tipo (poupança, ações, CDB, etc), valor investido, data e rentabilidade esperada. O app calculará seus rendimentos.',
        popular: false,
      },
      {
        id: '6',
        category: 'Metas',
        question: 'Como criar uma meta financeira?',
        answer: 'Acesse "Metas" no menu e toque em "Nova Meta". Defina o nome (ex: Carro Novo), valor alvo, prazo e quanto já tem guardado. O app mostrará seu progresso e quanto falta para alcançar.',
        popular: true,
      },
      {
        id: '7',
        category: 'Planejamento',
        question: 'Como funciona o orçamento mensal?',
        answer: 'No "Planejamento", você define quanto quer gastar por categoria no mês. O app acompanha seus gastos e alerta quando estiver próximo do limite. Assim você controla melhor seus gastos!',
        popular: false,
      },
      {
        id: '8',
        category: 'Premium',
        question: 'Quais as vantagens da versão Premium?',
        answer: 'A versão Premium oferece: relatórios avançados, exportação em PDF/Excel, comparativo entre períodos, projeções futuras, análise de tendências, backup automático e suporte prioritário.',
        popular: true,
      },
      {
        id: '9',
        category: 'Backup',
        question: 'Meus dados estão seguros?',
        answer: 'Sim! Seus dados são armazenados de forma criptografada no Firebase. Você pode fazer backup manual ou automático e restaurar em qualquer dispositivo. Apenas você tem acesso aos seus dados.',
        popular: false,
      },
      {
        id: '10',
        category: 'Conta',
        question: 'Como alterar minha senha?',
        answer: 'Vá em "Perfil" > "Configurações" > "Alterar Senha". Digite sua senha atual e a nova senha duas vezes. Você também pode usar "Esqueci minha senha" na tela de login para redefinir.',
        popular: false,
      },
      {
        id: '11',
        category: 'Conta',
        question: 'Posso usar em mais de um dispositivo?',
        answer: 'Sim! Faça login com a mesma conta em qualquer dispositivo. Use a função "Sincronizar Dispositivos" em Backup para garantir que todos os dados estejam atualizados.',
        popular: false,
      },
      {
        id: '12',
        category: 'Geral',
        question: 'Como deletar uma transação?',
        answer: 'No histórico de transações, deslize a transação para o lado ou toque nela e escolha "Excluir". Você também pode editar os dados se cometeu algum erro.',
        popular: false,
      },
    ];
  }

  // Buscar FAQ por categoria
  getFAQByCategory(category) {
    const allFAQ = this.getFAQData();
    if (category === 'Populares') {
      return allFAQ.filter(faq => faq.popular);
    }
    return allFAQ.filter(faq => faq.category === category);
  }

  // Buscar FAQ (pesquisa)
  searchFAQ(searchTerm) {
    const allFAQ = this.getFAQData();
    const term = searchTerm.toLowerCase();
    return allFAQ.filter(
      faq =>
        faq.question.toLowerCase().includes(term) ||
        faq.answer.toLowerCase().includes(term)
    );
  }

  // Obter categorias do FAQ
  getFAQCategories() {
    return [
      { id: 'all', name: 'Todas', icon: 'format-list-bulleted' },
      { id: 'popular', name: 'Populares', icon: 'star' },
      { id: 'Geral', name: 'Geral', icon: 'help-circle' },
      { id: 'Dízimo', name: 'Dízimo', icon: 'hand-heart' },
      { id: 'Investimentos', name: 'Investimentos', icon: 'chart-line' },
      { id: 'Metas', name: 'Metas', icon: 'target' },
      { id: 'Planejamento', name: 'Planejamento', icon: 'calendar-check' },
      { id: 'Premium', name: 'Premium', icon: 'crown' },
      { id: 'Backup', name: 'Backup', icon: 'backup-restore' },
      { id: 'Conta', name: 'Conta', icon: 'account' },
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