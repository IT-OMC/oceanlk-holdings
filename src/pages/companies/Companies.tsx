import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SectionWrapper from '../../components/SectionWrapper';
import { ArrowRight } from 'lucide-react';

const companies = [
    {
        id: 'ocean-marine',
        name: 'OceanLK Marine',
        category: 'Maritime & Logistics',
        description: 'Leading maritime solutions and logistics services across the Indian Ocean region.',
        image: 'https://images.unsplash.com/photo-1559302504-64aae6ca6b6f?q=80&w=2537&auto=format&fit=crop',
        founded: '1988',
        employees: '500+'
    },
    {
        id: 'ocean-leisure',
        name: 'OceanLK Leisure',
        category: 'Hospitality & Tourism',
        description: 'Redefining island hospitality with world-class resorts and experiences.',
        image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2649&auto=format&fit=crop',
        founded: '1995',
        employees: '800+'
    },
    {
        id: 'ocean-energy',
        name: 'OceanLK Energy',
        category: 'Renewable Energy',
        description: 'Pioneering sustainable energy solutions for a greener tomorrow.',
        image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=2670&auto=format&fit=crop',
        founded: '2010',
        employees: '300+'
    },
    {
        id: 'ocean-tech',
        name: 'OceanLK Tech',
        category: 'Technology & Innovation',
        description: 'Driving digital transformation and technological innovation.',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
        founded: '2015',
        employees: '200+'
    },
    {
        id: 'ocean-capital',
        name: 'OceanLK Capital',
        category: 'Investment & Finance',
        description: 'Strategic investment arm driving financial growth and sustainable value creation.',
        image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=2670&auto=format&fit=crop',
        founded: '2018',
        employees: '50+'
    }
];

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
                        {companies.map((company, index) => (
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
                                                alt={company.name}
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
                                            <h3 className="text-2xl font-bold mb-3">{company.name}</h3>
                                            <p className="text-gray-300 mb-4">{company.description}</p>
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
