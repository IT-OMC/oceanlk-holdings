'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Calendar, Play, Image as ImageIcon, FileText, ArrowUpRight } from 'lucide-react';

import { getMediaUrl } from '../../utils/api';
import { MediaImage, MediaVideo } from '../../components/MediaThumbnail';
import { MediaCard, MediaCardModal, type MediaCardData } from '../../components/ExpandableMediaCard';

export interface MediaItem {
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

const Media = ({ mediaItems }: { mediaItems: MediaItem[] }) => {
    const [activeTab, setActiveTab] = useState('all');
    // Only one card (image / video / album) can be expanded at a time — this id
    // drives the shared layoutId morph between the grid tile and the modal.
    const [activeCardId, setActiveCardId] = useState<string | null>(null);

    const filteredItems = mediaItems.filter(item => {
        if (activeTab === 'all') return true;
        // Images tab: Show items explicitly marked as IMAGE, OR items marked as GALLERY but with <= 1 photo (handling miscategorized singles)
        if (activeTab === 'images') return item.type === 'IMAGE' || (item.type === 'GALLERY' && (!item.photoCount || item.photoCount <= 1));
        if (activeTab === 'videos') return item.type === 'VIDEO';
        // Albums tab: Show items marked as ALBUM, or GALLERY with > 1 photo
        if (activeTab === 'albums') return item.type === 'ALBUM' || (item.type === 'GALLERY' && (item.photoCount && item.photoCount > 1));
        if (activeTab === 'documents') return item.type === 'DOCUMENT';
        return true;
    });

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

    const getCardMedia = (item: MediaItem) => {
        const isDocument = item.type === 'DOCUMENT';
        const displayImageUrl = isDocument && item.videoUrl ? item.videoUrl : item.imageUrl;
        const videoSrc = !isDocument && (item.videoUrl || (item.imageUrl && /\.(mp4|webm|ogg)$/i.test(item.imageUrl) ? item.imageUrl : null));
        const isActuallyVideo = !isDocument && (item.type === 'VIDEO' || !!videoSrc);

        if (isActuallyVideo && videoSrc) return <MediaVideo src={getMediaUrl(videoSrc)} />;
        if (displayImageUrl) return <MediaImage src={getMediaUrl(displayImageUrl)} alt={item.title} />;
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <Play className="w-12 h-12 text-gray-300" />
            </div>
        );
    };

    // Looked up from the full (unfiltered) list so switching tabs while a
    // card is expanded doesn't strand the modal on a filtered-out item.
    const activeItem = activeCardId ? mediaItems.find((item) => item.id === activeCardId) ?? null : null;

    // Assign grid spans for variety (2 large, rest standard)
    const getGridSpan = (index: number) => {
        if (index === 0) return 'md:col-span-2 md:row-span-2';
        if (index === 1) return 'md:col-span-1 md:row-span-2';
        return 'md:col-span-1 md:row-span-1';
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">

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

                            // For documents, check if cover image exists in videoUrl
                            const isDocument = item.type === 'DOCUMENT';
                            const displayImageUrl = isDocument && item.videoUrl ? item.videoUrl : item.imageUrl;

                            const dateLabel = new Date(item.publishedDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            });

                            // Documents open the existing full detail page — the App
                            // Store-style expand/morph interaction below is only for
                            // images, videos, and albums per the design spec.
                            if (isDocument) {
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
                                        <Link href={`/news/media/${item.id}`} className="block h-full w-full">
                                            {displayImageUrl ? (
                                                <MediaImage
                                                    src={getMediaUrl(displayImageUrl)}
                                                    alt={item.title}
                                                    className="group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                                                    <FileText className="w-12 h-12 text-gray-300" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

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

                                            <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                                                <div className="flex items-center gap-2 text-sm text-gray-300 mb-3 font-medium">
                                                    <Calendar className="w-4 h-4" />
                                                    {dateLabel}
                                                </div>

                                                <h3 className={`font-bold mb-3 leading-tight ${span.includes('col-span-2') ? 'text-3xl' : 'text-xl'}`}>
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
                            }

                            const cardData: MediaCardData = {
                                id: item.id,
                                category: item.type || 'Media',
                                title: item.title,
                                description: item.description,
                                dateLabel,
                                mediaTypeLabel: getMediaTypeLabel(item),
                                typeIcon: getMediaIcon(item.type),
                                detailHref: `/news/media/${item.id}`,
                                media: getCardMedia(item),
                                span,
                                isLarge,
                            };

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className={span}
                                >
                                    <MediaCard data={cardData} onOpen={(d) => setActiveCardId(d.id)} />
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

                <AnimatePresence>
                    {activeItem && (
                        <MediaCardModal
                            data={{
                                id: activeItem.id,
                                category: activeItem.type || 'Media',
                                title: activeItem.title,
                                description: activeItem.description,
                                dateLabel: new Date(activeItem.publishedDate).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                }),
                                mediaTypeLabel: getMediaTypeLabel(activeItem),
                                typeIcon: getMediaIcon(activeItem.type),
                                detailHref: `/news/media/${activeItem.id}`,
                                media: getCardMedia(activeItem),
                            }}
                            onClose={() => setActiveCardId(null)}
                        />
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default Media;
