import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Coffee, TrendingUp, Award, Users, ArrowRight } from 'lucide-react';

const RefreshedCultureHero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeStage, setActiveStage] = useState(0);

    const stages = [
        {
            id: 0,
            title: "Join",
            subtitle: "The Welcome",
            icon: Coffee,
            description: "Your journey begins with a seamless onboarding experience. We equip you with the tools, mentorship, and warm welcome you need to feel at home from day one.",
            stat: "100% Support"
        },
        {
            id: 1,
            title: "Grow",
            subtitle: "The Learning",
            icon: TrendingUp,
            description: "Continuous learning is in our DNA. Access world-class training, workshops, and personalized development plans to sharpen your skills and expand your horizons.",
            stat: "50+ Programs"
        },
        {
            id: 2,
            title: "Excel",
            subtitle: "The Impact",
            icon: Award,
            description: "Your work matters here. We empower you to take ownership of challenging projects, drive innovation, and see the tangible impact of your contributions.",
            stat: "Global Reach"
        },
        {
            id: 3,
            title: "Lead",
            subtitle: "The Legacy",
            icon: Users,
            description: "As you evolve, so does your influence. Mentor others, lead initiatives, and shape the future of Ocean Ceylon Holdings. Your growth creates our legacy.",
            stat: "Limitless Path"
        }
    ];

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full bg-[#05050A] flex flex-col justify-center overflow-hidden pt-20 md:pt-24"
        >
            {/* Video Background - Full View */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 h-full top-0">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover opacity-60"
                    >
                        <source src="/culture/1472714_People_Business_1920x1080.mp4" type="video/mp4" />
                    </video>

                    {/* Gradient Overlays for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#05050A] via-[#05050A]/80 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] via-transparent to-[#05050A]/50" />
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full mt-8 md:mt-0">

                {/* Left Side: Headline & Intro */}
                <div className="flex flex-col space-y-8 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold leading-tight text-white tracking-tight mb-6">
                            Not just a job. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-secondary">
                                A Journey.
                            </span>
                        </h1>
                        <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-lg">
                            From your first cup of coffee to leading global initiatives, discover how you'll grow, thrive, and make a difference at Ocean Ceylon Holdings.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="flex flex-wrap gap-4"
                    >
                        <button className="px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-full font-semibold transition-all flex items-center gap-2 group">
                            Start Your Journey
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button className="px-8 py-4 border border-slate-700 text-white hover:bg-slate-800/50 hover:border-slate-600 rounded-full font-medium transition-all backdrop-blur-sm flex items-center gap-2">
                            <Play size={16} fill="currentColor" /> Watch Video
                        </button>
                    </motion.div>
                </div>

                {/* Right Side: Interactive Growth Steps */}
                <div className="relative">
                    {/* Connection Line */}
                    <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-slate-800 hidden md:block" />

                    <div className="flex flex-col space-y-6 relative">
                        {stages.map((stage, index) => {
                            const isActive = activeStage === index;

                            return (
                                <motion.div
                                    key={stage.id}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 + (index * 0.1) }}
                                    onClick={() => setActiveStage(index)}
                                    className={`relative z-10 pl-0 md:pl-20 cursor-pointer group transition-all duration-300 ${isActive ? 'scale-105 md:scale-100' : 'opacity-70 hover:opacity-100'}`}
                                >
                                    {/* Timeline Node (Desktop) */}
                                    <div className={`hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'bg-primary border-primary' : 'bg-[#05050A] border-slate-700 group-hover:border-primary/50'}`}>
                                        <div className={`w-2 h-2 rounded-full bg-white transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>

                                    {/* Content Card */}
                                    <div className={`p-6 rounded-2xl border transition-all duration-300 ${isActive ? 'bg-slate-900/80 border-primary/50 shadow-xl backdrop-blur-md' : 'bg-slate-900/40 border-slate-800 hover:bg-slate-800/60'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg ${isActive ? 'bg-primary/20 text-primary' : 'bg-slate-800 text-slate-400'}`}>
                                                <stage.icon size={24} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className={`text-xl font-bold mb-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>
                                                    {stage.title} <span className="text-sm font-normal text-slate-500 mx-2 hidden sm:inline">|</span> <span className="text-sm font-normal text-slate-500 block sm:inline">{stage.subtitle}</span>
                                                </h3>

                                                <AnimatePresence>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="text-slate-400 text-sm leading-relaxed mt-2 mb-3">
                                                                {stage.description}
                                                            </p>
                                                            <div className="inline-block px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                                                                <span className="text-xs font-semibold text-primary">{stage.stat}</span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default RefreshedCultureHero;

