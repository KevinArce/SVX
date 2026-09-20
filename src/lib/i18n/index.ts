import { TRANSLATIONS, type Language, type TranslationDict } from './translations';

export { TRANSLATIONS, type Language, type TranslationDict };

export const DEFAULT_LANGUAGE: Language = 'es';
export const STORAGE_KEY = 'svx_language';

/**
 * Reads the preferred language from localStorage if available, or returns 'es'.
 */
export function getStoredLanguage(): Language {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    if (val === 'en' || val === 'es') return val;
  } catch (_) {}
  return DEFAULT_LANGUAGE;
}

/**
 * Returns a translated UI string with optional variable replacement ({key}).
 */
export function t(key: string, lang: Language = 'es', params?: Record<string, string | number>): string {
  let str = TRANSLATIONS[lang]?.ui[key] ?? TRANSLATIONS['es']?.ui[key] ?? key;
  if (params) {
    for (const [paramKey, val] of Object.entries(params)) {
      str = str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(val));
    }
  }
  return str;
}
