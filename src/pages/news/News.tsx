import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { Calendar, ArrowRight } from 'lucide-react';

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
        <div className="min-h-screen">
            <SectionWrapper id="news" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">Latest News</h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                        Stay updated with the latest developments, announcements, and achievements
                        from across the OceanLK group.
                    </p>

                    <div className="space-y-6">
                        {newsArticles.map((article, index) => (
                            <motion.div
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link to={`/news/articles/${article.id}`}>
                                    <div className="glass rounded-xl overflow-hidden hover:scale-[1.01] transition-transform group">
                                        <div className="flex flex-col md:flex-row gap-6">
                                            <div className="md:w-1/3 h-64 md:h-auto overflow-hidden">
                                                <img
                                                    src={article.image}
                                                    alt={article.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="flex-1 p-6 md:py-8">
                                                <div className="flex items-center gap-4 mb-4">
                                                    <span className="bg-accent px-3 py-1 rounded-full text-sm font-semibold">
                                                        {article.category}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                                        <Calendar className="w-4 h-4" />
                                                        {article.date}
                                                    </div>
                                                </div>
                                                <h3 className="text-3xl font-bold mb-3 group-hover:text-accent transition-colors">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-300 text-lg mb-4">{article.excerpt}</p>
                                                <span className="text-accent flex items-center gap-2 font-semibold">
                                                    Read Full Article
                                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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

export default News;
