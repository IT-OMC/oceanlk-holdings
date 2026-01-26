import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from './locales/en.json';
import siTranslations from './locales/si.json';
import arTranslations from './locales/ar.json';
import zhTranslations from './locales/zh.json';
import nlTranslations from './locales/nl.json';
import frTranslations from './locales/fr.json';
import deTranslations from './locales/de.json';
import elTranslations from './locales/el.json';
import hiTranslations from './locales/hi.json';
import itTranslations from './locales/it.json';
import ptTranslations from './locales/pt.json';
import ruTranslations from './locales/ru.json';
import esTranslations from './locales/es.json';

// Translation resources
const resources = {
    en: { translation: enTranslations },
    si: { translation: siTranslations },
    ar: { translation: arTranslations },
    zh: { translation: zhTranslations },
    nl: { translation: nlTranslations },
    fr: { translation: frTranslations },
    de: { translation: deTranslations },
    el: { translation: elTranslations },
    hi: { translation: hiTranslations },
    it: { translation: itTranslations },
    pt: { translation: ptTranslations },
    ru: { translation: ruTranslations },
    es: { translation: esTranslations }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage']
        }
    });

export default i18n;
