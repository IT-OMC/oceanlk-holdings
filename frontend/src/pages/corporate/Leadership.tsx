import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../../components/SectionWrapper';
import { Linkedin, Mail, ArrowRight, X } from 'lucide-react';
// import { leadershipData } from '../../data/leadershipData'; // Removed

// Keeping this interface or redefining it to match backend response
export interface LeadershipMember {
    id: string;
    name: string;
    position: string;
    department: 'BOARD' | 'EXECUTIVE' | 'SENIOR';
    image: string;
    bio: string; // backend has bio
    shortDescription?: string; // backend has shortDescription
    details?: string; // UI uses details, backend has bio. I'll map them or update UI to use bio
    linkedin?: string;
    email?: string;
}

interface LeadershipCategory {
    id: string;
    code: string;
    title: string;
    subtitle: string;
    displayOrder: number;
}

interface LeadershipCardProps {
    member: LeadershipMember;
    index: number;
}

const LeadershipCard = ({ member, index }: LeadershipCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 ${!isExpanded ? 'hover:border-accent/50 hover:scale-[1.02] hover:shadow-2xl hover:shadow-accent/20' : ''
                } transition-all duration-500 h-full flex flex-col`}
        >
            <AnimatePresence mode="wait">
                {!isExpanded ? (
                    <motion.div
                        key="default"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="flex flex-col h-full"
                    >
                        {/* Tech Badge */}
                        <div className="absolute top-4 left-4 z-10">
                            <span className="px-3 py-1 text-xs font-semibold bg-black/40 backdrop-blur-sm border border-white/20 rounded-full text-white">
                                {member.department || 'tech'}
                            </span>
                        </div>

                        {/* Portrait Image */}
                        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10">
                            <img
                                src={member.image}
                                alt={member.name}
                                className="w-full h-72 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a1a]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4 flex flex-col flex-grow">
                            <div className="flex-grow">
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors duration-300">
                                    {member.name}
                                </h3>
                                <p className="text-sm font-semibold text-accent/90 mb-3">
                                    {member.position}
                                </p>
                                <p className="text-sm text-gray-300 leading-relaxed line-clamp-3">
                                    {member.shortDescription || member.bio}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-auto">
                                <button
                                    onClick={() => setIsExpanded(true)}
                                    className="flex items-center gap-2 text-sm text-accent font-medium group/btn hover:gap-3 transition-all duration-300"
                                >
                                    Read More
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </button>

                                <div className="flex gap-2">
                                    {member.linkedin && (
                                        <a
                                            href={member.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 rounded-lg transition-all duration-300 group/icon"
                                        >
                                            <Linkedin className="w-4 h-4 text-gray-300 group-hover/icon:text-accent transition-colors" />
                                        </a>
                                    )}
                                    {member.email && (
                                        <a
                                            href={`mailto:${member.email}`}
                                            className="p-2 bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 rounded-lg transition-all duration-300 group/icon"
                                        >
                                            <Mail className="w-4 h-4 text-gray-300 group-hover/icon:text-accent transition-colors" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Corner Accents */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-bl-[100px]" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-tr-[100px]" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="expanded"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        className="p-8 h-full flex flex-col relative bg-[#0f0f2a]"
                    >
                        <button
                            onClick={() => setIsExpanded(false)}
                            className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">
                                {member.name}
                            </h3>
                            <p className="text-accent font-semibold">
                                {member.position}
                            </p>
                        </div>

                        <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line">
                                {member.details || member.bio}
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-white/10 text-right">
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-sm text-accent hover:text-white transition-colors font-medium"
                            >
                                Close Details
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

interface SectionHeaderProps {
    title: string;
    subtitle: string;
    delay?: number;
}

const SectionHeader = ({ title, subtitle, delay = 0 }: SectionHeaderProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay }}
            className="text-center mb-12"
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
                {title}
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                {subtitle}
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-6" />
        </motion.div>
    );
};

const Leadership = () => {
    const [leaders, setLeaders] = useState<LeadershipMember[]>([]);
    const [categories, setCategories] = useState<LeadershipCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [leadersResponse, categoriesResponse] = await Promise.all([
                    fetch('http://localhost:8080/api/leadership'),
                    fetch('http://localhost:8080/api/leadership-categories')
                ]);

                if (leadersResponse.ok && categoriesResponse.ok) {
                    const leadersData = await leadersResponse.json();
                    const categoriesData = await categoriesResponse.json();
                    setLeaders(leadersData);
                    setCategories(categoriesData);
                }
            } catch (error) {
                console.error('Failed to fetch data', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0f0f2a] to-[#0a0a1a]">
            {/* Hero Section */}
            <SectionWrapper id="leadership-hero" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="inline-block mb-6 px-6 py-3 bg-gradient-to-r from-accent/20 to-primary/20 backdrop-blur-xl border border-accent/30 rounded-full"
                    >
                        <span className="text-accent font-semibold">Excellence in Leadership</span>
                    </motion.div>

                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-accent to-white bg-clip-text text-transparent">
                        Meet The Leadership Team
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                        Visionary leaders driving innovation, excellence, and sustainable growth across
                        all our business operations with decades of combined experience.
                    </p>

                    <div className="flex flex-wrap justify-center gap-8 mt-12">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="glass px-8 py-4 rounded-xl border border-accent/30"
                        >
                            <div className="text-3xl font-bold text-accent">15+</div>
                            <div className="text-sm text-gray-300">Years Average Experience</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="glass px-8 py-4 rounded-xl border border-primary/30"
                        >
                            <div className="text-3xl font-bold text-primary">{leaders.length}</div>
                            <div className="text-sm text-gray-300">Leadership Members</div>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="glass px-8 py-4 rounded-xl border border-accent/30"
                        >
                            <div className="text-3xl font-bold text-accent">100%</div>
                            <div className="text-sm text-gray-300">Committed to Excellence</div>
                        </motion.div>
                    </div>
                </motion.div>
            </SectionWrapper>

            {/* Dynamic Categories */}
            {categories.map((category) => {
                const categoryLeaders = leaders.filter(l => l.department === category.code);
                if (categoryLeaders.length === 0) return null;

                return (
                    <SectionWrapper key={category.id} id={category.code.toLowerCase()} className="py-20">
                        <SectionHeader
                            title={category.title}
                            subtitle={category.subtitle}
                        />
                        <div className="flex flex-wrap justify-center gap-8">
                            {categoryLeaders.map((member, index) => (
                                <div key={member.id} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(25%-1.5rem)]">
                                    <LeadershipCard member={member} index={index} />
                                </div>
                            ))}
                        </div>
                    </SectionWrapper>
                );
            })}

            {/* CTA Section */}
            <SectionWrapper id="leadership-cta" className="py-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/20 via-primary/10 to-accent/20 backdrop-blur-xl border border-accent/30 p-12 md:p-16 text-center"
                >
                    <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-accent bg-clip-text text-transparent">
                            Join Our Leadership Journey
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                            We're always looking for talented leaders to join our team and drive our mission forward.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-accent to-primary text-white font-semibold rounded-xl shadow-lg shadow-accent/30 hover:shadow-accent/50 transition-all duration-300 inline-flex items-center gap-2"
                        >
                            Explore Opportunities
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Leadership;
