import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

// Define company data with new logos
const subsidiaries = [
    {
        id: 1,
        name: 'OceanTech Solutions',
        tagline: 'Technology & Innovation',
        description: 'Leading provider of cutting-edge technology solutions and digital transformation services.',
        logo: '/subsidiaries/oceantech_logo_1768307339285.png',
        color: 'from-blue-600 to-cyan-400',
        glowColor: 'shadow-blue-500/50',
        orbitRadius: 280,
    },
    {
        id: 2,
        name: 'Maritime Logistics Ltd',
        tagline: 'Global Shipping',
        description: 'World-class maritime logistics and supply chain management solutions across continents.',
        logo: '/subsidiaries/maritime_logo_1768307355885.png',
        color: 'from-emerald-500 to-teal-400',
        glowColor: 'shadow-teal-500/50',
        orbitRadius: 280,
    },
    {
        id: 3,
        name: 'Ceylon Capital Group',
        tagline: 'Investment & Finance',
        description: 'Strategic investment portfolio management and financial advisory services.',
        logo: '/subsidiaries/capital_logo_1768307372443.png',
        color: 'from-amber-400 to-yellow-600',
        glowColor: 'shadow-amber-500/50',
        orbitRadius: 280,
    },
    {
        id: 4,
        name: 'Ocean Hospitality',
        tagline: 'Hotels & Resorts',
        description: 'Luxury hospitality experiences with premium hotels and resorts worldwide.',
        logo: '/subsidiaries/hospitality_logo_1768307390674.png',
        color: 'from-purple-500 to-fuchsia-400',
        glowColor: 'shadow-purple-500/50',
        orbitRadius: 280,
    },
    {
        id: 5,
        name: 'Global Trade Partners',
        tagline: 'International Trade',
        description: 'Facilitating international trade and commerce across emerging markets.',
        logo: '/subsidiaries/trade_logo_1768307410341.png',
        color: 'from-orange-500 to-red-500',
        glowColor: 'shadow-orange-500/50',
        orbitRadius: 280,
    },
];

// Holographic Card Component
const HolographicCard = ({ subsidiary }: { subsidiary: typeof subsidiaries[0] }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="absolute bottom-full mb-6 left-1/2 -translate-x-1/2 w-72 pointer-events-none z-50"
            style={{ perspective: '1000px' }}
        >
            {/* Connection Beam */}
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 24, opacity: 1 }}
                className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-cyan-400/50 to-transparent"
            />

            {/* Card Content */}
            <div className={`relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-xl p-5 shadow-2xl overflow-hidden ring-1 ring-white/20 ${subsidiary.glowColor}`}>
                {/* Scanline Effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent bg-[length:100%_4px]"
                    style={{ opacity: 0.1 }}
                    animate={{ backgroundPosition: ['0% 0%', '0% 100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Header */}
                <div className="flex items-center gap-3 mb-3 border-b border-white/10 pb-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${subsidiary.color} p-1.5`}>
                        <img src={subsidiary.logo} alt="icon" className="w-full h-full object-contain brightness-200 contrast-200 grayscale" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm leading-tight">{subsidiary.name}</h4>
                        <span className="text-xs text-cyan-400 font-mono tracking-wider">SECURE_LINK</span>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-2">
                    <p className="text-xs text-slate-300 font-medium">{subsidiary.tagline}</p>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                        {subsidiary.description}
                    </p>
                </div>

                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50 rounded-tl-sm" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/50 rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/50 rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50 rounded-br-sm" />
            </div>
        </motion.div>
    );
};

