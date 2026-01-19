import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowUpRight, BookOpen } from 'lucide-react';

import Navbar from '../../components/Navbar';

const blogPosts = [
    {
        id: 'sustainable-shipping',
        title: 'The Future of Sustainable Shipping',
        excerpt: 'Exploring how OceanLK Marine is pioneering eco-friendly maritime solutions.',
        image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?q=80&w=800&auto=format&fit=crop',
        author: 'Sarah Johnson',
        date: 'January 10, 2026',
        category: 'Maritime',
        readTime: '5 min read',
        span: 'md:col-span-2 md:row-span-2'
    },
    {
        id: 'tourism-trends',
        title: '2026 Tourism Trends in Sri Lanka',
        excerpt: 'Insights into the evolving landscape of hospitality.',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop',
        author: 'Michael Chen',
        date: 'January 8, 2026',
        category: 'Hospitality',
        readTime: '4 min read',
        span: 'md:col-span-1 md:row-span-2'
    },
    {
        id: 'renewable-energy',
        title: 'Renewable Energy: Our Commitment',
        excerpt: 'Contributing to a sustainable future.',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop',
        author: 'David Kumar',
        date: 'January 5, 2026',
        category: 'Energy',
        readTime: '6 min read',
        span: 'md:col-span-1 md:row-span-1'
    },
    {
        id: 'digital-transformation',
        title: 'Digital Transformation in Traditional Industries',
        excerpt: 'Leveraging technology to revolutionize business.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
        author: 'Emily Watson',
        date: 'January 3, 2026',
        category: 'Technology',
        readTime: '7 min read',
        span: 'md:col-span-1 md:row-span-1'
    }
];

const Blogs = () => {
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
                                    style={{ backgroundImage: `url('${post.image}')` }}
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
                                            {post.date}
                                        </div>
                                        <div className="w-1 h-1 bg-gray-500 rounded-full" />
                                        <div className="flex items-center gap-1">
                                            <User className="w-3 h-3" />
                                            {post.author}
                                        </div>
                                    </div>

                                    <h3 className={`font-bold mb-3 leading-tight ${post.span.includes('col-span-2') ? 'text-3xl' : 'text-xl'}`}>
                                        {post.title}
                                    </h3>

                                    {post.span.includes('row-span-2') && (
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
            </section>


        </div>
    );
};

export default Blogs;
