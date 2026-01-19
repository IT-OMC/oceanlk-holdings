import { motion } from 'framer-motion';
import SectionWrapper from '../../components/SectionWrapper';
import { Target, Eye, Users, Shield, Globe } from 'lucide-react';
import { oceanData } from '../../data/mockData';

const Profile = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-navy">
            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/20 to-navy pointer-events-none" />
                <SectionWrapper>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-4xl mx-auto relative z-10"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
                            Corporate Profile
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">
                            {oceanData.company.tagline}
                        </p>
                    </motion.div>
                </SectionWrapper>
            </div>

            {/* Who We Are, What We Do, Why Choose Us */}
            <SectionWrapper className="py-20">
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {/* Who We Are */}
                    <motion.div variants={fadeIn} className="glass p-8 rounded-2xl border border-white/10 hover:border-accent/30 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/30 transition-colors">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Who We Are</h3>
                        <p className="text-gray-400 leading-relaxed">
                            OceanLK Holdings is a premier corporate holding company with a rich legacy of excellence spanning over three decades. From our roots in Sri Lanka, we've grown into a diversified powerhouse, uniting industry leaders under one strategic umbrella.
                        </p>
                    </motion.div>

                    {/* What We Do */}
                    <motion.div variants={fadeIn} className="glass p-8 rounded-2xl border border-white/10 hover:border-accent/30 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-500/30 transition-colors">
                            <Globe className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">What We Do</h3>
                        <p className="text-gray-400 leading-relaxed">
                            We drive sustainable growth across diverse sectors including Maritime, Logistics, Engineering, Investment, and Leisure. Our portfolio companies are interconnected, creating a robust ecosystem that delivers exceptional value and innovation globally.
                        </p>
                    </motion.div>

                    {/* Why Choose Us */}
                    <motion.div variants={fadeIn} className="glass p-8 rounded-2xl border border-white/10 hover:border-accent/30 transition-all duration-300 group">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/30 transition-colors">
                            <Shield className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white">Why Choose Us</h3>
                        <p className="text-gray-400 leading-relaxed">
                            Our unwavering commitment to operational excellence, integrity, and sustainable practices sets us apart. We combine deep local expertise with global standards, ensuring reliability and long-term success for all our partners and stakeholders.
                        </p>
                    </motion.div>
                </motion.div>
            </SectionWrapper>

            {/* Mission & Vision */}
            <div className="py-20 bg-gradient-to-b from-navy to-blue-900/20">
                <SectionWrapper>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" />
                            <div className="relative glass p-10 rounded-3xl border border-white/10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-accent/20 rounded-xl">
                                        <Eye className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white">Our Vision</h3>
                                </div>
                                <p className="text-xl text-gray-300 leading-relaxed italic">
                                    "To be the most trusted and innovative conglomerate in the region, driving sustainable growth and creating lasting value for all stakeholders."
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                            <div className="relative glass p-10 rounded-3xl border border-white/10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-blue-500/20 rounded-xl">
                                        <Target className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <h3 className="text-3xl font-bold text-white">Our Mission</h3>
                                </div>
                                <p className="text-xl text-gray-300 leading-relaxed">
                                    To deliver exceptional value through operational excellence, strategic innovation, and unwavering commitment to our core values and sustainable practices in every sector we operate.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </SectionWrapper>
            </div>

            {/* About Section */}
            <SectionWrapper className="py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="glass p-10 md:p-14 rounded-3xl border border-white/10 max-w-5xl mx-auto text-center"
                >
                    <h2 className="text-3xl font-bold mb-8 text-white">Our Journey</h2>
                    <p className="text-gray-300 leading-loose text-lg mb-6">
                        Established in 1990, OceanLK Holdings began as a dedicated maritime service provider. Over the decades, driven by a spirit of entrepreneurship and a vision for broader impact, we expanded our horizons. Today, we stand as a testament to resilience and strategic foresight, having successfully navigated global economic tides to build a conglomerate that powers industries and enriches lives.
                    </p>
                    <p className="text-gray-300 leading-loose text-lg">
                        We believe in the power of connection—connecting markets, connecting people, and connecting ideas. Our diverse portfolio serves as a bridge between Sri Lanka's immense potential and the global marketplace, fostering a future of shared prosperity.
                    </p>
                </motion.div>
            </SectionWrapper>

            {/* Purpose Statement Section */}
            <div className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent pointer-events-none" />
                <SectionWrapper>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10 text-center max-w-5xl mx-auto"
                    >
                        <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm mb-10 shadow-xl shadow-blue-900/20">
                            <Target className="w-10 h-10 text-accent" />
                        </div>

                        <h2 className="text-4xl md:text-6xl font-bold mb-12 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-200">
                            Our Purpose
                        </h2>

                        <div className="relative glass p-12 md:p-16 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50" />
                            <div className="absolute -left-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors duration-500" />
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors duration-500" />

                            <p className="relative text-2xl md:text-4xl text-gray-200 leading-tight font-light italic">
                                "To be the catalyst for <span className="text-accent font-normal">sustainable growth</span> and innovation, bridging local potential with <span className="text-blue-300 font-normal">global opportunities</span> to create lasting value for our nation and the world."
                            </p>
                        </div>
                    </motion.div>
                </SectionWrapper>
            </div>
        </div>
    );
};

export default Profile;
