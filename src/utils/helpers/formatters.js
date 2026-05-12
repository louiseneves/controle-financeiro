/**
 * Funções de formatação com suporte a internacionalização
 * IMPORTANTE: Função pura - não acessa stores diretamente
 * Use formatCurrencyHook em componentes React
 */

import { useCallback } from "react";
import useSettingsStore from "../../store/settingsStore";

/* ==================== RELATIVE TIME ==================== */

const relativeTimeTexts = {
  pt: {
    now: "Agora",
    minute: "Há 1 minuto",
    minutes: (n) => `Há ${n} minutos`,
    hour: "Há 1 hora",
    hours: (n) => `Há ${n} horas`,
    yesterday: "Ontem",
    days: (n) => `Há ${n} dias`,
    weeks: (n) => `Há ${n} semanas`,
    month: "Há 1 mês",
    months: (n) => `Há ${n} meses`,
    year: "Há 1 ano",
    years: (n) => `Há ${n} anos`,
  },

  en: {
    now: "Now",
    minute: "1 minute ago",
    minutes: (n) => `${n} minutes ago`,
    hour: "1 hour ago",
    hours: (n) => `${n} hours ago`,
    yesterday: "Yesterday",
    days: (n) => `${n} days ago`,
    weeks: (n) => `${n} weeks ago`,
    month: "1 month ago",
    months: (n) => `${n} months ago`,
    year: "1 year ago",
    years: (n) => `${n} years ago`,
  },

  es: {
    now: "Ahora",
    minute: "Hace 1 minuto",
    minutes: (n) => `Hace ${n} minutos`,
    hour: "Hace 1 hora",
    hours: (n) => `Hace ${n} horas`,
    yesterday: "Ayer",
    days: (n) => `Hace ${n} días`,
    weeks: (n) => `Hace ${n} semanas`,
    month: "Hace 1 mes",
    months: (n) => `Hace ${n} meses`,
    year: "Hace 1 año",
    years: (n) => `Hace ${n} años`,
  },
};

/* ==================== LOCALE ==================== */

export const getCurrentLocale = () => {
  const settings = useSettingsStore.getState();

  return settings.language || "pt-BR";
};

export const useCurrentLocale = () => {
  return useSettingsStore((state) => state.language || "pt-BR");
};

/* ==================== DATE HELPERS ==================== */

/**
 * Data local SEM bug de timezone (resolve 20h virar dia seguinte)
 */

export const getLocalDate = () => {
  const now = new Date();

  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate(),
  ).padStart(2, "0")}`;
};

/**
 * Converte ISO com segurança (remove T e timezone bug)
 */
export const parseISODateOnly = (dateString) => {
  if (!dateString) return null;

  const clean = dateString.split("T")[0];
  const [year, month, day] = clean.split("-").map(Number);

  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day, 12, 0, 0);
};

/**
 * Evita bug de timezone do Firebase
 */
export const toSafeISOString = (date) => {
  if (!date) return null;

  const parsed = typeof date === "string" ? parseISODateOnly(date) : date;

  if (!parsed) return null;

  return new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate(),
    12,
    0,
    0,
  ).toISOString();
};

/**
 * ISO → BR/US display
 */
export const getDisplayDate = (date, language = "pt-BR") => {
  if (!date) return "";

  const clean = date.split("T")[0];

  if (!clean.includes("-")) {
    return formatDateInput(clean, language);
  }

  const [year, month, day] = clean.split("-");

  if (language === "en-US") {
    return `${month}/${day}/${year}`;
  }

  return `${day}/${month}/${year}`;
};
/* ==================== INPUT DATE ==================== */

/**
 * Máscara automática enquanto digita
 */
export const formatDateInput = (text, language = "pt-BR") => {
  const numbers = text.replace(/\D/g, "").slice(0, 8);

  if (language === "en-US") {
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
    }
    return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
  }

  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 4) {
    return `${numbers.slice(0, 2)}/${numbers.slice(2)}`;
  }

  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}/${numbers.slice(4)}`;
};

