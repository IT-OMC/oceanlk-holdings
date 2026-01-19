import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const HoldingDescription = () => {
    const { t } = useTranslation();

    const memberships = [
        { name: "World Shipping Council", logo: "/partner_logos/partner1.png", year: "2018" },
        { name: "Int. Chamber of Shipping", logo: "/partner_logos/partner2.png", year: "2019" },
        { name: "BIMCO Member", logo: "/partner_logos/partner3.png", year: "2020" },
        { name: "Marine Environment Pro.", logo: "/partner_logos/partner4.png", year: "2021" },
        // Repeat for demo purposes
        { name: "World Shipping Council", logo: "/partner_logos/partner1.png", year: "2018" },
        { name: "Int. Chamber of Shipping", logo: "/partner_logos/partner2.png", year: "2019" },
        { name: "BIMCO Member", logo: "/partner_logos/partner3.png", year: "2020" },
        { name: "Marine Environment Pro.", logo: "/partner_logos/partner4.png", year: "2021" },
    ];

    return (
        <section className="relative min-h-[70vh] flex items-center justify-center bg-black overflow-hidden py-24">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950/20 via-black to-blue-950/20" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay" />

                {/* Glow effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">

                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h4 className="text-secondary uppercase tracking-[0.3em] text-sm font-bold mb-4">
                            {t('home.memberships.label')}
                        </h4>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6">
                            {t('home.memberships.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('home.memberships.titleAccent')}</span>
                        </h2>

                        <p className="max-w-2xl mx-auto text-lg text-gray-400 leading-relaxed font-light">
                            {t('home.memberships.description')}
                        </p>
                    </motion.div>
                </div>

                {/* Badges Carousel - Full Width */}
                <div className="w-full relative overflow-hidden py-10 group/carousel">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

                    <motion.div
                        className="flex gap-6 md:gap-10 items-center"
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        style={{ width: 'fit-content' }}
                    >
                        {/* Duplicate for smooth infinite scroll */}
                        {[...memberships, ...memberships, ...memberships].map((member, i) => (
                            <div
                                key={i}
                                className="group relative flex-shrink-0"
                            >
                                {/* Premium Card Design */}
                                <div className="relative w-56 h-64 md:w-64 md:h-72 perspective-1000">

                                    {/* Card Container */}
                                    <div className="relative w-full h-full bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-between transition-all duration-500 group-hover:border-primary/30 group-hover:bg-[#0f0f0f] shadow-xl overflow-hidden">

                                        {/* Hover Gradient Background */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Status Badge */}
                                        <div className="absolute top-4 right-4 z-20">
                                            <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-gray-400 border border-white/5 uppercase tracking-wider group-hover:bg-primary/10 group-hover:text-primary group-hover:border-primary/20 transition-colors">
                                                {t('home.memberships.activeBadge')}
                                            </div>
                                        </div>

                                        {/* Logo Container */}
                                        <div className="relative z-10 w-24 h-24 flex items-center justify-center mt-4">
                                            {/* Logo Glow */}
                                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150" />

                                            <img
                                                src={member.logo}
                                                alt={member.name}
                                                className="relative w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 drop-shadow-lg"
                                            />
                                        </div>

                                        {/* Text Info */}
                                        <div className="relative z-10 w-full text-center space-y-2 mt-4">
                                            <p className="text-white font-medium text-sm md:text-base leading-tight group-hover:text-primary transition-colors duration-300">
                                                {member.name}
                                            </p>
                                            <div className="h-px w-12 mx-auto bg-gradient-to-r from-transparent via-gray-700 to-transparent group-hover:via-primary/50 transition-all" />
                                            <p className="text-xs text-gray-500 font-mono">
                                                {t('home.memberships.memberSince')} {member.year}
                                            </p>
                                        </div>

                                        {/* Bottom Accent */}
                                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HoldingDescription;

