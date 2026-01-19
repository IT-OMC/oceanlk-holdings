import { motion } from 'framer-motion';
import { Users, Globe, Shield, Zap, TrendingUp } from 'lucide-react';

const BentoGrid = () => {
    return (
        <div className="max-w-6xl mx-auto px-4 py-20">


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">

                {/* Who We Are - Large Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="md:col-span-2 row-span-1 glass p-10 rounded-3xl border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-600/20 transition-all duration-500" />
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/20">
                            <Users className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-4">Who We Are</h3>
                        <p className="text-gray-300 text-lg leading-relaxed max-w-2xl">
                            OceanLK Holdings is a premier corporate holding company with a rich legacy of excellence. We unite industry leaders under one strategic umbrella, driving innovation from our roots in Sri Lanka to the global stage.
                        </p>
                    </div>
                </motion.div>

                {/* Quick Stats - Tall/Small Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="md:col-span-1 glass p-8 rounded-3xl border border-white/10 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-white/5 to-transparent"
                >
                    <div className="absolute bottom-0 right-0 p-4 opacity-10">
                        <TrendingUp size={120} />
                    </div>
                    <div>
                        <span className="text-5xl font-bold text-accent block mb-2">35+</span>
                        <span className="text-gray-400 font-medium">Years of Excellence</span>
                    </div>
                    <div className="mt-8">
                        <span className="text-5xl font-bold text-blue-400 block mb-2">12</span>
                        <span className="text-gray-400 font-medium">Subsidiaries</span>
                    </div>
                </motion.div>

                {/* What We Do */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="md:col-span-1 glass p-8 rounded-3xl border border-white/10 group hover:bg-white/5 transition-colors"
                >
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-colors">
                        <Globe className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">What We Do</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                        Maritime, Logistics, Engineering, Investment, and Leisure. We create a robust ecosystem delivering exceptional value globally.
                    </p>
                </motion.div>

                {/* Why Choose Us - Wide */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="md:col-span-2 glass p-10 rounded-3xl border border-white/10 relative overflow-hidden group"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                        <div className="flex-1">
                            <div className="w-14 h-14 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
                                <Shield className="w-7 h-7 text-purple-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">Why Choose Us</h3>
                            <p className="text-gray-300 leading-relaxed">
                                Unwavering commitment to operational excellence, integrity, and sustainable practices. We combine deep local expertise with global standards.
                            </p>
                        </div>

                        {/* Values List */}
                        <div className="grid grid-cols-2 gap-4">
                            {['Integrity', 'Innovation', 'Sustainability', 'Excellence'].map((val, i) => (
                                <div key={i} className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                                    <Zap className="w-4 h-4 text-yellow-400" />
                                    <span className="text-sm font-medium text-gray-300">{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default BentoGrid;
