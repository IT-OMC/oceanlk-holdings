import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { Play, Image as ImageIcon, FileText, ArrowRight } from 'lucide-react';

const mediaItems = [
    {
        id: 'ceo-interview',
        title: 'CEO Interview: Vision for 2026',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=800&auto=format&fit=crop',
        date: 'January 10, 2026',
        duration: '12:45'
    },
    {
        id: 'resort-gallery',
        title: 'New Mirissa Resort Photo Gallery',
        type: 'gallery',
        thumbnail: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop',
        date: 'January 8, 2026',
        count: '24 photos'
    },
    {
        id: 'annual-report',
        title: 'Annual Report 2025',
        type: 'document',
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
        date: 'January 5, 2026',
        pages: '48 pages'
    },
    {
        id: 'vessel-launch',
        title: 'New LNG Vessel Launch Ceremony',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?q=80&w=800&auto=format&fit=crop',
        date: 'January 3, 2026',
        duration: '8:30'
    },
    {
        id: 'solar-project',
        title: 'Solar Farm Project Documentation',
        type: 'gallery',
        thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
        date: 'December 28, 2025',
        count: '16 photos'
    },
    {
        id: 'sustainability-report',
        title: 'Sustainability Report 2025',
        type: 'document',
        thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop',
        date: 'December 20, 2025',
        pages: '32 pages'
    }
];

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'video':
            return Play;
        case 'gallery':
            return ImageIcon;
        case 'document':
            return FileText;
        default:
            return FileText;
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'video':
            return 'bg-red-500';
        case 'gallery':
            return 'bg-blue-500';
        case 'document':
            return 'bg-green-500';
        default:
            return 'bg-gray-500';
    }
};

const Media = () => {
    return (
        <div className="min-h-screen">
            <SectionWrapper id="media" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">Media Center</h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                        Browse our collection of videos, photo galleries, and corporate documents.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {mediaItems.map((item, index) => {
                            const Icon = getTypeIcon(item.type);
                            const colorClass = getTypeColor(item.type);

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Link to={`/news/media/${item.id}`}>
                                        <div className="glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform group">
                                            <div className="relative h-56 overflow-hidden">
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-primary/50 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
                                                    <div className={`${colorClass} w-16 h-16 rounded-full flex items-center justify-center`}>
                                                        <Icon className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                                <div className="absolute top-4 right-4">
                                                    <span className="bg-primary px-3 py-1 rounded-full text-sm font-semibold capitalize">
                                                        {item.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                                                    {item.title}
                                                </h3>
                                                <div className="flex items-center justify-between text-sm text-gray-400">
                                                    <span>{item.date}</span>
                                                    <span>
                                                        {item.type === 'video' && item.duration}
                                                        {item.type === 'gallery' && item.count}
                                                        {item.type === 'document' && item.pages}
                                                    </span>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2 text-accent font-semibold">
                                                    View
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Media;
