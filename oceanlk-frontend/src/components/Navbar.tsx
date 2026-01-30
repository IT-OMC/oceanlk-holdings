import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Search, ChevronDown, X, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { oceanData } from '../data/mockData';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { t } = useTranslation();
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            // Only apply scroll effect on home page
            if (isHomePage) {
                if (window.scrollY > 50) {
                    setIsScrolled(true);
                } else {
                    setIsScrolled(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);


    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`fixed left-0 right-0 z-50 transition-all duration-300 ${isHomePage
                ? (isScrolled ? 'top-0 bg-white shadow-md py-1.5' : 'top-3.5 bg-transparent py-4')
                : 'top-0 bg-white shadow-md py-1.5'
                }`}
        >
            <div className="w-full px-4 md:px-6 lg:px-8 mx-auto">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex items-center"
                    >
                        <Link to="/">
                            <img
                                src="/och-logo.png"
                                alt="OceanLK Holdings"
                                className="h-14 md:h-16 lg:h-20 w-auto"
                            />
                        </Link>
                    </motion.div>

                    {/* Right Side - Navigation & Icons */}
                    <div className="flex items-center gap-6">
                        <ul className="hidden lg:flex items-center gap-8">
                            {oceanData.navigation.map((link: any, index) => (
                                <motion.li
                                    key={link.name}
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.5 }}
                                    className="relative group"
                                    onMouseEnter={() => setActiveDropdown(link.name)}
                                    onMouseLeave={() => setActiveDropdown(null)}
                                >
                                    <div className="flex items-center gap-1 cursor-pointer">
                                        <Link
                                            to={link.path || '#'}
                                            className={`text-base font-semibold transition-all duration-300 relative inline-block py-4 ${(isHomePage && !isScrolled) ? 'text-white hover:text-white/80' : 'text-primary hover:text-accent'}`}
                                            onClick={(e) => link.hasDropdown && e.preventDefault()}
                                        >
                                            {link.name}
                                            <span className={`absolute bottom-2 left-0 w-0 h-0.5 transition-all duration-300 ${(isHomePage && !isScrolled) ? 'bg-white group-hover:w-full' : 'bg-accent group-hover:w-full'}`} />
                                        </Link>
                                        {link.hasDropdown && (
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''} ${(isHomePage && !isScrolled) ? 'text-white group-hover:text-white/80' : 'text-primary group-hover:text-accent'}`} />
                                        )}
                                    </div>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {link.hasDropdown && activeDropdown === link.name && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                transition={{ duration: 0.2 }}
                                                className="absolute top-full left-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-100 overflow-hidden z-50 p-2"
                                            >
                                                <div className="flex flex-col gap-1">
                                                    {link.subItems.map((subItem: any, subIndex: number) => (
                                                        <Link
                                                            key={subIndex}
                                                            to={subItem.path}
                                                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium group"
                                                        >
                                                            {subItem.logo && (
                                                                <div className="w-5 h-5 flex-shrink-0 rounded overflow-hidden bg-white ring-1 ring-gray-200 group-hover:ring-accent transition-all">
                                                                    <img
                                                                        src={subItem.logo}
                                                                        alt={subItem.name}
                                                                        className="w-full h-full object-contain p-0.5"
                                                                    />
                                                                </div>
                                                            )}
                                                            <span className={subItem.logo ? '' : 'ml-8'}>{subItem.name}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.li>
                            ))}
                        </ul>

                        <div className="flex items-center gap-3">
                            {/* Search - Desktop Only */}
                            <div className="hidden md:block">
                                <AnimatePresence>
                                    {isSearchOpen ? (
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 200, opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            className="relative"
                                        >
                                            <input
                                                type="text"
                                                placeholder={t('Search...')}
                                                className="w-full pl-4 pr-10 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-accent text-black"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => setIsSearchOpen(false)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={() => setIsSearchOpen(true)}
                                            className={`p-3 rounded-full transition-colors ${(isHomePage && !isScrolled) ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                                            aria-label="Search"
                                        >
                                            <Search className={`w-5 h-5 ${(isHomePage && !isScrolled) ? 'text-white' : 'text-primary'}`} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Language Switcher */}
                            <div className="hidden md:block">
                                <LanguageSwitcher />
                            </div>

                            {/* Hamburger Menu Button - Mobile Only */}
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsMobileMenuOpen(true)}
                                className={`lg:hidden p-3 rounded-full transition-colors ${(isHomePage && !isScrolled) ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                                aria-label="Menu"
                            >
                                <Menu className={`w-6 h-6 ${(isHomePage && !isScrolled) ? 'text-white' : 'text-primary'}`} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Sheet */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                        />

                        {/* Sheet */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                                <img src="/och-logo.png" alt="OceanLK" className="h-12 w-auto" />
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-6 h-6 text-primary" />
                                </button>
                            </div>

                            {/* Navigation Links */}
                            <nav className="p-6 space-y-1">
                                {oceanData.navigation.map((link: any) => (
                                    <div key={link.name} className="space-y-1">
                                        {link.hasDropdown ? (
                                            <>
                                                <button
                                                    onClick={() => setActiveDropdown(activeDropdown === link.name ? null : link.name)}
                                                    className="w-full flex items-center justify-between px-4 py-3 text-base font-semibold text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                                >
                                                    {link.name}
                                                    <ChevronDown
                                                        className={`w-5 h-5 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                <AnimatePresence>
                                                    {activeDropdown === link.name && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: 'auto', opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.2 }}
                                                            className="overflow-hidden pl-4 space-y-1"
                                                        >
                                                            {link.subItems.map((subItem: any, index: number) => (
                                                                <Link
                                                                    key={index}
                                                                    to={subItem.path}
                                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                                >
                                                                    {subItem.logo && (
                                                                        <div className="w-5 h-5 flex-shrink-0 rounded overflow-hidden bg-white ring-1 ring-gray-200">
                                                                            <img
                                                                                src={subItem.logo}
                                                                                alt={subItem.name}
                                                                                className="w-full h-full object-contain p-0.5"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <span>{subItem.name}</span>
                                                                </Link>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </>
                                        ) : (
                                            <Link
                                                to={link.path || '#'}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="block px-4 py-3 text-base font-semibold text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        )}
                                    </div>
                                ))}
                            </nav>

                            {/* Footer with Language Switcher */}
                            <div className="border-t border-gray-200 p-6">
                                <LanguageSwitcher />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </motion.nav>
    );
};

export default Navbar;
