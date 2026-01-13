import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Building2, TrendingUp, Users, Briefcase, Globe } from 'lucide-react';
import React, { useState } from 'react';

// Define company data
const subsidiaries = [
    {
        id: 1,
        name: 'OceanTech Solutions',
        tagline: 'Technology & Innovation',
        description: 'Leading provider of cutting-edge technology solutions and digital transformation services.',
        icon: Building2,
        color: 'from-blue-500 to-cyan-500',
        orbitRadius: 280,
        orbitDuration: 30,
    },
    {
        id: 2,
        name: 'Maritime Logistics Ltd',
        tagline: 'Global Shipping & Logistics',
        description: 'World-class maritime logistics and supply chain management solutions across continents.',
        icon: Globe,
        color: 'from-emerald-500 to-teal-500',
        orbitRadius: 280,
        orbitDuration: 30,
    },
    {
        id: 3,
        name: 'Ceylon Capital Group',
        tagline: 'Investment & Finance',
        description: 'Strategic investment portfolio management and financial advisory services.',
        icon: TrendingUp,
        color: 'from-amber-500 to-orange-500',
        orbitRadius: 280,
        orbitDuration: 30,
    },
    {
        id: 4,
        name: 'Ocean Hospitality',
        tagline: 'Hotels & Resorts',
        description: 'Luxury hospitality experiences with premium hotels and resorts worldwide.',
        icon: Users,
        color: 'from-purple-500 to-pink-500',
        orbitRadius: 280,
        orbitDuration: 30,
    },
    {
        id: 5,
        name: 'Global Trade Partners',
        tagline: 'International Trade',
        description: 'Facilitating international trade and commerce across emerging markets.',
        icon: Briefcase,
        color: 'from-rose-500 to-red-500',
        orbitRadius: 280,
        orbitDuration: 30,
    },
];

// 3D Tilt Card Component
const TiltCard = ({ subsidiary }: { subsidiary: typeof subsidiaries[0] }) => {
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['17.5deg', '-17.5deg']);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-17.5deg', '17.5deg']);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        setIsHovered(false);
    };

    const Icon = subsidiary.icon;

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            whileHover={{ scale: 1.1 }}
            className="relative cursor-pointer"
        >
            <motion.div
                className={`relative w-full h-full rounded-xl bg-gradient-to-br ${subsidiary.color} p-6 shadow-2xl`}
                style={{
                    transform: 'translateZ(75px)',
                    transformStyle: 'preserve-3d',
                }}
            >
                {/* Icon */}
                <div className="flex items-center justify-center mb-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                        <Icon className="w-8 h-8 text-white" />
                    </div>
                </div>

                {/* Company Name */}
                <h3 className="text-xl font-bold text-white text-center mb-2">
                    {subsidiary.name}
                </h3>

                {/* Tagline */}
                <p className="text-sm text-white/90 font-medium text-center mb-3">
                    {subsidiary.tagline}
                </p>

                {/* Description - Only show on hover */}
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                        opacity: isHovered ? 1 : 0,
                        height: isHovered ? 'auto' : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                >
                    <p className="text-sm text-white/80 text-center leading-relaxed">
                        {subsidiary.description}
                    </p>
                </motion.div>

                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/10 to-transparent"
                    style={{
                        transform: 'translateZ(-1px)',
                    }}
                />
            </motion.div>
        </motion.div>
    );
};

