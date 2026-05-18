jest.mock("../../../src/services/firebase/firestore", () => ({
  addDocument: jest.fn().mockResolvedValue("id-1"),
  updateDocument: jest.fn().mockResolvedValue(true),
  deleteDocument: jest.fn().mockResolvedValue(true),
  getDocuments: jest
    .fn()
    .mockResolvedValue([{ id: "1", title: "meta", userId: "user-1" }]),
}));

jest.mock("../../../src/services/firebase/config", () => ({
  auth: { currentUser: { uid: "user-1" } },
  COLLECTIONS: { GOALS: "goals" },
}));

jest.mock("../../../src/store/settingsStore", () => ({
  getState: () => ({
    notifications: { enabled: false, goals: false },
  }),
}));

jest.mock("../../../src/store/premiumStore", () => ({
  __esModule: true,
  default: {
    getState: () => ({
      isPremium: true,
    }),
  },
}));

// ⚠️ IMPORT DEPOIS DOS MOCKS
import useGoalsStore from "../../../src/store/goalsStore";

describe("goalsStore - 95% COVERAGE", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    useGoalsStore.setState({
      goals: [],
      loading: false,
      error: null,
    });
  });

  test("init state", () => {
    const state = useGoalsStore.getState();
    expect(state.goals).toEqual([]);
  });

  test("loadGoals success", async () => {
    await useGoalsStore.getState().loadGoals("user-1");

    const goals = useGoalsStore.getState().goals;
    expect(goals.length).toBeGreaterThan(0);

    const goal = goals[0];
    expect(goal).toBeDefined();
  });

  test("loadGoals error branch", async () => {
    const firestore = require("../../../src/services/firebase/firestore");
    firestore.getDocuments.mockRejectedValueOnce(new Error("fail"));

    const res = await useGoalsStore.getState().loadGoals("user-1");

    expect(res.success).toBe(false);
  });

  test("addGoal success", async () => {
    const res = await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "goal",
    });

    expect(res.success).toBe(true);

    const goals = useGoalsStore.getState().goals;
    expect(goals.length).toBe(1);
  });

  test("addGoal without userId", async () => {
    const res = await useGoalsStore.getState().addGoal({});

    expect(res.success).toBe(false);
  });

  test("addGoal error branch", async () => {
    const firestore = require("../../../src/services/firebase/firestore");
    firestore.addDocument.mockRejectedValueOnce(new Error("fail"));

    const res = await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "x",
    });

    expect(res.success).toBe(false);
  });

  test("updateGoal success", async () => {
    await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "old",
    });

    const goal = useGoalsStore.getState().goals[0];

    const res = await useGoalsStore
      .getState()
      .updateGoal(goal.id, { title: "new" });

    expect(res.success).toBe(true);

    const updated = useGoalsStore.getState().goals[0];
    expect(updated.title).toBe("new");
  });
  test("updateGoal fake id (branch coverage)", async () => {
    const res = await useGoalsStore
      .getState()
      .updateGoal("fake", { title: "x" });

    expect(res.success).toBe(false);
    expect(res.error).toBe("NOT_FOUND");
  });

  test("updateGoal error branch", async () => {
    const firestore = require("../../../src/services/firebase/firestore");
    firestore.updateDocument.mockRejectedValueOnce(new Error("fail"));

    const res = await useGoalsStore
      .getState()
      .updateGoal("fake", { title: "x" });

    expect(res.success).toBe(false);
  });

  test("deleteGoal success", async () => {
    await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "to delete",
    });

    const goal = useGoalsStore.getState().goals[0];

    const res = await useGoalsStore.getState().deleteGoal(goal.id);

    expect(res.success).toBe(true);

    const goals = useGoalsStore.getState().goals;
    expect(goals.length).toBe(0);
  });

  test("deleteGoal error branch", async () => {
    const firestore = require("../../../src/services/firebase/firestore");
    firestore.deleteDocument.mockRejectedValueOnce(new Error("fail"));

    await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "x",
    });

    const goals = useGoalsStore.getState().goals;
    expect(goals.length).toBeGreaterThan(0);

    const goal = goals[0];

    const res = await useGoalsStore.getState().deleteGoal(goal.id);

    expect(res.success).toBe(false);
  });

  test("clearError", () => {
    useGoalsStore.setState({ error: "x" });

    useGoalsStore.getState().clearError();

    expect(useGoalsStore.getState().error).toBeNull();
  });
  test("addGoal -> GOALS_LIMIT para usuário free", async () => {
    const premiumStore = require("../../../src/store/premiumStore").default;

    premiumStore.getState = () => ({
      isPremium: false,
    });

    useGoalsStore.setState({
      goals: [{}, {}, {}],
    });

    const res = await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "meta",
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe("GOALS_LIMIT");
  });

  test("addGoal -> NO_ID_RETURNED", async () => {
    const firestore = require("../../../src/services/firebase/firestore");

    firestore.addDocument.mockResolvedValueOnce(null);

    const res = await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "meta",
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe("NO_ID_RETURNED");
  });

  test("addToGoal success", async () => {
    await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "meta",
      targetAmount: 1000,
      currentAmount: 100,
    });

    const goal = useGoalsStore.getState().goals[0];

    const res = await useGoalsStore.getState().addToGoal(goal.id, 200);

    expect(res.success).toBe(true);

    const updated = useGoalsStore.getState().goals[0];

    expect(updated.currentAmount).toBe(300);
  });

  test("addToGoal meta inexistente", async () => {
    const res = await useGoalsStore.getState().addToGoal("fake", 100);

    expect(res.success).toBe(false);
  });

  test("addToGoal error branch", async () => {
    const firestore = require("../../../src/services/firebase/firestore");

    await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "meta",
    });

    const goal = useGoalsStore.getState().goals[0];

    firestore.updateDocument.mockRejectedValueOnce(new Error("fail"));

    const res = await useGoalsStore.getState().addToGoal(goal.id, 100);

    expect(res.success).toBe(false);
  });

  test("deleteGoal -> NOT_FOUND", async () => {
    const res = await useGoalsStore.getState().deleteGoal("fake");

    expect(res.success).toBe(false);
    expect(res.error).toBe("NOT_FOUND");
  });

  test("restoreGoals success", async () => {
    useGoalsStore.setState({
      goals: [
        {
          id: "old-1",
          title: "old",
        },
      ],
    });

    const res = await useGoalsStore.getState().restoreGoals([
      {
        id: "backup-1",
        title: "nova",
      },
    ]);

    expect(res.success).toBe(true);

    const goals = useGoalsStore.getState().goals;

    expect(goals.length).toBe(1);
    expect(goals[0].title).toBe("nova");
  });

  test("restoreGoals sem usuário", async () => {
    const config = require("../../../src/services/firebase/config");

    config.auth.currentUser = null;

    const res = await useGoalsStore.getState().restoreGoals([]);

    expect(res.success).toBe(false);

    config.auth.currentUser = { uid: "user-1" };
  });

  test("restoreGoals loading branch", async () => {
    useGoalsStore.setState({
      loading: true,
    });

    const res = await useGoalsStore.getState().restoreGoals([]);

    expect(res).toBeUndefined();
  });

  test("restoreGoals invalid format", async () => {
    const res = await useGoalsStore.getState().restoreGoals("invalid");

    expect(res.success).toBe(false);
  });

  test("restoreGoals error branch", async () => {
    const firestore = require("../../../src/services/firebase/firestore");

    firestore.addDocument.mockRejectedValueOnce(new Error("fail"));

    const res = await useGoalsStore.getState().restoreGoals([
      {
        id: "1",
        title: "meta",
      },
    ]);

    expect(res.success).toBe(false);
  });
  test("addToGoal deve disparar notificação", async () => {
    // mock settings com notificações ligadas
    const settingsStore = require("../../../src/store/settingsStore");

    settingsStore.getState = () => ({
      notifications: {
        enabled: true,
        goals: true,
      },
    });

    // mock notification service
    const NotificationService =
      require("../../../src/services/notifications/notificationService").default;

    NotificationService.scheduleGoalAchievementNotification = jest.fn();

    // adiciona meta
    await useGoalsStore.getState().addGoal({
      userId: "user-1",
      title: "Carro",
      targetAmount: 1000,
      currentAmount: 100,
    });

    const goal = useGoalsStore.getState().goals[0];

    // adiciona progresso
    const res = await useGoalsStore.getState().addToGoal(goal.id, 100);

    expect(res.success).toBe(true);

    expect(
      NotificationService.scheduleGoalAchievementNotification,
    ).toHaveBeenCalled();
  });
});
