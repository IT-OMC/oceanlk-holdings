import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const BusinessVideo = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    const [bgVideo, setBgVideo] = useState("https://www.youtube.com/embed/QRCJvp0p7uk?autoplay=1&mute=1&controls=0&loop=1&playlist=QRCJvp0p7uk&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1");
    const [frontVideo, setFrontVideo] = useState("https://www.youtube.com/embed/FjXRWYYuq_0?si=R-ohWNzHB__2fYgr");

    useEffect(() => {
        const timer = setTimeout(() => {
            setBgVideo("https://www.youtube.com/embed/6VfYIo2wBNk?autoplay=1&mute=1&controls=0&loop=1&playlist=6VfYIo2wBNk&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&playsinline=1");
            setFrontVideo("https://www.youtube.com/embed/XsVN3OLJ0qA?si=8oQ6yXb7mkRTShsY");
        }, 30000);

        return () => clearTimeout(timer);
    }, []);

    const addRelZero = (url: string) => {
        if (!url) return '';
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}rel=0`;
    };

    return (
        <section ref={containerRef} className="relative min-h-screen overflow-hidden flex items-center justify-center bg-black">
            {/* Background Video */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0 h-[120%]"
            >
                <iframe
                    className="w-full h-full pointer-events-none scale-[3] lg:scale-125 border-0"
                    src={bgVideo}
                    title="Background Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
            </motion.div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/60 z-10" />

            {/* Content Container */}
            <div className="relative z-20 container mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center h-full">

                {/* Text Content */}
                <motion.div
                    style={{ opacity }}
                    className="text-white space-y-6 max-w-xl"
                >
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-block py-1 px-3 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-semibold tracking-wider uppercase"
                    >
                        Our Vision
                    </motion.span>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
                    >
                        Pioneering the Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Logistics</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-lg text-slate-300 leading-relaxed"
                    >
                        At OceanLK, we bridge continents through seamless supply chain solutions.
                        Watch how we are redefining maritime and aviation logistics with innovation
                        and sustainable practices.
                    </motion.p>

                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-white text-slate-900 font-bold rounded-lg shadow-lg hover:shadow-cyan-500/20 transition-all"
                    >
                        Explore Our Services
                    </motion.button>
                </motion.div>

                {/* Side Video Player */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, x: 50 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 50 }}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black"
                >
                    <iframe
                        className="w-full h-full"
                        src={addRelZero(frontVideo)}
                        title="Company Overview"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                </motion.div>
            </div>
        </section>
    );
};

export default BusinessVideo;
