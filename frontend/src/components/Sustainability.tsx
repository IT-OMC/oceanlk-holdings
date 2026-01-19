import { useState, useRef, useEffect } from 'react';
import { motion, useInView, useMotionValue, useTransform } from 'framer-motion';
import SectionWrapper from './SectionWrapper';

const Sustainability = () => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const sliderRef = useRef<HTMLDivElement>(null);
    const countersRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(countersRef, { once: true, margin: "-100px" });

    const handleMove = (clientX: number) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const percent = (x / rect.width) * 100;
        setSliderPosition(percent);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging) handleMove(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isDragging && e.touches[0]) handleMove(e.touches[0].clientX);
    };

    const stats = [
        { label: 'Net Carbon Goal', value: 0, suffix: '', prefix: '' },
        { label: 'Local Jobs Created', value: 500, suffix: '+', prefix: '' },
        { label: 'Ocean Cleanup Tons', value: 1200, suffix: '', prefix: '' },
        { label: 'Green Fleet Vessels', value: 25, suffix: '', prefix: '' },
    ];

    return (
        <SectionWrapper id="sustainability" className="py-20 bg-gradient-to-b from-background to-background-dark">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
                        Environmental Impact
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Modern maritime companies must address environmental concerns.
                        We're leading the way with CSR initiatives, ocean conservation efforts, and green logistics.
                    </p>
                </motion.div>

                {/* Split Screen Slider */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-20"
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-center mb-8 text-primary">
                        Traditional vs. Green Technology
                    </h3>
                    <div
                        ref={sliderRef}
                        className="relative w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl cursor-ew-resize select-none"
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onMouseLeave={() => setIsDragging(false)}
                        onMouseMove={handleMouseMove}
                        onTouchStart={() => setIsDragging(true)}
                        onTouchEnd={() => setIsDragging(false)}
                        onTouchMove={handleTouchMove}
                    >
                        {/* Before Image - Traditional */}
                        <div className="absolute inset-0">
                            <img
                                src="https://images.unsplash.com/photo-1605731414555-0ac2b3320b94?q=80&w=2000&auto=format&fit=crop"
                                alt="Traditional Maritime"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <span className="inline-block px-4 py-2 bg-red-600 text-white font-bold rounded-lg mb-2">
                                    PROBLEM
                                </span>
                                <h4 className="text-3xl font-bold text-white mb-2">Traditional Methods</h4>
                                <p className="text-white/90">High emissions, fuel inefficiency</p>
                            </div>
                        </div>

                        {/* After Image - Green Tech */}
                        <div
                            className="absolute inset-0"
                            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=2000&auto=format&fit=crop"
                                alt="Green Maritime Technology"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                            <div className="absolute bottom-8 right-8 text-right">
                                <span className="inline-block px-4 py-2 bg-green-600 text-white font-bold rounded-lg mb-2">
                                    SOLUTION
                                </span>
                                <h4 className="text-3xl font-bold text-white mb-2">Green Technology</h4>
                                <p className="text-white/90">Zero emissions, renewable energy</p>
                            </div>
                        </div>

                        {/* Slider Handle */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                            style={{ left: `${sliderPosition}%` }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Counter Stats */}
                <motion.div
                    ref={countersRef}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h3 className="text-2xl md:text-3xl font-bold text-center mb-12 text-primary">
                        Our Impact in Numbers
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="mb-4">
                                    <CounterAnimation
                                        target={stat.value}
                                        prefix={stat.prefix}
                                        suffix={stat.suffix}
                                        isInView={isInView}
                                    />
                                </div>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </SectionWrapper>
    );
};

const CounterAnimation = ({
    target,
    prefix = '',
    suffix = '',
    isInView
}: {
    target: number;
    prefix?: string;
    suffix?: string;
    isInView: boolean;
}) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        const duration = 2000; // 2 seconds
        const steps = 60;
        const increment = target / steps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, duration / steps);

        return () => clearInterval(timer);
    }, [isInView, target]);

    return (
        <div className="text-5xl md:text-6xl font-bold text-secondary">
            {prefix}{count.toLocaleString()}{suffix}
        </div>
    );
};

export default Sustainability;
