import { motion } from 'framer-motion';
import SectionWrapper from '../../components/SectionWrapper';
import { oceanData } from '../../data/mockData';
import { Globe } from 'lucide-react';

const Profile = () => {
    return (
        <div className="min-h-screen">
            <SectionWrapper id="profile" className="pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-5xl font-bold mb-6">Corporate Profile</h1>
                    <p className="text-xl text-gray-300 mb-8">
                        OceanLK Holdings is a premier corporate holding company with a rich legacy of excellence
                        spanning over three decades. From our roots in Sri Lanka, we've grown into a diversified
                        powerhouse with a global footprint.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mt-12">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="glass p-8 rounded-xl"
                        >
                            <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                            <p className="text-gray-300">
                                To be the most trusted and innovative conglomerate in the region,
                                driving sustainable growth and creating lasting value for all stakeholders.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="glass p-8 rounded-xl"
                        >
                            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                            <p className="text-gray-300">
                                To deliver exceptional value through operational excellence, strategic innovation,
                                and unwavering commitment to our core values and sustainable practices.
                            </p>
                        </motion.div>
                    </div>

                    {/* Partners Section */}
                    <div id="partners" className="mt-32">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold mb-6">Our Strategic Partners</h2>
                            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                                We believe in the power of collaboration. Our network of global partners ensures we deliver world-class solutions across all our sectors.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {oceanData.partners.map((partner, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 transition-colors flex flex-col items-center justify-center text-center group"
                                >
                                    <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        {/* Using Icon placeholder if no real logo image, or render image if available */}
                                        <Globe className="w-10 h-10 text-cyan-400 opacity-80 group-hover:opacity-100" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{partner.name}</h3>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Profile;
