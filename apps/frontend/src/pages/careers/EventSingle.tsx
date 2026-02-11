import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, ArrowLeft, Share2, CalendarPlus } from 'lucide-react';
import moment from 'moment';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { API_ENDPOINTS } from '../../utils/api';

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

const EventSingle = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                // Try fetching single event
                const response = await fetch(API_ENDPOINTS.MEDIA_SINGLE(id!));
                if (response.ok) {
                    const data = await response.json();
                    setEvent({
                        id: data.id,
                        title: data.title,
                        description: data.description,
                        date: data.publishedDate || new Date().toISOString(),
                        time: data.duration || '09:00', // Using duration as time placeholder or default
                        location: 'OceanLK Premises', // Default location
                        imageUrl: data.imageUrl,
                        category: data.category || 'SOCIAL',
                        status: data.status || 'Upcoming'
                    });
                } else {
                    // Fallback: Fetch all and find
                    const allResponse = await fetch(API_ENDPOINTS.MEDIA);
                    if (allResponse.ok) {
                        const allData = await allResponse.json();
                        const foundEvent = allData.find((item: any) => item.id === id);
                        if (foundEvent) {
                            setEvent({
                                id: foundEvent.id,
                                title: foundEvent.title,
                                description: foundEvent.description,
                                date: foundEvent.publishedDate || new Date().toISOString(),
                                time: foundEvent.duration || '09:00',
                                location: 'OceanLK Premises',
                                imageUrl: foundEvent.imageUrl,
                                category: foundEvent.category || 'SOCIAL',
                                status: foundEvent.status || 'Upcoming'
                            });
                        } else {
                            setError('Event not found');
                        }
                    } else {
                        setError('Failed to load event details');
                    }
                }
            } catch (err) {
                console.error(err);
                setError('An error occurred while fetching event details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvent();
        }
    }, [id]);

    const addToCalendar = () => {
        // Implement add to calendar functionality
        console.log('Add to calendar');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !event) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Event not found'}</h2>
                <button
                    onClick={() => navigate('/careers/culture')}
                    className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Events
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full mt-16">
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-900 to-indigo-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 lg:p-20">
                    <div className="max-w-7xl mx-auto">
                        <Link
                            to="/careers/culture"
                            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft size={20} className="mr-2" />
                            Back to Events
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-bold tracking-wider uppercase rounded-full mb-4">
                                {event.category}
                            </span>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
                                {event.title}
                            </h1>
                            <div className="flex flex-wrap gap-6 text-white/90">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-blue-400" />
                                    <span className="text-lg">{moment(event.date).format('MMMM DD, YYYY')}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-400" />
                                    <span className="text-lg">{event.time ? moment(event.time, 'HH:mm').format('h:mm A') : 'TBA'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-blue-400" />
                                    <span className="text-lg">{event.location}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-8"
                    >
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">About the Event</h2>
                            <div className="prose prose-lg text-gray-600 max-w-none">
                                {event.description.split('\n').map((paragraph, bg) => (
                                    <p key={bg} className="mb-4 last:mb-0">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                        {/* Additional Info / Gallery Placeholder */}
                        {/* We could add gallery images here if they existed in the model */}
                    </motion.div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Event Details</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Calendar className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Date</p>
                                        <p className="text-gray-900 font-semibold">{moment(event.date).format('dddd, MMM DD, YYYY')}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Time</p>
                                        <p className="text-gray-900 font-semibold">{event.time ? moment(event.time, 'HH:mm').format('h:mm A') : 'To be Announced'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Location</p>
                                        <p className="text-gray-900 font-semibold">{event.location}</p>
                                        <p className="text-sm text-gray-500 mt-1">OceanLK Headquarters</p>
                                    </div>
                                </div>

                                <hr className="border-gray-100" />

                                <div className="flex gap-3">
                                    <button
                                        onClick={addToCalendar}
                                        className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CalendarPlus size={18} />
                                        Add to Calendar
                                    </button>
                                    <button className="w-12 h-12 bg-gray-100 text-gray-600 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                                        <Share2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default EventSingle;
