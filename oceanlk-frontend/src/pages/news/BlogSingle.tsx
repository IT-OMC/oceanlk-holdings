
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowLeft, Calendar, User, Share2, Loader } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    author: string;
    publishedDate: string;
    category: string;
    readTime: string;
    // Map description to content for now, or use a separate content field if available later
}

const BlogSingle = () => {
    const { id } = useParams<{ id: string }>();
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            fetchBlog();
        }
    }, [id]);

    const fetchBlog = async () => {
        try {
            const response = await fetch(`/api/media/${id}`);
            if (response.ok) {
                const data = await response.json();
                setBlog({
                    id: data.id,
                    title: data.title,
                    description: data.description, // Main rich text content usually stored here
                    imageUrl: data.imageUrl,
                    author: data.author || 'OceanLK Team',
                    publishedDate: new Date(data.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    category: data.category,
                    readTime: data.readTime || '5 min read'
                });
            } else {
                setError('Blog post not found');
            }
        } catch (error) {
            console.error('Error fetching blog:', error);
            setError('Failed to load blog post');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin text-cyan-500" size={48} />
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
                    <p className="text-gray-500 mb-6">{error || "The requested blog post could not be found."}</p>
                    <Link to="/news/blogs" className="text-accent hover:underline">
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
            </div>

            <SectionWrapper className="py-20">
                <div className="max-w-4xl mx-auto">
                    <Link to="/news/blogs" className="inline-flex items-center gap-2 text-accent mb-6 hover:gap-3 transition-all">
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
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary-light rounded-md hover:bg-accent transition-colors">
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
