import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader, Download } from 'lucide-react';
import { API_ENDPOINTS } from '../../utils/api';

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
    author?: string;
}

const MediaSingle = () => {
    const { id } = useParams<{ id: string }>();
    const [media, setMedia] = useState<MediaItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMediaItem = useCallback(async (mediaId: string) => {
        try {
            setIsLoading(true);
            const response = await fetch(API_ENDPOINTS.MEDIA_SINGLE(mediaId));
            if (response.ok) {
                const data = await response.json();
                setMedia(data);
            } else {
                setError('Media item not found');
            }
        } catch (error) {
            console.error('Error fetching media item:', error);
            setError('Failed to load media item');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchMediaItem(id);
        }
    }, [id, fetchMediaItem]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader className="animate-spin text-blue-500" size={48} />
            </div>
        );
    }

    if (error || !media) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Media Not Found</h1>
                    <Link to="/news/media" className="text-blue-500 hover:underline">
                        Back to Media Center
                    </Link>
                </div>
            </div>
        );
    }

    // Determine type for correct rendering
    const isVideo = media.type === 'VIDEO' || !!media.videoUrl;
    const isGallery = media.type === 'GALLERY' || media.type === 'ALBUM';
    const isDocument = media.type === 'DOCUMENT';

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <div className="pt-24 pb-8 px-4 md:px-6 w-full max-w-[95%] mx-auto">
                <Link to="/news/media" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-all mb-8">
                    <ArrowLeft className="w-5 h-5" />
                    Back to Media Center
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-6xl mx-auto"
                >
                    <div className="mb-10 text-center">
                        <span className="bg-purple-100 text-purple-600 px-4 py-1.5 rounded-full text-sm font-bold inline-block mb-6 uppercase tracking-wider">
                            {media.type || media.category}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">{media.title}</h1>
                        <p className="text-gray-500">{new Date(media.publishedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    {/* Video Player */}
                    {isVideo && (
                        <div className="bg-black rounded-3xl overflow-hidden aspect-video shadow-2xl mb-12 relative group">
                            {media.videoUrl ? (
                                <video
                                    src={media.videoUrl}
                                    controls
                                    className="w-full h-full object-contain"
                                    poster={media.imageUrl}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <p className="text-white">Video unavailable</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Gallery Grid */}
                    {isGallery && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {/* Display main image first if it's not in galleryImages, or just map galleryImages */}
                            {media.galleryImages && media.galleryImages.length > 0 ? (
                                media.galleryImages.map((image, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer"
                                        onClick={() => window.open(image, '_blank')}
                                    >
                                        <img
                                            src={image}
                                            alt={`${media.title} - ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                    </motion.div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10">
                                    <img src={media.imageUrl} alt={media.title} className="max-w-4xl mx-auto rounded-3xl shadow-xl" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Document View */}
                    {isDocument && (
                        <div className="bg-gray-50 border border-gray-200 rounded-3xl p-10 mb-12 text-center">
                            <div className="mb-8">
                                <img
                                    src={media.imageUrl}
                                    alt={media.title}
                                    className="h-64 mx-auto rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-500"
                                />
                            </div>
                            <p className="text-gray-500 mb-6">{media.pageCount ? `${media.pageCount} pages` : 'Document'}</p>
                            {media.videoUrl && (
                                <a
                                    href={media.videoUrl}
                                    download
                                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                >
                                    <Download className="w-5 h-5" />
                                    Download Document
                                </a>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    <div className="max-w-4xl mx-auto prose prose-lg text-gray-600">
                        <p className="text-xl leading-relaxed">{media.description}</p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MediaSingle;
