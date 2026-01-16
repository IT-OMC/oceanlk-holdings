import { motion } from 'framer-motion';

const GlobalMetrics = () => {
    return (
        <section className="relative py-20 bg-ocean-base overflow-hidden">
            {/* Background Glows matching GlobalConnections for continuity */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {[
                        { value: '15+', label: 'Active Routes', color: 'from-blue-400 to-blue-600' },
                        { value: '113', label: 'Weekly Sailings', color: 'from-purple-400 to-purple-600' },
                        { value: '3.8M TEU', label: 'Annual Tonnage', color: 'from-pink-400 to-pink-600' },
                        { value: '50+', label: 'Global Ports', color: 'from-emerald-400 to-emerald-600' }
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -4 }}
                            className="glass p-6 rounded-2xl text-center group hover:bg-white/10 transition-all"
                        >
                            <div className={`text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                                {stat.value}
                            </div>
                            <div className="text-slate-300 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default GlobalMetrics;
