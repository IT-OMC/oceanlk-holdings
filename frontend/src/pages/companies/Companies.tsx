import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowRight } from 'lucide-react';
import { oceanData } from '../../data/mockData';

const Companies = () => {
    return (
        <div className="min-h-screen">
            <SectionWrapper id="companies" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">Our Companies</h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                        A diversified portfolio of industry-leading companies driving excellence
                        across multiple sectors.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        {oceanData.sectors.map((company: any, index: number) => (
                            <motion.div
                                key={company.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Link to={`/companies/${company.id}`}>
                                    <div className="glass rounded-xl overflow-hidden hover:scale-[1.02] transition-transform group">
                                        <div className="relative h-64 overflow-hidden">
                                            <img
                                                src={company.image}
                                                alt={company.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/50 to-transparent" />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-accent text-sm font-semibold uppercase tracking-wider">
                                                    {company.category}
                                                </span>
                                                <ArrowRight className="w-5 h-5 text-accent group-hover:translate-x-2 transition-transform" />
                                            </div>
                                            <h3 className="text-2xl font-bold mb-3">{company.title}</h3>
                                            <p className="text-gray-300 mb-4">{company.desc}</p>
                                            <div className="flex gap-6 text-sm">
                                                <div>
                                                    <span className="text-gray-400">Founded:</span>
                                                    <span className="ml-2 font-semibold">{company.founded}</span>
                                                </div>
                                                <div>
                                                    <span className="text-gray-400">Employees:</span>
                                                    <span className="ml-2 font-semibold">{company.employees}</span>
                                                </div>
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
