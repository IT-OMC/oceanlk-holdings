import { motion } from 'framer-motion';
import SectionWrapper from '../../components/SectionWrapper';
import { Heart, Users, TrendingUp, Award, Coffee, Zap } from 'lucide-react';

const values = [
    {
        icon: Heart,
        title: 'People First',
        description: 'We believe in nurturing talent and creating an environment where everyone can thrive.'
    },
    {
        icon: TrendingUp,
        title: 'Growth Mindset',
        description: 'Continuous learning and development are at the core of our culture.'
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'We pursue excellence in everything we do, from small tasks to major projects.'
    },
    {
        icon: Zap,
        title: 'Innovation',
        description: 'We encourage creative thinking and embrace new ideas from all team members.'
    },
    {
        icon: Users,
        title: 'Collaboration',
        description: 'Together we achieve more through teamwork and mutual support.'
    },
    {
        icon: Coffee,
        title: 'Work-Life Balance',
        description: 'We value your well-being and support a healthy work-life integration.'
    }
];

const Culture = () => {
    return (
        <div className="min-h-screen">
            <SectionWrapper id="culture" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">Our Culture</h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                        At OceanLK, our culture is built on trust, innovation, and a shared commitment
                        to excellence. We create an environment where talent flourishes and ideas come to life.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="glass p-8 rounded-xl hover:scale-105 transition-transform"
                                >
                                    <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                        <Icon className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                                    <p className="text-gray-300">{value.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                        className="mt-16 glass p-12 rounded-xl"
                    >
                        <h2 className="text-3xl font-bold mb-6">Why Join OceanLK?</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-accent">Benefits & Perks</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li>• Competitive salary packages</li>
                                    <li>• Comprehensive health insurance</li>
                                    <li>• Professional development programs</li>
                                    <li>• Flexible working arrangements</li>
                                    <li>• Annual performance bonuses</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mb-3 text-accent">Growth Opportunities</h3>
                                <ul className="space-y-2 text-gray-300">
                                    <li>• Career advancement paths</li>
                                    <li>• Leadership training programs</li>
                                    <li>• International exposure</li>
                                    <li>• Mentorship programs</li>
                                    <li>• Skill development workshops</li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Culture;
