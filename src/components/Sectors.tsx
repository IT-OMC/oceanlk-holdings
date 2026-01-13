import { motion } from 'framer-motion';
import { oceanData } from '../data/mockData';
import SectionWrapper from './SectionWrapper';
import { ArrowUpRight } from 'lucide-react';

const SectorCard = ({ title, desc, image }: { title: string; desc: string; image: string }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="glass-strong rounded-2xl overflow-hidden group cursor-pointer h-80"
        >
            <div className="relative h-full overflow-hidden">
                {/* Real Image */}
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0"
                >
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-darkest via-ocean-darkest/70 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

                {/* Content */}
                <div className="relative h-full p-6 flex flex-col justify-end">
                    <div className="transform group-hover:translate-y-0 transition-transform">
                        <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                            {title}
                            <ArrowUpRight className="w-5 h-5 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-slate-300 text-sm opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            {desc}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Sectors = () => {
    return (
        <SectionWrapper id="sectors" className="py-20">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                    Our <span className="text-accent">Portfolio</span>
                </h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                    Diversified investments across high-growth industries shaping the future
                </p>
            </motion.div>

            {/* Grid Layout - 3 equal cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {oceanData.sectors.map((sector, index) => (
                    <motion.div
                        key={sector.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                        <SectorCard title={sector.title} desc={sector.desc} image={sector.image} />
                    </motion.div>
                ))}
            </div>
        </SectionWrapper>
    );
};

export default Sectors;
