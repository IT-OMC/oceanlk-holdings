import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
    id: number;
    title: string;
    category: 'Sports' | 'Celebrations' | 'Gathering';
    date: string;
    image: string;
    description: string;
}

const events: Event[] = [
    {
        id: 1,
        title: "Annual Ocean Cricket Tournament",
        category: "Sports",
        date: "March 2024",
        image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Teams from all subsidiaries battled it out for the Ocean Trophy."
    },
    {
        id: 2,
        title: "New Year Celebration",
        category: "Celebrations",
        date: "April 2024",
        image: "https://images.unsplash.com/photo-1514525253440-100e4952c427?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Traditional games, food, and festivities bringing the whole family together."
    },
    {
        id: 3,
        title: "Badminton Championship",
        category: "Sports",
        date: "August 2024",
        image: "https://images.unsplash.com/photo-1626224583764-847890e045b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Fast-paced action at the indoor stadium."
    },
    {
        id: 4,
        title: "Christmas Gala",
        category: "Celebrations",
        date: "December 2023",
        image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Ending the year on a high note with music and gifts."
    },
    {
        id: 5,
        title: "Inter-Company Futsal",
        category: "Sports",
        date: "June 2024",
        image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "High energy 5-a-side matches under the lights."
    },
    {
        id: 6,
        title: "Founder's Day",
        category: "Celebrations",
        date: "January 2024",
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        description: "Honoring our journey and vision for the future."
    }
];

const Tabs = ({ selected, setSelected }: { selected: string, setSelected: (val: string) => void }) => {
    return (
        <div className="flex justify-center space-x-4 mb-12">
            {['All', 'Sports', 'Celebrations'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setSelected(tab)}
                    className={`px-6 py-2 rounded-full text-lg font-medium transition-all duration-300 ${selected === tab
                            ? 'bg-blue-600 text-white shadow-lg scale-105'
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

const EventsGallery = () => {
    const [selectedTab, setSelectedTab] = useState('All');

    const filteredEvents = selectedTab === 'All'
        ? events
        : events.filter(e => e.category === selectedTab);

    return (
        <section className="py-24 bg-ocean-darker relative">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xlmd:text-5xl font-bold text-white mb-4">Life at Ocean</h2>
                    <p className="text-xl text-gray-400">Capturing the moments that define us.</p>
                </motion.div>

                <Tabs selected={selectedTab} setSelected={setSelectedTab} />

                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredEvents.map((event) => (
                            <motion.div
                                layout
                                key={event.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
                            >
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 transition-opacity duration-300" />

                                <div className="absolute bottom-0 left-0 p-6 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                    <span className="inline-block px-3 py-1 bg-blue-600 text-xs font-bold rounded-full text-white mb-2">
                                        {event.category}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
                                    <p className="text-gray-300 text-sm mb-2">{event.date}</p>
                                    <p className="text-gray-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                        {event.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default EventsGallery;
