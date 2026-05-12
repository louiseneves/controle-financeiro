import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  initialized = false;

  scheduledNotifications = {};

  // =========================
  // INIT
  // =========================

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
        await Notifications.setNotificationChannelAsync("default", {
          name: "Padrão",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#2563EB",
        });

        await Notifications.setNotificationChannelAsync("reminders", {
          name: "Lembretes",
          importance: Notifications.AndroidImportance.HIGH,
          sound: "default",
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#F59E0B",
        });

        await Notifications.setNotificationChannelAsync("alerts", {
          name: "Alertas",
          importance: Notifications.AndroidImportance.MAX,
          sound: "default",
          vibrationPattern: [0, 500, 250, 500],
          lightColor: "#EF4444",
        });

        console.log("✅ Canais Android configurados");
      }

      this.initialized = true;

      console.log("✅ NotificationService inicializado");
    } catch (error) {
      console.warn("⚠️ Erro ao inicializar notificações:", error.message);
    }
  }

  // =========================
  // CANCELAR TODAS
  // =========================

  async cancelAll() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();

      this.scheduledNotifications = {};

      console.log("🔕 Todas notificações canceladas");
    } catch (error) {
      console.warn("⚠️ Erro ao cancelar notificações:", error.message);
    }
  }

  // =========================
  // APLICAR CONFIGURAÇÕES
  // =========================

  async applySettings(notifications) {
    try {
      await this.cancelAll();

      if (!notifications?.enabled) {
        console.log("🔕 Notificações desativadas");
        return;
      }

      const { time, bills, tithe, goals, dailyReminder, titheDay, titheMonth } =
        notifications;

      if (dailyReminder) {
        await this.scheduleDailyReminder(time);
      }

      if (bills) {
        await this.scheduleBillsReminder(time);
      }

      if (goals) {
        await this.scheduleGoalsReminder(time);
      }

      if (tithe) {
        await this.scheduleTitheReminder(
          time,
          titheDay || 5,
          titheMonth || null,
        );
      }

      console.log("✅ Configurações aplicadas");
    } catch (error) {
      console.error("❌ Erro ao aplicar notificações:", error);
    }
  }

  // =========================
  // NOTIFICAÇÃO IMEDIATA
  // =========================

  async showNotification(title, body, data = {}, channelId = "default") {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          channelId,
        },

        trigger: null,
      });
    } catch (error) {
      console.warn("⚠️ Erro ao mostrar notificação:", error.message);
    }
  }

  // =========================
  // LEMBRETE DIÁRIO
  // =========================

  async scheduleDailyReminder(time) {
    try {
      const [hour, minute] = time.split(":").map(Number);

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "📱 Lembrete Diário",
          body: "Hora de conferir suas finanças!",
          sound: true,
          channelId: "reminders",
        },

        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });

      this.scheduledNotifications.dailyReminder = id;

      console.log("✅ Lembrete diário agendado:", time);
    } catch (error) {
      console.warn("⚠️ Erro lembrete diário:", error.message);
    }
  }

  // =========================
  // CONTAS
  // =========================

  async scheduleBillsReminder(time) {
    try {
      const [hour, minute] = time.split(":").map(Number);

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "💳 Contas Próximas",
          body: "Você possui contas para pagar.",
          sound: true,
          channelId: "reminders",
        },

        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });

      this.scheduledNotifications.bills = id;

      console.log("✅ Lembrete de contas agendado");
    } catch (error) {
      console.warn("⚠️ Erro contas:", error.message);
    }
  }

  // =========================
  // DÍZIMO
  // =========================
  // day = dia do mês
  // month = mês específico (1-12)
  // null = todos os meses

  async scheduleTitheReminder(time, day = 5, month = null) {
    try {
      const [hour, minute] = time.split(":").map(Number);

      let trigger = null;

      // TODOS OS MESES
      if (!month) {
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
          day,
          hour,
          minute,
        };
      }

      // MÊS ESPECÍFICO
      else {
        trigger = {
          type: Notifications.SchedulableTriggerInputTypes.YEARLY,
          month,
          day,
          hour,
          minute,
        };
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🙏 Lembrete de Dízimo",
          body: "Não esqueça do seu dízimo.",
          sound: true,
          channelId: "reminders",
        },

        trigger,
      });

      this.scheduledNotifications.tithe = id;

      console.log("✅ Lembrete de dízimo agendado");
    } catch (error) {
      console.warn("⚠️ Erro dízimo:", error.message);
    }
  }

  // =========================
  // METAS
  // =========================

  async scheduleGoalsReminder(time) {
    try {
      const [hour, minute] = time.split(":").map(Number);

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "🎯 Suas Metas",
          body: "Continue avançando nas suas metas!",
          sound: true,
          channelId: "reminders",
        },

        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });

      this.scheduledNotifications.goals = id;

      console.log("✅ Lembrete metas agendado");
    } catch (error) {
      console.warn("⚠️ Erro metas:", error.message);
    }
  }

  // =========================
  // TRANSAÇÕES
  // =========================

  async notifyTransaction(type, amount) {
    try {
      const formattedAmount = Number(amount).toFixed(2);

      if (type === "income") {
        await this.showNotification(
          "💰 Receita adicionada",
          `Receita de R$ ${formattedAmount} adicionada`,
          {
            type: "income_transaction",
            amount,
          },
        );
      }

      if (type === "expense") {
        await this.showNotification(
          "💸 Despesa adicionada",
          `Despesa de R$ ${formattedAmount} adicionada`,
          {
            type: "expense_transaction",
            amount,
          },
        );
      }
    } catch (error) {
      console.warn("⚠️ Erro transação:", error.message);
    }
  }

  // =========================
  // META
  // =========================

  async scheduleGoalAchievementNotification(goalName, percentage) {
    try {
      let title = "🎯 Progresso da Meta";

      let body = `Você atingiu ${percentage.toFixed(0)}% da meta "${goalName}"`;

      if (percentage >= 100) {
        title = "🏆 Meta concluída!";
        body = `Parabéns! Você atingiu a meta "${goalName}"`;
      } else if (percentage >= 80) {
        title = "🔥 Quase lá!";
        body = `Você está em ${percentage.toFixed(
          0,
        )}% para atingir "${goalName}"`;
      }

      await this.showNotification(
        title,
        body,
        {
          type: "goal_progress",
          goalName,
          percentage,
        },
        "alerts",
      );
    } catch (error) {
      console.warn("⚠️ Erro meta:", error.message);
    }
  }

  // =========================
  // ORÇAMENTO
  // =========================

  async scheduleBudgetWarning(category, type) {
    try {
      let title = "";
      let body = "";

      // 90%
      if (type === "warning") {
        title = "⚠️ Atenção ao orçamento";
        body = `Você já utilizou 90% do orçamento em ${category}`;
      }

      // EXCEDIDO
      if (type === "exceeded") {
        title = "🚨 Orçamento excedido!";
        body = `Você ultrapassou o orçamento em ${category}`;
      }

      await this.showNotification(
        title,
        body,
        {
          type: "budget_alert",
          category,
          alertType: type,
        },
        "alerts",
      );
    } catch (error) {
      console.warn("⚠️ Erro orçamento:", error.message);
    }
  }
}

export default new NotificationService();
