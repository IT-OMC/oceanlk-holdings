import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

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
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
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
                        Under Construction
                    </h2>

                    <p className="text-slate-400 mb-8 leading-relaxed">
                        The Ocean Ceylon Holdings digital experience is currently being built. Please check back soon for our launch.
                    </p>

                    <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-500">
                        <AlertCircle className="w-3 h-3" />
                        <span>Work in Progress</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default UnderDevelopmentPopup;
