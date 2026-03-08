/**
 * Funções de formatação com suporte a internacionalização
 */

import useSettingsStore from '../../store/settingsStore';

const relativeTimeTexts = {
  pt: {
    now: 'Agora',
    minute: 'Há 1 minuto',
    minutes: n => `Há ${n} minutos`,
    hour: 'Há 1 hora',
    hours: n => `Há ${n} horas`,
    yesterday: 'Ontem',
    days: n => `Há ${n} dias`,
    weeks: n => `Há ${n} semanas`,
    month: 'Há 1 mês',
    months: n => `Há ${n} meses`,
    year: 'Há 1 ano',
    years: n => `Há ${n} anos`,
  },
  en: {
    now: 'Now',
    minute: '1 minute ago',
    minutes: n => `${n} minutes ago`,
    hour: '1 hour ago',
    hours: n => `${n} hours ago`,
    yesterday: 'Yesterday',
    days: n => `${n} days ago`,
    weeks: n => `${n} weeks ago`,
    month: '1 month ago',
    months: n => `${n} months ago`,
    year: '1 year ago',
    years: n => `${n} years ago`,
  },
  es: {
    now: 'Ahora',
    minute: 'Hace 1 minuto',
    minutes: n => `Hace ${n} minutos`,
    hour: 'Hace 1 hora',
    hours: n => `Hace ${n} horas`,
    yesterday: 'Ayer',
    days: n => `Hace ${n} días`,
    weeks: n => `Hace ${n} semanas`,
    month: 'Hace 1 mes',
    months: n => `Hace ${n} meses`,
    year: 'Hace 1 año',
    years: n => `Hace ${n} años`,
  },
};

export const getCurrentLocale = () => {
  const settings = useSettingsStore.getState();
  return settings.language || 'pt-BR';
};


/**
 * Formatar valor para moeda
 * Usa a moeda configurada nas settings
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  
  const settings = useSettingsStore.getState();
  const currency = settings.currency || 'BRL';
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;

  // Configurações de locale por moeda
  const localeMap = {
    BRL: 'pt-BR',
    USD: 'en-US',
    EUR: 'pt-PT',
    GBP: 'en-GB',
    ARS: 'es-AR',
    CLP: 'es-CL',
    PYG: 'es-PY',
    UYU: 'es-UY',
  };

  const locale = settings.language || localeMap[currency] || 'pt-BR';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch (error) {
    // Fallback se der erro
    return `R$ ${num.toFixed(2).replace('.', ',')}`;
  }
};

/**
 * Formatar data para formato respeita o idioma
 */
export const formatDate = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';

  const locale = getCurrentLocale();

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short', // 👈 muda aqui
    year: 'numeric',
  }).format(dateObj);
};


/**
 * Formatar data com hora (formato brasileiro)
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';

  const locale = getCurrentLocale();
  
  // Formato brasileiro: DD/MM/AAAA às HH:MM
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Formatar data por extenso (português)
 */
export const formatDateLong = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';

  const locale = getCurrentLocale();
  
  // Formato: 28 de janeiro de 2026
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(dateObj);
};

/**
 * Formatar mês e ano (português)
 */
export const formatMonthYear = (date) => {
  if (!date) return '';

  const locale = getCurrentLocale();

  const formatted = new Intl.DateTimeFormat(locale, {
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));

  // Só capitaliza para PT e ES
  if (locale.startsWith('pt') || locale.startsWith('es')) {
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // Inglês já vem certo
  return formatted;
};



/**
 * Formatar apenas o mês (português)
 */
export const formatMonth = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';

  const locale = getCurrentLocale();
  
  // Formato: Janeiro
  return new Intl.DateTimeFormat(locale, {
    month: 'long',
  }).format(dateObj);
};

/**
 * Formatar mês abreviado (português)
 */
export const formatMonthShort = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const locale = getCurrentLocale();

  // Formato: Jan
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
  }).format(dateObj);
};

/**
 * Formatar dia da semana (português)
 */
export const formatWeekday = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';

  const locale = getCurrentLocale();
  
  // Formato: Segunda-feira
  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
  }).format(dateObj);
};

/**
 * Formatar número para porcentagem
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  
  return `${num.toFixed(decimals)}%`;
};

/**
 * Formatar número grande (abreviado)
 * Ex: 1500 -> 1,5 mil | 1500000 -> 1,5 mi
 */
