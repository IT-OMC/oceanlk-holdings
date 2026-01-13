import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';

const blogData: Record<string, any> = {
    'sustainable-shipping': {
        title: 'The Future of Sustainable Shipping',
        image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?q=80&w=2537&auto=format&fit=crop',
        author: 'Sarah Johnson',
        date: 'January 10, 2026',
        category: 'Maritime',
        readTime: '5 min read',
        content: `
            <p>The maritime industry stands at a critical juncture. As global trade continues to expand, 
            the environmental impact of shipping has come under increasing scrutiny. At OceanLK Marine, 
            we're committed to pioneering sustainable solutions that balance economic growth with 
            environmental responsibility.</p>

            <h2>The Challenge</h2>
            <p>Maritime transport accounts for approximately 3% of global greenhouse gas emissions. 
            With over 90% of world trade carried by sea, the industry's carbon footprint presents 
            a significant challenge that requires immediate and innovative solutions.</p>

            <h2>Our Approach</h2>
            <p>We've invested heavily in next-generation technologies including:</p>
            <ul>
                <li>LNG-powered vessels reducing emissions by up to 25%</li>
                <li>Advanced hull designs improving fuel efficiency</li>
                <li>Smart routing systems optimizing voyages</li>
                <li>Alternative fuel research including hydrogen and ammonia</li>
            </ul>

            <h2>Looking Ahead</h2>
            <p>The future of sustainable shipping isn't just about technology—it's about fostering 
            a culture of environmental stewardship across the entire maritime industry. Through 
            collaboration, innovation, and commitment, we're charting a course towards a greener future.</p>
        `
    },
    'tourism-trends': {
        title: '2026 Tourism Trends in Sri Lanka',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2649&auto=format&fit=crop',
        author: 'Michael Chen',
        date: 'January 8, 2026',
        category: 'Hospitality',
        readTime: '4 min read',
        content: `
            <p>Sri Lanka's tourism industry is experiencing a renaissance, with new trends reshaping 
            the hospitality landscape. As OceanLK Leisure continues to expand its presence, we're 
            witnessing exciting shifts in traveler preferences and expectations.</p>

            <h2>Sustainable Tourism</h2>
            <p>Today's travelers are increasingly conscious of their environmental impact. 
            Eco-friendly resorts and sustainable tourism practices are no longer optional—they're 
            expected. Our properties have embraced this shift with solar power, waste reduction 
            programs, and community engagement initiatives.</p>

            <h2>Experiential Travel</h2>
            <p>Guests seek authentic, immersive experiences that connect them with local culture, 
            cuisine, and traditions. We've developed programs that offer:</p>
            <ul>
                <li>Traditional cooking classes with local chefs</li>
                <li>Cultural heritage tours</li>
                <li>Wildlife conservation experiences</li>
                <li>Artisan workshop visits</li>
            </ul>
        `
    },
    'renewable-energy': {
        title: 'Renewable Energy: Our Commitment',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2670&auto=format&fit=crop',
        author: 'David Kumar',
        date: 'January 5, 2026',
        category: 'Energy',
        readTime: '6 min read',
        content: `
            <p>Climate change demands urgent action. At OceanLK Energy, we're not just talking 
            about renewable energy—we're actively building the infrastructure for a sustainable future.</p>

            <h2>Our Portfolio</h2>
            <p>With over 250MW of renewable capacity, our projects span:</p>
            <ul>
                <li>18 solar installations across Sri Lanka</li>
                <li>Wind farms in high-potential zones</li>
                <li>Hybrid energy systems for remote communities</li>
            </ul>

            <h2>Impact</h2>
            <p>Our renewable energy projects have already prevented over 100,000 tons of CO₂ 
            emissions annually, equivalent to taking 20,000 cars off the road.</p>
        `
    },
    'digital-transformation': {
        title: 'Digital Transformation in Traditional Industries',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
        author: 'Emily Watson',
        date: 'January 3, 2026',
        category: 'Technology',
        readTime: '7 min read',
        content: `
            <p>Digital transformation is revolutionizing even the most traditional industries. 
            At OceanLK Tech, we're helping businesses navigate this transition with cutting-edge 
            solutions tailored to their unique challenges.</p>

            <h2>The Digital Imperative</h2>
            <p>Companies that fail to embrace digital transformation risk obsolescence. 
            But successful transformation requires more than just implementing new technologies—it 
            demands a fundamental shift in mindset and operations.</p>
        `
    }
};

const BlogSingle = () => {
    const { id } = useParams<{ id: string }>();
    const blog = id ? blogData[id] : null;

    if (!blog) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
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
                    src={blog.image}
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
                                    <span>{blog.date}</span>
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
                            className="prose prose-invert prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                    </motion.article>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default BlogSingle;
