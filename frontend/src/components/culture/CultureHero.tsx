import { motion } from 'framer-motion';

const CultureHero = () => {
    return (
        <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-blue-900/40 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://assets.mixkit.co/videos/preview/mixkit-underwater-bubbles-rising-to-the-surface-1188-large.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="relative z-20 text-center max-w-5xl mx-auto px-6">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="text-6xl md:text-8xl font-bold mb-6 tracking-tight text-white"
                >
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Culture</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-3xl mx-auto"
                >
                    At Ocean Ceylon Holdings, we foster a diverse ecosystem where sports, celebrations, and individual milestones ripple into collective success.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-12"
                >
                    <div className="flex justify-center gap-4">
                        <div className="h-16 w-1 bg-cyan-400/50 rounded-full animate-pulse" />
                        <div className="h-12 w-1 bg-cyan-400/30 rounded-full animate-pulse delay-100" />
                        <div className="h-20 w-1 bg-cyan-400/70 rounded-full animate-pulse delay-75" />
                        <div className="h-14 w-1 bg-cyan-400/40 rounded-full animate-pulse delay-200" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CultureHero;
