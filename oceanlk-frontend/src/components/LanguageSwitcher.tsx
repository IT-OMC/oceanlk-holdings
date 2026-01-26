import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const languages = [
    { code: 'ar', name: 'Arabic', flag: 'sa' },
    { code: 'zh', name: 'Chinese (Simplified)', flag: 'cn' },
    { code: 'nl', name: 'Dutch', flag: 'nl' },
    { code: 'en', name: 'English', flag: 'gb' },
    { code: 'fr', name: 'French', flag: 'fr' },
    { code: 'de', name: 'German', flag: 'de' },
    { code: 'el', name: 'Greek', flag: 'gr' },
    { code: 'hi', name: 'Hindi', flag: 'in' },
    { code: 'it', name: 'Italian', flag: 'it' },
    { code: 'pt', name: 'Portuguese', flag: 'pt' },
    { code: 'ru', name: 'Russian', flag: 'ru' },
    { code: 'si', name: 'සිංහල', flag: 'lk' },
    { code: 'es', name: 'Spanish', flag: 'es' }
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages.find(lang => lang.code === 'en') || languages[0];

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Change Language"
            >
                <img
                    src={`https://flagcdn.com/w40/${currentLanguage.flag}.png`}
                    alt={currentLanguage.name}
                    className="w-5 h-auto object-cover rounded-sm"
                />
                <span className="hidden lg:inline text-sm font-semibold text-primary">
                    {currentLanguage.name}
                </span>
                <ChevronDown className={`w-3 h-3 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 top-full mt-2 w-[500px] bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50 py-4 px-2"
                        >
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                                {languages.map((lang) => (
                                    <motion.button
                                        key={lang.code}
                                        onClick={() => changeLanguage(lang.code)}
                                        className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${i18n.language === lang.code
                                            ? 'bg-blue-50 text-accent font-semibold'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        whileHover={{ x: 4 }}
                                    >
                                        <img
                                            src={`https://flagcdn.com/w40/${lang.flag}.png`}
                                            alt={lang.name}
                                            className="w-6 h-auto object-cover rounded-sm shadow-sm"
                                        />
                                        <span className="text-left">{lang.name}</span>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default LanguageSwitcher;
