import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  initialized = false;
  scheduledNotifications = {}; // ✅ NOVO: Rastrear notificações agendadas

  async init() {
    if (this.initialized) return;

    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("⚠️ Permissão de notificações não concedida");
        return;
      }

      if (Platform.OS === "android") {
        try {
          await Notifications.setNotificationChannelAsync("default", {
            name: "Notificações Gerais",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#2563EB",
            sound: "default",
          });

          await Notifications.setNotificationChannelAsync("reminders", {
            name: "Lembretes",
            importance: Notifications.AndroidImportance.HIGH,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#F59E0B",
            sound: "default",
          });

          await Notifications.setNotificationChannelAsync("alerts", {
            name: "Alertas Importantes",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 500, 200, 500],
            lightColor: "#EF4444",
            sound: "default",
          });
        } catch (error) {
          console.warn("⚠️ Erro ao configurar canais:", error.message);
        }
      }

      this.initialized = true;
      console.log("✅ NotificationService inicializado");
    } catch (error) {
      console.warn(
        "⚠️ Erro ao inicializar NotificationService:",
        error.message,
      );
      this.initialized = true;
    }
  }

  async cancelAll() {
    try {
      if (this.initialized) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        this.scheduledNotifications = {}; // ✅ Limpar rastreamento
        console.log("🔕 Todas as notificações canceladas");
      }
    } catch (error) {
      console.warn("⚠️ Erro ao cancelar notificações:", error.message);
    }
  }

  // ✅ NOVA FUNÇÃO PRINCIPAL: Aplicar configurações de notificações
  async applySettings(notifications) {
    if (!this.initialized) {
      console.warn("⚠️ NotificationService não inicializado");
      return;
    }

    try {
      // 1. Cancelar todas as notificações antigas
      await this.cancelAll();

      // 2. Se notificações estão desativadas, não agendar nada
      if (!notifications.enabled) {
        console.log("🔕 Notificações desativadas");
        return;
      }

      const { time, bills, tithe, goals, dailyReminder } = notifications;

      // 3. Agendar notificações baseado nas configurações
      if (dailyReminder) {
        await this.scheduleDailyReminder(time);
      }

      if (bills) {
        await this.scheduleBillsReminder(time);
      }

      if (tithe) {
        await this.scheduleTitheReminder(time);
      }

      if (goals) {
        await this.scheduleGoalsReminder(time);
      }

      console.log("✅ Notificações aplicadas com sucesso");
    } catch (error) {
      console.error("❌ Erro ao aplicar configurações de notificação:", error);
    }
  }

  // Mostrar notificação imediata
  async showNotification(title, body, data = {}) {
    if (!this.initialized) {
      console.warn("⚠️ NotificationService não inicializado");
      return;
    }

    if (!title?.trim() || !body?.trim()) {
      console.error("❌ Título ou mensagem inválidos");
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
      console.warn("⚠️ Erro ao mostrar notificação:", error.message);
    }
  }

  // ✅ Agendar Lembrete Diário
  async scheduleDailyReminder(time) {
    try {
      const [hours, minutes] = time.split(":").map(Number);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "📱 Lembrete Diário",
          body: "Hora de conferir suas finanças!",
          sound: true,
        },
        trigger: {
          type: "daily",
          hour: hours,
          minute: minutes,
        },
      });

      this.scheduledNotifications["dailyReminder"] = notificationId;
      console.log("✅ Lembrete diário agendado para", time);
    } catch (error) {
      console.warn("⚠️ Erro ao agendar lembrete diário:", error.message);
    }
  }

  // ✅ Agendar Lembrete de Contas
  async scheduleBillsReminder(time) {
    try {
      const [hours, minutes] = time.split(":").map(Number);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "💳 Contas Próximas",
          body: "Você tem contas para pagar em breve",
          sound: true,
        },
        trigger: {
          type: "daily",
          hour: hours,
          minute: minutes,
        },
      });

      this.scheduledNotifications["bills"] = notificationId;
      console.log("✅ Lembrete de contas agendado");
    } catch (error) {
      console.warn("⚠️ Erro ao agendar lembrete de contas:", error.message);
    }
  }

  // ✅ Agendar Lembrete de Dízimo
  async scheduleTitheReminder(time) {
    try {
      const [hours, minutes] = time.split(":").map(Number);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🙏 Dízimo",
          body: "Lembrete para contribuir com seu dízimo",
          sound: true,
        },
        trigger: {
          type: "daily",
          hour: hours,
          minute: minutes,
        },
      });

      this.scheduledNotifications["tithe"] = notificationId;
      console.log("✅ Lembrete de dízimo agendado");
    } catch (error) {
      console.warn("⚠️ Erro ao agendar lembrete de dízimo:", error.message);
    }
  }

  // ✅ Agendar Lembrete de Metas
  async scheduleGoalsReminder(time) {
    try {
      const [hours, minutes] = time.split(":").map(Number);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎯 Suas Metas",
          body: "Você está progredindo em suas metas!",
          sound: true,
        },
        trigger: {
          type: "daily",
          hour: hours,
          minute: minutes,
        },
      });

      this.scheduledNotifications["goals"] = notificationId;
      console.log("✅ Lembrete de metas agendado");
    } catch (error) {
      console.warn("⚠️ Erro ao agendar lembrete de metas:", error.message);
    }
  }

  // Alerta de orçamento
  async scheduleBudgetWarning(category, percentage) {
    if (!category?.trim() || typeof percentage !== "number") {
      console.error("❌ Parâmetros inválidos para alerta de orçamento");
      return;
    }

    try {
      await this.showNotification(
        "⚠️ Orçamento Atingido",
        `Você atingiu ${percentage}% do orçamento em ${category}`,
        { type: "budget_alert", category, percentage },
      );
    } catch (error) {
      console.warn("⚠️ Erro ao agendar alerta de orçamento:", error.message);
    }
  }
}

// ✅ Exportar instância única (singleton)
export default new NotificationService();
