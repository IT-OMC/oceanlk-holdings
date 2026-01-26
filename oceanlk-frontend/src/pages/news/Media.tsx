import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Play, Image as ImageIcon, FileText, ArrowUpRight, Loader } from 'lucide-react';

import Navbar from '../../components/Navbar';

interface MediaItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    category: string;
    type?: string;
    publishedDate: string;
    featured: boolean;
    duration?: string;
    photoCount?: number;
    pageCount?: number;
    galleryImages?: string[];
}

const Media = () => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');

    const filteredItems = mediaItems.filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'images') return item.type !== 'VIDEO' && item.type !== 'ALBUM' && item.type !== 'DOCUMENT' && item.type !== 'GALLERY'; // Explicitly exclude others
        if (activeTab === 'videos') return item.type === 'VIDEO';
        if (activeTab === 'albums') return item.type === 'ALBUM' || (item.type === 'GALLERY' && (item.photoCount && item.photoCount > 1));
        if (activeTab === 'documents') return item.type === 'DOCUMENT';
        return true;
    });

    useEffect(() => {
        fetchMediaItems();
    }, []);

    const fetchMediaItems = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/media/media');
            if (response.ok) {
                const data = await response.json();
                setMediaItems(data);
            } else {
                setError('Failed to load media items');
            }
        } catch (error) {
            console.error('Error fetching media:', error);
            setError('Failed to load media items');
        } finally {
            setIsLoading(false);
        }
    };

    const getMediaIcon = (type?: string) => {
        switch (type?.toUpperCase()) {
            case 'VIDEO':
                return <Play className="w-4 h-4" />;
            case 'GALLERY':
            case 'ALBUM':
                return <ImageIcon className="w-4 h-4" />;
            case 'DOCUMENT':
                return <FileText className="w-4 h-4" />;
            default:
                return <ImageIcon className="w-4 h-4" />;
        }
    };

    const getMediaTypeLabel = (item: MediaItem) => {
        if (item.type === 'VIDEO' && item.duration) {
            return item.duration;
        } else if ((item.type === 'GALLERY' || item.type === 'ALBUM')) {
            const count = item.photoCount || (item.galleryImages ? item.galleryImages.length : 0);
            return count ? `${count} photos` : 'Gallery';
        } else if (item.type === 'DOCUMENT' && item.pageCount) {
            return `${item.pageCount} pages`;
        }
        return item.type || 'Media';
    };

    // Assign grid spans for variety (2 large, rest standard)
    const getGridSpan = (index: number) => {
        if (index === 0) return 'md:col-span-2 md:row-span-2';
        if (index === 1) return 'md:col-span-1 md:row-span-2';
        return 'md:col-span-1 md:row-span-1';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    <button
                        onClick={fetchMediaItems}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />

            <section className="pt-32 pb-8 px-4 md:px-6 w-full max-w-[95%] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Media Center</h2>
                        <p className="text-gray-500">Videos, galleries, and documents from OceanLK Holdings.</p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-gray-100/50 p-1 rounded-xl mt-6 md:mt-0">
                        {['All', 'Images', 'Videos', 'Albums', 'Documents'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab.toLowerCase())}
                                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${activeTab === tab.toLowerCase()
                                    ? 'text-purple-600 bg-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab.toLowerCase() && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-white rounded-lg shadow-sm -z-10"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredItems.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No {activeTab} available at the moment.</p>
                        <button
                            onClick={() => setActiveTab('all')}
                            className="mt-4 text-purple-600 font-semibold hover:underline"
                        >
                            View all media
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
                        {filteredItems.map((item, index) => {
                            const span = getGridSpan(index);
                            const isLarge = span.includes('row-span-2');

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className={`${span} group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100/50`}
                                >
                                    <Link to={`/news/media/${item.id}`} className="block h-full w-full">
                                        {/* Background Image */}
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url('${item.imageUrl}')` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                        {/* Top badges */}
                                        <div className="absolute top-6 left-6 flex items-center gap-2">
                                            <span className="bg-purple-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                                                {getMediaIcon(item.type)}
                                                {item.type || 'Media'}
                                            </span>
                                            {isLarge && (
                                                <span className="bg-black/40 backdrop-blur-sm text-gray-200 px-3 py-1 rounded-full text-xs font-medium">
                                                    {getMediaTypeLabel(item)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                                            <div className="flex items-center gap-2 text-sm text-gray-300 mb-3 font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(item.publishedDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>

                                            <h3 className={`font-bold mb-3 leading-tight ${span.includes('col-span-2') ? 'text-3xl' : isLarge ? 'text-xl' : 'text-lg'}`}>
                                                {item.title}
                                            </h3>

                                            {isLarge && (
                                                <p className="text-gray-200 text-sm line-clamp-2 mb-4 opacity-90">
                                                    {item.description}
                                                </p>
                                            )}

                                            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white">
                                                <ArrowUpRight className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            );
                        })}

                        {/* Subscription Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-purple-900 to-purple-800 rounded-3xl p-6 flex flex-col justify-center text-white relative overflow-hidden shadow-lg"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <Play size={100} />
                            </div>
                            <h3 className="font-bold text-xl mb-2 relative z-10">Subscribe</h3>
                            <p className="text-xs text-purple-200 mb-4 relative z-10">
                                Get the latest media updates directly to your inbox.
                            </p>
                            <div className="relative z-10">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:bg-white/20 transition-colors placeholder:text-purple-300"
                                />
                                <button className="w-full bg-white text-purple-900 text-xs font-bold py-2 rounded-xl hover:bg-purple-100 transition-colors">
                                    Sign Up
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </section>
        </div>
    );
};

export default Media;
