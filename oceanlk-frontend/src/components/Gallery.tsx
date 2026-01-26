import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Play, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface GalleryItem {
    id: string;
    title: string;
    description?: string;
    imageUrl: string;
    videoUrl?: string;
    category: string;
    company?: string;
}

const Gallery = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState('All');
    const [activeIndex, setActiveIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch gallery data from backend
    useEffect(() => {
        const fetchGalleryData = async () => {
            try {
                const response = await fetch('/api/media/gallery');
                if (response.ok) {
                    const data = await response.json();
                    // Map backend data to gallery format
                    const mappedData: GalleryItem[] = data.map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        imageUrl: item.imageUrl,
                        videoUrl: item.videoUrl,
                        category: item.company || 'General',
                        company: item.company
                    }));
                    setGalleryItems(mappedData);
                }
            } catch (error) {
                console.error('Failed to fetch gallery data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchGalleryData();
    }, []);

    // Get unique categories (companies) plus 'All'
    const categories = ['All', ...Array.from(new Set(galleryItems.map(item => item.category)))];

    const filteredItems = filter === 'All'
        ? galleryItems
        : galleryItems.filter(item => item.category === filter);

    // Reset index when filter changes
    useEffect(() => {
        setActiveIndex(0);
    }, [filter]);

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % filteredItems.length);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    };

    // Auto-advance if not hovering (optional, but nice)
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(handleNext, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, filteredItems.length]);

    const getItemStyles = (index: number) => {
        const diff = (index - activeIndex + filteredItems.length) % filteredItems.length;
        // Adjust diff to handle wrapping correctly for visual positioning
        // We want the shortest path distance.
        // e.g. if length is 5, active is 0. index 4 should be considered -1.
        let effectiveDiff = diff;
        if (diff > filteredItems.length / 2) {
            effectiveDiff = diff - filteredItems.length;
        } else if (diff < -filteredItems.length / 2) {
            effectiveDiff = diff + filteredItems.length;
        }

        // Limit visible items to +/- 2
        const isVisible = Math.abs(effectiveDiff) <= 2;

        return {
            x: `${effectiveDiff * 60}%`, // Overlap factor
            scale: 1 - Math.abs(effectiveDiff) * 0.15,
            zIndex: 10 - Math.abs(effectiveDiff),
            opacity: isVisible ? 1 - Math.abs(effectiveDiff) * 0.2 : 0,
            rotateY: effectiveDiff * -5, // Slight rotation effect
            display: isVisible ? 'block' : 'none'
        };
    };

    return (
        <section className="py-10 lg:py-16 bg-white relative overflow-hidden" id="gallery">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-2">{t('home.gallery.label')}</p>
                    <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-4">
                        {t('home.gallery.title')} <span className="text-accent">{t('home.gallery.titleAccent')}</span>
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        {t('home.gallery.description')}
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="flex justify-center flex-wrap gap-4 mb-16">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${filter === cat
                                ? 'bg-navy text-white shadow-lg scale-105'
                                : 'bg-white border border-slate-200 text-slate-600 hover:border-navy hover:text-navy'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* 3D Carousel */}
                {isLoading ? (
                    <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
                        <p className="text-slate-500">Loading gallery...</p>
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
                        <p className="text-slate-500">No media items found</p>
                    </div>
                ) : (
                    <div
                        className="relative h-[400px] lg:h-[500px] flex items-center justify-center mb-12"
                        onMouseEnter={() => setIsAutoPlaying(false)}
                        onMouseLeave={() => setIsAutoPlaying(true)}
                    >
                        <AnimatePresence mode='popLayout'>
                            {filteredItems.map((item, index) => {
                                const styles = getItemStyles(index);
                                // Only render if visible to save resources, though we set display: none in styles too
                                if (styles.opacity === 0) return null;

                                const isActive = index === activeIndex;

                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={false}
                                        animate={styles}
                                        transition={{ duration: 0.5, ease: "easeInOut" }}
                                        className={`absolute w-[280px] md:w-[400px] lg:w-[600px] aspect-[4/3] rounded-3xl shadow-2xl overflow-hidden bg-slate-900 ${isActive ? 'cursor-default' : 'cursor-pointer'
                                            }`}
                                        onClick={() => !isActive && setActiveIndex(index)}
                                    >
                                        <div className="relative w-full h-full group">
                                            {/* Media Content */}
                                            {item.videoUrl && isActive ? (
                                                <video
                                                    src={item.videoUrl}
                                                    className="w-full h-full object-cover"
                                                    autoPlay
                                                    muted
                                                    loop
                                                    playsInline
                                                />
                                            ) : (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            )}

                                            {/* Overlay (always visible on inactive, hover/active styled) */}
                                            <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                                                }`}>
                                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform transition-transform duration-300">
                                                    <span className="inline-block px-3 py-1 bg-accent/90 text-white text-xs font-bold rounded-full mb-3 shadow-sm">
                                                        {item.category}
                                                    </span>
                                                    <h3 className="text-white text-2xl md:text-3xl font-bold mb-2">
                                                        {item.title}
                                                    </h3>

                                                    {/* Play Icon if video available but not active/playing yet (though we auto play active) */}
                                                    {item.videoUrl && !isActive && (
                                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[200%]">
                                                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                                                                <Play className="w-6 h-6 text-white fill-white" />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {/* Navigation Controls */}
                <div className="flex items-center justify-center gap-6">
                    <button
                        onClick={handlePrev}
                        className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-300 group"
                        aria-label="Previous slide"
                    >
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={() => window.location.href = '/companies'}
                        className="px-8 py-4 bg-white border border-slate-200 text-navy font-semibold rounded-full hover:bg-navy hover:text-white hover:border-navy transition-all duration-300 flex items-center gap-2 group shadow-sm hover:shadow-lg"
                    >
                        {t('home.gallery.viewMore')}
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={handleNext}
                        className="w-14 h-14 rounded-full border border-slate-200 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-300 group"
                        aria-label="Next slide"
                    >
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Gallery;
