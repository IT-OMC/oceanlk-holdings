import { motion } from 'framer-motion';
import { oceanData } from '../data/mockData';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Gallery = () => {
    const { t } = useTranslation();
    const [showAll, setShowAll] = useState(false);
    const displayedImages = showAll ? oceanData.gallery : oceanData.gallery.slice(0, 4);

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-b from-white to-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-4">
                        {t('gallery.title')} <span className="text-accent">{t('gallery.titleAccent')}</span>
                    </h2>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                        {t('gallery.description')}
                    </p>
                </motion.div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {displayedImages.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                        >
                            {/* Image */}
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-6">
                                    <span className="inline-block px-3 py-1 bg-accent/20 text-accent text-xs font-semibold rounded-full mb-2 backdrop-blur-sm">
                                        {item.category}
                                    </span>
                                    <h3 className="text-white font-semibold text-lg">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* See More Button */}
                {!showAll && oceanData.gallery.length > 4 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <button
                            onClick={() => setShowAll(true)}
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-semibold rounded-full hover:bg-accent/90 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/20"
                        >
                            <span>{t('gallery.seeMore')}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                )}

                {/* Show Less Button */}
                {showAll && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <button
                            onClick={() => setShowAll(false)}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-200 text-navy font-semibold rounded-full hover:bg-slate-300 transition-all duration-300 hover:scale-105"
                        >
                            <span>{t('gallery.showLess')}</span>
                        </button>
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default Gallery;
