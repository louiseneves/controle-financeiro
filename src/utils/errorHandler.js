/**
 * Error Handler - Padrão centralizado para tratamento de erros
 * Todos os stores devem usar este módulo para consistência
 */

/**
 * Classificação de erro
 */
export const ERROR_TYPES = {
  NETWORK: "NETWORK_ERROR",
  AUTH: "AUTH_ERROR",
  VALIDATION: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND_ERROR",
  PERMISSION: "PERMISSION_ERROR",
  UNKNOWN: "UNKNOWN_ERROR",
};

/**
 * Classe para erros estruturados
 */
export class AppError extends Error {
  constructor(message, type = ERROR_TYPES.UNKNOWN, originalError = null) {
    super(message);
    this.name = "AppError";
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }

  toObject() {
    return {
      message: this.message,
      type: this.type,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

/**
 * Classificar erro automático
 * @param {Error} error - Erro para classificar
 * @returns {string} - Tipo de erro
 */
export const classifyError = (error) => {
  if (!error) return ERROR_TYPES.UNKNOWN;

  const message = error?.message || "";
  const code = error?.code || "";

  // Erros de rede
  if (
    message.includes("network") ||
    message.includes("Network") ||
    code === "NETWORK_ERROR"
  ) {
    return ERROR_TYPES.NETWORK;
  }

  // Erros de autenticação
  if (message.includes("auth") || code === "PERMISSION_DENIED") {
    return ERROR_TYPES.AUTH;
  }

  // Erros de validação
  if (message.includes("validation") || code === "INVALID_ARGUMENT") {
    return ERROR_TYPES.VALIDATION;
  }

  // Erros de não encontrado
  if (message.includes("not found") || code === "NOT_FOUND") {
    return ERROR_TYPES.NOT_FOUND;
  }

  // Erros de permissão
  if (message.includes("permission") || message.includes("Permission")) {
    return ERROR_TYPES.PERMISSION;
  }

  return ERROR_TYPES.UNKNOWN;
};

/**
 * Handler de erro com logging estruturado
 * @param {Error} error - Erro para tratar
 * @param {string} context - Contexto onde o erro ocorreu
 * @param {object} metadata - Dados adicionais
 * @returns {AppError} - Erro estruturado
 */
export const handleError = (error, context = "Unknown", metadata = {}) => {
  const errorType = classifyError(error);

  // Log estruturado (em produção, enviar para Sentry)
  if (__DEV__) {
    console.error(`[${context}] ${errorType}:`, {
      message: error?.message,
      code: error?.code,
      ...metadata,
      stack: error?.stack,
    });
  }
  // TODO: Enviar para Sentry em produção
  // Sentry.captureException(error, { extra: { context, ...metadata } });

  return new AppError(error?.message || "Erro desconhecido", errorType, error);
};

/**
 * Extrair mensagem amigável de erro
 * @param {Error|AppError} error - Erro
 * @returns {string} - Mensagem amigável
 */
export const getErrorMessage = (error) => {
  if (!error) return "Erro desconhecido";

  // Se for AppError
  if (error instanceof AppError) {
    switch (error.type) {
      case ERROR_TYPES.NETWORK:
        return "Erro de conexão. Verifique sua internet.";
      case ERROR_TYPES.AUTH:
        return "Erro de autenticação. Faça login novamente.";
      case ERROR_TYPES.PERMISSION:
        return "Você não tem permissão para essa ação.";
      case ERROR_TYPES.NOT_FOUND:
        return "Recurso não encontrado.";
      case ERROR_TYPES.VALIDATION:
        return error.message || "Dados inválidos.";
      default:
        return error.message || "Erro desconhecido";
    }
  }

  // Mensagem customizada se existir
  if (error.message) {
    return error.message;
  }

  return "Erro desconhecido";
};

export default {
  ERROR_TYPES,
  AppError,
  classifyError,
  handleError,
  getErrorMessage,
};
