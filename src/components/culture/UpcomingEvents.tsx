import { motion } from 'framer-motion';
import { CalendarPlus } from 'lucide-react';

const UpcomingEvents = () => {
    const events = [
        {
            id: 1,
            title: "Thanksgiving Potluck",
            date: "Nov 19",
            location: "Main Cafeteria • 12:00 PM",
            image: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80",
            tag: "SOCIAL",
            tagColor: "text-blue-500"
        },
        {
            id: 2,
            title: "Leadership Workshop",
            date: "Nov 22",
            location: "Conference Room A • 9:00 AM",
            image: "https://images.unsplash.com/photo-1544531320-dd40439ba5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1746&q=80",
            tag: "LEARNING",
            tagColor: "text-cyan-500"
        },
        {
            id: 3,
            title: "Winter Gala",
            date: "Dec 05",
            location: "Downtown Hall • 7:00 PM",
            image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1548&q=80",
            tag: "CELEBRATION",
            tagColor: "text-purple-500"
        }
    ];

    return (
        <section className="py-20 px-4 md:px-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
                <button className="text-blue-500 font-bold text-sm hover:underline">View Calendar</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {events.map((event) => (
                    <motion.div
                        key={event.id}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
                    >
                        <div className="h-48 overflow-hidden relative">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                                {event.date}
                            </div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{event.title}</h3>
                            <p className="text-sm text-gray-500 mb-4">{event.location}</p>
                            <span className={`text-[10px] font-bold tracking-wider uppercase ${event.tagColor}`}>
                                {event.tag}
                            </span>
                        </div>
                    </motion.div>
                ))}

                {/* Suggest an Idea Card */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gray-50 rounded-3xl p-8 flex flex-col justify-center items-center text-center border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer group"
                >
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                        <CalendarPlus className="text-gray-500 group-hover:text-blue-600" size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">Suggest an Idea</h3>
                    <p className="text-sm text-gray-500">Have an idea for a team event? Let us know!</p>
                </motion.div>
            </div>
        </section>
    );
};

export default UpcomingEvents;
