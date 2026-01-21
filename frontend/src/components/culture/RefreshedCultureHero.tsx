import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Globe } from 'lucide-react';

const RefreshedCultureHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden bg-blue-950">
            {/* Background Video Layer */}
            <motion.div
                style={{ y, opacity }}
                className="absolute inset-0 z-0"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/40 to-blue-950/90 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover opacity-60"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-people-working-in-a-modern-office-4338-large.mp4" type="video/mp4" />
                    {/* Fallback to image if video fails or while loading */}
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                        alt="Office Culture"
                        className="w-full h-full object-cover"
                    />
                </video>
            </motion.div>

            {/* Abstract Shapes/Particles Overlay */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700" />
            </div>

            {/* Main Content */}
            <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-5xl mx-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-300 text-sm font-medium tracking-wider uppercase"
                    >
                        <Globe size={14} className="animate-spin-slow" />
                        <span>Life at Ocean Ceylon Holdings</span>
                    </motion.div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight drop-shadow-lg">
                        <span className="block overflow-hidden">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.3, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="block"
                            >
                                Empowering People.
                            </motion.span>
                        </span>
                        <span className="block overflow-hidden mt-2">
                            <motion.span
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                                className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400"
                            >
                                Shaping Horizons.
                            </motion.span>
                        </span>
                    </h1>

                    {/* Description */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="text-lg md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        Dive into a vibrant ecosystem where innovation meets passion.
                        We don't just build careers; we craft legacies together.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <button className="group relative px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] hover:-translate-y-1">
                            <span className="flex items-center gap-3">
                                Join Our Team
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button className="group flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-white/15 text-white rounded-full font-bold text-lg backdrop-blur-sm border border-white/10 transition-all duration-300 hover:-translate-y-1">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-blue-900 group-hover:scale-110 transition-transform">
                                <Play size={14} fill="currentColor" className="ml-0.5" />
                            </span>
                            <span>Watch Our Story</span>
                        </button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" />
                <span className="text-cyan-400/70 text-[10px] uppercase tracking-[0.3em]">Scroll</span>
            </motion.div>
        </section>
    );
};

export default RefreshedCultureHero;
