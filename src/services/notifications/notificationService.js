import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configurar comportamento padrão das notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  initialized = false;

  async init() {
    if (this.initialized) return;

    try {
      // ✅ Verificar permissão de notificações
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('⚠️ Permissão de notificações não concedida');
        return;
      }

      // Configurar canais no Android
      if (Platform.OS === 'android') {
        try {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'Notificações Gerais',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#2563EB',
            sound: 'default',
          });

          await Notifications.setNotificationChannelAsync('reminders', {
            name: 'Lembretes',
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#F59E0B',
            sound: 'default',
          });

          await Notifications.setNotificationChannelAsync('alerts', {
            name: 'Alertas Importantes',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 500, 200, 500],
            lightColor: '#EF4444',
            sound: 'default',
          });
        } catch (error) {
          console.warn('⚠️ Erro ao configurar canais de notificação:', error.message);
        }
      }

      this.initialized = true;
      console.log('✅ NotificationService inicializado');
    } catch (error) {
      console.warn('⚠️ Erro ao inicializar NotificationService:', error.message);
      // Falha silenciosa - notificações opcionais
      this.initialized = true;
    }
  }

  async cancelAll() {
    try {
      if (this.initialized) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log('🔕 Todas as notificações canceladas');
      }
    } catch (error) {
      console.warn('⚠️ Erro ao cancelar notificações:', error.message);
    }
  }

  // Mostrar notificação imediata
  async showNotification(title, body, data = {}) {
    // ✅ Verificar se NotificationService foi inicializado
    if (!this.initialized) {
      console.warn('⚠️ NotificationService não inicializado, ignorando notificação:', title);
      return;
    }

    // ✅ Validar parâmetros
    if (!title || typeof title !== 'string' || !title.trim()) {
      console.error('❌ Título inválido para notificação:', title);
      return;
    }

    if (!body || typeof body !== 'string' || !body.trim()) {
      console.error('❌ Mensagem inválida para notificação:', body);
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title.trim(),
          body: body.trim(),
          data,
          sound: true,
        },
        trigger: null, // Imediata
      });
    } catch (error) {
      console.warn('⚠️ Erro ao mostrar notificação:', error.message);
      // Falha silenciosa - notificações são opcionais
    }
  }

  // Alerta de orçamento
  async scheduleBudgetWarning(category, percentage) {
    // ✅ Validar parâmetros
    if (!category || typeof category !== 'string' || !category.trim()) {
      console.error('❌ Categoria inválida para alerta de orçamento:', category);
      return;
    }

    if (typeof percentage !== 'number' || isNaN(percentage) || percentage < 0) {
      console.error('❌ Percentage inválido para alerta de orçamento:', percentage);
      return;
    }

    if (percentage < 80) return;

    const isExceeded = percentage >= 100;
    const title = isExceeded ? '🚨 Orçamento Excedido!' : '⚠️ Atenção ao Orçamento';
    const body = isExceeded
      ? `Você ultrapassou o orçamento de ${category}!`
      : `Você já gastou ${Math.round(percentage)}% do orçamento de ${category}`;

    await this.showNotification(title, body, {
      type: 'budget_warning',
      category,
      percentage,
    });
  }

  // Notificação de conquista de meta
  async scheduleGoalAchievementNotification(goalName, percentage) {
    // ✅ Validar percentage
    if (typeof percentage !== 'number' || isNaN(percentage) || percentage < 0) {
      console.error('❌ Percentage inválido para notificação de meta:', percentage);
      return;
    }

    let milestone = null;
    if (percentage >= 100) milestone = 100;
    else if (percentage >= 75 && percentage < 80) milestone = 75;
    else if (percentage >= 50 && percentage < 55) milestone = 50;
    else if (percentage >= 25 && percentage < 30) milestone = 25;

    if (!milestone) return;

    const messages = {
      25: `🎯 Você alcançou 25% da meta "${goalName}"! Continue assim!`,
      50: `🎯 Metade do caminho! "${goalName}" está 50% completa!`,
      75: `🎯 Quase lá! Faltam apenas 25% para "${goalName}"!`,
      100: `🎉 Parabéns! Você alcançou a meta "${goalName}"!`,
    };

    await this.showNotification(
      milestone === 100 ? '🎉 Meta Alcançada!' : '🎯 Progresso da Meta',
      messages[milestone],
      {
        type: 'goal_achievement',
        goalName,
        milestone,
      }
    );
  }

  // Lembrete diário
  async scheduleDailyReminder(time) {
    // ✅ Verificar se NotificationService foi inicializado
    if (!this.initialized) {
      console.warn('⚠️ NotificationService não inicializado');
      return;
    }

    // ✅ Validar parâmetro time
    if (!time || typeof time !== 'string') {
      console.error('❌ Horário inválido para lembrete diário:', time);
      return;
    }

    const [hour, minute] = time.split(':').map(Number);

    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      console.error('❌ Hora/minuto inválidos para lembrete diário:', time);
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💰 Lembrete Diário',
          body: 'Não esqueça de registrar seus gastos de hoje!',
        },
        trigger: {
          type: 'daily',
          hour,
          minute,
        },
      });

      console.log(`✅ Lembrete diário agendado para ${time}`);
    } catch (error) {
      console.warn('⚠️ Erro ao agendar lembrete diário:', error.message);
    }
  }

  // Lembrete de contas
  async scheduleBillsReminder(hour, minute) {
    // ✅ Verificar se NotificationService foi inicializado
    if (!this.initialized) {
      console.warn('⚠️ NotificationService não inicializado');
      return;
    }

    // ✅ Validar parâmetros
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      console.error('❌ Hora/minuto inválidos para lembrete de contas:', hour, minute);
      return;
    }

    try {
      // ✅ Android não suporta calendar, usar weekday como fallback
      // Agendar para 5º dia da semana (quinta-feira) de cada semana
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📄 Contas a Vencer',
          body: 'Verifique suas contas e pagamentos pendentes.',
        },
        trigger: {
          type: 'weekCalendar',
          weekday: 5, // Quinta-feira
          hour,
          minute,
        },
      });

      console.log(`✅ Lembrete de contas agendado para quintas-feiras às ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    } catch (error) {
      console.warn('⚠️ Erro ao agendar lembrete de contas:', error.message);
    }
  }

  // Lembrete de dízimo
  async scheduleTitheReminder(time) {
    // ✅ Verificar se NotificationService foi inicializado
    if (!this.initialized) {
      console.warn('⚠️ NotificationService não inicializado');
      return;
    }

    // ✅ Validar parâmetro time
    if (!time || typeof time !== 'string') {
      console.error('❌ Horário inválido para lembrete de dízimo:', time);
      return;
    }

    const [hour, minute] = time.split(':').map(Number);

    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      console.error('❌ Hora/minuto inválidos para lembrete de dízimo:', time);
      return;
    }

    try {
      // ✅ Android não suporta calendar, usar weekday como fallback
      // Agendar para método de webi (quarta-feira)
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🙏 Lembrete de Dízimo',
          body: 'Hora de separar o seu dízimo mensal.',
        },
        trigger: {
          type: 'weekCalendar',
          weekday: 4, // Quarta-feira
          hour,
          minute,
        },
      });

      console.log(`✅ Lembrete de dízimo agendado para quartas-feiras às ${time}`);
    } catch (error) {
      console.warn('⚠️ Erro ao agendar lembrete de dízimo:', error.message);
    }
  }

  // Lembrete de metas
  async scheduleGoalsReminder(time) {
    // ✅ Verificar se NotificationService foi inicializado
    if (!this.initialized) {
      console.warn('⚠️ NotificationService não inicializado');
      return;
    }

    // ✅ Validar parâmetro time
    if (!time || typeof time !== 'string') {
      console.error('❌ Horário inválido para lembrete de metas:', time);
      return;
    }

    const [hour, minute] = time.split(':').map(Number);

    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
      console.error('❌ Hora/minuto inválidos para lembrete de metas:', time);
      return;
    }

    try {
      // ✅ Usar weekCalendar que funciona em Android e iOS
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎯 Revise suas Metas',
          body: 'Confira o progresso das suas metas financeiras.',
        },
        trigger: {
          type: 'weekCalendar',
          weekday: 2, // Segunda-feira
          hour,
          minute,
        },
      });

      console.log(`✅ Lembrete de metas agendado para segundas às ${time}`);
    } catch (error) {
      console.warn('⚠️ Erro ao agendar lembrete de metas:', error.message);
    }
  }

  // Aplicar todas as configurações de notificação
  async applySettings(notifications) {
    try {
      await this.cancelAll();

      if (!notifications || !notifications.enabled) {
        console.log('🔕 Notificações desabilitadas');
        return;
      }

      const time = notifications.time || '20:00';
      const [hour, minute] = time.split(':').map(Number);

      // ✅ Validar hora/minuto com range correto
      if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        console.error('❌ Horário inválido para notificações:', time);
        return;
      }

      if (notifications.dailyReminder) {
        await this.scheduleDailyReminder(time);
      }

      if (notifications.bills) {
        await this.scheduleBillsReminder(hour, minute);
      }

      if (notifications.tithe) {
        await this.scheduleTitheReminder(time);
      }

      if (notifications.goals) {
        await this.scheduleGoalsReminder(time);
      }

      console.log('✅ Configurações de notificação aplicadas com sucesso');
    } catch (error) {
      console.warn('⚠️ Erro ao aplicar configurações de notificação:', error.message);
    }
  }
}

export default new NotificationService();

