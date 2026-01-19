import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Image as ImageIcon, FileText, ArrowRight } from 'lucide-react';
import MediaHero from '../../components/news/MediaHero';
import MediaCTA from '../../components/news/MediaCTA';
import Navbar from '../../components/Navbar';

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
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />

            <MediaHero />

            {/* Media Grid Section */}
            <section className="py-20 px-4 md:px-6 w-full max-w-[95%] mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Media Gallery</h2>
                        <p className="text-gray-500">Browse our collection of videos, photos, and documents.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mediaItems.map((item, index) => {
                        const Icon = getTypeIcon(item.type);
                        const colorClass = getTypeColor(item.type);

                        return (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Link to={`/news/media/${item.id}`}>
                                    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group h-full flex flex-col">
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className={`${colorClass} w-16 h-16 rounded-full flex items-center justify-center shadow-lg`}>
                                                    <Icon className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold capitalize text-gray-900">
                                                    {item.type}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6 flex-1 flex flex-col">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                                                {item.title}
                                            </h3>
                                            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                                                <span>{item.date}</span>
                                                <span>
                                                    {item.type === 'video' && item.duration}
                                                    {item.type === 'gallery' && item.count}
                                                    {item.type === 'document' && item.pages}
                                                </span>
                                            </div>
                                            <div className="mt-auto flex items-center gap-2 text-purple-600 font-semibold text-sm">
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
            </section>

            <MediaCTA />
        </div>
    );
};

export default Media;
