import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogPosts = [
    {
        id: 'sustainable-shipping',
        title: 'The Future of Sustainable Shipping',
        excerpt: 'Exploring how OceanLK Marine is pioneering eco-friendly maritime solutions.',
        image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?q=80&w=800&auto=format&fit=crop',
        author: 'Sarah Johnson',
        date: 'January 10, 2026',
        category: 'Maritime',
        readTime: '5 min read'
    },
    {
        id: 'tourism-trends',
        title: '2026 Tourism Trends in Sri Lanka',
        excerpt: 'Insights into the evolving landscape of hospitality and tourism.',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop',
        author: 'Michael Chen',
        date: 'January 8, 2026',
        category: 'Hospitality',
        readTime: '4 min read'
    },
    {
        id: 'renewable-energy',
        title: 'Renewable Energy: Our Commitment',
        excerpt: 'How OceanLK Energy is contributing to a sustainable future.',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=800&auto=format&fit=crop',
        author: 'David Kumar',
        date: 'January 5, 2026',
        category: 'Energy',
        readTime: '6 min read'
    },
    {
        id: 'digital-transformation',
        title: 'Digital Transformation in Traditional Industries',
        excerpt: 'Leveraging technology to revolutionize established business models.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
        author: 'Emily Watson',
        date: 'January 3, 2026',
        category: 'Technology',
        readTime: '7 min read'
    }
];

const Blogs = () => {
    return (
        <div className="min-h-screen">
            <SectionWrapper id="blogs" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">Our Blog</h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                        Insights, stories, and perspectives from across the OceanLK group.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {blogPosts.map((post, index) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link to={`/news/blogs/${post.id}`}>
                                    <div className="glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform group">
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-4 left-4">
                                                <span className="bg-accent px-3 py-1 rounded-full text-sm font-semibold">
                                                    {post.category}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {post.date}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    {post.author}
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3 group-hover:text-accent transition-colors">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-300 mb-4">{post.excerpt}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-400">{post.readTime}</span>
                                                <span className="text-accent flex items-center gap-2 font-semibold">
                                                    Read More
                                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Blogs;
