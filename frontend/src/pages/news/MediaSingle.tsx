import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowLeft, Play, Download } from 'lucide-react';

const mediaData: Record<string, any> = {
    'ceo-interview': {
        title: 'CEO Interview: Vision for 2026',
        type: 'video',
        date: 'January 10, 2026',
        description: 'Chairman & CEO Rajesh Fernando shares insights on OceanLK\'s strategic direction for 2026 and beyond.',
        thumbnail: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=2537&auto=format&fit=crop',
        videoUrl: 'https://example.com/video.mp4',
        duration: '12:45'
    },
    'resort-gallery': {
        title: 'New Mirissa Resort Photo Gallery',
        type: 'gallery',
        date: 'January 8, 2026',
        description: 'Explore our newest beachfront property through this stunning photo collection.',
        images: [
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800'
        ],
        count: '24 photos'
    },
    'annual-report': {
        title: 'Annual Report 2025',
        type: 'document',
        date: 'January 5, 2026',
        description: 'Comprehensive overview of OceanLK\'s financial performance and strategic initiatives for 2025.',
        thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2537&auto=format&fit=crop',
        downloadUrl: '/documents/annual-report-2025.pdf',
        pages: '48 pages'
    }
};

const MediaSingle = () => {
    const { id } = useParams<{ id: string }>();
    const media = id ? mediaData[id] : null;

    if (!media) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Media Not Found</h1>
                    <Link to="/news/media" className="text-accent hover:underline">
                        Back to Media Center
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <SectionWrapper className="pt-32 pb-20">
                <div className="max-w-6xl mx-auto">
                    <Link to="/news/media" className="inline-flex items-center gap-2 text-accent mb-6 hover:gap-3 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Media Center
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-8">
                            <span className="bg-accent px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4 capitalize">
                                {media.type}
                            </span>
                            <h1 className="text-5xl font-bold mb-4">{media.title}</h1>
                            <p className="text-xl text-gray-300 mb-2">{media.description}</p>
                            <p className="text-gray-400">{media.date}</p>
                        </div>

                        {media.type === 'video' && (
                            <div className="glass rounded-xl overflow-hidden p-4 mb-8">
                                <div className="relative aspect-video bg-primary-light rounded-lg overflow-hidden flex items-center justify-center">
                                    <img
                                        src={media.thumbnail}
                                        alt={media.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <button className="absolute inset-0 flex items-center justify-center bg-primary/50 hover:bg-primary/30 transition-colors">
                                        <div className="bg-accent w-20 h-20 rounded-full flex items-center justify-center">
                                            <Play className="w-10 h-10 text-white ml-1" />
                                        </div>
                                    </button>
                                </div>
                                <div className="mt-4 text-center text-gray-400">
                                    Duration: {media.duration}
                                </div>
                            </div>
                        )}

                        {media.type === 'gallery' && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                                {media.images.map((image: string, index: number) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        className="glass rounded-xl overflow-hidden hover:scale-105 transition-transform"
                                    >
                                        <img
                                            src={image}
                                            alt={`Gallery image ${index + 1}`}
                                            className="w-full h-64 object-cover"
                                        />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {media.type === 'document' && (
                            <div className="glass rounded-xl p-8 mb-8">
                                <div className="flex items-center justify-center mb-8">
                                    <img
                                        src={media.thumbnail}
                                        alt={media.title}
                                        className="max-w-md rounded-lg shadow-2xl"
                                    />
                                </div>
                                <div className="text-center">
                                    <p className="text-gray-400 mb-6">{media.pages}</p>
                                    <button className="bg-accent text-white px-8 py-4 rounded-md font-semibold flex items-center gap-2 hover:bg-accent/90 transition-all mx-auto">
                                        <Download className="w-5 h-5" />
                                        Download PDF
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default MediaSingle;
