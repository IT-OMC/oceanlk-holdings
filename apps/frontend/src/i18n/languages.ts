// Kept separate from config.ts (which calls i18next.init() as a module
// side effect) so Server Components can read the supported-language list
// without triggering client-only i18next initialization on the server.
export const SUPPORTED_LANGUAGES = [
    'en', 'si', 'ar', 'zh', 'nl', 'fr', 'de', 'el', 'hi', 'it', 'pt', 'ru', 'es',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];
