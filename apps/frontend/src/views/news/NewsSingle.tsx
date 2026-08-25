'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { getMediaUrl } from '../../utils/api';

export interface NewsArticle {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    publishedDate: string;
    category: string;
}

const NewsSingle = ({ article }: { article: NewsArticle }) => {
    return (
        <div className="min-h-screen">
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src={getMediaUrl(article.imageUrl)}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-primary/40 to-primary/20" />
            </div>

            <SectionWrapper className="py-20">
                <div className="max-w-4xl mx-auto">
                    <Link href="/news/articles" className="inline-flex items-center gap-2 text-accent mb-6 hover:gap-3 transition-all">
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
                            <button className="flex items-center gap-2 px-4 py-2 text-white bg-primary-light rounded-md hover:bg-accent transition-colors">
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
