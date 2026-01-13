import { motion } from 'framer-motion';
import SectionWrapper from '../../components/SectionWrapper';
import { MapPin, Briefcase, Clock, ArrowRight } from 'lucide-react';

const jobOpenings = [
    {
        id: 1,
        title: 'Senior Maritime Engineer',
        company: 'OceanLK Marine',
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        department: 'Engineering',
        description: 'Lead our maritime engineering team in developing innovative shipping solutions.'
    },
    {
        id: 2,
        title: 'Resort Manager',
        company: 'OceanLK Leisure',
        location: 'Galle, Sri Lanka',
        type: 'Full-time',
        department: 'Hospitality',
        description: 'Manage daily operations of our flagship beach resort property.'
    },
    {
        id: 3,
        title: 'Renewable Energy Specialist',
        company: 'OceanLK Energy',
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        department: 'Engineering',
        description: 'Drive our solar and wind energy project implementations.'
    },
    {
        id: 4,
        title: 'Full Stack Developer',
        company: 'OceanLK Tech',
        location: 'Remote',
        type: 'Contract',
        department: 'Technology',
        description: 'Build cutting-edge web applications for our enterprise clients.'
    },
    {
        id: 5,
        title: 'Financial Analyst',
        company: 'OceanLK Holdings',
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        department: 'Finance',
        description: 'Provide financial analysis and strategic insights for group operations.'
    },
    {
        id: 6,
        title: 'Marketing Manager',
        company: 'OceanLK Leisure',
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        department: 'Marketing',
        description: 'Lead marketing strategies for our hospitality brands.'
    }
];

const Onboard = () => {
    return (
        <div className="min-h-screen">
            <SectionWrapper id="onboard" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">Career Opportunities</h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                        Join our team and be part of something extraordinary. Explore exciting opportunities
                        across our diverse portfolio of companies.
                    </p>

                    <div className="space-y-6">
                        {jobOpenings.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="glass p-6 rounded-xl hover:scale-[1.01] transition-transform group cursor-pointer"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                                                    {job.title}
                                                </h3>
                                                <p className="text-accent font-semibold">{job.company}</p>
                                            </div>
                                        </div>
                                        <p className="text-gray-300 mb-4">{job.description}</p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                {job.type}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-4 h-4" />
                                                {job.department}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bg-accent text-white px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-accent/90 transition-all self-start md:self-center">
                                        Apply Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-12 text-center glass p-8 rounded-xl"
                    >
                        <h3 className="text-2xl font-bold mb-4">Don't see a perfect fit?</h3>
                        <p className="text-gray-300 mb-6">
                            We're always looking for talented individuals. Submit your CV to our talent pool.
                        </p>
                        <a href="/careers/talent-pool" className="text-accent font-semibold hover:underline">
                            Join Our Talent Pool →
                        </a>
                    </motion.div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Onboard;
