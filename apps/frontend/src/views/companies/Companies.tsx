import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowRight, Users, Calendar } from 'lucide-react';
import { oceanData } from '../../data/mockData';

const Companies = () => {
    return (
        <div className="min-h-screen bg-gray-50/50">
            <SectionWrapper id="companies" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="mb-16">
                        <h1 className="text-5xl font-bold mb-6 text-gray-900">Our Companies</h1>
                        <p className="text-xl text-gray-600 max-w-3xl">
                            A diversified portfolio of industry-leading companies driving excellence
                            across multiple sectors.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {oceanData.sectors.map((company: any, index: number) => (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link to={`/companies/${company.id}`} className="block h-full">
                                    <div className="group h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                                        {/* Image Header */}
                                        <div className="relative h-56 overflow-hidden">
                                            <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-gray-900/0 transition-colors z-10" />
                                            <img
                                                src={company.image}
                                                alt={company.title}
                                                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                            />
                                            {/* Logo Overlay */}
                                            <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                                                <img
                                                    src={company.logo}
                                                    alt={`${company.title} logo`}
                                                    className="w-12 h-12 object-contain"
                                                />
                                            </div>
                                            {/* Category Tag */}
                                            <div className="absolute top-4 right-4 z-20">
                                                <span className="bg-primary/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                                    {company.category}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content Body */}
                                        <div className="p-8">
                                            <div className="mb-4">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                                    {company.title}
                                                </h3>
                                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                                    {company.desc}
                                                </p>
                                            </div>

                                            {/* Divider */}
                                            <div className="h-px w-full bg-gray-100 my-6" />

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                                        <Calendar className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Est.</p>
                                                        <p className="text-sm font-semibold text-gray-900">{company.founded}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <Users className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Team</p>
                                                        <p className="text-sm font-semibold text-gray-900">{company.employees}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Footer */}
                                            <div className="flex items-center text-primary font-semibold text-sm group/btn">
                                                <span className="mr-2">View Company Profile</span>
                                                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Companies;
