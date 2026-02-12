import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const verticals = [
    {
        id: 1,
        title: "Ocean Maritime Ceylon",
        expandedHeading: "Global Ocean Freight",
        description: "Comprehensive ocean freight solutions connecting major global ports with precision and efficiency.",
        collapsedImage: "/ecosystem-images/Front images/1.jpeg",
        expandedImage: "/ecosystem-images/Main images/1.jpg",
        color: "from-blue-600 to-cyan-600",
        link: "/companies/omc"
    },
    {
        id: 2,
        title: "Ocean Engineering Ceylon",
        expandedHeading: "Marine Engineering Excellence",
        description: "Expert marine engineering services ensuring vessel peak performance and safety compliance.",
        collapsedImage: "/ecosystem-images/Front images/2.png",
        expandedImage: "/ecosystem-images/Main images/2.jpg",
        color: "from-sky-600 to-indigo-600",
        link: "/companies/oec"
    },
    {
        id: 3,
        title: "Ocean Maritime Channel",
        expandedHeading: "Maritime Logistics Channel",
        description: "Seamless logistics channel management and global product sourcing for maritime operations.",
        collapsedImage: "/ecosystem-images/Front images/3.jpg",
        expandedImage: "/ecosystem-images/Main images/3.jpg",
        color: "from-emerald-600 to-teal-600",
        link: "/companies/omch"
    },
    {
        id: 4,
        title: "Connecting Cubes",
        expandedHeading: "Luxury Corporate Travel",
        description: "Premium travel agency curating personalized corporate and luxury travel experiences.",
        collapsedImage: "/ecosystem-images/Front images/4.jpg",
        expandedImage: "/ecosystem-images/Main images/4.jpg",
        color: "from-purple-600 to-violet-600",
        link: "/companies/connecting-cubes"
    },
    {
        id: 5,
        title: "Digital Books",
        expandedHeading: "Digital Storytelling & Marketing",
        description: "Forward-thinking digital marketing agency driving brand visibility and storytelling.",
        collapsedImage: "/ecosystem-images/Front images/5.jpg",
        expandedImage: "/ecosystem-images/Main images/5.jpg",
        color: "from-orange-600 to-red-600",
        link: "/companies/digital-books"
    },
];

const EcosystemAccordion = () => {
    const [activeId, setActiveId] = useState<number | null>(1);
    const navigate = useNavigate();

    return (
        <section className="relative py-24 text-white overflow-hidden">
            {/* Extended Background: Video + Overlay */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="/ecosystem-images/Background/0_Underwater_Ocean_720x720.mp4" type="video/mp4" />
                </video>
                {/* Vivid overlay to ensure text readability while keeping the ocean vibe */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-blue-950/40 to-slate-950/90 mix-blend-multiply" />
                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay" />
            </div>

            <div className="relative z-10 container mx-auto px-6 h-[600px] flex flex-col lg:flex-row gap-4">

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
                            {/* Background Image - Expanded */}
                            <AnimatePresence mode="popLayout">
                                {activeId === item.id && (
                                    <motion.img
                                        initial={{ opacity: 0, scale: 1.2 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.7 }}
                                        src={item.expandedImage}
                                        alt={`${item.title} Expanded`}
                                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            // Fallback if image not found to unsplash or placeholder
                                            (e.target as HTMLImageElement).src = `https://source.unsplash.com/random/800x600/?business,${item.id}`;
                                        }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Background Image - Collapsed (Always rendered but hidden when expanded to maintain state if needed, or re-rendered) 
                                 Actually, it's better to render it when NOT active, or underneath. 
                                 Let's render it always at a lower z-index or opacity if we want a smooth transition, 
                                 but for simplicity and performance, let's show it when !activeId.
                             */}
                            <AnimatePresence>
                                {activeId !== item.id && (
                                    <motion.img
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 0.4 }}
                                        exit={{ opacity: 0 }}
                                        src={item.collapsedImage}
                                        alt={`${item.title} Collapsed`}
                                        className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = `https://source.unsplash.com/random/400x800/?abstract,${item.id}`;
                                        }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-b ${item.color} ${activeId === item.id ? 'opacity-20' : 'opacity-40'} transition-opacity`} />

                            {/* Content */}
                            <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <span className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50 ${activeId === item.id ? '' : 'lg:-rotate-90 lg:mt-32 lg:whitespace-nowrap'}`}>
                                        0{item.id}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h3 className={`text-xl lg:text-3xl font-bold text-white whitespace-nowrap ${activeId !== item.id ? 'lg:hidden' : ''}`}>
                                        {activeId === item.id ? item.expandedHeading : item.title}
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
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(item.link);
                                                }}
                                                className="text-sm font-semibold text-white/80 hover:text-white flex items-center gap-2 group/btn"
                                            >
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
