/**
 * Transactions Navigator
 * Stack de navegação para telas de transações
 */

import React, { useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AddIncomeScreen from "../screens/transactions/AddIncomeScreen";
import AddExpenseScreen from "../screens/transactions/AddExpenseScreen";
import AddOfferScreen from "../screens/transactions/AddOfferScreen";
import AddInvestmentScreen from "../screens/transactions/AddInvestmentScreen";
import InvestmentsListScreen from "../screens/transactions/InvestmentsListScreen";
import TitheCalculatorScreen from "../screens/transactions/TitheCalculatorScreen";
import TransactionDetailScreen from "../screens/transactions/TransactionDetailScreen";
import { useTheme } from "../context/ThemeContext";
import { t } from "../i18n";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const Stack = createNativeStackNavigator();

// Tela temporária de Transações
const TransactionsListScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("transactionsNavigator.title")}</Text>
      <Text style={styles.subtitle}>{t("transactionsNavigator.subtitle")}</Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.success + "30" },
          ]}
          onPress={() => navigation.navigate("AddIncome")}
        >
          <MaterialCommunityIcons
            name="plus"
            size={32}
            color={colors.success}
          />
          <Text style={styles.actionText}>
            {t("transactionsNavigator.addIncome")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.error + "30" },
          ]}
          onPress={() => navigation.navigate("AddExpense")}
        >
          <MaterialCommunityIcons name="minus" size={32} color={colors.error} />
          <Text style={styles.actionText}>
            {t("transactionsNavigator.addExpense")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.offer + "30" },
          ]}
          onPress={() => navigation.navigate("AddOffer")}
        >
          <MaterialCommunityIcons
            name="hands-pray"
            size={32}
            color={colors.offer}
          />
          <Text style={styles.actionText}>
            {t("transactionsNavigator.registerOffer")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.tithe + "30" },
          ]}
          onPress={() => navigation.navigate("TitheCalculator")}
        >
          <MaterialCommunityIcons name="cross" size={32} color={colors.tithe} />
          <Text style={styles.actionText}>
            {t("transactionsNavigator.titheCalculator")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: colors.investment + "30" },
          ]}
          onPress={() => navigation.navigate("InvestmentsList")}
        >
          <MaterialCommunityIcons
            name="chart-line"
            size={32}
            color={colors.investment}
          />
          <Text style={styles.actionText}>
            {t("transactionsNavigator.myInvestments")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    actions: {
      gap: 16,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      borderRadius: 16,
      gap: 16,
    },
    actionIcon: {
      fontSize: 32,
    },
    actionText: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },
  });

const TransactionsNavigator = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: "600",
        },
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="TransactionsList"
        component={TransactionsListScreen}
        options={{ title: t("transactionsNavigator.titleTransactions") }}
      />

      <Stack.Screen
        name="AddIncome"
        component={AddIncomeScreen}
        options={{ title: t("transactionsNavigator.addIncome") }}
      />

      <Stack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{ title: t("transactionsNavigator.addExpense") }}
      />

      <Stack.Screen
        name="AddOffer"
        component={AddOfferScreen}
        options={{ title: t("transactionsNavigator.addOffer") }}
      />

      <Stack.Screen
        name="TitheCalculator"
        component={TitheCalculatorScreen}
        options={{ title: t("transactionsNavigator.titheCalculator") }}
      />

      <Stack.Screen
        name="InvestmentsList"
        component={InvestmentsListScreen}
        options={{ title: t("transactionsNavigator.investmentsList") }}
      />

      <Stack.Screen
        name="AddInvestment"
        component={AddInvestmentScreen}
        options={{ title: t("transactionsNavigator.addInvestment") }}
      />

      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{ title: t("transactionsNavigator.transactionDetail") }}
      />
    </Stack.Navigator>
  );
};

export default TransactionsNavigator;
