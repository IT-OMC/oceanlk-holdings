import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Ship, Calendar, Anchor, Globe, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
    theme: 'blue' | 'purple' | 'pink' | 'emerald' | 'orange';
    index: number;
    icon: any;
}

const MetricCard = ({ value, label, theme, index, icon: Icon }: MetricCardProps) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    // Extract numeric value and suffix
    const numericMatch = value.match(/^([\d.]+)(.*)$/);
    const numericValue = numericMatch ? parseFloat(numericMatch[1]) : 0;
    const suffix = numericMatch ? numericMatch[2] : value;

    const animatedCount = useCountUp(numericValue, 2000, isInView);

    // Theme definitions
    const themes = {
        blue: {
            text: 'text-blue-600',
            bg: 'bg-blue-50 hover:bg-blue-100',
            icon: 'text-blue-500',
            border: 'border-blue-100'
        },
        purple: {
            text: 'text-purple-600',
            bg: 'bg-purple-50 hover:bg-purple-100',
            icon: 'text-purple-500',
            border: 'border-purple-100'
        },
        pink: {
            text: 'text-pink-600',
            bg: 'bg-pink-50 hover:bg-pink-100',
            icon: 'text-pink-500',
            border: 'border-pink-100'
        },
        emerald: {
            text: 'text-emerald-600',
            bg: 'bg-emerald-50 hover:bg-emerald-100',
            icon: 'text-emerald-500',
            border: 'border-emerald-100'
        },
        orange: {
            text: 'text-orange-600',
            bg: 'bg-orange-50 hover:bg-orange-100',
            icon: 'text-orange-500',
            border: 'border-orange-100'
        }
    };

    const currentTheme = themes[theme];

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.6, type: "spring" }}
            className={`relative group h-full p-6 flex flex-col items-center justify-between
                backdrop-blur-sm rounded-2xl border transition-all duration-500
                hover:shadow-xl hover:-translate-y-2
                bg-white/80 ${currentTheme.border} ${currentTheme.bg}
            `}
        >
            {/* Icon Decoration */}
            <div className={`mb-4 p-4 rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform duration-300 ${currentTheme.text}`}>
                <Icon size={32} strokeWidth={1.5} />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center gap-2">
                <div className={`text-4xl lg:text-5xl font-black tracking-tight ${currentTheme.text}`}>
                    <span className="tabular-nums">{isInView ? animatedCount : 0}</span>{suffix}
                </div>
                <div className="font-medium text-slate-500 uppercase tracking-widest text-[11px] text-center px-2">
                    {label}
                </div>
            </div>

        </motion.div>
    );
};

const GlobalMetrics = () => {
    const { t } = useTranslation();
    const metrics = [
        { value: '15+', label: t('home.metrics.activeRoutes'), theme: 'blue' as const, icon: Ship },
        { value: '113', label: t('home.metrics.weeklySailings'), theme: 'purple' as const, icon: Calendar },
        { value: '3M', label: t('home.metrics.annualCapacity'), theme: 'pink' as const, icon: Anchor },
        { value: '50+', label: t('home.metrics.globalPorts'), theme: 'emerald' as const, icon: MapPin },
        { value: '25+', label: t('home.metrics.countriesServed'), theme: 'orange' as const, icon: Globe }
    ];

    return (
        <section className="relative py-20 bg-slate-50/50">
            <div className="max-w-[1400px] mx-auto px-6 relative z-10">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-slate-900">
                        {t('home.metrics.title')}
                    </h2>
                    <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full mb-4" />
                    <p className="text-slate-500 text-sm tracking-widest uppercase font-medium">
                        {t('home.metrics.subtitle')}
                    </p>
                </motion.div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {metrics.map((metric, index) => (
                        <MetricCard
                            key={metric.label}
                            {...metric}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default GlobalMetrics;
