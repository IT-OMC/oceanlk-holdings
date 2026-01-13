import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowLeft, ExternalLink, Users, TrendingUp, Award } from 'lucide-react';

const companyData: Record<string, any> = {
    'ocean-marine': {
        name: 'OceanLK Marine',
        category: 'Maritime & Logistics',
        tagline: 'Navigating Global Waters',
        description: 'OceanLK Marine stands as a cornerstone of maritime excellence in the Indian Ocean region. With state-of-the-art vessels and cutting-edge logistics solutions, we connect continents and facilitate global trade.',
        image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?q=80&w=2537&auto=format&fit=crop',
        founded: '1988',
        employees: '500+',
        revenue: '$120M',
        stats: [
            { label: 'Vessels', value: '45+', icon: TrendingUp },
            { label: 'Ports Served', value: '25', icon: Award },
            { label: 'Annual Shipments', value: '10K+', icon: Users }
        ]
    },
    'ocean-leisure': {
        name: 'OceanLK Leisure',
        category: 'Hospitality & Tourism',
        tagline: 'Crafting Unforgettable Experiences',
        description: 'OceanLK Leisure transforms hospitality into an art form. Our portfolio of premium resorts and unique travel experiences showcase the best of island living.',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2649&auto=format&fit=crop',
        founded: '1995',
        employees: '800+',
        revenue: '$85M',
        stats: [
            { label: 'Properties', value: '12', icon: Award },
            { label: 'Guest Satisfaction', value: '98%', icon: TrendingUp },
            { label: 'Annual Guests', value: '50K+', icon: Users }
        ]
    },
    'ocean-energy': {
        name: 'OceanLK Energy',
        category: 'Renewable Energy',
        tagline: 'Powering a Sustainable Future',
        description: 'OceanLK Energy leads the charge in renewable energy solutions. Our solar and wind projects are powering communities while protecting our planet.',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2670&auto=format&fit=crop',
        founded: '2010',
        employees: '300+',
        revenue: '$65M',
        stats: [
            { label: 'MW Capacity', value: '250+', icon: TrendingUp },
            { label: 'Solar Projects', value: '18', icon: Award },
            { label: 'CO₂ Saved', value: '100K tons', icon: Users }
        ]
    },
    'ocean-tech': {
        name: 'OceanLK Tech',
        category: 'Technology & Innovation',
        tagline: 'Innovating Tomorrow, Today',
        description: 'OceanLK Tech drives digital transformation across industries. Our solutions blend cutting-edge technology with practical business needs.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
        founded: '2015',
        employees: '200+',
        revenue: '$45M',
        stats: [
            { label: 'Clients', value: '150+', icon: Users },
            { label: 'Projects Delivered', value: '300+', icon: Award },
            { label: 'Growth Rate', value: '45%', icon: TrendingUp }
        ]
    },
    'ocean-capital': {
        name: 'OceanLK Capital',
        category: 'Investment & Finance',
        tagline: 'Strategic Growth. Sustainable Returns.',
        description: 'OceanLK Capital identifies and cultivates high-potential investment opportunities. We drive financial growth while ensuring responsible capital allocation.',
        image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2670&auto=format&fit=crop',
        founded: '2018',
        employees: '50+',
        revenue: '$200M+',
        stats: [
            { label: 'AUM', value: '$500M', icon: TrendingUp },
            { label: 'Portfolio Co.', value: '15', icon: Award },
            { label: 'ROI', value: '18%', icon: Users }
        ]
    }
};

const CompanySingle = () => {
    const { id } = useParams<{ id: string }>();
    const company = id ? companyData[id] : null;

    if (!company) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Company Not Found</h1>
                    <Link to="/companies" className="text-accent hover:underline">
                        Back to Companies
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[60vh] overflow-hidden">
                <img
                    src={company.image}
                    alt={company.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
                <div className="absolute inset-0 flex items-center">
                    <SectionWrapper>
                        <Link to="/companies" className="inline-flex items-center gap-2 text-accent mb-6 hover:gap-3 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                            Back to Companies
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-accent uppercase tracking-wider mb-2">{company.category}</p>
                            <h1 className="text-6xl font-bold mb-4">{company.name}</h1>
                            <p className="text-2xl text-gray-200">{company.tagline}</p>
                        </motion.div>
                    </SectionWrapper>
                </div>
            </div>

            <SectionWrapper className="py-20">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <h2 className="text-3xl font-bold mb-6">About {company.name}</h2>
                            <p className="text-xl text-gray-300 leading-relaxed mb-8">
                                {company.description}
                            </p>

                            <div className="grid sm:grid-cols-3 gap-6 mb-12">
                                {company.stats.map((stat: any, index: number) => {
                                    const Icon = stat.icon;
                                    return (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                                            className="glass p-6 rounded-xl text-center"
                                        >
                                            <Icon className="w-8 h-8 text-accent mx-auto mb-3" />
                                            <div className="text-3xl font-bold mb-2">{stat.value}</div>
                                            <div className="text-gray-400 text-sm">{stat.label}</div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <button className="bg-accent text-white px-8 py-4 rounded-md font-semibold flex items-center gap-2 hover:bg-accent/90 transition-all">
                                Visit Company Website
                                <ExternalLink className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="glass p-8 rounded-xl sticky top-32"
                        >
                            <h3 className="text-2xl font-bold mb-6">Quick Facts</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="text-gray-400 text-sm mb-1">Founded</div>
                                    <div className="text-xl font-semibold">{company.founded}</div>
                                </div>
                                <div className="border-t border-white/10 pt-4">
                                    <div className="text-gray-400 text-sm mb-1">Employees</div>
                                    <div className="text-xl font-semibold">{company.employees}</div>
                                </div>
                                <div className="border-t border-white/10 pt-4">
                                    <div className="text-gray-400 text-sm mb-1">Annual Revenue</div>
                                    <div className="text-xl font-semibold">{company.revenue}</div>
                                </div>
                                <div className="border-t border-white/10 pt-4">
                                    <div className="text-gray-400 text-sm mb-1">Industry</div>
                                    <div className="text-xl font-semibold">{company.category}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </SectionWrapper>
        </div>
    );
};

export default CompanySingle;
