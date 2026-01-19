import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, ArrowUpRight } from 'lucide-react';

import Navbar from '../../components/Navbar';

const newsArticles = [
    {
        id: 'expansion-announcement',
        title: 'OceanLK Announces Major Expansion into Southeast Asia',
        excerpt: 'Strategic move to strengthen regional presence and diversify operations.',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
        date: 'January 11, 2026',
        category: 'Corporate',
        span: 'md:col-span-2 md:row-span-2'
    },
    {
        id: 'awards-2025',
        title: 'Environmental Excellence Award',
        excerpt: 'Recognition for sustainable maritime practices.',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=800&auto=format&fit=crop',
        date: 'January 9, 2026',
        category: 'Awards',
        span: 'md:col-span-1 md:row-span-2'
    },
    {
        id: 'new-resort',
        title: 'Luxury Resort in Mirissa',
        excerpt: 'New standards in island hospitality.',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop',
        date: 'January 7, 2026',
        category: 'Hospitality',
        span: 'md:col-span-1 md:row-span-1'
    },
    {
        id: 'energy-milestone',
        title: '250MW Renewable Energy',
        excerpt: 'Significant capacity milestone achieved.',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
        date: 'January 4, 2026',
        category: 'Energy',
        span: 'md:col-span-1 md:row-span-1'
    },
    {
        id: 'partnership',
        title: 'Strategic Tech Partnership',
        excerpt: 'OceanLK Tech partners for digital innovation.',
        image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop',
        date: 'January 2, 2026',
        category: 'Technology',
        span: 'md:col-span-2 md:row-span-1' // Adjusted to fill nicely if wanted, or keep standard
    }
];

const News = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />

            <section className="pt-32 pb-8 px-4 md:px-6 w-full max-w-[95%] mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest News</h2>
                        <p className="text-gray-500">Stay updated with our latest announcements and achievements.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
                    {newsArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`${article.span} group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100/50`}
                        >
                            <Link to={`/news/articles/${article.id}`} className="block h-full w-full">
                                {/* Use different layouts based on span */}
                                {article.span?.includes('row-span-2') ? (
                                    // Vertical or Large Cards (Full Background)
                                    <>
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url('${article.image}')` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                        <div className="absolute top-6 left-6">
                                            <span className="bg-blue-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {article.category}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                                            <div className="flex items-center gap-2 text-sm text-gray-300 mb-2 font-medium">
                                                <Calendar className="w-4 h-4" />
                                                {article.date}
                                            </div>
                                            <h3 className={`font-bold mb-2 leading-tight ${article.span.includes('col-span-2') ? 'text-3xl' : 'text-xl'}`}>
                                                {article.title}
                                            </h3>
                                            <p className="text-gray-200 text-sm line-clamp-2 mb-4 opacity-90">
                                                {article.excerpt}
                                            </p>
                                            <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-300 group-hover:text-blue-200 transition-colors">
                                                Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </>
                                ) : (
                                    // Standard Cards (Image Top or Left depending on space, simplified to Image Top here or Overlay for consistency)
                                    // Let's go with Overlay style for ALL for that premium "Culture" look, 
                                    // OR split style. The culture page mixes them. 
                                    // Let's try mixed: 
                                    // If standard card, maybe image top?
                                    // Actually, fully immersive cards (overlay) look best for 'Redesign with best UX'. 
                                    // Let's stick to full overlay for consistency and premium feel, 
                                    // but maybe lighter gradient for smaller cards? 
                                    // No, let's keep the dark gradient overlay for text readability on images.
                                    <>
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                            style={{ backgroundImage: `url('${article.image}')` }}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/20 backdrop-blur-md border border-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                                                {article.category}
                                            </span>
                                        </div>
                                        <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                                            <div className="flex items-center gap-2 text-[10px] text-gray-300 mb-1">
                                                <Calendar className="w-3 h-3" />
                                                {article.date}
                                            </div>
                                            <h3 className="text-lg font-bold mb-1 leading-snug">
                                                {article.title}
                                            </h3>
                                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </>
                                )}
                            </Link>
                        </motion.div>
                    ))}

                    {/* Decorator / Extra Link Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="md:col-span-1 md:row-span-1 bg-gray-50 rounded-3xl p-6 flex flex-col justify-center items-center text-center border border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-colors group cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                            <ArrowRight className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900">View Archive</h3>
                        <p className="text-xs text-gray-500 mt-1">Explore older news</p>
                    </motion.div>
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
                        <p className="text-sm text-gray-400 mb-6 relative z-10">Get the latest insights directly to your inbox.</p>
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

export default News;
