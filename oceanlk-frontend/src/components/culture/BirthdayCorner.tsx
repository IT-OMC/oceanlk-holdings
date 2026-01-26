import { motion } from 'framer-motion';

const birthdays = [
    { name: "Sarah Silva", role: "UX Designer", date: "Jan 12", image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Raj Perera", role: "Marine Engineer", date: "Jan 15", image: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Nimali Fernando", role: "HR Manager", date: "Jan 22", image: "https://randomuser.me/api/portraits/women/68.jpg" },
    { name: "Kamal De Soysa", role: "Logistics Lead", date: "Jan 28", image: "https://randomuser.me/api/portraits/men/86.jpg" },
];

const BirthdayCorner = () => {
    return (
        <section className="py-20 bg-gradient-to-br from-blue-900 via-ocean-base to-blue-900 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-center md:text-left mb-8 md:mb-0"
                    >
                        <h2 className="text-4xl font-bold text-white mb-2">
                            Celebrations of the Month <span className="text-2xl">🎉</span>
                        </h2>
                        <p className="text-blue-200">
                            Wishing our team members a fantastic year ahead!
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20"
                    >
                        <span className="text-white font-semibold">January 2026</span>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {birthdays.map((person, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl text-center group hover:bg-white/10 transition-all duration-300"
                        >
                            <div className="relative w-24 h-24 mx-auto mb-4">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full animate-spin-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <img
                                    src={person.image}
                                    alt={person.name}
                                    className="w-full h-full rounded-full object-cover border-4 border-transparent group-hover:border-white/20 relative z-10 transition-all duration-300"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-white text-ocean-base text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                                    {person.date}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-1">{person.name}</h3>
                            <p className="text-sm text-blue-300">{person.role}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BirthdayCorner;
