import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import SectionWrapper from '../../components/SectionWrapper';
import { Target, Eye } from 'lucide-react';
import { oceanData } from '../../data/mockData';
import Timeline from '../../components/corporate/Timeline';
import BentoGrid from '../../components/corporate/BentoGrid';

const Profile = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Parallax transforms with different intensities
    const blob1X = useTransform(mouseX, [0, 1], [-30, 30]);
    const blob1Y = useTransform(mouseY, [0, 1], [-30, 30]);

    const blob2X = useTransform(mouseX, [0, 1], [20, -20]);
    const blob2Y = useTransform(mouseY, [0, 1], [20, -20]);

    const blob3X = useTransform(mouseX, [0, 1], [-15, 15]);
    const blob3Y = useTransform(mouseY, [0, 1], [15, -15]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Normalize mouse position to 0-1 range
            mouseX.set(clientX / innerWidth);
            mouseY.set(clientY / innerHeight);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="min-h-screen bg-navy relative overflow-hidden">
            {/* Global Interactive Background */}
            <div className="absolute inset-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-navy to-navy" />

                {/* Interactive Blob 1 - Top Right */}
                <motion.div
                    className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]"
                    style={{ x: blob1X, y: blob1Y }}
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                {/* Interactive Blob 2 - Bottom Left */}
                <motion.div
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]"
                    style={{ x: blob2X, y: blob2Y }}
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.18, 0.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                {/* Interactive Blob 3 - Center */}
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]"
                    style={{ x: blob3X, y: blob3Y }}
                    animate={{
                        scale: [1, 1.15, 1],
                        rotate: [0, 180, 360],
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />

                {/* Additional Accent Blob */}
                <motion.div
                    className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                        opacity: [0.05, 0.1, 0.05],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                />
            </div>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20">
                <SectionWrapper>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-5xl mx-auto relative z-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="inline-block mb-6 px-6 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm"
                        >
                            <span className="text-blue-300 font-medium tracking-wide uppercase text-sm">Est. 1990</span>
                        </motion.div>

                        <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-blue-100 to-blue-900/50 tracking-tight">
                            Corporate Profile
                        </h1>
                        <p className="text-xl md:text-3xl text-gray-300 leading-relaxed font-light max-w-3xl mx-auto">
                            {oceanData.company.tagline}
                        </p>
                    </motion.div>
                </SectionWrapper>
            </div>

            {/* Bento Grid Overview - Discovery Phase */}
            <div className="relative z-10">
                <BentoGrid />
            </div>

            {/* Timeline - Evolution Phase */}
            <div className="relative z-10">
                <Timeline />
            </div>

            {/* Mission & Vision - Philosophy Phase */}
            <div className="py-20 relative z-10">
                <SectionWrapper>
                    <div className="text-center mb-16">
                        <span className="text-accent tracking-widest text-sm font-semibold uppercase mb-2 block">Our Philosophy</span>
                        <h2 className="text-4xl font-bold text-white">Guiding Principles</h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-stretch mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative group h-full"
                        >
                            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                            <div className="relative h-full glass p-10 rounded-[2rem] border border-white/10 hover:border-accent/40 transition-all duration-300 flex flex-col">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-accent/20 rounded-2xl group-hover:bg-accent/30 transition-colors">
                                        <Eye className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white">Our Vision</h3>
                                </div>
                                <p className="text-xl text-gray-300 leading-relaxed italic flex-grow">
                                    "To be the most trusted and innovative conglomerate in the region, driving sustainable growth and creating lasting value for all stakeholders."
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative group h-full"
                        >
                            <div className="absolute inset-0 bg-blue-500/10 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
                            <div className="relative h-full glass p-10 rounded-[2rem] border border-white/10 hover:border-blue-400/40 transition-all duration-300 flex flex-col">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="p-4 bg-blue-500/20 rounded-2xl group-hover:bg-blue-500/30 transition-colors">
                                        <Target className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white">Our Mission</h3>
                                </div>
                                <p className="text-xl text-gray-300 leading-relaxed flex-grow">
                                    To deliver exceptional value through operational excellence, strategic innovation, and unwavering commitment to our core values and sustainable practices in every sector we operate.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Integrated Purpose Statement */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 text-center max-w-5xl mx-auto"
                    >
                        <h2 className="text-20px md:text-6xl font-bold mb-12 text-white tracking-tight">
                            Our Purpose Statement
                        </h2>

                        <div className="relative bg-navy/80 backdrop-blur-xl p-12 md:p-16 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden group hover:scale-[1.01] transition-transform duration-500">
                            {/* Top Green Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-70" />

                            {/* Background Ambient Glows */}
                            <div className="absolute -left-20 -top-20 w-60 h-60 bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
                            <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

                            <p className="relative text-2xl md:text-4xl text-gray-200 leading-tight font-light italic">
                                "To be the catalyst for <span className="text-accent font-normal">sustainable growth</span> and innovation, bridging local potential with <span className="text-blue-400 font-normal">global opportunities</span> to create lasting value for our nation and the world."
                            </p>
                        </div>
                    </motion.div>
                </SectionWrapper>
            </div>
        </div>
    );
};

export default Profile;
