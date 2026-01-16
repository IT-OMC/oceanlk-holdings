import { motion } from 'framer-motion';
import ThreeGlobe from './ThreeGlobe';

const GlobalConnections = () => {
    return (
        <section className="relative py-10 lg:py-16 bg-gradient-to-b from-navy via-navy to-slate-900 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                        Connecting Sri Lanka
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            To The World
                        </span>
                    </h2>
                    <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                        Strategic location at the crossroads of global trade routes. Explore our shipping network
                        spanning across continents and oceans.
                    </p>
                </motion.div>

                {/* Globe Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative mb-16"
                >
                    <div className="relative h-[500px] lg:h-[700px] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-900 to-navy shadow-2xl">
                        <ThreeGlobe />

                        {/* Interaction Hint */}
                        <div className="absolute top-6 right-6 glass px-4 py-2 rounded-lg text-sm text-slate-300">
                            <span className="text-blue-400 font-semibold">Zoom</span> and Drag
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default GlobalConnections;
