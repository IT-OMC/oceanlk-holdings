import { motion, useMotionValue, useTransform } from 'framer-motion';
import { oceanData } from '../data/mockData';
import SectionWrapper from './SectionWrapper';
import { useState } from 'react';
import { TrendingUp, Building2, Users } from 'lucide-react';

const iconMap: Record<string, any> = {
    'Years of Excellence': TrendingUp,
    'Subsidiaries': Building2,
    'Global Partners': Users,
};

const StatCard = ({ label, value }: { label: string; value: string }) => {
    const [isHovered, setIsHovered] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useTransform(y, [-100, 100], [10, -10]);
    const rotateY = useTransform(x, [-100, 100], [-10, 10]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        x.set(e.clientX - centerX);
        y.set(e.clientY - centerY);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        x.set(0);
        y.set(0);
    };

    const Icon = iconMap[label] || TrendingUp;

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
            }}
            className="bg-white rounded-lg p-8 cursor-pointer transition-all duration-300 shadow-lg border border-gray-100 hover:border-b-4 hover:border-b-accent"
            whileHover={{ scale: 1.02 }}
        >
            <motion.div
                animate={{
                    y: isHovered ? [0, -5, 0] : 0,
                }}
                transition={{
                    duration: 2,
                    repeat: isHovered ? Infinity : 0,
                    ease: 'easeInOut',
                }}
                className="mb-4"
            >
                <Icon className="w-12 h-12 text-accent" strokeWidth={1.5} />
            </motion.div>

            <h3 className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                {value}
            </h3>

            <h4 className="text-lg font-semibold text-accent mb-2">
                {label}
            </h4>
        </motion.div>
    );
};

const Stats = () => {
    return (
        <SectionWrapper id="about" className="py-20">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl lg:text-5xl font-bold text-primary mb-4">
                    OceanLK <span className="text-accent">at a Glance</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Pioneering excellence across industries with strategic vision and unwavering commitment
                </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
                {oceanData.stats.map((stat, index) => (
                    <motion.div
                        key={stat.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                        <StatCard label={stat.label} value={stat.value} />
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Stats;
