import { motion } from 'framer-motion';
import SectionWrapper from '../../components/SectionWrapper';

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
                </motion.div>
            </SectionWrapper>
        </div>
    );
};

export default Profile;
