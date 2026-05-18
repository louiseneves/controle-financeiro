jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),

  requestPermissionsAsync: jest.fn(async () => ({
    status: "granted",
  })),

  getPermissionsAsync: jest.fn(async () => ({
    status: "granted",
  })),

  scheduleNotificationAsync: jest.fn(async () => "notification-id"),

  cancelScheduledNotificationAsync: jest.fn(async () => {}),

  cancelAllScheduledNotificationsAsync: jest.fn(async () => {}),

  setNotificationChannelAsync: jest.fn(async () => {}),

  AndroidImportance: {
    MAX: 5,
  },

  SchedulableTriggerInputTypes: {
    DAILY: "daily",
    YEARLY: "yearly",
  },
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");

  return {
    Ionicons: (props) => <Text>{props.name}</Text>,
    MaterialIcons: (props) => <Text>{props.name}</Text>,
    Feather: (props) => <Text>{props.name}</Text>,
  };
});
