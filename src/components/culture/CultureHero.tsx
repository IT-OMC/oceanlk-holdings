import { motion } from 'framer-motion';

const CultureHero = () => {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Video Background */}
            <div className="absolute inset-0 w-full h-full">
                <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay using overlay color */}
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source
                        src="https://videos.pexels.com/video-files/3196344/3196344-uhd_2560_1440_25fps.mp4"
                        type="video/mp4"
                    />
                </video>
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight"
                >
                    More Than Just a Workplace.
                    <br />
                    <span className="text-accent bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
                        A Tide of Talent.
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-xl md:text-2xl text-gray-200 max-w-2xl font-light"
                >
                    Dive into a culture where innovation flows and every voice makes a ripple.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-12"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1.5 h-1.5 bg-white rounded-full"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CultureHero;
