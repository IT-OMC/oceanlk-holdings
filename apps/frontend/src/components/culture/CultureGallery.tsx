import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { API_ENDPOINTS } from '../../utils/api';

interface MediaItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

const CultureGallery = () => {
    const [images, setImages] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(10); // Start with 10 images

    useEffect(() => {
        fetchGalleryImages();
    }, []);

    const fetchGalleryImages = async () => {
        try {
            // Fetch both GALLERY and LIFE_AT_OCH categories
            const [galleryRes, lifeRes] = await Promise.all([
                fetch(`${API_ENDPOINTS.MEDIA}?category=GALLERY`),
                fetch(`${API_ENDPOINTS.MEDIA}?category=LIFE_AT_OCH`)
            ]);

            let allImages: MediaItem[] = [];

            if (galleryRes.ok) {
                const galleryData = await galleryRes.json();
                allImages = [...allImages, ...galleryData];
            }
            if (lifeRes.ok) {
                const lifeData = await lifeRes.json();
                allImages = [...allImages, ...lifeData];
            }

            // Remove duplicates if any (based on ID)
            const uniqueImages = Array.from(new Map(allImages.map(item => [item.id, item])).values());
            setImages(uniqueImages);

        } catch (error) {
            console.error('Failed to fetch gallery images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleShowMore = () => {
        setVisibleCount(prev => prev + 10);
    };

    // Assign different span classes for variety
    const getSpanClass = (index: number) => {
        const patterns = [
            'col-span-1 md:col-span-2 row-span-2',
            'col-span-1 md:col-span-1 row-span-1',
            'col-span-1 md:col-span-1 row-span-1',
            'col-span-1 md:col-span-1 row-span-2',
            'col-span-1 md:col-span-1 row-span-1',
            'col-span-1 md:col-span-2 row-span-1',
        ];
        return patterns[index % patterns.length];
    };

    if (loading) {
        return (
            <section className="pt-8 pb-20 px-4 md:px-6 max-w-[95%] mx-auto mt-[10px]">
                <div className="text-center py-12 text-gray-500">
                    <p>Loading gallery...</p>
                </div>
            </section>
        );
    }

    if (images.length === 0) {
        return (
            <section className="pt-8 pb-20 px-4 md:px-6 max-w-[95%] mx-auto mt-[10px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4 text-gray-900">Captured Moments</h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                        A glimpse into the daily life, celebrations, and collaborative spirit that defines our culture.
                    </p>
                </motion.div>
                <div className="text-center py-12 text-gray-500">
                    <p>No gallery images available yet.</p>
                </div>
            </section>
        );
    }

    const visibleImages = images.slice(0, visibleCount);

    return (
        <section className="pt-8 pb-20 px-4 md:px-6 max-w-[95%] mx-auto mt-[10px]">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
            >
                <h2 className="text-4xl font-bold mb-4 text-gray-900">Captured Moments</h2>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    A glimpse into the daily life, celebrations, and collaborative spirit that defines our culture.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-4 auto-rows-[200px] gap-4 mb-12">
                {visibleImages.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className={`relative rounded-2xl overflow-hidden group ${getSpanClass(index)}`}
                    >
                        <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                            <span className="text-white font-medium text-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                {item.title}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Show More Button */}
            {/* Show More / Show Less Button */}
            {images.length > 10 && (
                <div className="flex justify-center">
                    <button
                        onClick={visibleCount >= images.length ? () => setVisibleCount(10) : handleShowMore}
                        className="px-8 py-3 bg-white border border-gray-200 text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        {visibleCount >= images.length ? 'Show Less' : 'Show More'}
                    </button>
                </div>
            )}
        </section>
    );
};

export default CultureGallery;