// Orbiting Planet Component
const OrbitingPlanet = ({
    subsidiary,
    index,
    baseRotation,
    onHover
}: {
    subsidiary: typeof subsidiaries[0];
    index: number;
    baseRotation: any;
    onHover: (isHovered: boolean) => void;
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Calculate evenly spaced angle for each company
    const totalCompanies = subsidiaries.length;
    const angleOffset = (360 / totalCompanies) * index;

    // Transform motion value for this specific planet's position
    const rotation = useTransform(baseRotation, (latest: number) => latest + angleOffset);
    // Counter rotation to keep the planet upright
    const counterRotation = useTransform(baseRotation, (latest: number) => -(latest + angleOffset));

    return (
        <motion.div
            className="absolute"
            style={{
                left: '50%',
                top: '50%',
                width: subsidiary.orbitRadius * 2,
                height: subsidiary.orbitRadius * 2,
                marginLeft: -subsidiary.orbitRadius,
                marginTop: -subsidiary.orbitRadius,
                rotate: rotation,
            }}
        >
            {/* Planet positioned on the orbit */}
            <motion.div
                className="absolute"
                style={{
                    left: '50%',
                    top: '0',
                    marginLeft: -60,
                    marginTop: -60,
                    rotate: counterRotation,
                }}
                onMouseEnter={() => {
                    setIsExpanded(true);
                    onHover(true);
                }}
                onMouseLeave={() => {
                    setIsExpanded(false);
                    onHover(false);
                }}
            >
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{
                            width: isExpanded ? 320 : 120, // Slightly smaller collapsed size
                            height: isExpanded ? 'auto' : 120,
                            zIndex: isExpanded ? 50 : 1
                        }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                        className="relative"
                    >
                        {isExpanded ? (
                            <TiltCard subsidiary={subsidiary} />
                        ) : (
                            // Collapsed planet
                            <motion.div
                                className={`w-full h-full rounded-full bg-gradient-to-br ${subsidiary.color} shadow-lg flex items-center justify-center relative overflow-hidden ring-4 ring-white/20`}
                                whileHover={{ scale: 1.1 }}
                            >
                                {/* Glowing ring */}
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    animate={{
                                        boxShadow: [
                                            '0 0 10px rgba(255,255,255,0.3)',
                                            '0 0 20px rgba(255,255,255,0.5)',
                                            '0 0 10px rgba(255,255,255,0.3)',
                                        ],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                />

                                {/* Icon */}
                                <div className="relative z-10 bg-white/20 backdrop-blur-sm rounded-full p-5">
                                    <subsidiary.icon className="w-8 h-8 text-white" />
                                </div>

                                {/* Shine effect */}
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-full rounded-full bg-gradient-to-br from-white/30 via-transparent to-transparent"
                                    animate={{
                                        rotate: [0, 360],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                />
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Portfolio = () => {
    // Shared rotation state
    const baseRotation = useMotionValue(0);
    const [isPaused, setIsPaused] = useState(false);


    // We use requestAnimationFrame to drive the rotation
    React.useEffect(() => {
        let lastTime = performance.now();
        let animationFrameId: number;

        const animate = (time: number) => {
            if (!isPaused) {
                const delta = time - lastTime;
                // Speed: degrees per millisecond. 360 degrees / 30000ms = 0.012 deg/ms
                const current = baseRotation.get();
                baseRotation.set(current + (delta * 0.012));
            }
            lastTime = time;
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, baseRotation]);

    return (
        <section id="portfolio" className="relative min-h-screen py-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                {/* Radial Gradient on right side */}
                <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-blue-100/40 via-transparent to-transparent rounded-full blur-3xl" />
            </div>

            {/* Content - Split Layout */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* LEFT SIDE - Text with Glass Effect */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative z-30"
                    >
                        {/* Glass Panel */}
                        <div className="relative backdrop-blur-xl bg-white/70 rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20">
                            {/* Decorative gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent rounded-3xl" />

                            {/* Content */}
                            <div className="relative z-10">
                                <motion.p
                                    className="text-primary font-semibold text-lg mb-4"
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.2 }}
                                >
                                    GROUP PORTFOLIO
                                </motion.p>
                                <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-6">
                                    Our Corporate Ecosystem
                                </h2>
                                <p className="text-lg text-gray-700 leading-relaxed">
                                    Explore our diverse portfolio of subsidiary companies, each a leader in their respective industry.
                                </p>

                                {/* Additional decorative elements */}
                                <div className="mt-8 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                        <p className="text-gray-600">Innovation & Technology</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-secondary" />
                                        <p className="text-gray-600">Global Maritime Solutions</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-accent" />
                                        <p className="text-gray-600">Strategic Investments</p>
                                    </div>
                                </div>
                            </div>

                            {/* Glass shine effect */}
                            <div className="absolute top-0 left-0 w-full h-full rounded-3xl bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
                        </div>
                    </motion.div>

                    {/* RIGHT SIDE - Orbiting Animation */}
                    <div className="relative w-full flex items-center justify-center" style={{ minHeight: '600px' }}>
                        {/* Central Hub - Main Company with Logo */}
                        <motion.div
                            className="relative z-20"
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        >
                            <motion.div
                                className="relative w-32 h-32 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden ring-4 ring-blue-50"
                                whileHover={{ scale: 1.05 }}
                            >
                                {/* Rotating background pattern (subtle now) */}
                                <motion.div
                                    className="absolute inset-0 opacity-5"
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                                >
                                    <div className="w-full h-full bg-[radial-gradient(circle_at_center,#0a1628_1px,transparent_1px)] bg-[size:10px_10px]" />
                                </motion.div>

                                {/* Company Logo */}
                                <div className="relative z-10 p-4">
                                    <motion.img
                                        src="/och-logo.png"
                                        alt="Ocean Ceylon Holdings"
                                        className="w-full h-full object-contain"
                                        animate={{ scale: [1, 1.05, 1] }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    />
                                </div>

                                {/* Glowing ring effect */}
                                <motion.div
                                    className="absolute inset-0 rounded-full border-4 border-blue-100"
                                    animate={{
                                        scale: [1, 1.1, 1],
                                        opacity: [0.3, 0.6, 0.3],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </motion.div>
                        </motion.div>

                        {/* Single Orbit Ring - Smaller */}
                        <motion.div
                            className="absolute left-1/2 top-1/2 rounded-full border border-dashed border-gray-300/60"
                            style={{
                                width: 400,
                                height: 400,
                                marginLeft: -200,
                                marginTop: -200,
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        />


                        {/* Orbiting Planets - Smaller */}
                        {subsidiaries.map((subsidiary, index) => {
                            // Smaller orbit radius
                            const smallerSubsidiary = {
                                ...subsidiary,
                                orbitRadius: 200, // Reduced from 280
                            };

                            return (
                                <OrbitingPlanet
                                    key={subsidiary.id}
                                    subsidiary={smallerSubsidiary}
                                    index={index}
                                    baseRotation={baseRotation}
                                    onHover={setIsPaused}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Portfolio;

