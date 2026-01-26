import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

const NewsCTA = () => {
    return (
        <section className="py-24 bg-white text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl opacity-50 pointer-events-none">
                <div className="absolute top-20 left-10 w-20 h-20 bg-blue-100 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-20 right-10 w-32 h-32 bg-cyan-100 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6">
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shadow-sm">
                        <Mail className="text-blue-500" size={32} />
                    </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
                    Never miss an update
                </h2>

                <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto leading-relaxed">
                    Subscribe to our newsletter and stay informed about the latest news, insights, and developments from OCH.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-[#0099cc] text-white rounded-full font-bold shadow-lg shadow-blue-500/30 hover:bg-[#0088bb] transition-colors"
                    >
                        Subscribe Now
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-full font-bold hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                        View Archive
                    </motion.button>
                </div>
            </div>
        </section>
    );
};

export default NewsCTA;
