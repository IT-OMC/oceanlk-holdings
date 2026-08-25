import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { SUPPORTED_LANGUAGES } from './languages';

i18n
    // Lazy-loads each locale's JSON on demand instead of bundling all 13
    // into every visitor's initial download.
    .use(resourcesToBackend((language: string) => import(`./locales/${language}.json`)))
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],
        debug: false,
        interpolation: {
            escapeValue: false
        },
        // Cookie (not sessionStorage) so the server can read the same
        // value the client will pick, via cookies() in a Server Component.
        detection: {
            order: ['cookie', 'navigator'],
            caches: ['cookie'],
            lookupCookie: 'i18nextLng'
        }
    });

export default i18n;
