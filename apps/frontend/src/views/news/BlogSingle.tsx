'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { getMediaUrl } from '../../utils/api';

export interface BlogPost {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    author: string;
    publishedDate: string;
    category: string;
    readTime: string;
}

const BlogSingle = ({ blog }: { blog: BlogPost }) => {
    return (
        <div className="min-h-screen">
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src={getMediaUrl(blog.imageUrl)}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-primary/30 to-primary/10" />
            </div>

            <SectionWrapper className="py-20">
                <div className="max-w-4xl mx-auto">
                    <Link href="/news/blogs" className="inline-flex items-center gap-2 text-accent mb-6 hover:gap-3 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                        Back to Blogs
                    </Link>

                    <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="mb-6">
                            <span className="bg-accent px-3 py-1 rounded-full text-sm font-semibold inline-block mb-4">
                                {blog.category}
                            </span>
                            <h1 className="text-5xl font-bold mb-6">{blog.title}</h1>
                            <div className="flex items-center gap-6 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    <span>{blog.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>{blog.publishedDate}</span>
                                </div>
                                <span>{blog.readTime}</span>
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
                            dangerouslySetInnerHTML={{ __html: blog.description }}
                        />
                    </motion.article>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default BlogSingle;
