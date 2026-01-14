import { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, animate, useInView } from 'framer-motion';
import { Shield, Award, Star, Anchor, Truck, Globe } from 'lucide-react';

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
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXRel = e.clientX - rect.left - width / 2;
        const mouseYRel = e.clientY - rect.top - height / 2;
        x.set(mouseXRel / 25);
        y.set(mouseYRel / 25);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const rotateX = useTransform(mouseY, (value) => value * -1);
    const rotateY = useTransform(mouseX, (value) => value);

    const badges = [
        { id: 1, label: "ISO 9001", icon: Shield },
        { id: 2, label: "Green Award", icon: Star },
        { id: 3, label: "Best Logistics", icon: Award },
        { id: 4, label: "Global Safety", icon: Shield },
        { id: 5, label: "Eco Partner", icon: Globe },
        { id: 6, label: "Top Employer", icon: Award },
    ];

    const stats = [
        { value: 15, suffix: "+", label: "Active Routes", color: "from-blue-400 to-blue-600" },
        { value: 113, suffix: "", label: "Weekly Sailings", color: "from-purple-400 to-purple-600" },
        { value: 3.8, suffix: "M", label: "Annual Tonnage (TEU)", color: "from-pink-400 to-pink-600" }, // Handle float for TEU manually if needed, simplified here
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

            <div
                className="relative z-10 perspective-1000 w-full max-w-7xl px-6"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <div className="flex flex-col items-center">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h4 className="text-blue-400 uppercase tracking-[0.2em] text-sm font-semibold mb-2">The Ocean</h4>
                        <h2 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter mb-8">
                            CORE
                            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                        </h2>

                        <p className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed">
                            Ocean Ceylon Holdings is more than a conglomerate; we are a <span className="text-cyan-400 font-medium">unified ecosystem</span> of innovation.
                            Rooted in Sri Lanka but reaching for the horizon, we integrate core pillars into a seamless flow of value.
                        </p>
                    </motion.div>

                    {/* 3 Sector Cards */}
                    <div ref={ref} className="grid md:grid-cols-3 gap-8 w-full mb-20 perspective-1000">
                        {[
                            { title: "Marine Expertise", icon: Anchor, image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?q=80&w=2600&auto=format&fit=crop" },
                            { title: "Logistics Precision", icon: Truck, image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2600&auto=format&fit=crop" },
                            { title: "Leisure Experiences", icon: Globe, image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2600&auto=format&fit=crop" }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                style={{ rotateX, rotateY }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                viewport={{ once: true }}
                                className="relative h-64 md:h-80 rounded-3xl overflow-hidden group border border-white/10 shadow-2xl"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center mb-4 border border-white/10 group-hover:border-cyan-400/50 transition-colors">
                                        <item.icon className="w-8 h-8 text-white group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Badges Marquee (Right to Left) */}
                    <div className="w-full overflow-hidden mb-20 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />

                        <motion.div
                            animate={{ x: [0, -1000] }} // Adjust based on width
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="flex gap-12 whitespace-nowrap"
                        >
                            {/* Double the list for seamless loop */}
                            {[...badges, ...badges, ...badges].map((badge, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-sm flex-shrink-0">
                                    <badge.icon className="w-5 h-5 text-yellow-400" />
                                    <span className="text-gray-300 font-medium">{badge.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

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