/**
 * Input → ISO seguro
 */
export const formattedDateToISO = (formattedDate, language = "pt-BR") => {
  if (!formattedDate) return "";

  const parts = formattedDate.split("/");

  if (language === "en-US") {
    const [month, day, year] = parts;
    if (!year) return formattedDate;

    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const [day, month, year] = parts;
  if (!year) return formattedDate;

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

/**
 * Placeholder dinâmico
 */
export const getDatePlaceholder = (language = "pt-BR") => {
  if (language.startsWith("en")) return "MM/DD/YYYY";
  return "DD/MM/YYYY";
};

/* ==================== CURRENCY ==================== */

export const formatCurrencyValue = (
  value,
  currency = "BRL",
  locale = "pt-BR",
) => {
  if (value === null || value === undefined) {
    return "R$ 0,00";
  }

  const num = typeof value === "number" ? value : parseFloat(value) || 0;

  const localeMap = {
    BRL: "pt-BR",
    USD: "en-US",
    EUR: "pt-PT",
    GBP: "en-GB",
    ARS: "es-AR",
    CLP: "es-CL",
    PYG: "es-PY",
    UYU: "es-UY",
  };

  const finalLocale = locale || localeMap[currency] || "pt-BR";

  try {
    return new Intl.NumberFormat(finalLocale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `${currency} ${num.toFixed(2)}`;
  }
};

export const useCurrencyFormatter = () => {
  const currency = useSettingsStore((state) => state.currency);
  const language = useSettingsStore((state) => state.language);

  return useCallback(
    (value) => formatCurrencyValue(value, currency, language),
    [currency, language],
  );
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return "R$ 0,00";
  }

  const settings = useSettingsStore.getState();

  const currency = settings.currency || "BRL";
  const locale = settings.language || "pt-BR";

  const num = typeof value === "number" ? value : parseFloat(value) || 0;

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `R$ ${num.toFixed(2).replace(".", ",")}`;
  }
};

/* ==================== DATE FORMAT ==================== */

export const formatDate = (date) => {
  if (!date) return "";

  const dateObj = parseISODateOnly(date);
  if (!dateObj) return "";

  const locale = getCurrentLocale();

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(dateObj);
};

export const formatDateTime = (date) => {
  if (!date) return "";

  const dateObj = parseLocalDate(date);

  if (!dateObj || isNaN(dateObj.getTime())) {
    return "";
  }

  const locale = getCurrentLocale();

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj);
};

export const formatDateLong = (date) => {
  if (!date) return "";

  const dateObj = parseLocalDate(date);

  if (!dateObj || isNaN(dateObj.getTime())) {
    return "";
  }

  const locale = getCurrentLocale();

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);
};

export const formatMonthYear = (date) => {
  if (!date) return "";

  const locale = getCurrentLocale();

  const formatted = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(parseLocalDate(date));

  if (locale.startsWith("pt") || locale.startsWith("es")) {
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  return formatted;
};

export const formatMonth = (date) => {
  if (!date) return "";

  const dateObj = parseLocalDate(date);

  if (!dateObj || isNaN(dateObj.getTime())) {
    return "";
  }

  const locale = getCurrentLocale();

  return new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(dateObj);
};

export const formatMonthShort = (date) => {
  if (!date) return "";

  const dateObj = parseLocalDate(date);

  if (!dateObj || isNaN(dateObj.getTime())) {
    return "";
  }

  const locale = getCurrentLocale();

  return new Intl.DateTimeFormat(locale, {
    month: "short",
  }).format(dateObj);
};

export const formatWeekday = (date) => {
  if (!date) return "";

  const dateObj = parseLocalDate(date);

  if (!dateObj || isNaN(dateObj.getTime())) {
    return "";
  }

  const locale = getCurrentLocale();

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
  }).format(dateObj);
};

/* ==================== NUMBERS ==================== */

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) {
    return "0%";
  }

  const num = typeof value === "number" ? value : parseFloat(value) || 0;

  return `${num.toFixed(decimals)}%`;
};

