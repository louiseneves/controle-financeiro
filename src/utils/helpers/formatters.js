/**
 * Funções de formatação
 */

/**
 * Formatar valor para moeda brasileira
 * @param {number} value - Valor numérico
 * @returns {string} - Valor formatado (ex: R$ 1.234,56)
 */
export const formatCurrency = value => {
  if (!value && value !== 0) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formatar data para formato brasileiro
 * @param {string|Date} date - Data
 * @returns {string} - Data formatada (ex: 18/12/2024)
 */
export const formatDate = date => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR').format(dateObj);
};

/**
 * Formatar data com hora
 * @param {string|Date} date - Data
 * @returns {string} - Data e hora formatadas (ex: 18/12/2024 às 14:30)
 */
export const formatDateTime = date => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(dateObj);
};

/**
 * Formatar data por extenso
 * @param {string|Date} date - Data
 * @returns {string} - Data por extenso (ex: 18 de dezembro de 2024)
 */
export const formatDateLong = date => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Formatar mês e ano
 * @param {string|Date} date - Data
 * @returns {string} - Mês e ano (ex: Dezembro de 2024)
 */
export const formatMonthYear = date => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Formatar número para porcentagem
 * @param {number} value - Valor numérico
 * @param {number} decimals - Casas decimais (padrão: 2)
 * @returns {string} - Porcentagem formatada (ex: 12,50%)
 */
export const formatPercentage = (value, decimals = 2) => {
  if (!value && value !== 0) return '0%';
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncar texto
 * @param {string} text - Texto
 * @param {number} maxLength - Tamanho máximo
 * @returns {string} - Texto truncado
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalizar primeira letra
 * @param {string} text - Texto
 * @returns {string} - Texto capitalizado
 */
export const capitalize = text => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Obter iniciais do nome
 * @param {string} name - Nome completo
 * @returns {string} - Iniciais (ex: João Silva -> JS)
 */
export const getInitials = name => {
  if (!name) return '';
  
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDateLong,
  formatMonthYear,
  formatPercentage,
  truncateText,
  capitalize,
  getInitials,
};