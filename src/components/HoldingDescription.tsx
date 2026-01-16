import { motion } from 'framer-motion';

const HoldingDescription = () => {

    const partners = [
        { name: "Global Shipping Alliance", logo: "/partner_logos/partner1.png" },
        { name: "EcoMarine Solutions", logo: "/partner_logos/partner2.png" },
        { name: "Asian Logistics Network", logo: "/partner_logos/partner3.png" },
        { name: "Ceylon Trade Hub", logo: "/partner_logos/partner4.png" },
        // Repeat for demo purposes
        { name: "Global Shipping Alliance", logo: "/partner_logos/partner1.png" },
        { name: "EcoMarine Solutions", logo: "/partner_logos/partner2.png" },
        { name: "Asian Logistics Network", logo: "/partner_logos/partner3.png" },
        { name: "Ceylon Trade Hub", logo: "/partner_logos/partner4.png" },
    ];

    return (
        <section className="relative min-h-[80vh] flex items-center justify-center bg-black overflow-hidden py-24">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-black to-blue-950" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

                {/* Subtle Grid */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            <div className="relative z-10 w-full">
                <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">

                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <h4 className="text-cyan-400 uppercase tracking-[0.3em] text-sm font-bold mb-4">
                            Ocean Ceylon Holdings
                        </h4>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-8">
                            POWERING PROGRESS<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                                TOGETHER
                            </span>
                        </h2>

                        <p className="max-w-3xl mx-auto text-lg text-gray-300 leading-relaxed font-light">
                            We are a diversified holding company, uniting industry leaders to drive sustainable innovation.
                            Our strength lies in our network—collaborating with world-class partners to deliver excellence across marine, logistics, and leisure sectors.
                        </p>
                    </motion.div>
                </div>

                {/* Partner Badges Carousel - Full Width */}
                <div className="w-full relative overflow-hidden py-16">
                    {/* Gradient Masks - Pushed to edges */}
                    <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

                    <motion.div
                        className="flex gap-8 md:gap-12 items-center"
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        style={{ width: 'fit-content' }}
                    >
                        {/* Duplicate for smooth infinite scroll */}
                        {[...partners, ...partners, ...partners, ...partners].map((partner, i) => (
                            <div
                                key={i}
                                className="group relative flex-shrink-0"
                            >
                                {/* New Premium Card Design */}
                                <div className="relative w-48 h-48 md:w-64 md:h-64">
                                    {/* Animated Border */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-secondary/40 to-primary/40 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Main Card */}
                                    <div className="relative w-full h-full bg-gradient-to-br from-white/[0.08] to-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/[0.12]">

                                        {/* Hexagon Background Pattern */}
                                        <div className="absolute inset-0 opacity-5">
                                            <svg className="w-full h-full" viewBox="0 0 100 100">
                                                <pattern id="hexagons" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                                    <polygon points="10,1 18,5 18,13 10,17 2,13 2,5" fill="none" stroke="white" strokeWidth="0.5" />
                                                </pattern>
                                                <rect width="100" height="100" fill="url(#hexagons)" />
                                            </svg>
                                        </div>

                                        {/* Logo Container */}
                                        <div className="relative z-10 w-24 h-24 md:w-32 md:h-32 flex items-center justify-center mb-6">
                                            {/* Pulsing Glow */}
                                            <motion.div
                                                animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 0.8] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                                className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 blur-2xl rounded-full"
                                            />

                                            <img
                                                src={partner.logo}
                                                alt={partner.name}
                                                className="relative w-full h-full object-contain filter drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>

                                        {/* Divider Line */}
                                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent mb-4" />

                                        {/* Partner Name */}
                                        <p className="relative z-10 text-white text-sm md:text-base font-semibold uppercase tracking-wide text-center opacity-80 group-hover:opacity-100 transition-opacity">
                                            {partner.name}
                                        </p>

                                        {/* Shine Effect */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Partnership CTA Button - Moved to Bottom */}
                <div className="w-full flex justify-center py-12">
                    <motion.a
                        href="/contact"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-full shadow-lg hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                    >
                        <span>Become a Partner</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </motion.a>
                </div>
            </div>
        </section>
    );
};

export default HoldingDescription;

