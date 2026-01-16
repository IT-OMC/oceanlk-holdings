import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

const CultureCTA = () => {
    return (
        <section className="py-32 bg-white text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-50 pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-100 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center rotate-12 shadow-sm">
                        <Rocket className="text-blue-500" size={32} />
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                    Ready to make an impact?
                </h2>

                <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed">
                    Join a team that celebrates creativity, integrity, and growth. We are looking for people just like you.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-[#0099cc] text-white rounded-full font-bold shadow-lg shadow-blue-500/30 hover:bg-[#0088bb] transition-colors"
                    >
                        View Open Positions
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                        Contact Us
                    </motion.button>
                </div>
            </div>

            <div className="absolute bottom-0 w-full text-center pb-8 text-xs text-gray-400 border-t border-gray-100 pt-8 mt-20 flex justify-between px-10 max-w-7xl mx-auto">
                <span>© 2024 Holding Co. All rights reserved.</span>
                <div className="flex gap-4">
                    <span>@</span>
                    <span>🌐</span>
                    <span>ℹ️</span>
                </div>
            </div>
        </section>
    );
};

export default CultureCTA;
