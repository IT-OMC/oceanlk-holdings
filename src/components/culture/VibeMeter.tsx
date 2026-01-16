import { motion } from 'framer-motion';

const VibeMeter = () => {
    return (
        <div className="py-20 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center mb-16 relative z-10">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold mb-4"
                >
                    Office Vibe Meter
                </motion.h2>
                <p className="text-gray-400">Feel the energy of our workspace</p>
            </div>

            <div className="relative h-[400px] flex items-center justify-center">
                {/* Glowing Orbs */}
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10 max-w-5xl mx-auto px-6">
                    {[
                        { label: 'Energy', value: 'High', color: 'bg-blue-400' },
                        { label: 'Collaborative', value: 'Active', color: 'bg-purple-400' },
                        { label: 'Focus', value: 'Deep', color: 'bg-emerald-400' }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            className="glass p-8 rounded-2xl text-center relative overflow-hidden group"
                        >
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 ${item.color}`} />
                            <h3 className="text-xl text-gray-400 mb-2">{item.label}</h3>
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                {item.value}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VibeMeter;
