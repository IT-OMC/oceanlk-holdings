import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// Custom hook for count-up animation
const useCountUp = (end: number, duration: number = 2000, inView: boolean) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!inView) return;

        let startTime: number | null = null;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            setCount(Math.floor(end * easeOutQuart));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, inView]);

    return count;
};

interface MetricCardProps {
    value: string;
    label: string;
    color: string;
    index: number;
}

const MetricCard = ({ value, label, color, index }: MetricCardProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    // Extract numeric value and suffix
    const numericMatch = value.match(/^([\d.]+)(.*)$/);
    const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0;
    const suffix = numericMatch ? numericMatch[2] : value;

    const animatedCount = useCountUp(numericValue, 2000, isInView);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative group"
        >
            {/* Gradient border effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${color} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-500`} />

            {/* Card content */}
            <div className="relative glass backdrop-blur-xl bg-white/5 p-8 rounded-2xl border border-white/10 overflow-hidden">
                {/* Corner accents */}
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-bl-full`} />
                <div className={`absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr ${color} opacity-10 rounded-tr-full`} />

                {/* Animated background glow */}
                <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Content */}
                <div className="relative z-10">
                    <div className={`text-5xl lg:text-6xl font-bold mb-3 bg-gradient-to-r ${color} bg-clip-text text-transparent drop-shadow-lg`}>
                        {isInView ? animatedCount : 0}{suffix}
                    </div>
                    <div className="text-slate-300 text-sm font-medium tracking-wide uppercase opacity-80 group-hover:opacity-100 transition-opacity">
                        {label}
                    </div>
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
            </div>
        </motion.div>
    );
};

const GlobalMetrics = () => {
    const metrics = [
        { value: '15+', label: 'Active Routes', color: 'from-blue-400 to-blue-600' },
        { value: '113', label: 'Weekly Sailings', color: 'from-purple-400 to-purple-600' },
        { value: '3.8M', label: 'Annual TEU Capacity', color: 'from-pink-400 to-pink-600' },
        { value: '50+', label: 'Global Ports', color: 'from-emerald-400 to-emerald-600' },
        { value: '25+', label: 'Countries Served', color: 'from-orange-400 to-orange-600' }
    ];

    return (
        <section className="relative py-24 bg-ocean-base overflow-hidden">
            {/* Enhanced Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Global Impact
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Connecting the world through maritime excellence
                    </p>
                </motion.div>

                {/* Metrics grid - responsive for 5 items */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {metrics.map((metric, index) => (
                        <MetricCard
                            key={metric.label}
                            value={metric.value}
                            label={metric.label}
                            color={metric.color}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GlobalMetrics;
