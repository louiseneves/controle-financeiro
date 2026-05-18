jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),

  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: "granted" })),

  requestPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: "granted" }),
  ),

  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),

  scheduleNotificationAsync: jest.fn(() => Promise.resolve("notification-id")),

  cancelAllScheduledNotificationsAsync: jest.fn(() => Promise.resolve()),

  AndroidImportance: {
    HIGH: "high",
    MAX: "max",
  },

  SchedulableTriggerInputTypes: {
    DAILY: "daily",
    MONTHLY: "monthly",
    YEARLY: "yearly",
  },
}));

jest.mock("react-native", () => ({
  Platform: {
    OS: "android",
  },
}));

import * as Notifications from "expo-notifications";

import notificationService from "../../../src/services/notifications/notificationService";

describe("notificationService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    notificationService.initialized = false;
    notificationService.scheduledNotifications = {};
  });

  // =========================
  // INIT
  // =========================

  it("deve inicializar notificações", async () => {
    await notificationService.init();

    expect(Notifications.getPermissionsAsync).toHaveBeenCalled();

    expect(Notifications.setNotificationChannelAsync).toHaveBeenCalled();

    expect(notificationService.initialized).toBe(true);
  });

  it("deve lidar com permissão negada", async () => {
    Notifications.getPermissionsAsync.mockResolvedValueOnce({
      status: "denied",
    });

    Notifications.requestPermissionsAsync.mockResolvedValueOnce({
      status: "denied",
    });

    await notificationService.init();

    expect(notificationService.initialized).toBe(false);
  });

  // =========================
  // CANCEL
  // =========================

  it("deve cancelar notificações", async () => {
    await notificationService.cancelAll();

    expect(
      Notifications.cancelAllScheduledNotificationsAsync,
    ).toHaveBeenCalled();
  });

  // =========================
  // SHOW
  // =========================

  it("deve mostrar notificação", async () => {
    await notificationService.showNotification("Teste", "Body");

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  // =========================
  // DAILY
  // =========================

  it("deve agendar lembrete diário", async () => {
    await notificationService.scheduleDailyReminder("10:30");

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();

    expect(notificationService.scheduledNotifications.dailyReminder).toBe(
      "notification-id",
    );
  });

  // =========================
  // BILLS
  // =========================

  it("deve agendar contas", async () => {
    await notificationService.scheduleBillsReminder("09:00");

    expect(notificationService.scheduledNotifications.bills).toBe(
      "notification-id",
    );
  });

  // =========================
  // GOALS
  // =========================

  it("deve agendar metas", async () => {
    await notificationService.scheduleGoalsReminder("08:00");

    expect(notificationService.scheduledNotifications.goals).toBe(
      "notification-id",
    );
  });

  // =========================
  // TITHE
  // =========================

  it("deve agendar dízimo mensal", async () => {
    await notificationService.scheduleTitheReminder("10:00", 5);

    expect(notificationService.scheduledNotifications.tithe).toBe(
      "notification-id",
    );
  });

  it("deve agendar dízimo anual", async () => {
    await notificationService.scheduleTitheReminder("10:00", 5, 12);

    expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  // =========================
  // TRANSACTIONS
  // =========================

  it("deve notificar income", async () => {
    const spy = jest.spyOn(notificationService, "showNotification");

    await notificationService.notifyTransaction("income", 100);

    expect(spy).toHaveBeenCalled();
  });

  it("deve notificar expense", async () => {
    const spy = jest.spyOn(notificationService, "showNotification");

    await notificationService.notifyTransaction("expense", 50);

    expect(spy).toHaveBeenCalled();
  });

  // =========================
  // GOAL ACHIEVEMENT
  // =========================

  it("deve notificar meta concluída", async () => {
    const spy = jest.spyOn(notificationService, "showNotification");

    await notificationService.scheduleGoalAchievementNotification("Casa", 100);

    expect(spy).toHaveBeenCalled();
  });

  it("deve notificar meta quase concluída", async () => {
    const spy = jest.spyOn(notificationService, "showNotification");

    await notificationService.scheduleGoalAchievementNotification("Casa", 85);

    expect(spy).toHaveBeenCalled();
  });

  // =========================
  // BUDGET
  // =========================

  it("deve alertar warning orçamento", async () => {
    const spy = jest.spyOn(notificationService, "showNotification");

    await notificationService.scheduleBudgetWarning("Mercado", "warning");

    expect(spy).toHaveBeenCalled();
  });

  it("deve alertar orçamento excedido", async () => {
    const spy = jest.spyOn(notificationService, "showNotification");

    await notificationService.scheduleBudgetWarning("Mercado", "exceeded");

    expect(spy).toHaveBeenCalled();
  });
  it("deve ignorar notificações desabilitadas", async () => {
    const cancelSpy = jest.spyOn(notificationService, "cancelAll");

    const dailySpy = jest.spyOn(notificationService, "scheduleDailyReminder");

    await notificationService.applySettings({
      enabled: false,
    });

    expect(cancelSpy).toHaveBeenCalled();

    expect(dailySpy).not.toHaveBeenCalled();
  });
  it("deve aplicar todas notificações", async () => {
    const dailySpy = jest.spyOn(notificationService, "scheduleDailyReminder");

    const billsSpy = jest.spyOn(notificationService, "scheduleBillsReminder");

    const goalsSpy = jest.spyOn(notificationService, "scheduleGoalsReminder");

    const titheSpy = jest.spyOn(notificationService, "scheduleTitheReminder");

    await notificationService.applySettings({
      enabled: true,
      time: "20:00",
      bills: true,
      tithe: true,
      goals: true,
      dailyReminder: true,
      titheDay: 5,
      titheMonth: 12,
    });

    expect(dailySpy).toHaveBeenCalled();
    expect(billsSpy).toHaveBeenCalled();
    expect(goalsSpy).toHaveBeenCalled();
    expect(titheSpy).toHaveBeenCalled();
  });
  it("deve lidar com erro no init", async () => {
    Notifications.getPermissionsAsync.mockRejectedValueOnce(new Error("fail"));

    await notificationService.init();

    expect(notificationService.initialized).toBe(false);
  });
  it("deve lidar com erro ao cancelar notificações", async () => {
    Notifications.cancelAllScheduledNotificationsAsync.mockRejectedValueOnce(
      new Error("fail"),
    );

    await notificationService.cancelAll();
  });
  it("deve lidar com erro ao mostrar notificação", async () => {
    Notifications.scheduleNotificationAsync.mockRejectedValueOnce(
      new Error("fail"),
    );

    await notificationService.showNotification("Teste", "Body");
  });
  it("deve notificar progresso normal da meta", async () => {
    const spy = jest.spyOn(notificationService, "showNotification");

    await notificationService.scheduleGoalAchievementNotification("Carro", 50);

    expect(spy).toHaveBeenCalled();
  });
  it("deve lidar com tipo desconhecido no orçamento", async () => {
    const spy = jest.spyOn(notificationService, "showNotification");

    await notificationService.scheduleBudgetWarning("Mercado", "other");

    expect(spy).toHaveBeenCalled();
  });
  it("deve lidar com erro em showNotification", async () => {
  Notifications.scheduleNotificationAsync.mockRejectedValueOnce(
    new Error("Erro mockado")
  );

  const warnSpy = jest.spyOn(console, "warn").mockImplementation();

  await notificationService.showNotification(
    "Teste",
    "Body"
  );

  expect(warnSpy).toHaveBeenCalled();

  warnSpy.mockRestore();
});
});
