/**
 * Logger - Gerenciamento de logs com suporte a ambientes
 * Em produção: envia para Sentry/serviço externo
 * Em desenvolvimento: mostra no console
 */

const isDevelopment = __DEV__ || process.env.NODE_ENV === "development";

/**
 * Registra um log de informação
 * @param {string} message - Mensagem
 * @param {any} data - Dados adicionais (opcional)
 */
export const logInfo = (message, data = null) => {
  if (isDevelopment) {
    console.log(`ℹ️ ${message}`, data || "");
  }
  // TODO: Enviar para Sentry em produção
  // Sentry.captureMessage(message, 'info', { extra: data });
};

/**
 * Registra um aviso
 * @param {string} message - Mensagem
 * @param {any} data - Dados adicionais (opcional)
 */
export const logWarn = (message, data = null) => {
  if (isDevelopment) {
    console.warn(`⚠️ ${message}`, data || "");
  }
  // TODO: Enviar para Sentry em produção
};

/**
 * Registra um sucesso
 * @param {string} message - Mensagem
 * @param {any} data - Dados adicionais (opcional)
 */
export const logSuccess = (message, data = null) => {
  if (isDevelopment) {
    console.log(`✅ ${message}`, data || "");
  }
};

/**
 * Registra um erro
 * @param {string} message - Mensagem
 * @param {Error} error - Objeto de erro
 */
export const logError = (message, error = null) => {
  const errorMessage = error?.message || String(error);

  if (isDevelopment) {
    console.error(`❌ ${message}:`, errorMessage);
    if (error?.stack) console.error(error.stack);
  }

  // TODO: Enviar para Sentry em produção
  // Sentry.captureException(error, {
  //   extra: { context: message }
  // });
};

export default {
  logInfo,
  logWarn,
  logSuccess,
  logError,
};
