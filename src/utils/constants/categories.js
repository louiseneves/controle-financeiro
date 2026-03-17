/**
 * Categorias padrão do app
 * Ícones usando MaterialIcons (React Native Vector Icons)
 * Traduções via i18n (pt-BR, en-US, es-ES)
 */

import { t } from "../../i18n";

export const INCOME_CATEGORIES = [
  {
    id: "salario",
    name: t("categories.income.salario"),
    icon: "payments",
    color: "#10B981",
  },
  {
    id: "freelance",
    name: t("categories.income.freelance"),
    icon: "computer",
    color: "#3B82F6",
  },
  {
    id: "investimentos",
    name: t("categories.income.investimentos"),
    icon: "trending-up",
    color: "#8B5CF6",
  },
  {
    id: "bonus",
    name: t("categories.income.bonus"),
    icon: "card-giftcard",
    color: "#F59E0B",
  },
  {
    id: "presente",
    name: t("categories.income.presente"),
    icon: "celebration",
    color: "#EC4899",
  },
  {
    id: "venda",
    name: t("categories.income.venda"),
    icon: "sell",
    color: "#06B6D4",
  },
  {
    id: "aluguel",
    name: t("categories.income.aluguel"),
    icon: "home",
    color: "#14B8A6",
  },
  {
    id: "outros",
    name: t("categories.income.outros"),
    icon: "attach-money",
    color: "#6B7280",
  },
];

export const EXPENSE_CATEGORIES = [
  {
    id: "alimentacao",
    name: t("categories.expense.alimentacao"),
    icon: "restaurant",
    color: "#EF4444",
  },
  {
    id: "transporte",
    name: t("categories.expense.transporte"),
    icon: "directions-car",
    color: "#F59E0B",
  },
  {
    id: "moradia",
    name: t("categories.expense.moradia"),
    icon: "home",
    color: "#8B5CF6",
  },
  {
    id: "saude",
    name: t("categories.expense.saude"),
    icon: "local-hospital",
    color: "#10B981",
  },
  {
    id: "educacao",
    name: t("categories.expense.educacao"),
    icon: "school",
    color: "#3B82F6",
  },
  {
    id: "lazer",
    name: t("categories.expense.lazer"),
    icon: "sports-esports",
    color: "#EC4899",
  },
  {
    id: "vestuario",
    name: t("categories.expense.vestuario"),
    icon: "checkroom",
    color: "#06B6D4",
  },
  {
    id: "contas",
    name: t("categories.expense.contas"),
    icon: "receipt-long",
    color: "#F59E0B",
  },
  {
    id: "mercado",
    name: t("categories.expense.mercado"),
    icon: "shopping-cart",
    color: "#10B981",
  },
  {
    id: "combustivel",
    name: t("categories.expense.combustivel"),
    icon: "local-gas-station",
    color: "#EF4444",
  },
  {
    id: "telefone",
    name: t("categories.expense.telefone"),
    icon: "phone-iphone",
    color: "#3B82F6",
  },
  {
    id: "streaming",
    name: t("categories.expense.streaming"),
    icon: "live-tv",
    color: "#8B5CF6",
  },
  {
    id: "academia",
    name: t("categories.expense.academia"),
    icon: "fitness-center",
    color: "#10B981",
  },
  {
    id: "pet",
    name: t("categories.expense.pet"),
    icon: "pets",
    color: "#F59E0B",
  },
  {
    id: "outros",
    name: t("categories.expense.outros"),
    icon: "credit-card",
    color: "#6B7280",
  },
];

export const INVESTMENT_CATEGORIES = [
  {
    id: "poupanca",
    name: t("categories.investment.poupanca"),
    icon: "savings",
    color: "#10B981",
  },
  {
    id: "cdb",
    name: t("categories.investment.cdb"),
    icon: "assessment",
    color: "#3B82F6",
  },
  {
    id: "tesouro",
    name: t("categories.investment.tesouro"),
    icon: "account-balance",
    color: "#8B5CF6",
  },
  {
    id: "acoes",
    name: t("categories.investment.acoes"),
    icon: "show-chart",
    color: "#EF4444",
  },
  {
    id: "fundos",
    name: t("categories.investment.fundos"),
    icon: "business-center",
    color: "#F59E0B",
  },
  {
    id: "cripto",
    name: t("categories.investment.cripto"),
    icon: "currency-bitcoin",
    color: "#F59E0B",
  },
  {
    id: "outros",
    name: t("categories.investment.outros"),
    icon: "account-balance-wallet",
    color: "#6B7280",
  },
];

export const OFFER_CATEGORIES = [
  {
    id: "dizimo",
    name: t("categories.offering.dizimo"),
    icon: "church",
    color: "#6366F1",
  },
  {
    id: "oferta",
    name: t("categories.offering.oferta"),
    icon: "volunteer-activism",
    color: "#8B5CF6",
  },
  {
    id: "missoes",
    name: t("categories.offering.missoes"),
    icon: "public",
    color: "#10B981",
  },
  {
    id: "construcao",
    name: t("categories.offering.construcao"),
    icon: "construction",
    color: "#F59E0B",
  },
  {
    id: "caridade",
    name: t("categories.offering.caridade"),
    icon: "favorite",
    color: "#EC4899",
  },
  {
    id: "outros",
    name: t("categories.offering.outros"),
    icon: "card-giftcard",
    color: "#6B7280",
  },
];

export const TRANSACTION_TYPES = {
  INCOME: "receita",
  EXPENSE: "despesa",
  INVESTMENT: "investimento",
  OFFER: "oferta",
};

export default {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  INVESTMENT_CATEGORIES,
  OFFER_CATEGORIES,
  TRANSACTION_TYPES,
};
