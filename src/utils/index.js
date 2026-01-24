/**
 * Exportar todas as constantes e helpers
 */

// Constantes
export {default as COLORS} from './constants/colors';
export {default as ROUTES} from './constants/routes';
export {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  INVESTMENT_CATEGORIES,
  OFFER_CATEGORIES,
  TRANSACTION_TYPES,
} from './constants/categories';

// Helpers
export {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDateLong,
  formatMonthYear,
  formatPercentage,
  truncateText,
  capitalize,
  getInitials,
} from './helpers/formatters';

export {
  calculateTithe,
  calculateTotalTithe,
  calculatePercentage,
  checkTitheStatus,
  getOfferSuggestions,
  getTitheHistory,
} from './helpers/titheCalculator';