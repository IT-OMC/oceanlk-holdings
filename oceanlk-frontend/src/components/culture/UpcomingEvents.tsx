import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPlus, X, Send } from 'lucide-react';
import moment from 'moment';

interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    time?: string;
    location: string;
    imageUrl?: string;
    category: string;
    status: string;
}

const UpcomingEvents = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState<Event[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        ideaTitle: '',
        description: ''
    });

    useEffect(() => {
        fetchUpcomingEvents();
    }, []);

    const fetchUpcomingEvents = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/media');
            if (response.ok) {
                const data = await response.json();
                // Filter for EVENTS category and map to Event interface
                const eventsData = data
                    .filter((item: any) => item.category === 'EVENTS')
                    .map((item: any) => ({
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        date: item.publishedDate || new Date().toISOString(),
                        time: '09:00', // Default time as backend doesn't have time field yet
                        location: 'OceanLK Premises', // Default location
                        imageUrl: item.imageUrl,
                        category: 'SOCIAL', // Default category mapping for UI colors
                        status: 'Upcoming'
                    }));

                setEvents(eventsData.slice(0, 3));
            }
        } catch (error) {
            console.error('Failed to fetch upcoming events:', error);
        } finally {

        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'SOCIAL':
                return 'text-blue-500';
            case 'LEARNING':
                return 'text-cyan-500';
            case 'CELEBRATION':
                return 'text-purple-500';
            case 'MEETING':
                return 'text-yellow-500';
            default:
                return 'text-gray-500';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Idea submitted:', formData);
        setIsModalOpen(false);
        // Reset form
        setFormData({ name: '', email: '', ideaTitle: '', description: '' });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section className="py-20 px-4 md:px-6 w-full max-w-[95%] mx-auto">
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {events.map((event) => (
                    <motion.div
                        key={event.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
                    >
                        <div className="h-48 overflow-hidden relative">
                            {event.imageUrl ? (
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-blue-100 flex items-center justify-center">
                                    <span className="text-4xl">📅</span>
                                </div>
                            )}
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                {moment(event.date).format('MMM DD')}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {event.location}
                                {event.time && ` • ${moment(event.time, 'HH:mm').format('h:mm A')}`}
                            </p>
                            <span className={`text-[10px] font-bold tracking-wider uppercase ${getCategoryColor(event.category)}`}>
                                {event.category}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {/* Suggest an Idea Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    onClick={() => setIsModalOpen(true)}
                    className="relative bg-gray-900 rounded-3xl p-8 flex flex-col justify-center items-center text-center overflow-hidden group cursor-pointer"
                >
                    <img
                        src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-white/30 transition-colors">
                            <CalendarPlus className="text-white" size={24} />
                        </div>
                        <h3 className="font-bold text-white mb-2 shadow-sm">Suggest an Idea</h3>
                        <p className="text-sm text-gray-200">Have an idea for a team event? Let us know!</p>
                    </div>
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", duration: 0.5 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <X size={20} className="text-gray-600" />
                            </button>

                            {/* Header */}
                            <div className="mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                    <CalendarPlus className="text-blue-600" size={24} />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Suggest an Event Idea</h2>
                                <p className="text-gray-600">Share your creative ideas with us!</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="ideaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                                        Event Title
                                    </label>
                                    <input
                                        type="text"
                                        id="ideaTitle"
                                        name="ideaTitle"
                                        value={formData.ideaTitle}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Summer Team Building"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        required
                                        rows={4}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                                        placeholder="Describe your event idea..."
                                    />
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Send size={18} />
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default UpcomingEvents;
