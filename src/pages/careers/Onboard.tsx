import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../../components/SectionWrapper';
import { MapPin, Briefcase, ArrowRight, Search, Filter } from 'lucide-react';

const jobOpenings = [
    {
        id: 1,
        title: 'Senior Maritime Engineer',
        company: 'OceanLK Marine',
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        category: 'Engineering',
        description: 'Lead our maritime engineering team in developing innovative shipping solutions.'
    },
    {
        id: 2,
        title: 'Resort Manager',
        company: 'OceanLK Leisure',
        location: 'Galle, Sri Lanka',
        type: 'Full-time',
        category: 'Hospitality',
        description: 'Manage daily operations of our flagship beach resort property.'
    },
    {
        id: 3,
        title: 'Renewable Energy Specialist',
        company: 'OceanLK Energy',
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        category: 'Engineering',
        description: 'Drive our solar and wind energy project implementations.'
    },
    {
        id: 4,
        title: 'Full Stack Developer',
        company: 'OceanLK Tech',
        location: 'Remote',
        type: 'Contract',
        category: 'Technology',
        description: 'Build cutting-edge web applications for our enterprise clients.'
    },
    {
        id: 5,
        title: 'Financial Analyst',
        company: 'OceanLK Holdings',
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        category: 'Finance',
        description: 'Provide financial analysis and strategic insights for group operations.'
    },
    {
        id: 6,
        title: 'Marketing Manager',
        company: 'OceanLK Leisure',
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        category: 'Marketing',
        description: 'Lead marketing strategies for our hospitality brands.'
    }
];

const categories = ['All', 'Engineering', 'Hospitality', 'Technology', 'Finance', 'Marketing'];

const Onboard = () => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredJobs = jobOpenings.filter(job => {
        const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-navy-light via-navy to-navy relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-40 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10" />

            <SectionWrapper id="onboard" className="pt-32 pb-20">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6"
                    >
                        Join Our Team
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
                        Shape the Future <br /> with OceanLK
                    </h1>
                    <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
                        Discover where your talent fits in our ecosystem of innovative companies.
                        We're building something extraordinary, together.
                    </p>

                    {/* Search and Filter Bar */}
                    <div className="max-w-4xl mx-auto glass p-2 rounded-2xl flex flex-col md:flex-row gap-4 items-center mb-12 border border-white/5 shadow-2xl shadow-black/20">
                        <div className="relative flex-1 w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for opportunities ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                            />
                        </div>
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto px-2 md:px-0 no-scrollbar">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${selectedCategory === category
                                        ? 'bg-secondary text-white shadow-lg shadow-secondary/25'
                                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Job Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredJobs.map((job) => (
                            <motion.div
                                layout
                                key={job.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-secondary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl -z-10" />
                                <div className="h-full glass p-8 rounded-2xl border border-white/5 hover:border-secondary/30 transition-colors flex flex-col">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-secondary/10 transition-colors">
                                            <Briefcase className="w-6 h-6 text-secondary" />
                                        </div>
                                        <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-gray-400 border border-white/10">
                                            {job.type}
                                        </span>
                                    </div>

                                    <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-secondary transition-colors">
                                        {job.title}
                                    </h3>
                                    <p className="text-secondary/80 font-medium mb-4 text-sm uppercase tracking-wider">
                                        {job.company}
                                    </p>

                                    <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                                        {job.description}
                                    </p>

                                    <div className="mt-auto pt-6 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <MapPin className="w-4 h-4" />
                                                <span>{job.location}</span>
                                            </div>
                                            <button className="p-2 rounded-full bg-white/5 hover:bg-secondary hover:text-white transition-all group-hover:translate-x-1">
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredJobs.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="inline-block p-6 rounded-full bg-white/5 mb-4">
                            <Filter className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-300">No positions found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
                    </motion.div>
                )}

                {/* Talent Pool Section - Banner Style */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-20 relative overflow-hidden rounded-3xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-secondary to-primary opacity-20" />
                    <div className="absolute inset-0 backdrop-blur-3xl" />
                    <div className="relative p-12 md:p-16 text-center border border-white/10 rounded-3xl">
                        <h3 className="text-3xl font-bold mb-4 text-white">Don't see a perfect fit?</h3>
                        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                            We're always looking for talented individuals to join our diverse portfolio of companies.
                            Submit your CV to our talent pool and we'll contact you when a matching opportunity arises.
                        </p>
                        <a
                            href="/careers/talent-pool"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 transform hover:scale-105 transition-all"
                        >
                            Join Our Talent Pool
                            <ArrowRight className="w-5 h-5" />
                        </a>
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Onboard;
