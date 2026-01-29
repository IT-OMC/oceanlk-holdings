import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Calendar, PartyPopper } from 'lucide-react';

const ActivityTimeline = () => {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["1%", "-95%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-neutral-900">
            <div className="sticky top-0 flex h-screen items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-20 px-20">
                    {/* Intro Card */}
                    <div className="flex-shrink-0 w-[500px] h-[600px] flex items-center justify-center">
                        <div>
                            <h2 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-6">
                                Life in<br />Motion
                            </h2>
                            <p className="text-2xl text-gray-400 max-w-md">
                                From the pitch to the party, explore the moments that bring us together.
                            </p>
                            <div className="flex gap-4 mt-8 text-white/50">
                                <span className="flex items-center gap-2"><Trophy size={16} /> Sports</span>
                                <span className="flex items-center gap-2"><PartyPopper size={16} /> Festivals</span>
                                <span className="flex items-center gap-2"><Calendar size={16} /> Birthdays</span>
                            </div>
                        </div>
                    </div>

                    {/* Category 1: The Arena (Sports) */}
                    <ArenaSection />

                    {/* Category 2: The Festival (Celebrations) */}
                    <FestivalSection />

                    {/* Category 3: Cake Day (Birthdays) */}
                    <BirthdaySection />
                </motion.div>
            </div>
        </section>
    );
};

const ArenaSection = () => {
    return (
        <div className="flex-shrink-0 w-[800px] h-[600px] bg-neutral-800 rounded-3xl overflow-hidden relative group border border-white/5">
            <div className="absolute inset-0 bg-neutral-900 z-0">
                <img
                    src="https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=2600&auto=format&fit=crop"
                    alt="Cricket Match"
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100 group-hover:scale-105"
                />
            </div>

            <div className="absolute top-8 left-8 z-10 bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
                <div className="flex items-center gap-2 text-white font-mono">
                    <span className="text-red-500 animate-pulse">●</span> LIVE SCORE
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/90 to-transparent z-10">
                <h3 className="text-6xl font-black text-white italic tracking-tighter mb-2">THE ARENA</h3>
                <p className="text-xl text-gray-300">Annual Cricket Tournament 2024</p>
                <div className="flex gap-8 mt-6 font-mono text-3xl text-white">
                    <div>
                        <span className="text-xs text-gray-500 block">OCEAN MARINE</span>
                        142/4
                    </div>
                    <div className="text-accent text-lg self-center">VS</div>
                    <div>
                        <span className="text-xs text-gray-500 block">OCEAN TECH</span>
                        138/8
                    </div>
                </div>
            </div>
        </div>
    );
};

const FestivalSection = () => {
    const photos = [
        { id: 1, rotate: -6, z: 10, src: "https://images.unsplash.com/photo-1514525253440-b393452e23f0?q=80&w=1000&auto=format&fit=crop" },
        { id: 2, rotate: 3, z: 20, src: "https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1000&auto=format&fit=crop" },
        { id: 3, rotate: -12, z: 5, src: "https://images.unsplash.com/photo-1545228519-aa32537cb017?q=80&w=1000&auto=format&fit=crop" },
    ];

    return (
        <div className="flex-shrink-0 w-[600px] h-[600px] flex items-center justify-center relative">
            <div className="absolute inset-0 flex flex-col items-center justify-center -z-10">
                <h3 className="text-6xl font-black text-white/10 tracking-widest uppercase">Festivals</h3>
                <p className="text-white/20">Drag the memories</p>
            </div>
            {photos.map((photo) => (
                <motion.div
                    key={photo.id}
                    drag
                    dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                    whileDrag={{ scale: 1.1, zIndex: 100 }}
                    initial={{ rotate: photo.rotate }}
                    className="absolute w-72 h-80 bg-white p-3 pb-12 shadow-2xl cursor-grab active:cursor-grabbing transform hover:rotate-0 transition-transform duration-300"
                    style={{ zIndex: photo.z }}
                >
                    <div className="w-full h-full bg-gray-200 overflow-hidden">
                        <img src={photo.src} alt="Festival" className="w-full h-full object-cover" />
                    </div>
                </motion.div>
            ))}
        </div>
    );
};

const BirthdaySection = () => {
    const handleConfetti = () => {
        const end = Date.now() + 1000;
        const colors = ['#bb0000', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    };

    return (
        <div className="flex-shrink-0 w-[500px] h-[600px] bg-white rounded-3xl p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">JANUARY</span>
            </div>

            <h3 className="text-4xl font-black text-gray-900 mb-8 mt-4">Cake Day</h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="group relative" onMouseEnter={handleConfetti}>
                    <div className="aspect-square rounded-2xl overflow-hidden mb-2">
                        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" alt="Birthday" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-gray-800">Sarah J.</p>
                    <p className="text-sm text-gray-500">Jan 12</p>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        Today!
                    </div>
                </div>
                <div className="group relative" onMouseEnter={handleConfetti}>
                    <div className="aspect-square rounded-2xl overflow-hidden mb-2">
                        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" alt="Birthday" className="w-full h-full object-cover" />
                    </div>
                    <p className="font-bold text-gray-800">Mike R.</p>
                    <p className="text-sm text-gray-500">Jan 24</p>
                </div>
            </div>

            <div className="mt-auto bg-gray-100 p-4 rounded-xl flex items-center gap-4">
                <PartyPopper className="text-orange-500" />
                <p className="text-sm text-gray-600">
                    Hover over the birthday stars to celebrate with them!
                </p>
            </div>
        </div>
    );
};

export default ActivityTimeline;
