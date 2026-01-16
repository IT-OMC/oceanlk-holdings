import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import NewsHero from '../../components/news/NewsHero';
import NewsCTA from '../../components/news/NewsCTA';
import Navbar from '../../components/Navbar';

const newsArticles = [
    {
        id: 'expansion-announcement',
        title: 'OceanLK Announces Major Expansion into Southeast Asia',
        excerpt: 'Strategic move to strengthen regional presence and diversify operations.',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
        date: 'January 11, 2026',
        category: 'Corporate'
    },
    {
        id: 'awards-2025',
        title: 'OceanLK Marine Receives Environmental Excellence Award',
        excerpt: 'Recognition for outstanding commitment to sustainable maritime practices.',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=800&auto=format&fit=crop',
        date: 'January 9, 2026',
        category: 'Awards'
    },
    {
        id: 'new-resort',
        title: 'OceanLK Leisure Opens Luxury Resort in Mirissa',
        excerpt: 'State-of-the-art beachfront property sets new standards in island hospitality.',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=800&auto=format&fit=crop',
        date: 'January 7, 2026',
        category: 'Hospitality'
    },
    {
        id: 'energy-milestone',
        title: '250MW Renewable Energy Milestone Achieved',
        excerpt: 'OceanLK Energy reaches significant capacity milestone ahead of schedule.',
        image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop',
        date: 'January 4, 2026',
        category: 'Energy'
    },
    {
        id: 'partnership',
        title: 'Strategic Partnership with Global Tech Leader',
        excerpt: 'OceanLK Tech partners with international firm for digital innovation.',
        image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=800&auto=format&fit=crop',
        date: 'January 2, 2026',
        category: 'Technology'
    }
];

const News = () => {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <Navbar />

            <NewsHero />

            {/* Articles Section */}
            <section className="py-20 px-4 md:px-6 w-full max-w-[95%] mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 mb-2">Latest News</h2>
                        <p className="text-gray-500">Stay updated with our latest announcements and achievements.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newsArticles.map((article, index) => (
                        <motion.div
                            key={article.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                        >
                            <Link to={`/news/articles/${article.id}`}>
                                <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group h-full flex flex-col">
                                    <div className="h-56 overflow-hidden relative">
                                        <img
                                            src={article.image}
                                            alt={article.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                                            <Calendar className="w-4 h-4" />
                                            {article.date}
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 mb-4 flex-1">{article.excerpt}</p>
                                        <span className="text-blue-600 flex items-center gap-2 font-semibold text-sm">
                                            Read Full Article
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            <NewsCTA />
        </div>
    );
};

export default News;
