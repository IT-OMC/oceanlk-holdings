
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowUpRight, BookOpen, Loader } from 'lucide-react';

import Navbar from '../../components/Navbar';
import { API_ENDPOINTS } from '../../utils/api';

interface BlogPost {
    id: string;
    title: string;
    description: string;
    excerpt?: string;
    imageUrl: string;
    author?: string;
    publishedDate: string;
    category: string;
    readTime?: string;
    span?: string;
}

const Blogs = () => {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(async () => {
        try {
            const response = await fetch(API_ENDPOINTS.MEDIA_BLOGS);
            if (response.ok) {
                const data = await response.json();
                // Map and assign spans for layout variety
                const mappedData = data.map((item: any, index: number) => ({
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    excerpt: item.excerpt || item.description, // Use excerpt or fallback to description
                    imageUrl: item.imageUrl,
                    author: item.author || 'OceanLK Team',
                    publishedDate: new Date(item.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    category: item.category,
                    readTime: item.readTime || '5 min read',
                    span: getGridSpan(index)
                }));
                setBlogPosts(mappedData);
            } else {
                setError('Failed to fetch blog posts');
            }
        } catch (error) {
            console.error('Error fetching blogs:', error);
            setError('Failed to load blog posts');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    const getGridSpan = (index: number) => {
        // Pattern: Big, Small, Small, Small...
        if (index === 0) return 'md:col-span-2 md:row-span-2';
        if (index === 1) return 'md:col-span-1 md:row-span-2';
        return 'md:col-span-1 md:row-span-1';
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white text-gray-900 font-sans">
                <Navbar />
                <div className="flex items-center justify-center h-screen">
                    <Loader className="animate-spin text-cyan-500" size={48} />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white text-gray-900 font-sans">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-screen">
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    <button
                        onClick={fetchBlogs}
                        className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
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
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Our Blog</h2>
                        <p className="text-gray-500">Insights, stories, and perspectives from across the OceanLK group.</p>
                    </div>
                </div>

                {blogPosts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No blog posts available at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
                        {blogPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                                className={`${post.span} group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white border border-gray-100/50`}
                            >
                                <Link to={`/news/blogs/${post.id}`} className="block h-full w-full">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url('${post.imageUrl}')` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                                    <div className="absolute top-6 left-6 flex items-center gap-2">
                                        <span className="bg-cyan-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            {post.category}
                                        </span>
                                        <span className="bg-black/40 backdrop-blur-sm text-gray-200 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                            <BookOpen className="w-3 h-3" /> {post.readTime}
                                        </span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 p-8 text-white w-full">
                                        <div className="flex items-center gap-3 text-sm text-gray-300 mb-3 font-medium">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {post.publishedDate}
                                            </div>
                                            <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {post.author}
                                            </div>
                                        </div>

                                        <h3 className={`font-bold mb-3 leading-tight ${post.span?.includes('col-span-2') ? 'text-3xl' : 'text-xl'}`}>
                                            {post.title}
                                        </h3>

                                        {post.span?.includes('row-span-2') && (
                                            <p className="text-gray-200 text-sm line-clamp-2 mb-4 opacity-90">
                                                {post.excerpt}
                                            </p>
                                        )}

                                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center absolute bottom-8 right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 text-white">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}

                        {/* Newsletter Subscription Card */}
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="md:col-span-1 md:row-span-1 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 flex flex-col justify-center text-white relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-3 opacity-10">
                                <BookOpen size={100} />
                            </div>
                            <h3 className="font-bold text-xl mb-2 relative z-10">Subscribe</h3>
                            <p className="text-xs text-gray-400 mb-4 relative z-10">Get the latest insights directly to your inbox.</p>
                            <div className="relative z-10">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-3 py-2 text-sm mb-2 focus:outline-none focus:bg-white/20 transition-colors placeholder:text-gray-500"
                                />
                                <button className="w-full bg-cyan-500 text-white text-xs font-bold py-2 rounded-xl hover:bg-cyan-400 transition-colors">
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

export default Blogs;
