import { motion } from 'framer-motion';
import ThreeGlobe from './ThreeGlobe';

const GlobalConnections = () => {
    return (
        <section className="relative min-h-screen py-20 overflow-hidden bg-slate-900">
            {/* Globe Background - Full Section */}
            <div className="absolute inset-0 z-0">
                <ThreeGlobe />
            </div>

            {/* Background Glows - Overlay on globe or behind? 
                If behind, put before text. If on top of globe, puts after.
                Let's keep them delicate.
            */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl z-0 pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl z-0 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 pointer-events-none">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16 pointer-events-auto" // Enable text selection
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        Connecting Sri Lanka
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            To The World
                        </span>
                    </h2>
                    <p className="text-slate-200 text-lg max-w-3xl mx-auto drop-shadow-md font-medium">
                        Strategic location at the crossroads of global trade routes. Explore our shipping network
                        spanning across continents and oceans.
                    </p>
                </motion.div>

                {/* We removed the explicit globe container, but we might want to keep the "Zoom and Drag" hint visible */}
            </div>

            {/* Interaction Hint - Positioned absolutely in the section */}
            <div className="absolute bottom-8 right-8 z-20 glass px-4 py-2 rounded-lg text-sm text-slate-300 pointer-events-none">
                <span className="text-blue-400 font-semibold">Zoom</span> and Drag
            </div>
        </section>
    );
};

export default GlobalConnections;
