import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';

const DevelopmentAnimation = () => {
    return (
        <div className="relative w-24 h-24 flex items-center justify-center pointer-events-none">
            {/* Outer Rotating Ring of Dashes */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
            >
                {[...Array(12)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute top-0 left-1/2 w-0.5 h-2 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 -translate-x-1/2 origin-[50%_48px]"
                        style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
                    />
                ))}
            </motion.div>

            {/* Middle Rotating Hexagon/Geo Shape */}
            <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 border border-cyan-500/20 rounded-full"
            />

            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border border-blue-500/20 rounded-full border-dashed"
            />

            {/* Inner Pulsating Core */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute w-8 h-8 bg-cyan-500/20 rounded-full blur-sm"
            />

            {/* Center Dot */}
            <div className="absolute w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" />

            {/* Scanning Light Effect */}
            <motion.div
                animate={{
                    top: ['0%', '100%'],
                    opacity: [0, 1, 0],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent blur-sm"
            />
        </div>
    );
};

const UnderDevelopmentPopup = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check session storage to see if user already accepted
        const hasAccepted = sessionStorage.getItem('dev_popup_accepted');
        if (!hasAccepted) {
            setIsVisible(true);
        }
    }, []);

    const handleEnter = () => {
        setIsVisible(false);
        sessionStorage.setItem('dev_popup_accepted', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                        className="relative w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Decorative Background */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <div className="relative flex flex-col items-center text-center">
                            {/* Icon */}
                            {/* Animation */}
                            <div className="mb-6 relative">
                                <DevelopmentAnimation />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-3">
                                Under Development
                            </h2>

                            <p className="text-slate-400 mb-8 leading-relaxed">
                                Welcome to Ocean Ceylon Holdings. Please note that our digital experience is currently evolving. Some features may be experimental.
                            </p>

                            <motion.button
                                onClick={handleEnter}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold text-white shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
                            >
                                <span className="relative z-10">Enter Website</span>
                                <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />

                                {/* Shine Effect */}
                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 ease-in-out" />
                            </motion.button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                                <AlertCircle className="w-3 h-3" />
                                <span>Beta Version v0.9.1</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default UnderDevelopmentPopup;
