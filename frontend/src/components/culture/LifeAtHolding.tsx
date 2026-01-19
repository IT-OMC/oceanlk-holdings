import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Quote } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
    highlights,
    communityEvents,
    testimonials,
    coreValues,
    upcomingEvents,
    statsData
} from '../../data/lifeAtOCHData';

const LifeAtHolding = () => {
    const { t } = useTranslation();
    // State to hold selected random items
    const [highlight, setHighlight] = useState(highlights[0]);
    const [communityEvent, setCommunityEvent] = useState(communityEvents[0]);
    const [testimonial, setTestimonial] = useState(testimonials[0]);
    const [coreValue, setCoreValue] = useState(coreValues[0]);
    const [upcoming, setUpcoming] = useState(upcomingEvents[0]);
    const [stat, setStat] = useState(statsData[0]);

    useEffect(() => {
        // Function to get a random item from an array
        const getRandomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

        // Initialize with random items
        setHighlight(getRandomItem(highlights));
        setCommunityEvent(getRandomItem(communityEvents));
        setTestimonial(getRandomItem(testimonials));
        setCoreValue(getRandomItem(coreValues));
        setUpcoming(getRandomItem(upcomingEvents));
        setStat(getRandomItem(statsData));

        // Set up individual intervals for each card with different timings
        const highlightInterval = setInterval(() => {
            setHighlight(getRandomItem(highlights));
        }, 8000); // Change every 8 seconds

        const communityInterval = setInterval(() => {
            setCommunityEvent(getRandomItem(communityEvents));
        }, 6000); // Change every 6 seconds

        const testimonialInterval = setInterval(() => {
            setTestimonial(getRandomItem(testimonials));
        }, 7000); // Change every 7 seconds

        const valueInterval = setInterval(() => {
            setCoreValue(getRandomItem(coreValues));
        }, 5000); // Change every 5 seconds

        const upcomingInterval = setInterval(() => {
            setUpcoming(getRandomItem(upcomingEvents));
        }, 6500); // Change every 6.5 seconds

        const statInterval = setInterval(() => {
            setStat(getRandomItem(statsData));
        }, 5500); // Change every 5.5 seconds

        // Cleanup intervals on unmount
        return () => {
            clearInterval(highlightInterval);
            clearInterval(communityInterval);
            clearInterval(testimonialInterval);
            clearInterval(valueInterval);
            clearInterval(upcomingInterval);
            clearInterval(statInterval);
        };
    }, []);

    const CoreValueIcon = coreValue.icon;
    const StatIcon = stat.icon;

    return (
        <section className="pt-20 pb-8 px-4 md:px-6 w-full max-w-[95%] mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                <div>
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">{t('lifeAtOCH.title')}</h2>
                    <p className="text-gray-500">{t('lifeAtOCH.subtitle')}</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                        <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                            <div className="bg-current rounded-[1px]"></div>
                        </div>
                    </button>
                    <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600">
                        <div className="w-5 h-5 flex flex-col justify-between py-0.5">
                            <div className="h-0.5 w-full bg-current rounded-full"></div>
                            <div className="h-0.5 w-full bg-current rounded-full"></div>
                            <div className="h-0.5 w-full bg-current rounded-full"></div>
                        </div>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[minmax(200px,auto)]">
                {/* Large Card - Highlight (Dynamic) */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-3xl"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={highlight.id}
                            initial={{ x: -100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 100, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url('${highlight.image}')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-8 text-white">
                                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold bg-blue-500 rounded-full">
                                    {highlight.tag}
                                </span>
                                <h3 className="text-3xl font-bold mb-2">{highlight.title}</h3>
                                <p className="text-gray-200 line-clamp-2">{highlight.description}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Stats Card - Flexibility/Stats (Dynamic) */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className={`${stat.bgClass} rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden`}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={stat.id}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full flex flex-col justify-center"
                        >
                            <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 bg-white px-2 py-1 rounded">{stat.tag}</div>
                            <StatIcon className={`${stat.iconColor} mb-4`} size={32} />
                            <div className={`text-5xl font-bold ${stat.colorClass} mb-2`}>{stat.value}</div>
                            <div className="text-gray-600 font-medium">{stat.label}</div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Image Card - Community Event (Dynamic) */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="md:row-span-2 relative group overflow-hidden rounded-3xl"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={communityEvent.id}
                            initial={{ y: -100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute inset-0"
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url('${communityEvent.image}')` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur rounded-xl p-2 text-center text-xs font-bold shadow-lg">
                                <div className="text-gray-400 uppercase tracking-widest text-[10px]">{communityEvent.month}</div>
                                <div className="text-xl text-gray-900">{communityEvent.day}</div>
                            </div>
                            <div className="absolute bottom-0 left-0 p-6 text-white text-center w-full">
                                <h3 className="text-xl font-bold mb-1">{communityEvent.title}</h3>
                                <p className="text-sm text-gray-200">{communityEvent.description}</p>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Core Value Card (Dynamic) */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className={`${coreValue.bgClass} rounded-3xl p-8 flex flex-col justify-center overflow-hidden`}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={coreValue.id}
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -100, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full flex flex-col justify-center"
                        >
                            <CoreValueIcon className={coreValue.colorClass + " mb-4"} size={32} />
                            <div className="text-xs font-bold text-gray-400 uppercase mb-1">{coreValue.tag}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{coreValue.title}</h3>
                            <p className="text-gray-600 text-sm">{coreValue.description}</p>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Testimonial Card (Dynamic) */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="md:col-span-2 bg-white border border-gray-100 shadow-xl shadow-gray-100/50 rounded-3xl p-8 flex items-center gap-8 overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={testimonial.id}
                            initial={{ x: 100, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -100, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex items-center gap-8 w-full"
                        >
                            <div className="flex-shrink-0">
                                <img
                                    src={testimonial.image}
                                    alt="Employee"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                            </div>
                            <div className="relative">
                                <Quote className="absolute -top-4 -left-2 text-gray-100 rotate-180" size={60} fill="currentColor" />
                                <p className="text-lg text-gray-700 italic relative z-10 mb-4">
                                    {testimonial.quote}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-gray-900">{testimonial.name}</span>
                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                    <span className="text-blue-500 font-medium text-sm">{testimonial.position}</span>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Offices Card - Static but renamed */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white border border-gray-100 shadow-sm rounded-3xl p-8 flex flex-col justify-center"
                >
                    <div className="text-5xl font-bold text-gray-900 mb-2 flex items-baseline gap-1">
                        5<span className="text-blue-500 text-2xl">.</span>
                    </div>
                    <div className="text-gray-500 font-medium mb-4">{t('lifeAtOCH.islandwideOffices')}</div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-blue-200' : i === 2 ? 'bg-blue-300' : 'bg-blue-400'}`} />
                        ))}
                    </div>
                </motion.div>

                {/* Dark Card - Upcoming Event (Dynamic) */}
                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-[#0f172a] text-white rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent" />
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={upcoming.id}
                            initial={{ y: -50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10 flex flex-col h-full justify-between"
                        >
                            <div className="flex justify-between items-start">
                                <span className={`px-2 py-1 ${upcoming.tagColor} text-[10px] font-bold rounded`}>{upcoming.tag}</span>
                                <ChevronRight className="text-gray-500" size={16} />
                            </div>
                            <div className="mt-12">
                                <h3 className="text-xl font-bold mb-1">{upcoming.title}</h3>
                                <button className="text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors flex items-center gap-1 mt-2">
                                    {upcoming.action} <ChevronRight size={12} />
                                </button>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>
            </div>
        </section>
    );
};

export default LifeAtHolding;
