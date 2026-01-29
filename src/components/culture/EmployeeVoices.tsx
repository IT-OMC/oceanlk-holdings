import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Quote } from 'lucide-react';

const employees = [
    {
        id: 1,
        name: "David Chen",
        role: "Senior Engineer",
        word: "Family",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
        color: "bg-blue-500"
    },
    {
        id: 2,
        name: "Priya Patel",
        role: "UX Designer",
        word: "Electric",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
        color: "bg-purple-500"
    },
    {
        id: 3,
        name: "James Wilson",
        role: "Project Manager",
        word: "Home",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
        color: "bg-teal-500"
    },
    {
        id: 4,
        name: "Sarah Kim",
        role: "Marketing Lead",
        word: "Limitless",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
        color: "bg-rose-500"
    }
];

const EmployeeVoices = () => {
    const [playingId, setPlayingId] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = (id: number) => {
        if (playingId === id) {
            audioRef.current?.pause();
            setPlayingId(null);
        } else {
            // In a real app, you'd set the source based on the ID
            // audioRef.current.src = `/audio/${id}.mp3`;
            // but for now we simulate
            setPlayingId(id);
            setTimeout(() => setPlayingId(null), 2000); // Simulate 2s clip
        }
    };

    return (
        <section className="py-24 bg-ocean-dark relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h2 className="text-4xl font-bold text-white mb-4">The Crew</h2>
                <p className="text-gray-400">Hear what our people have to say.</p>
            </div>

            <div className="flex gap-8 overflow-x-auto pb-12 px-6 scrollbar-hide">
                {employees.map((emp) => (
                    <motion.div
                        key={emp.id}
                        whileHover={{ y: -10 }}
                        className="flex-shrink-0 w-80 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 relative group"
                    >
                        <div className="absolute top-6 right-6 text-white/20">
                            <Quote size={40} />
                        </div>

                        <div className="w-20 h-20 rounded-full overflow-hidden mb-6 ring-4 ring-white/10">
                            <img src={emp.image} alt={emp.name} className="w-full h-full object-cover" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-1">{emp.name}</h3>
                        <p className="text-sm text-gray-400 mb-6">{emp.role}</p>

                        <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between group-hover:bg-white/10 transition-colors">
                            <span className="text-lg font-medium text-white">"{emp.word}"</span>
                            <button
                                onClick={() => handlePlay(emp.id)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${playingId === emp.id ? 'bg-accent text-white' : 'bg-white text-primary'}`}
                            >
                                {playingId === emp.id ? <Pause size={18} /> : <Play size={18} />}
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section >
    );
};

export default EmployeeVoices;
