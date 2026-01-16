import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const NewCultureHero = () => {
    return (
        <section className="relative h-[85vh] w-full overflow-hidden rounded-3xl mx-auto max-w-[95%] mt-28">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")'
                }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-center text-center px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <span className="inline-block px-3 py-1 mb-6 text-xs font-bold tracking-wider text-white uppercase bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                        Now Hiring
                    </span>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
                        Building the Future, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            Together.
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Experience life at Holding Co., where innovation meets community
                        and every voice matters.
                    </p>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group flex items-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-full font-bold text-lg shadow-xl shadow-black/20 hover:bg-blue-50 transition-all duration-300"
                    >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                            <Play size={14} fill="currentColor" />
                        </span>
                        Play 2024 Reel
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
};

export default NewCultureHero;
