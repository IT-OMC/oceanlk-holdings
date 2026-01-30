import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../../components/SectionWrapper';
import { MapPin, Briefcase, ArrowRight, Search, Filter, Sparkles, Star, TrendingUp } from 'lucide-react';
import { API_ENDPOINTS } from '../../utils/api';

const categories = ['All', 'Engineering', 'Hospitality', 'Technology', 'Finance', 'Marketing'];

interface JobOpportunity {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    description: string;
    featured: boolean;
    level: string;
}

const Onboard = () => {
    const navigate = useNavigate();
    const [jobOpenings, setJobOpenings] = useState<JobOpportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        fetchJobs();

        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.JOBS);
            if (response.ok) {
                const data = await response.json();
                setJobOpenings(data);
            } else {
                console.error("Failed to fetch jobs");
            }
        } catch (error) {
            console.error("Error fetching jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredJobs = jobOpenings.filter(job => {
        const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const featuredJobs = filteredJobs.filter(job => job.featured);
    const regularJobs = filteredJobs.filter(job => !job.featured);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#1a2847] relative overflow-hidden">
            {/* Animated Gradient Mesh Background */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[120px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)',
                        transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[120px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
                        animationDelay: '1s',
                        transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)`
                    }}
                />
                <div
                    className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full blur-[150px] animate-pulse"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)',
                        animationDelay: '2s'
                    }}
                />
            </div>

            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        scale: Math.random() * 0.5 + 0.5
                    }}
                    animate={{
                        y: [null, Math.random() * window.innerHeight],
                        x: [null, Math.random() * window.innerWidth],
                    }}
                    transition={{
                        duration: Math.random() * 20 + 10,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            ))}

            <SectionWrapper id="onboard" className="pt-32 pb-20 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    {/* Animated Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8 relative overflow-hidden group"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 8px 32px rgba(16,185,129,0.2)'
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Sparkles className="w-4 h-4 text-emerald-400 relative z-10" />
                        <span className="text-sm font-semibold text-white relative z-10">Join Our Team</span>
                    </motion.div>

                    {/* Hero Title with Parallax */}
                    <motion.h1
                        className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-emerald-200 to-blue-200">
                            Shape the Future
                        </span>
                        <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-emerald-200 to-white">
                            with Ocean Ceylon
                        </span>
                    </motion.h1>

                    <motion.p
                        className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}
                    >
                        Discover where your talent fits in our ecosystem of innovative companies.
                        We're building something extraordinary, together.
                    </motion.p>

                    {/* Liquid Glass Search Bar */}
                    <motion.div
                        className="max-w-6xl mx-auto p-1.5 rounded-3xl relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)'
                        }}
                    >
                        <div className="flex flex-col lg:flex-row gap-4 items-stretch p-3">
                            {/* Search Input */}
                            <div className="relative flex-1 w-full lg:w-auto">
                                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                                <input
                                    type="text"
                                    placeholder="Search for your dream role..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full py-4 pl-14 pr-6 rounded-2xl text-white placeholder-gray-400 focus:outline-none transition-all"
                                    style={{
                                        background: 'rgba(255,255,255,0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                    }}
                                />
                            </div>

                            {/* Filter Chips - Wider Section */}
                            <div className="flex gap-2.5 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto px-2 lg:px-0 no-scrollbar lg:flex-shrink-0">
                                {categories.map((category) => (
                                    <motion.button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap relative overflow-hidden ${selectedCategory === category
                                            ? 'text-white'
                                            : 'text-gray-300 hover:text-white'
                                            }`}
                                        style={
                                            selectedCategory === category
                                                ? {
                                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.8) 0%, rgba(5,150,105,0.8) 100%)',
                                                    boxShadow: '0 8px 20px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                                                    border: '1px solid rgba(255,255,255,0.3)'
                                                }
                                                : {
                                                    background: 'rgba(255,255,255,0.05)',
                                                    backdropFilter: 'blur(10px)',
                                                    border: '1px solid rgba(255,255,255,0.1)'
                                                }
                                        }
                                    >
                                        {category}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Result Count */}
                        <motion.div
                            className="px-6 pb-3 text-sm text-gray-400"
                            key={filteredJobs.length}
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            Found <span className="text-emerald-400 font-semibold">{filteredJobs.length}</span> {filteredJobs.length === 1 ? 'opportunity' : 'opportunities'}
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Featured Jobs - Bento Grid */}
                {featuredJobs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.8 }}
                        className="mb-20"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <Star className="w-6 h-6 text-yellow-400" />
                            <h2 className="text-3xl font-bold text-white">Featured Opportunities</h2>
                            <TrendingUp className="w-6 h-6 text-emerald-400" />
                        </div>

                        {/* Bento Grid Layout */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-4 md:gap-6 auto-rows-[240px] sm:auto-rows-[260px] md:auto-rows-[280px]">
                            <AnimatePresence mode='popLayout'>
                                {featuredJobs.map((job, index) => {
                                    // Varied bento sizes with improved responsive breakpoints
                                    const gridClass = index === 0
                                        ? 'sm:col-span-2 md:col-span-6 lg:col-span-7 sm:row-span-2 md:row-span-2'
                                        : index === 1
                                            ? 'sm:col-span-1 md:col-span-3 lg:col-span-5 sm:row-span-1 md:row-span-1'
                                            : 'sm:col-span-1 md:col-span-3 lg:col-span-4 sm:row-span-1 md:row-span-1';

                                    return (
                                        <motion.div
                                            layout
                                            key={job.id}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ duration: 0.4, delay: index * 0.1 }}
                                            className={`group relative ${gridClass}`}
                                            whileHover={{
                                                scale: 1.02,
                                                transition: { duration: 0.3 }
                                            }}
                                        >
                                            {/* Glow Effect on Hover */}
                                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-3xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />

                                            {/* Liquid Glass Card */}
                                            <div
                                                className="h-full p-4 sm:p-5 rounded-2xl sm:rounded-3xl relative overflow-hidden transition-all duration-500"
                                                style={{
                                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                                                    backdropFilter: 'blur(24px)',
                                                    border: '1px solid rgba(255,255,255,0.25)',
                                                    boxShadow: '0 25px 70px rgba(0,0,0,0.4), 0 10px 30px rgba(16,185,129,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
                                                }}
                                            >
                                                {/* Adaptive Lighting Effect */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-emerald-500/10 group-hover:via-blue-500/5 group-hover:to-purple-500/10 transition-all duration-500" />

                                                <div className="relative z-10 h-full flex flex-col">
                                                    {/* Header */}
                                                    <div className="flex items-start justify-between mb-4">
                                                        <motion.div
                                                            className="p-2.5 rounded-xl"
                                                            style={{
                                                                background: 'linear-gradient(135deg, rgba(16,185,129,0.2) 0%, rgba(5,150,105,0.1) 100%)',
                                                                backdropFilter: 'blur(10px)',
                                                                border: '1px solid rgba(16,185,129,0.3)'
                                                            }}
                                                            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                                            transition={{ duration: 0.5 }}
                                                        >
                                                            <Briefcase className="w-5 h-5 text-emerald-400" />
                                                        </motion.div>
                                                        <div className="flex flex-col gap-1.5 items-end">
                                                            <span
                                                                className="px-3 py-1 rounded-full text-xs font-semibold text-emerald-300"
                                                                style={{
                                                                    background: 'rgba(16,185,129,0.2)',
                                                                    border: '1px solid rgba(16,185,129,0.3)',
                                                                    backdropFilter: 'blur(10px)'
                                                                }}
                                                            >
                                                                {job.type}
                                                            </span>
                                                            <span
                                                                className="px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-300 flex items-center gap-1"
                                                                style={{
                                                                    background: 'rgba(234,179,8,0.2)',
                                                                    border: '1px solid rgba(234,179,8,0.3)'
                                                                }}
                                                            >
                                                                <Star className="w-3 h-3" fill="currentColor" />
                                                                Featured
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Content */}
                                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 text-white group-hover:text-emerald-300 transition-colors duration-300">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-emerald-400 font-semibold mb-3 text-sm uppercase tracking-wider">
                                                        {job.company}
                                                    </p>

                                                    <p className="text-gray-300 text-sm mb-6 line-clamp-2 leading-relaxed">
                                                        {job.description}
                                                    </p>

                                                    {/* Footer */}
                                                    <div className="mt-auto pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                                <MapPin className="w-4 h-4 text-blue-400" />
                                                                <span>{job.location}</span>
                                                            </div>
                                                            <motion.button
                                                                onClick={() => navigate(`/careers/opportunities/${job.id}`)}
                                                                className="px-5 py-2.5 rounded-full text-white flex items-center gap-2"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.6) 0%, rgba(5,150,105,0.6) 100%)',
                                                                    border: '1px solid rgba(255,255,255,0.2)'
                                                                }}
                                                                whileHover={{
                                                                    scale: 1.05,
                                                                    paddingRight: 24,
                                                                    background: 'linear-gradient(135deg, rgba(16,185,129,0.8) 0%, rgba(5,150,105,0.8) 100%)'
                                                                }}
                                                                whileTap={{ scale: 0.95 }}
                                                            >
                                                                <span className="font-semibold text-sm">Apply</span>
                                                                <ArrowRight className="w-4 h-4" />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* All Opportunities Section */}
                {regularJobs.length > 0 && (
                    <div className="mb-20">
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">All Opportunities</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            <AnimatePresence mode='popLayout'>
                                {regularJobs.map((job, index) => (
                                    <motion.div
                                        layout
                                        key={job.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="group relative"
                                        whileHover={{
                                            scale: 1.03,
                                            transition: { duration: 0.3 }
                                        }}
                                    >
                                        {/* Glow Effect */}
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500" />

                                        {/* Liquid Glass Card */}
                                        <div
                                            className="h-full p-4 sm:p-5 rounded-2xl relative overflow-hidden transition-all duration-500"
                                            style={{
                                                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.04) 100%)',
                                                backdropFilter: 'blur(24px)',
                                                border: '1px solid rgba(255,255,255,0.2)',
                                                boxShadow: '0 15px 50px rgba(0,0,0,0.3), 0 8px 25px rgba(59,130,246,0.1), inset 0 1px 0 rgba(255,255,255,0.12)',
                                            }}
                                        >
                                            {/* Adaptive Lighting */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex items-start justify-between mb-4">
                                                    <motion.div
                                                        className="p-2 rounded-xl"
                                                        style={{
                                                            background: 'rgba(59,130,246,0.15)',
                                                            border: '1px solid rgba(59,130,246,0.3)',
                                                            backdropFilter: 'blur(10px)'
                                                        }}
                                                        whileHover={{ rotate: [0, -5, 5, 0] }}
                                                    >
                                                        <Briefcase className="w-5 h-5 text-blue-400" />
                                                    </motion.div>
                                                    <span
                                                        className="px-2.5 py-1 rounded-full text-xs font-medium text-gray-300"
                                                        style={{
                                                            background: 'rgba(255,255,255,0.1)',
                                                            border: '1px solid rgba(255,255,255,0.2)'
                                                        }}
                                                    >
                                                        {job.type}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-white group-hover:text-blue-300 transition-colors">
                                                    {job.title}
                                                </h3>
                                                <p className="text-blue-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                                                    {job.company}
                                                </p>

                                                <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                                                    {job.description}
                                                </p>

                                                <div className="mt-auto pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{job.location}</span>
                                                        </div>
                                                        <motion.button
                                                            onClick={() => navigate(`/careers/opportunities/${job.id}`)}
                                                            className="px-4 py-2 rounded-full flex items-center gap-2"
                                                            style={{
                                                                background: 'rgba(59,130,246,0.2)',
                                                                border: '1px solid rgba(59,130,246,0.3)'
                                                            }}
                                                            whileHover={{
                                                                scale: 1.05,
                                                                background: 'rgba(59,130,246,0.4)'
                                                            }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            <span className="font-semibold text-sm text-blue-400">Apply</span>
                                                            <ArrowRight className="w-4 h-4 text-blue-400" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredJobs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div
                            className="inline-block p-8 rounded-full mb-6"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <Filter className="w-10 h-10 text-gray-500" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-300 mb-2">No positions found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
                    </motion.div>
                )}

                {/* Talent Pool CTA - Immersive Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="mt-24 relative overflow-hidden rounded-3xl group"
                    whileHover={{ scale: 1.02 }}
                >
                    {/* Animated Background */}
                    <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 opacity-20" />
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 to-blue-500/30"
                            animate={{
                                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: 'linear'
                            }}
                            style={{ backgroundSize: '200% 200%' }}
                        />
                    </div>

                    {/* Glass Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backdropFilter: 'blur(40px)',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
                        }}
                    />

                    {/* Content */}
                    <div
                        className="relative p-16 text-center"
                        style={{ borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}
                    >
                        {/* Floating Icons */}
                        {[...Array(6)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute"
                                style={{
                                    left: `${20 + i * 15}%`,
                                    top: `${30 + (i % 2) * 40}%`
                                }}
                                animate={{
                                    y: [0, -20, 0],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{
                                    duration: 3 + i,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            >
                                <Sparkles className="w-6 h-6 text-emerald-300/30" />
                            </motion.div>
                        ))}

                        <motion.div
                            initial={{ scale: 0.9 }}
                            whileInView={{ scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                                Don't see a perfect fit?
                            </h3>
                            <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                                We're always looking for talented individuals to join our diverse portfolio of companies.
                                Submit your CV to our talent pool and we'll contact you when a matching opportunity arises.
                            </p>
                            <motion.a
                                href="/careers/talent-pool"
                                className="inline-flex items-center gap-3 px-10 py-5 rounded-full font-bold text-lg transition-all relative overflow-hidden group/button"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                                    color: '#0a1628',
                                    boxShadow: '0 10px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,1)'
                                }}
                                whileHover={{
                                    scale: 1.05,
                                    boxShadow: '0 15px 50px rgba(16,185,129,0.4), inset 0 1px 0 rgba(255,255,255,1)'
                                }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="relative z-10">Join Our Talent Pool</span>
                                <ArrowRight className="w-6 h-6 relative z-10 group-hover/button:translate-x-1 transition-transform" />

                                {/* Magnetic Effect Background */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 opacity-0 group-hover/button:opacity-20"
                                    initial={false}
                                />
                            </motion.a>
                        </motion.div>
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Onboard;
