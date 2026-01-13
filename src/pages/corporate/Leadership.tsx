import { motion } from 'framer-motion';
import SectionWrapper from '../../components/SectionWrapper';
import { Linkedin, Mail } from 'lucide-react';

const leadershipTeam = [
    {
        id: 1,
        name: 'Rajesh Fernando',
        position: 'Chairman & CEO',
        bio: 'Leading OceanLK with over 30 years of industry experience.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
    },
    {
        id: 2,
        name: 'Priya Jayawardena',
        position: 'Chief Financial Officer',
        bio: 'Expert in corporate finance and strategic planning.',
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop'
    },
    {
        id: 3,
        name: 'Michael De Silva',
        position: 'Chief Operating Officer',
        bio: 'Driving operational excellence across all business units.',
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop'
    },
    {
        id: 4,
        name: 'Samantha Perera',
        position: 'Chief Strategy Officer',
        bio: 'Architecting the future of OceanLK Holdings.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop'
    }
];

const Leadership = () => {
    return (
        <div className="min-h-screen">
            <SectionWrapper id="leadership" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">Leadership Team</h1>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                        Our leadership team brings together decades of experience, driving innovation
                        and excellence across all our business operations.
                    </p>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {leadershipTeam.map((leader, index) => (
                            <motion.div
                                key={leader.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="glass p-6 rounded-xl hover:scale-105 transition-transform"
                            >
                                <img
                                    src={leader.image}
                                    alt={leader.name}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                                <h3 className="text-xl font-bold mb-2">{leader.name}</h3>
                                <p className="text-accent font-semibold mb-3">{leader.position}</p>
                                <p className="text-gray-300 text-sm mb-4">{leader.bio}</p>
                                <div className="flex gap-3">
                                    <button className="p-2 bg-primary-light rounded-full hover:bg-accent transition-colors">
                                        <Linkedin className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 bg-primary-light rounded-full hover:bg-accent transition-colors">
                                        <Mail className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Leadership;
