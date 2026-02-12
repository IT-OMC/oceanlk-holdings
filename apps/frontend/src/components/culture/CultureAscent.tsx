
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, MotionValue, useSpring } from 'framer-motion';

interface AscentCardProps {
    data: {
        title: string;
        description: string;
        image: string;
        subtext: string;
    };
    index: number;
    scrollYProgress: MotionValue<number>;
    totalCards: number;
}

const AscentCard = ({
    data,
    index,
    scrollYProgress,
    totalCards
}: AscentCardProps) => {
    const step = 1 / totalCards;
    const start = index * step;
    const middle = start + (step / 2);
    const end = start + step;

    // Y Position
    const y = useTransform(
        scrollYProgress,
        [start, middle - 0.05, middle + 0.05, end],
        ['120vh', '0vh', '0vh', '-120vh']
    );

    // Scale
    const scale = useTransform(
        scrollYProgress,
        [start, middle, end],
        [0.8, 1.1, 0.8]
    );

    // Opacity
    const opacity = useTransform(
        scrollYProgress,
        [start, middle - 0.1, middle + 0.1, end],
        [0, 1, 1, 0]
    );

    // Blur
    const blur = useTransform(
        scrollYProgress,
        [start, middle, end],
        [10, 0, 10]
    );

    return (
        <motion.div
            style={{
                y,
                scale,
                opacity,
                filter: useTransform(blur, (v) => `blur(${v}px)`),
                zIndex: index + 10 // Ensure cards are above background but below overlays if any
            }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
            <div className="w-full max-w-6xl px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center pointer-events-auto">

                {/* Visual Card */}
                <div className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-white/10 ${index % 2 === 1 ? 'md:order-2' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-white/0 z-10" />
                    <img
                        src={data.image}
                        alt={data.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                </div>

                {/* Text Content */}
                <div className={`text-center md:text-left flex flex-col justify-center space-y-6 ${index % 2 === 1 ? 'md:order-1 items-end md:text-right' : ''}`}>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-4"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tighter shadow-black drop-shadow-lg">
                            {data.title}
                        </h2>
                        <h3 className="text-xl md:text-2xl font-light text-primary-light uppercase tracking-widest">
                            {data.subtext}
                        </h3>
                        <p className="text-lg md:text-xl text-slate-300 leading-relaxed font-light max-w-md backdrop-blur-sm bg-black/20 p-4 rounded-xl border border-white/5 shadow-inner">
                            {data.description}
                        </p>
                    </motion.div>
                </div>

            </div>
        </motion.div>
    );
};

// --- Custom Scroll Handle Component ---
const ScrollHandle = ({ scrollYProgress, containerRef, numStages }: { scrollYProgress: MotionValue<number>, containerRef: React.RefObject<HTMLDivElement>, numStages: number }) => {
    const [isDragging, setIsDragging] = useState(false);
    const trackRef = useRef<HTMLDivElement>(null);
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 400, damping: 30 });

    // Transform progress to % string
    const top = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

    const scrollToPercentage = (percentage: number) => {
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const absoluteContainerTop = window.scrollY + containerRect.top;
        const scrollDistance = containerRef.current.offsetHeight - window.innerHeight;
        const targetScrollY = absoluteContainerTop + (scrollDistance * percentage);

        window.scrollTo({
            top: targetScrollY,
            behavior: 'auto'
        });
    };

    const handleInteraction = (clientY: number) => {
        if (!trackRef.current || !containerRef.current) return;

        const trackRect = trackRef.current.getBoundingClientRect();
        const relativeY = clientY - trackRect.top;
        const percentage = Math.max(0, Math.min(1, relativeY / trackRect.height));

        scrollToPercentage(percentage);
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        handleInteraction(e.clientY);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                e.preventDefault();
                handleInteraction(e.clientY);
            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 h-[60vh] w-16 flex items-center justify-center z-50 hidden md:flex">
            {/* Hit Area for easier interaction */}
            <div
                className="absolute inset-0 z-10 cursor-pointer"
                onMouseDown={handleMouseDown}
            />

            {/* Background Track - Thin minimalist line */}
            <div
                ref={trackRef}
                className="w-[2px] h-full bg-white/10 rounded-full relative"
            >
                {/* Active Fill Track - Subtle gradient */}
                <motion.div
                    style={{ height: top }}
                    className="w-full bg-gradient-to-b from-blue-400 to-teal-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                />

                {/* Step Markers */}
                {Array.from({ length: numStages }).map((_, i) => {
                    const stageStep = 1 / numStages;
                    // Position at the start of the stage or center?
                    // Let's position it at the center of the stage's duration for better UX
                    const stageCenter = (i * stageStep) + (stageStep / 2);

                    return (
                        <div
                            key={`stop-${i}`}
                            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 cursor-pointer group z-20"
                            style={{ top: `${stageCenter * 100}%` }}
                            onClick={(e) => {
                                e.stopPropagation();
                                scrollToPercentage(stageCenter);
                            }}
                        >
                            <div className="w-full h-full rounded-full border border-white/20 bg-[#05050A] group-hover:border-blue-400 transition-colors duration-300 relative -translate-y-1/2 flex items-center justify-center">
                                {/* Active Indicator Dot */}
                                <motion.div
                                    style={{
                                        opacity: useTransform(scrollYProgress,
                                            [stageCenter - (stageStep / 2.5), stageCenter, stageCenter + (stageStep / 2.5)],
                                            [0, 1, 0]
                                        ),
                                        scale: useTransform(scrollYProgress,
                                            [stageCenter - (stageStep / 2), stageCenter, stageCenter + (stageStep / 2)],
                                            [0.5, 1.5, 0.5]
                                        )
                                    }}
                                    className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Draggable Thumb - Glowing Orb */}
            <motion.div
                style={{ top }}
                className="absolute w-4 h-4 -ml-[1px] pointer-events-none z-30"
            >
                <div className="w-full h-full bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)] relative -translate-y-1/2 ring-2 ring-blue-400/30 backdrop-blur-md">
                    <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-pulse blur-sm" />
                </div>
            </motion.div>
        </div>
    );
};


const CultureAscent = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const stages = [
        {
            title: "Join Our Family.",
            subtext: "The Entry",
            description: "Bring your quirks, your background, and your fresh perspective. We don't hire roles; we hire people.",
            image: "/images/culture/ascent-join.png"
        },
        {
            title: "Grow with Adventure.",
            subtext: "Connecting Cubes",
            description: "From travel perks to team retreats—explore the world with our travel arm, Connecting Cubes.",
            image: "/images/culture/ascent-grow.jpg"
        },
        {
            title: "Evolve with Tech.",
            subtext: "Ocean Engineering",
            description: "Work on cutting-edge marine technology and engineering projects that define industry standards.",
            image: "/images/culture/ascent-evolve.jpg"
        },
        {
            title: "Lead the Industry.",
            subtext: "Ocean Maritime",
            description: "Shape the future of global maritime logistics. Your journey leads to industry leadership.",
            image: "/images/culture/ascent-lead.jpg"
        }
    ];

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-[#05050A]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">

                {/* Dynamic Backgrounds */}
                {stages.map((stage, index) => {
                    // Create a transform for opacity based on the same index logic as cards
                    const step = 1 / stages.length;
                    const start = index * step;
                    const end = start + step;

                    // We want the background to be visible during its card's prominence
                    // Overlap slightly for smooth transition
                    const bgOpacity = useTransform(
                        scrollYProgress,
                        [start - 0.1, start, end, end + 0.1], // Adjust points for crossfade
                        [0, 1, 1, 0]
                    );

                    return (
                        <motion.div
                            key={`bg-${index}`}
                            style={{ opacity: bgOpacity }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <img src={stage.image} alt="" className="w-full h-full object-cover opacity-100 blur-sm scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-b from-[#05050A] via-[#05050A]/80 to-[#05050A]" />
                        </motion.div>
                    );
                })}

                {/* Constant Atmosphere Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#05050A] via-transparent to-[#05050A]" />
                    <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-slate-800 to-transparent opacity-20" />
                    <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-slate-800 to-transparent opacity-20" />
                </div>

                {/* Interactive Title */}
                <motion.div
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
                        scale: useTransform(scrollYProgress, [0, 0.15], [1, 1.5]),
                        y: useTransform(scrollYProgress, [0, 0.15], [0, -100]),
                        filter: useTransform(scrollYProgress, [0, 0.15], ["blur(0px)", "blur(10px)"]),
                        pointerEvents: useTransform(scrollYProgress, (v) => v > 0.05 ? 'none' : 'auto')
                    }}
                    className="absolute inset-0 flex flex-col items-center justify-center z-40 p-4"
                >
                    <h1 className="text-6xl md:text-9xl font-bold text-white tracking-widest uppercase drop-shadow-2xl text-center">
                        The Ascent
                    </h1>
                    <p className="text-xl md:text-3xl text-blue-300 mt-6 tracking-wide font-light max-w-4xl text-center drop-shadow-lg">
                        A transformational journey of personal and professional growth.
                    </p>

                    {/* Minimalist Scroll Indicator */}
                    <div className="mt-12 flex flex-col items-center gap-3">
                        <div className="w-[26px] h-[45px] rounded-full border-2 border-white/20 flex justify-center p-1.5 backdrop-blur-sm">
                            <motion.div
                                animate={{
                                    y: [0, 15, 0],
                                    opacity: [1, 0.2, 1]
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                            />
                        </div>
                        <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] font-medium">Scroll to Begin</span>
                    </div>
                </motion.div>

                {/* Scroll Handle */}
                <ScrollHandle scrollYProgress={scrollYProgress} containerRef={containerRef} numStages={stages.length} />

                {/* Cards Container */}
                <div className="relative w-full h-full flex items-center justify-center perspective-1000">
                    {stages.map((stage, index) => (
                        <AscentCard
                            key={index}
                            data={stage}
                            index={index}
                            scrollYProgress={scrollYProgress}
                            totalCards={stages.length}
                        />
                    ))}
                </div>

                {/* Final CTA Button triggers at the end */}
                <motion.div
                    style={{
                        opacity: useTransform(scrollYProgress, [0.95, 1], [0, 1]),
                        y: useTransform(scrollYProgress, [0.95, 1], [50, 0]),
                        pointerEvents: useTransform(scrollYProgress, (v) => v > 0.95 ? 'auto' : 'none')
                    }}
                    className="absolute top-1/2 left-0 right-0 -translate-y-1/2 z-50 flex justify-center"
                >
                    <button className="px-12 py-6 bg-gradient-to-r from-primary to-secondary text-white text-xl font-bold rounded-full shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 transition-all transform backdrop-blur-md border border-white/20">
                        Start Your Journey
                    </button>
                </motion.div>

            </div>
        </section>
    );
};

export default CultureAscent;
