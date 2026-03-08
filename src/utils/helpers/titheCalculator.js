/**
 * Calculadora de Dízimo
 * Funções para calcular dízimo e ofertas
 */

/**
 * Calcular 10% do valor (dízimo)
 * @param {number} amount - Valor base
 * @returns {number} - 10% do valor
 */
export const calculateTithe = amount => {
  if (!amount || amount <= 0) return 0;
  return amount * 0.1;
};

/**
 * Calcular dízimo de múltiplas receitas
 * @param {array} incomes - Array de receitas {amount: number}
 * @returns {number} - Total de dízimo
 */
export const calculateTotalTithe = incomes => {
  if (!incomes || incomes.length === 0) return 0;
  
  const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount || 0), 0);
  return calculateTithe(totalIncome);
};

/**
 * Calcular porcentagem personalizada
 * @param {number} amount - Valor base
 * @param {number} percentage - Porcentagem (ex: 5 para 5%)
 * @returns {number} - Valor calculado
 */
export const calculatePercentage = (amount, percentage) => {
  if (!amount || amount <= 0 || !percentage) return 0;
  return (amount * percentage) / 100;
};

/**
 * Verificar se dízimo foi pago no mês
 * @param {array} offers - Array de ofertas do mês
 * @param {number} expectedTithe - Valor esperado de dízimo
 * @returns {object} - {paid: boolean, amount: number, remaining: number}
 */
export const checkTitheStatus = (offers, expectedTithe) => {
  if (!offers || offers.length === 0) {
    return {
      paid: false,
      amount: 0,
      remaining: expectedTithe,
      percentage: 0,
    };
  }

  // Somar apenas ofertas do tipo "dízimo"
  const paidTithe = offers
    .filter(offer => offer.category === 'dizimo' || offer.type === 'dizimo')
    .reduce((sum, offer) => sum + Number(offer.amount || 0), 0);

  const remaining = expectedTithe - paidTithe;
  const percentage = expectedTithe > 0 ? (paidTithe / expectedTithe) * 100 : 0;

  return {
    paid: paidTithe >= expectedTithe,
    amount: paidTithe,
    remaining: remaining > 0 ? remaining : 0,
    percentage: Math.min(percentage, 100),
  };
};

/**
 * Obter sugestão de oferta baseada na renda
 * @param {number} income - Renda total
 * @returns {object} - Sugestões {min, recommended, generous}
 */
export const getOfferSuggestions = income => {
  if (!income || income <= 0) {
    return {
      min: 0,
      recommended: 0,
      generous: 0,
    };
  }

  return {
    min: calculatePercentage(income, 10), // 10% - Dízimo
    recommended: calculatePercentage(income, 15), // 15%
    generous: calculatePercentage(income, 20), // 20%
  };
};

/**
 * Calcular histórico de dízimos pagos
 * @param {array} offers - Array de todas as ofertas
 * @returns {object} - Estatísticas
 */
export const getTitheHistory = offers => {
  if (!offers || offers.length === 0) {
    return {
      total: 0,
      count: 0,
      average: 0,
      lastPayment: null,
    };
  }

  const tithes = offers.filter(
    offer => offer.category === 'dizimo' || offer.type === 'dizimo',
  );

  const total = tithes.reduce((sum, tithe) => sum + Number(tithe.amount || 0), 0);
  const count = tithes.length;
  const average = count > 0 ? total / count : 0;

  // Ordenar por data e pegar o mais recente
  const sortedTithes = [...tithes].sort((a, b) => {
    const dateA = new Date(a.date || a.createdAt);
    const dateB = new Date(b.date || b.createdAt);
    return dateB - dateA;
  });

  const lastPayment = sortedTithes.length > 0 ? sortedTithes[0] : null;

  return {
    total,
    count,
    average,
    lastPayment,
  };
};

export default {
  calculateTithe,
  calculateTotalTithe,
  calculatePercentage,
  checkTitheStatus,
  getOfferSuggestions,
  getTitheHistory,
};