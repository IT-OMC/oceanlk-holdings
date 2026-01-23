import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const RefreshedCultureHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full bg-[#05050A] flex items-start justify-center overflow-hidden pt-32 md:pt-40"
        >
            {/* Video Background - Full View */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 h-full top-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    >
                        <source src="/videos/Culture page/7031309_Close_up_Slow_Motion_3840x2160.mp4" type="video/mp4" />
                        {/* Fallback for browsers that don't support video */}
                    </video>

                    {/* Dark overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/80 via-[#05050A]/60 to-[#05050A]/80" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#05050A]/40 via-transparent to-[#05050A]/40" />
                </div>

                {/* Glow spots */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-[100px]" />
            </div>

            {/* Centered Content Container */}
            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center">
                <div className="flex justify-center items-center w-full">

                    {/* Main Content - Centered */}
                    <div className="max-w-4xl text-center flex flex-col items-center space-y-10">

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-5xl md:text-7xl font-bold leading-tight text-white tracking-tight"
                        >
                            The Complete <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary">
                                ecosystem
                            </span> for <br />
                            growth.
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-slate-400 text-lg max-w-2xl leading-relaxed mx-auto"
                        >
                            Everything you need to connect your passion to purposes.
                            We don't just build careers; we craft legacies together at Ocean Ceylon Holdings.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap items-center justify-center gap-6"
                        >
                            <button className="px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(0,86,179,0.3)] hover:shadow-[0_0_30px_rgba(0,86,179,0.5)]">
                                Get Started
                            </button>

                            <button className="group flex items-center gap-3 text-slate-300 hover:text-white transition-colors px-6 py-4 rounded-lg border border-slate-800 hover:border-slate-600 hover:bg-slate-900/50 backdrop-blur-sm">
                                <span className="bg-slate-800 p-2 rounded-full group-hover:bg-primary transition-colors">
                                    <Play size={12} fill="currentColor" />
                                </span>
                                <span>Watch Story</span>
                            </button>
                        </motion.div>

                        {/* Social Proof / Trusted By */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="pt-8 border-t border-slate-800/50 mt-4 flex items-center justify-center gap-8"
                        >
                            <div>
                                <p className="text-3xl font-bold text-white mb-1">320K+</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Happy Employees</p>
                            </div>
                            <div className="h-10 w-[1px] bg-slate-800" />
                            <div>
                                <p className="text-3xl font-bold text-white mb-1">5.0</p>
                                <p className="text-xs text-slate-500 uppercase tracking-wider">Star Rating</p>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </section>
    );
};

export default RefreshedCultureHero;
