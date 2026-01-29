import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowLeft, Calendar, Share2, Loader } from 'lucide-react';
import { API_ENDPOINTS } from '../../utils/api';

interface NewsArticle {
    id: string;
    title: string;
    content: string; // The rich text description
    imageUrl: string;
    publishedDate: string;
    category: string;
}

const NewsSingle = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<NewsArticle | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticle = useCallback(async () => {
        try {
            if (!id) return;
            const response = await fetch(API_ENDPOINTS.MEDIA_SINGLE(id));
            if (response.ok) {
                const data = await response.json();
                setArticle({
                    id: data.id,
                    title: data.title,
                    content: data.description, // Backend stores content in description
                    imageUrl: data.imageUrl,
                    publishedDate: new Date(data.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    category: data.category
                });
            } else {
                setError('Article not found');
            }
        } catch (error) {
            console.error('Error fetching article:', error);
            setError('Failed to load article');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) {
            fetchArticle();
        }
    }, [id, fetchArticle]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin text-cyan-500" size={48} />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
                    <p className="text-gray-500 mb-6">{error || "The requested article could not be found."}</p>
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
                    src={article.imageUrl}
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
                                    <span>{article.publishedDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mb-8">
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-md hover:bg-accent transition-colors">
                                <Share2 className="w-4 h-4" />
                                Share
                            </button>
                        </div>

                        <div
                            className="prose prose-invert prose-lg max-w-none whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    </motion.article>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default NewsSingle;
