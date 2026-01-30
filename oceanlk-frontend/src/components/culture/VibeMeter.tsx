import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Zap, TrendingUp, X } from 'lucide-react';

const vibes = [
    {
        id: 'create',
        label: 'Create',
        icon: Zap,
        color: 'from-purple-500 to-indigo-500',
        video: 'https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_25fps.mp4', // Creative work/brainstorming
        description: "Innovation isn't just a buzzword here. It's our daily bread. We challenge the status quo and build solutions that matter."
    },
    {
        id: 'play',
        label: 'Play',
        icon: Play,
        color: 'from-pink-500 to-rose-500', // Coral Pink-ish
        video: 'https://videos.pexels.com/video-files/8533118/8533118-uhd_2560_1440_25fps.mp4', // Sports/Fun
        description: "We work hard, but we play harder. From cricket matches to gaming nights, we believe in recharging our batteries together."
    },
    {
        id: 'grow',
        label: 'Grow',
        icon: TrendingUp,
        color: 'from-emerald-400 to-teal-500',
        video: 'https://videos.pexels.com/video-files/3196024/3196024-uhd_2560_1440_25fps.mp4', // Meeting/Growth
        description: "Your growth is our growth. With mentorship programs and continuous learning, we invest in your future as much as you do."
    }
];

const VibeMeter = () => {
    const [activeVibe, setActiveVibe] = useState<string | null>(null);
    const [hoveredVibe, setHoveredVibe] = useState<string | null>(null);

    return (
        <section className="py-24 bg-ocean-dark relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-white">The Vibe Meter</h2>
                    <p className="text-xl text-gray-400">Pulsing with energy, creativity, and growth.</p>
                </motion.div>

                <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-8">
                    {vibes.map((vibe) => {
                        const Icon = vibe.icon;
                        const isHovered = hoveredVibe === vibe.id;
                        const isActive = activeVibe === vibe.id;

                        return (
                            <motion.div
                                key={vibe.id}
                                layoutId={`card-${vibe.id}`}
                                onClick={() => setActiveVibe(vibe.id)}
                                onMouseEnter={() => setHoveredVibe(vibe.id)}
                                onMouseLeave={() => setHoveredVibe(null)}
                                className={`relative cursor-pointer transition-all duration-500 ease-out flex-shrink-0 ${isActive ? 'w-full md:w-2/3 h-96 z-20 order-first' : 'w-64 h-64 md:w-80 md:h-80'
                                    }`}
                            >
                                {/* Orb Container */}
                                <div className={`w-full h-full rounded-full overflow-hidden relative border-4 border-white/10 ${isActive ? 'rounded-3xl' : ''}`}>
                                    {/* Background Gradient/Video */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${vibe.color} opacity-80 z-10 transition-opacity duration-500`} />

                                    {(isHovered || isActive) && (
                                        <video
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="absolute inset-0 w-full h-full object-cover z-0"
                                        >
                                            <source src={vibe.video} type="video/mp4" />
                                        </video>
                                    )}

                                    {/* Content */}
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white p-6 text-center">
                                        {!isActive && (
                                            <motion.div
                                                initial={false}
                                                animate={{ scale: isHovered ? 1.2 : 1 }}
                                            >
                                                <Icon className="w-12 h-12 mb-4 drop-shadow-lg" />
                                                <h3 className="text-3xl font-bold tracking-wider drop-shadow-md">{vibe.label}</h3>
                                            </motion.div>
                                        )}

                                        {isActive && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="max-w-2xl"
                                            >
                                                <div className="flex items-center justify-center gap-3 mb-6">
                                                    <Icon className="w-10 h-10" />
                                                    <h3 className="text-4xl font-bold">{vibe.label}</h3>
                                                </div>
                                                <p className="text-xl leading-relaxed font-medium drop-shadow-sm">{vibe.description}</p>
                                            </motion.div>
                                        )}
                                    </div>

                                    {isActive && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveVibe(null);
                                            }}
                                            className="absolute top-6 right-6 z-30 bg-black/20 hover:bg-black/40 p-2 rounded-full text-white transition-colors"
                                        >
                                            <X className="w-6 h-6" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Backdrop for active state overlay */}
            <AnimatePresence>
                {activeVibe && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveVibe(null)}
                        className="fixed inset-0 bg-black/60 z-10 backdrop-blur-sm"
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default VibeMeter;