// Orbiting Planet Component
const OrbitingPlanet = ({
    subsidiary,
    index,
    baseRotation,
    onHover,
    isPaused
}: {
    subsidiary: typeof subsidiaries[0];
    index: number;
    baseRotation: any;
    onHover: (isHovered: boolean) => void;
    isPaused: boolean;
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const totalCompanies = subsidiaries.length;
    const angleOffset = (360 / totalCompanies) * index;

    // Calculate rotation: We want the planet to stay upright.
    // The parent container rotates, so we must counter-rotate the child.
    const rotation = useTransform(baseRotation, (latest: number) => latest + angleOffset);
    const counterRotation = useTransform(baseRotation, (latest: number) => -(latest + angleOffset));

    return (
        <motion.div
            className="absolute rounded-full"
            style={{
                left: '50%',
                top: '50%',
                width: subsidiary.orbitRadius * 2,
                height: subsidiary.orbitRadius * 2,
                marginLeft: -subsidiary.orbitRadius,
                marginTop: -subsidiary.orbitRadius,
                rotate: rotation,
                zIndex: isHovered ? 50 : 10,
                pointerEvents: 'none' // Let events pass through the orbit container
            }}
        >
            {/* The Planet */}
            <motion.div
                className="absolute"
                style={{
                    left: '50%',
                    top: -40, // Offset from rim
                    marginLeft: -40,
                    width: 80,
                    height: 80,
                    rotate: counterRotation,
                    pointerEvents: 'auto'
                }}
                onMouseEnter={() => { setIsHovered(true); onHover(true); }}
                onMouseLeave={() => { setIsHovered(false); onHover(false); }}
                whileHover={{ scale: 1.15 }}
            >
                <div className="relative w-full h-full flex items-center justify-center group cursor-pointer">
                    {/* Planet Orb */}
                    <div className="relative w-16 h-16 rounded-full bg-slate-900 border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden transition-all duration-300 group-hover:border-cyan-400/50 group-hover:shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                        {/* Background Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${subsidiary.color} opacity-20`} />

                        {/* Logo */}
                        <div className="absolute inset-2 p-2 bg-slate-950/50 rounded-full backdrop-blur-sm flex items-center justify-center">
                            <img src={subsidiary.logo} alt={subsidiary.name} className="w-full h-full object-contain" />
                        </div>

                        {/* Glass Gloss */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                    </div>

                    {/* Holographic Projection */}
                    <AnimatePresence>
                        {isHovered && <HolographicCard subsidiary={subsidiary} />}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Portfolio = () => {
    const baseRotation = useMotionValue(0);


    useEffect(() => {
        let lastTime = performance.now();
        let animationFrameId: number;

        const animate = (time: number) => {
            if (!isPaused) {
                const delta = time - lastTime;
                const current = baseRotation.get();
                baseRotation.set(current + (delta * 0.006));
            }
            lastTime = time;
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, baseRotation]);

    return (
        <section id="portfolio" className="relative py-24 overflow-hidden bg-slate-950">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[120px]" />
                {/* Tech Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="relative">
                            <h2 className="text-sm font-bold tracking-[0.2em] text-cyan-400 mb-3 uppercase">
                                Our Ecosystem
                            </h2>
                            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                                A Constellation of <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Excellence</span>
                            </h3>
                            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
                                Ocean Ceylon Holdings anchors a diverse portfolio of market-leading subsidiaries, each driving innovation in their respective sectors.
                            </p>

                            <div className="flex gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-cyan-500 text-slate-900 font-bold rounded-full shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
                                >
                                    Explore All Sectors
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Solar System */}
                    <div className="relative h-[600px] flex items-center justify-center perspective-1000">
                        {/* Orbit Track Visuals - Static */}
                        <div className="absolute w-[560px] h-[560px] rounded-full border border-white/5" />
                        <div className="absolute w-[560px] h-[560px] rounded-full border border-white/5 animate-pulse opacity-50" />

                        {/* Central Sun (Main Company) */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 1 }}
                            className="relative z-20"
                        >
                            <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
                                {/* Core Glow */}
                                <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-full border border-white/20 shadow-2xl flex items-center justify-center p-6 bg-slate-900">
                                    <img src="/och-logo.png" alt="OceanLK" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
                                </div>
                                {/* Orbit Rings around sun */}
                                <motion.div
                                    className="absolute inset-[-10px] rounded-full border border-cyan-500/30 opacity-50"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                />
                                <motion.div
                                    className="absolute inset-[-20px] rounded-full border border-dashed border-blue-500/20 opacity-30"
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        </motion.div>

                        {/* Planets */}
                        {subsidiaries.map((subsidiary, index) => (
                            <OrbitingPlanet
                                key={subsidiary.id}
                                subsidiary={subsidiary}
                                index={index}
                                baseRotation={baseRotation}
                                onHover={setIsPaused}
                                isPaused={isPaused}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;
