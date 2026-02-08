// src/services/currency/currencyService.js

const exchangeRates = {
  BRL: 1,
  USD: 5.0,
  EUR: 5.5,
  GBP: 6.2,
  ARS: 0.015,
  CLP: 0.005,
  PYG: 0.00073,
  UYU: 0.13,
};

/**
 * Converte um valor EM BRL para a moeda selecionada
 */
export const convertFromBRL = (valueInBRL, targetCurrency) => {
  if (!valueInBRL || targetCurrency === 'BRL') return valueInBRL;

  const rate = exchangeRates[targetCurrency];
  if (!rate) return valueInBRL;

  return valueInBRL / rate;
};
