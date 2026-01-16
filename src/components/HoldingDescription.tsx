// import { useRef } from 'react';
import { motion } from 'framer-motion';

const HoldingDescription = () => {
    // const ref = useRef<HTMLDivElement>(null);


    const partners = [
        { name: "Global Shipping Alliance", logo: "/partner_logos/partner1.png" },
        { name: "EcoMarine Solutions", logo: "/partner_logos/partner2.png" },
        { name: "Asian Logistics Network", logo: "/partner_logos/partner3.png" },
        { name: "Ceylon Trade Hub", logo: "/partner_logos/partner4.png" },
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden py-24">
            {/* Vivid Deep Sea Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-b from-blue-950 via-black to-blue-950" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />

                {/* Square Mesh Overlay */}
                <div
                    className="absolute inset-0 z-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)'
                    }}
                />

                {/* Animated Caustics/Glows */}
                <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[100px]"
                />
                <motion.div
                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="relative z-10 w-full">
                <div className="flex flex-col items-center">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16 px-6"
                    >
                        <h4 className="text-blue-400 uppercase tracking-[0.2em] text-sm font-semibold mb-2">Ocean Ceylon Holdings</h4>
                        <h2 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 tracking-tighter mb-8">
                            OUR GLOBAL FOOTPRINT
                            <div className="h-1.5 w-24 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mt-2 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                        </h2>

                        <p className="max-w-4xl mx-auto text-lg md:text-xl text-gray-300 leading-relaxed font-light">
                            From the heart of Sri Lanka to the global stage. We are a diversified powerhouse driving sustainable innovation across marine, logistics, and leisure sectors.
                            We collaborate with world-renowned organizations to drive sustainable growth and innovation. Together, we deliver world-class solutions that transcend boundaries.
                        </p>
                    </motion.div>

                    {/* Partner Logos Carousel (Right to Left) */}
                    <div className="w-full overflow-hidden mb-20 relative px-4 md:px-0">
                        {/* Gradient Masks */}
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

                        <h4 className="text-center text-blue-400 uppercase tracking-[0.2em] text-sm font-semibold mb-8">Our Trusted Partners</h4>

                        <motion.div
                            className="flex gap-16 md:gap-24 items-center pl-8"
                            animate={{ x: [0, -1000] }} // Adjust based on width
                            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                            style={{
                                width: 'fit-content',
                            }}
                        >
                            {/* Infinite Loop of Logos - Duplicating enough times to ensure smooth scroll */}
                            {[...partners, ...partners, ...partners, ...partners, ...partners, ...partners, ...partners].map((partner, i) => (
                                <div
                                    key={i}
                                    className="relative group flex-shrink-0"
                                >
                                    <div className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center p-6 hover:bg-white/10 transition-colors duration-500">
                                        <img
                                            src={partner.logo}
                                            alt={partner.name}
                                            className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500 opacity-70 group-hover:opacity-100 transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                        <span className="text-cyan-400 text-sm font-medium tracking-wider">{partner.name}</span>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default HoldingDescription;
