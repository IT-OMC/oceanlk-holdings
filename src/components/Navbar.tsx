import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Search, Menu, ChevronDown, X } from 'lucide-react';
import { oceanData } from '../data/mockData';

const Navbar = () => {
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="bg-white shadow-md relative z-50"
        >
            <div className="max-w-7xl mx-auto px-6 py-1.5">
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
                                className="h-20 w-auto"
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
                                            className="text-base font-semibold text-primary hover:text-accent transition-all duration-300 relative inline-block py-4"
                                            onClick={(e) => link.hasDropdown && e.preventDefault()}
                                        >
                                            {link.name}
                                            <span className="absolute bottom-2 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                                        </Link>
                                        {link.hasDropdown && (
                                            <ChevronDown className={`w-4 h-4 text-primary group-hover:text-accent transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
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
                                                className="absolute top-full left-0 w-56 bg-white shadow-xl rounded-b-xl border-t-2 border-accent overflow-hidden"
                                            >
                                                <div className="py-2">
                                                    {link.subItems.map((subItem: any, subIndex: number) => (
                                                        <Link
                                                            key={subIndex}
                                                            to={subItem.path}
                                                            className="block px-6 py-3 text-sm text-gray-600 hover:text-white hover:bg-primary transition-colors duration-200"
                                                        >
                                                            {subItem.name}
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
                                            placeholder="Search..."
                                            className="w-full pl-4 pr-10 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-accent"
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
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        aria-label="Search"
                                    >
                                        <Search className="w-5 h-5 text-primary" />
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Menu"
                            >
                                <Menu className="w-6 h-6 text-primary" />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
