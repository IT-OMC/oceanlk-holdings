import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { useState } from 'react';

const voices = [
    {
        name: 'Sarah Chen',
        role: 'Senior Developer',
        quote: "The automomy here is incredible. I'm trusted to make architectural decisions.",
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'
    },
    {
        name: 'James Wilson',
        role: 'Product Manager',
        quote: "Every Friday demo day amazes me. The speed of innovation is unmatched.",
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'
    },
    {
        name: 'Priya Patel',
        role: "UX Designer",
        quote: "Design isn't an afterthought here. It's woven into every product decision.",
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'
    }
];

const EmployeeVoices = () => {
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);

    return (
        <div className="py-20">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl font-bold mb-16 text-center">Voices of OceanLK</h2>

                <div className="grid md:grid-cols-3 gap-8">
                    {voices.map((voice, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass p-8 rounded-2xl relative group hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={voice.avatar}
                                    alt={voice.name}
                                    className="w-16 h-16 rounded-full object-cover border-2 border-accent"
                                />
                                <div>
                                    <h3 className="font-bold text-lg">{voice.name}</h3>
                                    <p className="text-accent text-sm">{voice.role}</p>
                                </div>
                            </div>

                            <p className="text-xl text-gray-300 italic mb-8">"{voice.quote}"</p>

                            <button
                                onClick={() => setPlayingIndex(playingIndex === index ? null : index)}
                                className="flex items-center gap-3 text-sm font-semibold text-accent hover:text-white transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-black transition-all">
                                    {playingIndex === index ? <Pause size={18} /> : <Play size={18} />}
                                </div>
                                Listen to Story
                            </button>

                            {/* Audio visualizer bar placeholder */}
                            {playingIndex === index && (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: 'auto' }}
                                    className="mt-6 flex gap-1 h-8 items-end justify-center"
                                >
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ height: [5, 25, 5] }}
                                            transition={{
                                                repeat: Infinity,
                                                duration: 0.8,
                                                delay: i * 0.05
                                            }}
                                            className="w-1 bg-accent rounded-full"
                                        />
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmployeeVoices;
