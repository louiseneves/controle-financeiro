import "dotenv/config";

export default {
  expo: {
    name: "Controle Financeiro",
    slug: "calculardizimo",
    version: "1.0.0",

    newArchEnabled: true,

    orientation: "portrait",
    icon: "./assets/logo.png",
    userInterfaceStyle: "automatic",

    splash: {
      image: "./assets/logo.png",
      resizeMode: "contain",
      backgroundColor: "#2563EB",
    },

    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.louiseneves.controlefinanceiro",
      buildNumber: "1",
    },

    android: {
      package: "com.louiseneves.calculardizimo",
      versionCode: 32,

      adaptiveIcon: {
        foregroundImage: "./assets/logo.png",
        backgroundColor: "#2563EB",
      },

      permissions: [
        "RECEIVE_BOOT_COMPLETED",
        "SCHEDULE_EXACT_ALARM",
        "POST_NOTIFICATIONS",
        "VIBRATE",
        "WAKE_LOCK",
      ],
    },

    plugins: [["expo-notifications"], "expo-secure-store", "expo-iap"],

    extra: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,

      eas: {
        projectId: "0ace624d-53cf-43f4-a330-c64ff592ec9f",
      },
    },

    jsEngine: "hermes",
  },
};
