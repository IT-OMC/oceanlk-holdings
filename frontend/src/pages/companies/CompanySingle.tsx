import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import {
    ArrowLeft, ExternalLink, Users, TrendingUp, Award,
    Ship, Anchor, Package, Briefcase, PieChart, Wrench,
    CheckCircle, Globe, Map, Activity, MapPin, Smile,
    Compass, Layout, BarChart
} from 'lucide-react';
import { oceanData } from '../../data/mockData';

// Map string icon names to Lucide components
const IconMap: Record<string, any> = {
    Ship, Anchor, Package, Briefcase, PieChart, TrendingUp,
    Wrench, Users, CheckCircle, Globe, Map, Activity,
    MapPin, Smile, Compass, Layout, BarChart, Award
};

const CompanySingle = () => {
    const { id } = useParams<{ id: string }>();
    const company = oceanData.sectors.find((c: any) => c.id === id);

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
                {company.video ? (
                    <video
                        src={company.video}
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src={company.image}
                        alt={company.title}
                        className="w-full h-full object-cover"
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/80 to-primary/40" />
                <div className="absolute inset-0 flex items-center">
                    <SectionWrapper>
                        <Link to="/companies" className="inline-flex items-center gap-2 text-accent mb-12 hover:gap-3 transition-all">
                            <ArrowLeft className="w-5 h-5" />
                            Back to Companies
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <p className="text-accent uppercase tracking-wider mb-2">{company.category}</p>
                            <h1 className="text-6xl text-white font-bold mb-4">{company.title}</h1>
                            <p className="text-2xl text-gray-200">{company.desc}</p>
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
                            <h2 className="text-3xl font-bold mb-6">About {company.title}</h2>
                            <p className="text-xl text-gray-400 leading-relaxed mb-8">
                                {company.longDescription}
                            </p>

                            <div className="grid sm:grid-cols-3 gap-6 mb-12">
                                {company.stats && company.stats.map((stat: any, index: number) => {
                                    const Icon = IconMap[stat.icon] || Award;
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
