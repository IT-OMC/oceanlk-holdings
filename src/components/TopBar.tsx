import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TopBar = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="w-full bg-[#004C97] border-b border-white/10 overflow-hidden"
                >
                    <div className="max-w-[98%] mx-auto h-full px-6 lg:px-12 flex items-center justify-end gap-8 py-2">
                        <div className="flex items-center gap-8 text-xs text-white">
                            <div className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors">
                                <span>Corporate</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors">
                                <span>Corporate</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors">
                                <span>Corporate</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors">
                                <span>Corporate</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                            <span className="text-gray-400">|</span>
                            <div className="flex items-center gap-1 cursor-pointer hover:text-accent transition-colors">
                                <span>Corporate</span>
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default TopBar;
