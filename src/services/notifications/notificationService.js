import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

class NotificationService {
  async init() {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('❌ Permissão de notificações negada');
      return;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Lembretes',
        importance: Notifications.AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  async cancelAll() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async scheduleDailyReminder(time) {
    const [hour, minute] = time.split(':').map(Number);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '💰 Lembrete Diário',
          body: 'Não esqueça de registrar seus gastos hoje!',
        },
        trigger: {
          type: 'daily',
          hour,
          minute,
          channelId: Platform.OS === 'android' ? 'default' : undefined,
        },
      });

      console.log('✅ Lembrete diário agendado');
    } catch (error) {
      console.log('❌ Erro lembrete diário:', error);
    }
  }

  async scheduleBillsReminder(time) {
    const [hour, minute] = time.split(':').map(Number);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '📄 Contas a vencer',
          body: 'Verifique suas contas pendentes.',
        },
        trigger: {
          type: 'monthly',
          day: 5,
          hour,
          minute,
          channelId: Platform.OS === 'android' ? 'default' : undefined,
        },
      });

      console.log('✅ Lembrete de contas agendado');
    } catch (error) {
      console.log('❌ Erro lembrete contas:', error);
    }
  }

  async scheduleTitheReminder(time) {
    const [hour, minute] = time.split(':').map(Number);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🙏 Lembrete de Dízimo',
          body: 'Hora de separar o seu dízimo.',
        },
        trigger: {
          type: 'monthly',
          day: 10,
          hour,
          minute,
          channelId: Platform.OS === 'android' ? 'default' : undefined,
        },
      });

      console.log('✅ Lembrete de dízimo agendado');
    } catch (error) {
      console.log('❌ Erro lembrete dízimo:', error);
    }
  }

  async scheduleGoalsReminder(time) {
    const [hour, minute] = time.split(':').map(Number);

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: '🎯 Metas Financeiras',
          body: 'Confira o progresso das suas metas.',
        },
        trigger: {
          type: 'weekly',
          weekday: 1, // Segunda-feira
          hour,
          minute,
          channelId: Platform.OS === 'android' ? 'default' : undefined,
        },
      });

      console.log('✅ Lembrete de metas agendado');
    } catch (error) {
      console.log('❌ Erro lembrete metas:', error);
    }
  }

  async applySettings(notifications) {
    await this.cancelAll();

    if (!notifications.enabled) return;

    const time = notifications.time || '20:00';

    if (notifications.dailyReminder) {
      await this.scheduleDailyReminder(time);
    }

    if (notifications.bills) {
      await this.scheduleBillsReminder(time);
    }

    if (notifications.tithe) {
      await this.scheduleTitheReminder(time);
    }

    if (notifications.goals) {
      await this.scheduleGoalsReminder(time);
    }
  }
}

export default new NotificationService();

