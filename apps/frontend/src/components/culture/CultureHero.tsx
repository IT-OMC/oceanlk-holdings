import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Coffee, TrendingUp, Award, Users, ArrowRight } from 'lucide-react';

// How long each stage stays active before auto-advancing to the next one.
const AUTO_ADVANCE_MS = 5000;

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

    // Auto-advance through the stages. Restarts whenever activeStage changes
    // (including when a stage is selected some other way in the future), so
    // every stage always gets the full AUTO_ADVANCE_MS on screen.
    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStage((prev) => (prev + 1) % stages.length);
        }, AUTO_ADVANCE_MS);

        return () => clearInterval(timer);
    }, [activeStage, stages.length]);

    const currentStage = stages[activeStage];

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen w-full bg-[#05050A] flex flex-col overflow-hidden pt-20 md:pt-24"
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

            <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col flex-1 mt-8 md:mt-0 pb-8 md:pb-10">

                {/* Top: Headline (left) + Dynamic Stage Story (right) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center flex-1">

                    {/* Left: Headline & Intro */}
                    <div className="flex flex-col justify-center items-center space-y-8 max-w-2xl">
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
                            <p className="text-slate-300 text-xl md:text-xl leading-relaxed max-w-lg">
                                From your first cup of coffee to leading global initiatives, discover how you'll grow, thrive, and make a difference at Ocean Ceylon Holdings.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="flex flex-wrap gap-4"
                        >
                            <button
                                onClick={() => {
                                    const element = document.getElementById('life-at-och');
                                    element?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-full font-semibold transition-all flex items-center gap-2 group">
                                Start Your Journey
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="px-8 py-4 border border-slate-700 text-white hover:bg-slate-800/50 hover:border-slate-600 rounded-full font-medium transition-all backdrop-blur-sm flex items-center gap-2">
                                <Play size={16} fill="currentColor" /> Watch Video
                            </button>
                        </motion.div>
                    </div>

                    {/* Right: Dynamic Stage Story - swaps automatically as the timer advances */}
                    <div className="flex flex-col items-center justify-center text-center px-4 py-12 min-h-[320px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStage.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="max-w-md"
                            >
                                {/* <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary">
                                    <currentStage.icon size={28} />
                                </div> */}

                                <p className="text-primary text-sm font-semibold uppercase tracking-[0.2em] mb-3">
                                    {currentStage.subtitle}
                                </p>

                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-5 tracking-tight">
                                    {currentStage.title}
                                </h2>

                                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                                    {currentStage.description}
                                </p>

                                <div className="inline-block px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
                                    <span className="text-xs md:text-sm font-semibold text-primary">{currentStage.stat}</span>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Bottom: Stage Titles as an auto-advancing timeline */}
                        <div className="border-t border-slate-800 pt-6 bottom-0 absolute mb-8">
                            <div className="flex flex-wrap justify-center md:justify-between gap-x-8 gap-y-4">
                                {stages.map((stage, index) => {
                                    const isActive = activeStage === index;

                                    return (
                                        <div
                                            key={stage.id}
                                            className={`flex-1 min-w-[120px] flex flex-col items-center md:items-start gap-2 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-50'}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${isActive ? 'bg-primary border-primary text-white' : 'bg-transparent border-slate-700 text-slate-500'}`}>
                                                    <stage.icon size={14} />
                                                </div>
                                                <span className={`text-sm md:text-base font-semibold transition-colors duration-300 ${isActive ? 'text-white' : 'text-slate-500'}`}>
                                                    {stage.title}
                                                </span>
                                            </div>

                                            {/* Progress track: fills over AUTO_ADVANCE_MS, remounted (via key)
                                        every time this stage becomes active so it always restarts at 0. */}
                                            <div className="w-full h-0.5 bg-slate-800 rounded-full overflow-hidden">
                                                {isActive && (
                                                    <motion.div
                                                        key={`${stage.id}-${activeStage}`}
                                                        className="h-full bg-primary origin-left"
                                                        initial={{ scaleX: 0 }}
                                                        animate={{ scaleX: 1 }}
                                                        transition={{ duration: AUTO_ADVANCE_MS / 1000, ease: 'linear' }}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
};

export default RefreshedCultureHero;
