import useSettingsStore from '../store/settingsStore';
import { translations } from './translations';

export const t = (path, params = {}) => {
  const language = useSettingsStore.getState().language || 'pt-BR';

  const keys = path.split('.');
  let result = translations[language];

  for (const key of keys) {
    result = result?.[key];
    if (!result) break;
  }

  if (typeof result !== 'string') {
    return result || path;
  }

  // 🔥 Interpolação {{param}}
  return result.replace(/{{(.*?)}}/g, (_, key) => {
    const value = params[key.trim()];
    return value !== undefined ? value : `{{${key}}}`;
  });
};

