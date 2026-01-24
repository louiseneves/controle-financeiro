/**
 * Rotas do App
 * Centraliza todos os nomes de rotas
 */

export const ROUTES = {
  // Auth
  LOGIN: 'Login',
  REGISTER: 'Register',
  FORGOT_PASSWORD: 'ForgotPassword',

  // Main Tabs
  HOME: 'Home',
  TRANSACTIONS: 'Transactions',
  REPORTS: 'Reports',
  PROFILE: 'Profile',

  // Transactions
  ADD_RECEITA: 'AddReceita',
  ADD_DESPESA: 'AddDespesa',
  ADD_INVESTIMENTO: 'AddInvestimento',
  ADD_OFERTA: 'AddOferta',
  CALCULADORA_DIZIMO: 'CalculadoraDizimo',
  EDIT_TRANSACTION: 'EditTransaction',

  // Reports
  HISTORICO: 'Historico',
  RELATORIO_AVANCADO: 'RelatorioAvancado',

  // Planning
  METAS: 'Metas',
  ADD_META: 'AddMeta',
  PLANEJAMENTO: 'Planejamento',

  // Settings
  PERFIL_EDIT: 'PerfilEdit',
  CONFIGURACOES: 'Configuracoes',
  SUPORTE: 'Suporte',
  BACKUP: 'Backup',
  UPGRADE_PREMIUM: 'UpgradePremium',
};

export default ROUTES;