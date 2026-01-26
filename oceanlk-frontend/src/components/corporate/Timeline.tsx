import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Calendar, Anchor, Settings, Globe, Map, BookOpen } from 'lucide-react';

const timelineData = [
    {
        year: '1990',
        title: 'The Foundation',
        description: 'Established as a dedicated maritime service provider, laying the groundwork for a legacy of excellence.',
        icon: Anchor
    },
    {
        year: '1998',
        title: 'Ocean Maritime Ceylon',
        description: 'Expanded operations to major ports, becoming a key player in ship supply and logistics.',
        icon: Globe
    },
    {
        year: '2005',
        title: 'Ocean Engineering Ceylon',
        description: 'Diversified into marine engineering to handle complex structural repairs and technical solutions.',
        icon: Settings
    },
    {
        year: '2012',
        title: 'Ocean Maritime Channel',
        description: 'Strengthened the supply chain with comprehensive channel management and global logistics.',
        icon: Map
    },
    {
        year: '2015',
        title: 'Connecting Cubes',
        description: 'Ventured into the leisure sector, offering personalized travel and tourism experiences.',
        icon: Globe
    },
    {
        year: '2018',
        title: 'Digital Books',
        description: 'Embraced the digital era with a marketing agency focused on brand visibility and content.',
        icon: BookOpen
    },
    {
        year: 'Present',
        title: 'Global Conglomerate',
        description: 'A diversified powerhouse driving sustainable growth and innovation across multiple industries.',
        icon: Calendar
    }
];

const TimelineItem = ({ item, index }: { item: any; index: number }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className={`flex items-center justify-between mb-16 w-full ${isEven ? 'flex-row-reverse' : ''
                }`}
        >
            <div className="w-5/12" />

            <div className="z-20 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50 border-4 border-navy">
                <item.icon className="w-5 h-5 text-white" />
            </div>

            <div className="w-5/12">
                <div className={`p-6 glass rounded-2xl border border-white/10 hover:border-accent/30 transition-all duration-300 transform hover:-translate-y-1 ${isEven ? 'text-right' : 'text-left'
                    }`}>
                    <span className="text-accent font-bold text-xl block mb-2">{item.year}</span>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </div>
            </div>
        </motion.div>
    );
};

const Timeline = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    return (
        <div ref={containerRef} className="relative py-20 max-w-5xl mx-auto px-4">
            <div className="text-center mb-20">
                <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">Our Historic Journey</h2>
                <p className="text-gray-400 max-w-2xl mx-auto">From humble beginnings to a global ecosystem, trace the milestones that defined our path.</p>
            </div>

            {/* Vertical Line */}
            <div className="relative pt-12">
                {/* Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-900/30 top-0 rounded-full overflow-hidden">
                    <motion.div
                        style={{ height }}
                        className="w-full bg-gradient-to-b from-blue-500 via-accent to-blue-500"
                    />
                </div>

                {timelineData.map((item, index) => (
                    <TimelineItem key={index} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default Timeline;
