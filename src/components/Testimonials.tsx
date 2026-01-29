import { motion } from 'framer-motion';
import { Star, Twitter, Instagram, Facebook, ExternalLink, Quote, ThumbsUp, MessageCircle, Share2 } from 'lucide-react';

// Mock Data for Social Media Integration
const socialReviews = [
    {
        id: 1,
        platform: 'google',
        author: 'David Chen',
        handle: 'CEO, TechFlow',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
        content: "Ocean Ceylon Holdings transformed our logistics supply chain. Their technological integration is miles ahead of the competition. Highly recommended for scalable solutions!",
        rating: 5,
        date: '2 days ago',
        link: '#',
        size: 'col-span-1 md:col-span-2 row-span-1',
        stats: { likes: 124, comments: 12 }
    },
    {
        id: 2,
        platform: 'twitter',
        author: 'Sarah Jenkins',
        handle: '@sarahj_tech',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
        content: "Just toured the new Ocean Hospitality resort in Maldives. Absolutely stunning architecture and sustainability focus! 🌿🌊 #SustainableTourism #OceanLK",
        date: '5h ago',
        link: '#',
        size: 'col-span-1 row-span-1',
        stats: { likes: 856, retweets: 45 }
    },
    {
        id: 3,
        platform: 'instagram',
        author: 'Life of Alex',
        handle: '@alex_travels',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600',
        content: "Partnering with Ocean Tech has been a game changer for our startup. 🚀 Fast, reliable, and visionary.",
        date: '1 week ago',
        link: '#',
        size: 'col-span-1 row-span-2',
        stats: { likes: '2.4k', comments: 142 }
    },
    {
        id: 4,
        platform: 'facebook',
        author: 'Michael Ross',
        handle: 'Director, Ross Exports',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
        content: "We've been working with Ocean Ceylon for over 5 years. Their dedication to integrity and excellence is unmatched in the region. Proud to be a partner.",
        date: '3 days ago',
        link: '#',
        size: 'col-span-1 md:col-span-2 row-span-1',
        stats: { likes: 45, comments: 8, shares: 2 }
    },
    {
        id: 5,
        platform: 'google',
        author: 'Emily White',
        handle: 'VP Operations',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
        content: "Exceptional service quality and transparent communication throughout our project lifecycle.",
        rating: 5,
        date: '1 day ago',
        link: '#',
        size: 'col-span-1 row-span-1',
        stats: { likes: 89, comments: 5 }
    }
];

const PlatformIcon = ({ platform }: { platform: string }) => {
    switch (platform) {
        case 'twitter': return <Twitter className="w-5 h-5 text-sky-400" fill="currentColor" />;
        case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" fill="currentColor" />;
        case 'instagram': return <Instagram className="w-5 h-5 text-pink-500" />;
        case 'google': return (
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-white">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="G" className="w-3 h-3" />
            </div>
        );
        default: return <Quote className="w-5 h-5 text-accent" />;
    }
};

const Testimonials = () => {
    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[120px]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                        Voices from the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Network</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        See what our partners and clients say across the digital ecosystem.
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]">
                    {socialReviews.map((item, index) => (
                        <motion.a
                            key={item.id}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.01 }}
                            className={`group relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition-all duration-300 ${item.size} flex flex-col`}
                        >
                            {/* Card Glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                            <div className="relative flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={item.avatar} alt={item.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
                                    <div>
                                        <h4 className="text-white font-semibold text-sm leading-tight">{item.author}</h4>
                                        <p className="text-slate-500 text-xs">{item.handle}</p>
                                    </div>
                                </div>
                                <div className="p-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/5 group-hover:bg-white/10">
                                    <PlatformIcon platform={item.platform} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-grow">
                                {item.rating && (
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                )}
                                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                                    {item.content}
                                </p>
                                {item.image && (
                                    <div className="mb-4 rounded-xl overflow-hidden h-48 border border-white/5">
                                        <img src={item.image} alt="Post" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                            </div>

                            {/* Footer Stats */}
                            <div className="relative pt-4 border-t border-white/5 flex items-center justify-between text-xs text-slate-500">
                                <span>{item.date}</span>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                                        <ThumbsUp className="w-3.5 h-3.5" />
                                        <span>{item.stats?.likes}</span>
                                    </div>
                                    <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                                        <MessageCircle className="w-3.5 h-3.5" />
                                        <span>{item.stats?.comments}</span>
                                    </div>
                                    {item.stats?.shares && (
                                        <div className="flex items-center gap-1 hover:text-cyan-400 transition-colors">
                                            <Share2 className="w-3.5 h-3.5" />
                                            <span>{item.stats?.shares}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <ExternalLink className="absolute bottom-6 right-6 w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
                        </motion.a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
