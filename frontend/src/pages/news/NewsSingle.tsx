import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';

const newsData: Record<string, any> = {
    'expansion-announcement': {
        title: 'OceanLK Announces Major Expansion into Southeast Asia',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2537&auto=format&fit=crop',
        date: 'January 11, 2026',
        category: 'Corporate',
        content: `
            OceanLK Holdings today announced a strategic expansion into Southeast Asian markets, 
            marking a significant milestone in the company's regional growth strategy. The move 
            includes establishing operations in Singapore, Malaysia, and Thailand.

            "This expansion represents a natural evolution of our business," said Rajesh Fernando, 
            Chairman & CEO. "Southeast Asia offers tremendous opportunities for growth across all 
            our business sectors."

            The expansion will involve investments exceeding $200 million over the next three years, 
            creating over 500 new jobs across the region. Initial focus areas include maritime 
            logistics, hospitality, and renewable energy projects.
        `
    },
    'awards-2025': {
        title: 'OceanLK Marine Receives Environmental Excellence Award',
        image: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?q=80&w=2537&auto=format&fit=crop',
        date: 'January 9, 2026',
        category: 'Awards',
        content: `
            OceanLK Marine has been honored with the prestigious Environmental Excellence Award 
            at the 2025 Maritime Industry Awards. The recognition celebrates the company's 
            outstanding commitment to sustainable maritime practices.

            The award specifically acknowledges OceanLK Marine's innovative approaches to 
            reducing emissions, including the deployment of LNG-powered vessels and implementation 
            of smart routing systems that have reduced fuel consumption by 23%.

            "This award belongs to our entire team," said the COO. "Every member of our organization 
            plays a role in our sustainability journey."
        `
    }
};

const NewsSingle = () => {
    const { id } = useParams<{ id: string }>();
    const article = id ? newsData[id] : null;

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
                    <Link to="/news/articles" className="text-accent hover:underline">
                        Back to News
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
            </div>

            <SectionWrapper className="py-20">
                <div className="max-w-4xl mx-auto">
                    <Link to="/news/articles" className="inline-flex items-center gap-2 text-accent mb-6 hover:gap-3 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                        Back to News
                    </Link>

                    <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-6">
                            <span className="bg-accent px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                                {article.category}
                            </span>
                            <h1 className="text-5xl font-bold mb-6">{article.title}</h1>
                            <div className="flex items-center gap-6 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>{article.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-8">
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-md hover:bg-accent transition-colors">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>

                        <div className="prose prose-invert prose-lg max-w-none">
                            {article.content.split('\n\n').map((paragraph: string, index: number) => (
                                <p key={index} className="mb-4 text-gray-300 leading-relaxed">
                                    {paragraph.trim()}
                                </p>
                            ))}
                        </div>
                    </motion.article>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default NewsSingle;
