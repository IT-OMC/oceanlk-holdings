import { useRef, useEffect } from 'react';
import { motion, animate, useInView } from 'framer-motion';
import { Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { oceanData } from '../data/mockData';

// Counter Component for Animated Metrics
const Counter = ({ from, to, duration = 2, suffix = "" }: { from: number; to: number; duration?: number; suffix?: string }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(nodeRef, { once: true });

    useEffect(() => {
        if (!nodeRef.current || !isInView) return;

        const controls = animate(from, to, {
            duration: duration,
            onUpdate(value) {
                if (nodeRef.current) {
                    nodeRef.current.textContent = value.toFixed(0) + suffix;
                }
            }
        });

        return () => controls.stop();
    }, [from, to, duration, isInView, suffix]);

    return <span ref={nodeRef} />;
};

const HoldingDescription = () => {

    // Stats kept for the bottom section
    const stats = [
        { value: 15, suffix: "+", label: "Active Routes", color: "from-blue-400 to-blue-600" },
        { value: 113, suffix: "", label: "Weekly Sailings", color: "from-purple-400 to-purple-600" },
        { value: 3.8, suffix: "M", label: "Annual Tonnage (TEU)", color: "from-pink-400 to-pink-600" },
        { value: 50, suffix: "+", label: "Global Ports", color: "from-emerald-400 to-emerald-600" }
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden py-24">
            {/* Vivid Deep Sea Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-black to-blue-950" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

                {/* Animated Caustics/Glows */}
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 w-full max-w-7xl px-6">
                <div className="flex flex-col items-center">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h4 className="text-blue-400 uppercase tracking-[0.2em] text-sm font-semibold mb-2">Global Alliances</h4>
                        <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter mb-8">
                            OUR STRATEGIC PARTNERSHIPS
                            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                        </h2>

                        <p className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed font-light">
                            Collaborating with world-class organizations to drive innovation and sustainable growth across the globe.
                        </p>
                    </motion.div>

                    {/* Partners Carousel */}
                    <div className="w-full overflow-hidden mb-12 relative">
                        {/* Gradient Masks */}
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

                        <motion.div
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            className="flex gap-16 md:gap-24 items-center w-max"
                        >
                            {[...oceanData.partners, ...oceanData.partners].map((partner, i) => ( // Duplicate for loop
                                <div key={i} className="flex flex-col items-center gap-4 group">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-6 hover:bg-white/10 transition-all duration-500 transform group-hover:scale-110 group-hover:border-cyan-400/30">
                                        {/* Placeholder for actual logo usage - using generic div if image fails or just name styling */}
                                        <div className="text-center">
                                            <Globe className="w-12 h-12 text-gray-500 group-hover:text-cyan-400 transition-colors duration-500 mb-2 mx-auto opacity-70 group-hover:opacity-100" />
                                        </div>
                                    </div>
                                    <span className="text-gray-400 text-sm font-medium uppercase tracking-wider group-hover:text-cyan-400 transition-colors">{partner.name}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* CTA Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-20"
                    >
                        <Link to="/corporate/profile#partners">
                            <button className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-full">
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                                <div className="absolute inset-0 w-full h-full border border-cyan-500/50 rounded-full" />
                                <span className="relative z-10 flex items-center gap-3 text-cyan-400 font-bold tracking-widest uppercase text-sm group-hover:text-white transition-colors duration-300">
                                    View All Partners
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </Link>
                    </motion.div>

                    {/* Animated Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full border-t border-white/10 pt-12">
                        {stats.map((stat, i) => (
                            <div key={i} className="text-center group">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, type: "spring" }}
                                    className={`text-4xl md:text-5xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                                >
                                    <Counter from={0} to={stat.value} suffix={stat.suffix} />
                                </motion.div>
                                <div className="text-xs md:text-sm text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>


                </div>
            </div>
        </section>
    );
};

export default HoldingDescription;
