import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Partners = () => {
    const [partners, setPartners] = useState<any[]>([]);

    useEffect(() => {
        const fetchPartners = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/partners');
                if (response.ok) {
                    const data = await response.json();

                    // Filter for PARTNER category
                    const partnerData = data.filter((p: any) => p.category === 'PARTNER');

                    const mapped = partnerData.map((p: any) => ({
                        ...p,
                        logo: p.logoUrl,
                    }));
                    setPartners(mapped);
                }
            } catch (error) {
                console.error('Failed to fetch partners', error);
            }
        };

        fetchPartners();
    }, []);

    // Create a safe list for carousel (duplicate for infinite scroll)
    const displayPartners = partners.length > 0 ? [...partners, ...partners, ...partners] : [];

    if (partners.length === 0) return null;

    return (
        <section className="relative min-h-[50vh] flex items-center justify-center bg-primary overflow-hidden py-16">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0 bg-primary">
                {/* Modern Gradient Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-primary to-primary" />

                {/* Abstract Glowing Orbs */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-[100px] translate-y-1/2" />

                {/* Mesh Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px),
                                        linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)' // Using black for mask to show mesh in center
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
                        className="text-center mb-12"
                    >
                        <h4 className="text-secondary uppercase tracking-[0.3em] text-sm font-bold mb-4">
                            Global Network
                        </h4>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-6">
                            Our <span className="text-white">Partners</span>
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg text-blue-100 leading-relaxed font-light">
                            Collaborating with industry leaders and global innovators to deliver excellence across every boundary.
                        </p>
                    </motion.div>
                </div>

                {/* Badges Carousel - Full Width */}
                <div className="w-full relative overflow-hidden py-8 group/carousel">
                    {/* Gradient Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-primary via-primary/80 to-transparent z-20 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-primary via-primary/80 to-transparent z-20 pointer-events-none" />

                    <motion.div
                        className="flex gap-6 md:gap-10 items-center"
                        animate={{ x: [0, -1000] }}
                        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                        style={{ width: 'fit-content' }}
                    >
                        {displayPartners.map((partner, i) => (
                            <div
                                key={i}
                                className="group relative flex-shrink-0"
                            >
                                <div className="relative w-48 h-32 md:w-56 md:h-40 perspective-1000">
                                    <div className="relative w-full h-full bg-white rounded-xl p-4 flex items-center justify-center transition-all duration-500 hover:-translate-y-1 shadow-md hover:shadow-xl overflow-hidden">

                                        <div className="relative z-10 w-full h-full p-2 flex items-center justify-center transition-all duration-500">
                                            <img
                                                src={partner.logo}
                                                alt={partner.name}
                                                className="max-w-full max-h-full object-contain"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-center mt-3 text-blue-100 font-medium text-sm group-hover:text-white transition-colors duration-300 opacity-0 group-hover:opacity-100">{partner.name}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Partners;