export const formatNumberCompact = (value) => {
  if (value === null || value === undefined) return '0';
  
  const num = typeof value === 'number' ? value : parseFloat(value) || 0;
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)} bi`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} mi`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} mil`;
  }
  
  return num.toFixed(0);
};

/**
 * Truncar texto
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalizar primeira letra
 */
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Capitalizar primeira letra de cada palavra
 */
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * Obter iniciais do nome
 */
export const getInitials = (name) => {
  if (!name) return '';
  
  const parts = name.trim().split(' ').filter(Boolean);
  
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (
    parts[0].charAt(0).toUpperCase() + 
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

/**
 * Formatar número de telefone brasileiro
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  } else if (cleaned.length === 10) {
    // Fixo: (XX) XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }
  
  return phone;
};

/**
 * Formatar CPF
 */
export const formatCPF = (cpf) => {
  if (!cpf) return '';
  
  const cleaned = cpf.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }
  
  return cpf;
};

/**
 * Formatar tempo relativo (ex: "há 2 dias")
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return '';

  const settings = useSettingsStore.getState();
  const language = settings.language || 'pt';
  const t = relativeTimeTexts[language];

  const diffMs = new Date() - dateObj;
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffMinutes < 1) return t.now;
  if (diffMinutes === 1) return t.minute;
  if (diffMinutes < 60) return t.minutes(diffMinutes);
  if (diffHours === 1) return t.hour;
  if (diffHours < 24) return t.hours(diffHours);
  if (diffDays === 1) return t.yesterday;
  if (diffDays < 7) return t.days(diffDays);
  if (diffDays < 30) return t.weeks(Math.floor(diffDays / 7));
  if (diffMonths === 1) return t.month;
  if (diffMonths < 12) return t.months(diffMonths);
  if (diffYears === 1) return t.year;

  return t.years(diffYears);
};


export const parseISODateOnly = (dateString) => {
  if (!dateString) return null;

  const [year, month, day] = dateString.split('-').map(Number);

  if (!year || !month || !day) return null;

  // Criar data sem timezone (local time at midnight)
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  return date;
};

export const isoToBR = (isoDate) => {
  if (!isoDate) return '';

  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return '';

  return `${day}/${month}/${year}`;
};

export const brToISO = (brDate) => {
  if (!brDate) return '';

  const [day, month, year] = brDate.split('/');
  if (!day || !month || !year) return '';

  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

export const getCurrencyPlaceholder = () => {
  const locale = getCurrentLocale();
  const settings = useSettingsStore.getState();
  const currency = settings.currency || 'BRL';

  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });

  const formatted = formatter.format(0);

  return formatted
    .replace(/[^\d.,]/g, '')
    .trim();
};

export const getCurrencySymbol = () => {
  const locale = getCurrentLocale();
  const settings = useSettingsStore.getState();
  const currency = settings.currency || 'BRL';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    })
      .formatToParts(0)
      .find(p => p.type === 'currency')?.value || '';
  } catch {
    return '';
  }
};

export const parseCurrencyInput = (value) => {
  if (!value) return 0;

  const settings = useSettingsStore.getState();
  const currency = settings.currency || 'BRL';

  // Remove tudo que não for número, ponto ou vírgula
  let sanitized = value.replace(/[^\d.,]/g, '');

  const commaDecimalCurrencies = ['BRL', 'EUR', 'ARS', 'CLP', 'PYG', 'UYU'];
 
  if (commaDecimalCurrencies.includes(currency)) {
    // 1.234,56 → 1234.56
    sanitized = sanitized.replace(/\./g, '').replace(',', '.');
  } else {
    // 1,234.56 → 1234.56
    sanitized = sanitized.replace(/,/g, '');
  }

  const number = Number(sanitized);
  return isNaN(number) ? 0 : number;
};




export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatDateLong,
  formatMonthYear,
  formatMonth,
  formatMonthShort,
  formatWeekday,
  formatPercentage,
  formatNumberCompact,
  truncateText,
  capitalize,
  capitalizeWords,
  getInitials,
  formatPhone,
  formatCPF,
  formatRelativeTime,
  parseISODateOnly,
  isoToBR,
  getCurrencyPlaceholder,
  getCurrencySymbol,
  parseCurrencyInput,
  getCurrentLocale,
};