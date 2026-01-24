/**
 * Categorias padrão do app
 */

export const INCOME_CATEGORIES = [
  {id: 'salario', name: 'Salário', icon: '💰', color: '#10B981'},
  {id: 'freelance', name: 'Freelance', icon: '💼', color: '#3B82F6'},
  {id: 'investimentos', name: 'Rendimento de Investimentos', icon: '📈', color: '#8B5CF6'},
  {id: 'bonus', name: 'Bônus', icon: '🎁', color: '#F59E0B'},
  {id: 'presente', name: 'Presente', icon: '🎉', color: '#EC4899'},
  {id: 'venda', name: 'Venda', icon: '🏷️', color: '#06B6D4'},
  {id: 'aluguel', name: 'Aluguel', icon: '🏠', color: '#14B8A6'},
  {id: 'outros', name: 'Outros', icon: '💵', color: '#6B7280'},
];

export const EXPENSE_CATEGORIES = [
  {id: 'alimentacao', name: 'Alimentação', icon: '🍔', color: '#EF4444'},
  {id: 'transporte', name: 'Transporte', icon: '🚗', color: '#F59E0B'},
  {id: 'moradia', name: 'Moradia', icon: '🏠', color: '#8B5CF6'},
  {id: 'saude', name: 'Saúde', icon: '🏥', color: '#10B981'},
  {id: 'educacao', name: 'Educação', icon: '📚', color: '#3B82F6'},
  {id: 'lazer', name: 'Lazer', icon: '🎮', color: '#EC4899'},
  {id: 'vestuario', name: 'Vestuário', icon: '👕', color: '#06B6D4'},
  {id: 'contas', name: 'Contas e Serviços', icon: '📄', color: '#F59E0B'},
  {id: 'mercado', name: 'Mercado', icon: '🛒', color: '#10B981'},
  {id: 'combustivel', name: 'Combustível', icon: '⛽', color: '#EF4444'},
  {id: 'telefone', name: 'Telefone/Internet', icon: '📱', color: '#3B82F6'},
  {id: 'streaming', name: 'Streaming', icon: '📺', color: '#8B5CF6'},
  {id: 'academia', name: 'Academia', icon: '💪', color: '#10B981'},
  {id: 'pet', name: 'Pet', icon: '🐕', color: '#F59E0B'},
  {id: 'outros', name: 'Outros', icon: '💳', color: '#6B7280'},
];

export const INVESTMENT_CATEGORIES = [
  {id: 'poupanca', name: 'Poupança', icon: '🏦', color: '#10B981'},
  {id: 'cdb', name: 'CDB', icon: '📊', color: '#3B82F6'},
  {id: 'tesouro', name: 'Tesouro Direto', icon: '🏛️', color: '#8B5CF6'},
  {id: 'acoes', name: 'Ações', icon: '📈', color: '#EF4444'},
  {id: 'fundos', name: 'Fundos de Investimento', icon: '💼', color: '#F59E0B'},
  {id: 'cripto', name: 'Criptomoedas', icon: '₿', color: '#F59E0B'},
  {id: 'outros', name: 'Outros', icon: '💰', color: '#6B7280'},
];

export const OFFER_CATEGORIES = [
  {id: 'dizimo', name: 'Dízimo', icon: '✝️', color: '#6366F1'},
  {id: 'oferta', name: 'Oferta', icon: '🙏', color: '#8B5CF6'},
  {id: 'missoes', name: 'Missões', icon: '🌍', color: '#10B981'},
  {id: 'construcao', name: 'Construção', icon: '🏗️', color: '#F59E0B'},
  {id: 'caridade', name: 'Caridade', icon: '❤️', color: '#EC4899'},
  {id: 'outros', name: 'Outros', icon: '🎁', color: '#6B7280'},
];

export const TRANSACTION_TYPES = {
  INCOME: 'receita',
  EXPENSE: 'despesa',
  INVESTMENT: 'investimento',
  OFFER: 'oferta',
};

export default {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  INVESTMENT_CATEGORIES,
  OFFER_CATEGORIES,
  TRANSACTION_TYPES,
};