export const formatNumberCompact = (value) => {
  if (value === null || value === undefined) {
    return "0";
  }

  const num = typeof value === "number" ? value : parseFloat(value) || 0;

  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)} bi`;
  }

  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)} mi`;
  }

  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} mil`;
  }

  return num.toFixed(0);
};

/* ==================== TEXT ==================== */

export const truncateText = (text, maxLength = 50) => {
  if (!text) return "";

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
};

export const capitalize = (text) => {
  if (!text) return "";

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const capitalizeWords = (text) => {
  if (!text) return "";

  return text
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

export const getInitials = (name) => {
  if (!name) return "";

  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "";

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
};

/* ==================== FORMATTERS ==================== */

export const formatPhone = (phone) => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
  }

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
  }

  return phone;
};

export const formatCPF = (cpf) => {
  if (!cpf) return "";

  const cleaned = cpf.replace(/\D/g, "");

  if (cleaned.length === 11) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
  }

  return cpf;
};

/* ==================== RELATIVE TIME ==================== */

export const formatRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = parseLocalDate(date);

  if (!dateObj || isNaN(dateObj.getTime())) {
    return "";
  }

  const settings = useSettingsStore.getState();

  const language = settings.language || "pt-BR";

  const langKey = language.startsWith("pt")
    ? "pt"
    : language.startsWith("es")
      ? "es"
      : "en";

  const t = relativeTimeTexts[langKey];

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

/* ==================== CURRENCY HELPERS ==================== */

export const getCurrencyPlaceholder = () => {
  const locale = getCurrentLocale();

  const settings = useSettingsStore.getState();

  const currency = settings.currency || "BRL";

  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });

  const formatted = formatter.format(0);

  return formatted.replace(/[^\d.,]/g, "").trim();
};

export const getCurrencySymbol = () => {
  const locale = getCurrentLocale();

  const settings = useSettingsStore.getState();

  const currency = settings.currency || "BRL";

  try {
    return (
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency,
      })
        .formatToParts(0)
        .find((p) => p.type === "currency")?.value || ""
    );
  } catch {
    return "";
  }
};

export const parseCurrencyInput = (value) => {
  if (!value) return 0;

  const settings = useSettingsStore.getState();

  const currency = settings.currency || "BRL";

  let sanitized = value.replace(/[^\d.,]/g, "");

  const commaDecimalCurrencies = ["BRL", "EUR", "ARS", "CLP", "PYG", "UYU"];

  if (commaDecimalCurrencies.includes(currency)) {
    sanitized = sanitized.replace(/\./g, "").replace(",", ".");
  } else {
    sanitized = sanitized.replace(/,/g, "");
  }

  const number = Number(sanitized);

  return isNaN(number) ? 0 : number;
};

// ✅ CORRIGIDO // Evita bug de UTC / timezone
export const parseLocalDate = (date) => {
  if (!date) return null;
  if (date instanceof Date) {
    return date;
  } // YYYY-MM-DD
  if (typeof date === "string" && date.includes("-")) {
    const [year, month, day] = date.split("T")[0].split("-").map(Number);
    return new Date(year, month - 1, day, 12, 0, 0);
  }
  return new Date(date);
};

/* ==================== EXPORT ==================== */

export default {
  formatCurrency,
  formatDate,
  formatDateInput,
  formatDateTime,
  formatDateLong,
  formatMonthYear,
  formatMonth,
  formatMonthShort,
  formatWeekday,
  formatPercentage,
  formatNumberCompact,
  formattedDateToISO,
  truncateText,
  capitalize,
  capitalizeWords,
  getInitials,
  formatPhone,
  formatCPF,
  formatRelativeTime,
  parseISODateOnly,
  getDatePlaceholder,
  getCurrencyPlaceholder,
  getCurrencySymbol,
  parseCurrencyInput,
  getCurrentLocale,
  getLocalDate,
  getDisplayDate,
  toSafeISOString,
  parseLocalDate,
};
