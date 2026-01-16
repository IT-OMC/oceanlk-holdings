import { motion } from 'framer-motion';
import { oceanData } from '../data/mockData';
import { Instagram, Heart, Calendar } from 'lucide-react';

const LatestUpdates = () => {
    // Format date to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    // Format likes count (e.g., 1.2k)
    const formatLikes = (count: number) => {
        if (count >= 1000) {
            return `${(count / 1000).toFixed(1)}k`;
        }
        return count.toString();
    };

    return (
        <section className="py-20 lg:py-32 bg-gradient-to-b from-navy to-navy/95 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Animated Gradient Orbs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />

            {/* Instagram Gradient Definition */}
            <svg width="0" height="0" className="absolute">
                <linearGradient id="instagram-gradient" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop stopColor="#833AB4" offset="0%" />
                    <stop stopColor="#FD1D1D" offset="50%" />
                    <stop stopColor="#FCAF45" offset="100%" />
                </linearGradient>
            </svg>

            <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Instagram className="w-8 h-8" style={{ stroke: 'url(#instagram-gradient)' }} />
                        <h2 className="text-4xl lg:text-5xl font-bold text-white">
                            Latest <span className="text-accent">Updates</span>
                        </h2>
                    </div>
                    <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                        Stay connected with the latest from our subsidiary companies
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 auto-rows-[280px]">
                    {oceanData.instagramUpdates.map((post, index) => {
                        // Determine grid span based on size
                        const sizeClasses = {
                            large: 'md:col-span-2 md:row-span-2',
                            medium: 'md:col-span-1 md:row-span-2',
                            small: 'md:col-span-1 md:row-span-1'
                        };

                        return (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.05 }}
                                className={`${sizeClasses[post.size as keyof typeof sizeClasses]} group relative overflow-hidden rounded-2xl cursor-pointer`}
                            >
                                {/* Background Image */}
                                <div className="absolute inset-0">
                                    <img
                                        src={post.image}
                                        alt={post.companyName}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {/* Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-transparent opacity-90" />
                                </div>

                                {/* Content */}
                                <div className="relative h-full p-6 flex flex-col justify-between">
                                    {/* Company Logo & Name */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md p-1.5 ring-2 ring-white/20 group-hover:ring-accent/50 transition-all duration-300">
                                            <img
                                                src={post.companyLogo}
                                                alt={post.companyName}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <span className="text-white font-semibold text-sm truncate">
                                            {post.companyName}
                                        </span>
                                    </div>

                                    {/* Post Info */}
                                    <div className="space-y-3">
                                        {/* Caption */}
                                        <p className="text-slate-200 text-sm leading-relaxed line-clamp-2 group-hover:line-clamp-3 transition-all duration-300">
                                            {post.caption}
                                        </p>

                                        {/* Metadata */}
                                        <div className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-4">
                                                {/* Likes */}
                                                <div className="flex items-center gap-1.5 text-slate-300 group-hover:text-red-500 transition-colors">
                                                    <Heart className="w-4 h-4 fill-current" />
                                                    <span className="font-medium">{formatLikes(post.likes)}</span>
                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-1.5 text-slate-400">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{formatDate(post.date)}</span>
                                                </div>
                                            </div>

                                            {/* Instagram Icon */}
                                            <Instagram className="w-5 h-5 text-slate-400 transition-all group-hover:[stroke:url(#instagram-gradient)]" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Glow Effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                    <div className="absolute inset-0 ring-2 ring-accent/50 rounded-2xl" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Instagram CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <p className="text-slate-400 text-sm">
                        Follow us on Instagram for real-time updates from all our companies
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default LatestUpdates;
