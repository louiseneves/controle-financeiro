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
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('❌ Permissão de notificações negada');
        return;
      }

      // Configurar canais no Android
      if (Platform.OS === 'android') {
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
      }

      this.initialized = true;
      console.log('✅ NotificationService inicializado');
    } catch (error) {
      console.error('❌ Erro ao inicializar NotificationService:', error);
    }
  }

  async cancelAll() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('🔕 Todas as notificações canceladas');
    } catch (error) {
      console.error('❌ Erro ao cancelar notificações:', error);
    }
  }

  // Mostrar notificação imediata
  async showNotification(title, body, data = {}) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null, // Imediata
      });
    } catch (error) {
      console.error('❌ Erro ao mostrar notificação:', error);
    }
  }

  // Alerta de orçamento
  async scheduleBudgetWarning(category, percentage) {
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
    const [hour, minute] = time.split(':').map(Number);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💰 Lembrete Diário',
          body: 'Não esqueça de registrar seus gastos de hoje!',
        },
        trigger: {
          hour,
          minute,
          repeats: true,
        },
      });

      console.log(`✅ Lembrete diário agendado para ${time}`);
    } catch (error) {
      console.error('❌ Erro ao agendar lembrete diário:', error);
    }
  }

  // Lembrete de contas
  async scheduleBillsReminder(hour, minute) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📄 Contas a Vencer',
          body: 'Verifique suas contas e pagamentos pendentes.',
        },
        trigger: {
          day: 5,
          hour,
          minute,
          repeats: true,
        },
      });

      console.log(`✅ Lembrete de contas agendado para dia 5 às ${hour}:${minute}`);
    } catch (error) {
      console.error('❌ Erro ao agendar lembrete de contas:', error);
    }
  }

  // Lembrete de dízimo
  async scheduleTitheReminder(time) {
    const [hour, minute] = time.split(':').map(Number);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🙏 Lembrete de Dízimo',
          body: 'Hora de separar o seu dízimo mensal.',
        },
        trigger: {
          day: 10,
          hour,
          minute,
          repeats: true,
        },
      });

      console.log(`✅ Lembrete de dízimo agendado para dia 10 às ${time}`);
    } catch (error) {
      console.error('❌ Erro ao agendar lembrete de dízimo:', error);
    }
  }

  // Lembrete de metas
  async scheduleGoalsReminder(time) {
    const [hour, minute] = time.split(':').map(Number);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎯 Revise suas Metas',
          body: 'Confira o progresso das suas metas financeiras.',
        },
        trigger: {
          weekday: 2, // Segunda-feira
          hour,
          minute,
          repeats: true,
        },
      });

      console.log(`✅ Lembrete de metas agendado para segundas às ${time}`);
    } catch (error) {
      console.error('❌ Erro ao agendar lembrete de metas:', error);
    }
  }

  // Aplicar todas as configurações de notificação
  async applySettings(notifications) {
    await this.cancelAll();

    if (!notifications || !notifications.enabled) {
      console.log('🔕 Notificações desabilitadas');
      return;
    }

    const time = notifications.time || '20:00';
    const [hour, minute] = time.split(':').map(Number);

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
  }
}

export default new NotificationService();

