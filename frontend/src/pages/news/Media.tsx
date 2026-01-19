import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Play, Image as ImageIcon, FileText, ArrowUpRight, Clock, Layers } from 'lucide-react';

import Navbar from '../../components/Navbar';

const mediaItems = [
    {
        id: 'ceo-interview',
        title: 'CEO Interview: Vision for 2026',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=800&auto=format&fit=crop',
        date: 'January 10, 2026',
        duration: '12:45',
        span: 'md:col-span-2 md:row-span-2'
    },
    {
        id: 'resort-gallery',
        title: 'New Mirissa Resort Gallery',
        type: 'gallery',
        thumbnail: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop',
        date: 'January 8, 2026',
        count: '24 photos',
        span: 'md:col-span-1 md:row-span-2'
    },
    {
        id: 'annual-report',
        title: 'Annual Report 2025',
        type: 'document',
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
        date: 'January 5, 2026',
        pages: '48 pages',
        span: 'md:col-span-1 md:row-span-1'
    },
    {
        id: 'vessel-launch',
        title: 'LNG Vessel Launch',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?q=80&w=800&auto=format&fit=crop',
        date: 'January 3, 2026',
        duration: '8:30',
        span: 'md:col-span-1 md:row-span-1'
    },
    {
        id: 'solar-project',
        title: 'Solar Farm Project',
        type: 'gallery',
        thumbnail: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
        date: 'December 28, 2025',
        count: '16 photos',
        span: 'md:col-span-2 md:row-span-1'
    },
    {
        id: 'sustainability-report',
        title: 'Sustainability Report 2025',
        type: 'document',
        thumbnail: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop',
        date: 'December 20, 2025',
        pages: '32 pages',
        span: 'md:col-span-2 md:row-span-1'
    }
];

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'video': return Play;
        case 'gallery': return ImageIcon;
        case 'document': return FileText;
        default: return FileText;
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'video': return 'bg-red-500';
        case 'gallery': return 'bg-blue-500';
        case 'document': return 'bg-emerald-500';
        default: return 'bg-gray-500';
    }
};

const Media = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />

            <section className="pt-32 pb-8 px-4 md:px-6 w-full max-w-[95%] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Media Gallery</h2>
                        <p className="text-gray-500">Browse our collection of videos, photos, and documents.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
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
                                className={`${item.span} group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100/50`}
                            >
                                <Link to={`/news/media/${item.id}`} className="block h-full w-full">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${item.thumbnail}')` }}
                                    />
                                    {/* Gradient overlay - stronger for readability */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-90" />

                                    {/* Type Badge */}
                                    <div className="absolute top-6 left-6">
                                        <div className={`${colorClass} w-10 h-10 rounded-full flex items-center justify-center shadow-lg text-white`}>
                                            <Icon className="w-5 h-5 ml-0.5" />
                                        </div>
                                    </div>

                                    {/* Content Info (Bottom) */}
                                    <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                                            <span>{item.date}</span>
                                            <span className="w-1 h-1 bg-gray-500 rounded-full" />
                                            <span className="flex items-center gap-1">
                                                {item.type === 'video' && <><Clock className="w-3 h-3" /> {item.duration}</>}
                                                {item.type === 'gallery' && <><Layers className="w-3 h-3" /> {item.count}</>}
                                                {item.type === 'document' && <><FileText className="w-3 h-3" /> {item.pages}</>}
                                            </span>
                                        </div>

                                        <h3 className={`font-bold mb-2 leading-tight ${item.span.includes('col-span-2') ? 'text-2xl' : 'text-lg'}`}>
                                            {item.title}
                                        </h3>

                                        {/* Play Button Overlay for Video */}
                                        {item.type === 'video' && item.span.includes('row-span-2') && (
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                                                <Play className="w-6 h-6 text-white fill-white ml-1" />
                                            </div>
                                        )}

                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}

                    {/* Newsletter Subscription Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-1 md:row-span-1 bg-[#0f172a] rounded-3xl p-8 flex flex-col justify-center text-white relative overflow-hidden"
                    >
                        {/* Background Icon */}
                        <div className="absolute -top-4 -right-4 text-gray-800 opacity-50 rotate-12">
                            <svg
                                width="120"
                                height="120"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                            </svg>
                        </div>

                        <h3 className="font-bold text-2xl mb-2 relative z-10">Subscribe</h3>
                        <p className="text-sm text-gray-400 mb-6 relative z-10">Get the latest updates directly to your inbox.</p>
                        <div className="relative z-10 space-y-3">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:bg-gray-800 transition-colors placeholder:text-gray-500 text-white"
                            />
                            <button className="w-full bg-cyan-500 text-white font-bold py-3 rounded-xl hover:bg-cyan-400 transition-colors">
                                Sign Up
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Media;
