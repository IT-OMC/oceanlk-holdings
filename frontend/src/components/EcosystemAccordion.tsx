import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const verticals = [
    {
        id: 1,
        title: "Maritime Logistics",
        description: "Comprehensive ocean freight solutions connecting major global ports with precision and efficiency.",
        image: "https://images.unsplash.com/photo-1494412574643-35d324688133?q=80&w=2075&auto=format&fit=crop", // Container ship
        color: "from-blue-600 to-cyan-600"
    },
    {
        id: 2,
        title: "Aviation Services",
        description: "Rapid air cargo transport ensuring time-critical deliveries across international borders.",
        image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2074&auto=format&fit=crop", // Airplane
        color: "from-sky-600 to-indigo-600"
    },
    {
        id: 3,
        title: "Ground Transport",
        description: "Reliable inland transportation network bridging the last mile with our extensive fleet.",
        image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?q=80&w=2075&auto=format&fit=crop", // Truck
        color: "from-emerald-600 to-teal-600"
    },
    {
        id: 4,
        title: "Warehousing",
        description: "State-of-the-art storage facilities with advanced inventory management systems.",
        image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop", // Warehouse
        color: "from-purple-600 to-violet-600"
    },
];

const EcosystemAccordion = () => {
    const [activeId, setActiveId] = useState<number | null>(1); // Default to first item open

    return (
        <section className="py-24 bg-slate-950 text-white overflow-hidden">
            <div className="container mx-auto px-6 h-[600px] flex flex-col lg:flex-row gap-4">

                {/* Header for Mobile / Intro Area */}
                <div className="lg:w-1/4 mb-10 lg:mb-0 flex flex-col justify-center pr-8 space-y-6">
                    <h2 className="text-4xl font-bold">
                        Our Business <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                            Ecosystem
                        </span>
                    </h2>
                    <p className="text-slate-400">
                        Explore our integrated verticals designed to provide end-to-end supply chain mastery.
                        Click to discover more about our capabilities.
                    </p>
                    <div className="h-1 w-20 bg-blue-500 rounded-full" />
                </div>

                {/* Accordion Container */}
                <div className="flex-1 flex flex-col lg:flex-row gap-2 h-full">
                    {verticals.map((item) => (
                        <motion.div
                            key={item.id}
                            layout
                            onClick={() => setActiveId(item.id)}
                            className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-500 ease-in-out
                                ${activeId === item.id ? 'flex-[3] lg:flex-[3]' : 'flex-1 lg:flex-[1]'}
                                h-[120px] lg:h-full bg-slate-900 border border-slate-800 group
                            `}
                        >
                            {/* Background Image */}
                            <AnimatePresence mode="popLayout">
                                {activeId === item.id && (
                                    <motion.img
                                        initial={{ opacity: 0, scale: 1.2 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.7 }}
                                        src={item.image}
                                        alt={item.title}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                    />
                                )}
                            </AnimatePresence>

                            {/* Gradient Overlay for inactive showing text */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${item.color} ${activeId === item.id ? 'opacity-20' : 'opacity-10'} transition-opacity`} />

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50 ${activeId === item.id ? '' : 'lg:-rotate-90 lg:mt-32 lg:whitespace-nowrap'}`}>
                                        0{item.id}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className={`text-xl lg:text-3xl font-bold text-white whitespace-nowrap ${activeId !== item.id && 'lg:hidden'}`}>
                                        {item.title}
                                    </h3>

                                    {activeId === item.id && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            <p className="text-slate-200 text-sm lg:text-base max-w-lg mb-4">
                                                {item.description}
                                            </p>
                                            <button className="text-sm font-semibold text-white/80 hover:text-white flex items-center gap-2 group/btn">
                                                Learn More
                                                <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
                                            </button>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EcosystemAccordion;
