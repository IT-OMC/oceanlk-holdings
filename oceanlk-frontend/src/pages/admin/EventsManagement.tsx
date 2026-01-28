import { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer, View } from 'react-big-calendar';
import moment from 'moment';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './EventsManagement.css';

const localizer = momentLocalizer(moment);

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
    createdAt?: string;
    updatedAt?: string;
}

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    resource: Event;
}

const EventsManagement = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Event | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [view, setView] = useState<View>('month');
    const [date, setDate] = useState(new Date());
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: moment().format('YYYY-MM-DD'),
        time: '09:00',
        location: '',
        imageUrl: '',
        category: 'SOCIAL',
    });

    const categories = [
        { value: 'SOCIAL', label: 'Social', color: 'bg-blue-500' },
        { value: 'LEARNING', label: 'Learning', color: 'bg-cyan-500' },
        { value: 'CELEBRATION', label: 'Celebration', color: 'bg-purple-500' },
        { value: 'MEETING', label: 'Meeting', color: 'bg-yellow-500' },
        { value: 'OTHER', label: 'Other', color: 'bg-gray-500' },
    ];

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/events');
            if (response.ok) {
                const data = await response.json();
                setEvents(data);

                // Convert to calendar events
                const calEvents = data.map((event: Event) => ({
                    id: event.id,
                    title: event.title,
                    start: new Date(event.date + (event.time ? `T${event.time}` : 'T00:00')),
                    end: new Date(event.date + (event.time ? `T${event.time}` : 'T00:00')),
                    resource: event,
                }));
                setCalendarEvents(calEvents);
            }
        } catch (error) {
            toast.error('Failed to fetch events');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const url = editingItem
                ? `http://localhost:8080/api/events/${editingItem.id}`
                : 'http://localhost:8080/api/events';

            const response = await fetch(url, {
                method: editingItem ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingItem ? 'Event updated successfully' : 'Event created successfully');
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({
                    title: '',
                    description: '',
                    date: moment().format('YYYY-MM-DD'),
                    time: '09:00',
                    location: '',
                    imageUrl: '',
                    category: 'SOCIAL',
                });
                fetchEvents();
            } else {
                toast.error('Failed to save event');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:8080/api/events/${itemToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Event deleted successfully');
                setDeleteModalOpen(false);
                setItemToDelete(null);
                fetchEvents();
            } else {
                toast.error('Failed to delete event');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const openEditModal = (item: Event) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            date: item.date,
            time: item.time || '09:00',
            location: item.location,
            imageUrl: item.imageUrl || '',
            category: item.category,
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (id: string) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleSelectEvent = useCallback((event: CalendarEvent) => {
        openEditModal(event.resource);
    }, []);

    const handleSelectSlot = useCallback(({ start }: { start: Date }) => {
        setEditingItem(null);
        setFormData({
            title: '',
            description: '',
            date: moment(start).format('YYYY-MM-DD'),
            time: '09:00',
            location: '',
            imageUrl: '',
            category: 'SOCIAL',
        });
        setIsModalOpen(true);
    }, []);

    const eventStyleGetter = (event: CalendarEvent) => {
        const category = categories.find((cat) => cat.value === event.resource.category);
        return {
            style: {
                backgroundColor: category ? category.color.replace('bg-', '#').replace('-500', '') : '#6B7280',
                borderRadius: '6px',
                opacity: 0.9,
                color: 'white',
                border: '0px',
                display: 'block',
            },
        };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-400">Manage events for the culture page</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({
                            title: '',
                            description: '',
                            date: moment().format('YYYY-MM-DD'),
                            time: '09:00',
                            location: '',
                            imageUrl: '',
                            category: 'SOCIAL',
                        });
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Event
                </button>
            </div>

            {/* Calendar */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <Calendar
                    localizer={localizer}
                    events={calendarEvents}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    view={view}
                    onView={setView}
                    date={date}
                    onNavigate={setDate}
                    eventPropGetter={eventStyleGetter}
                />
            </div>

            {/* Events List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events
                        .filter((event) => new Date(event.date) >= new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map((event) => {
                            const category = categories.find((cat) => cat.value === event.category);
                            return (
                                <motion.div
                                    key={event.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white/5 rounded-xl p-4 border border-white/10"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className={`px-2 py-1 rounded text-xs font-bold ${category?.color} text-white`}>
                                            {category?.label || event.category}
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded ${event.status === 'UPCOMING' ? 'bg-green-500/20 text-green-400' :
                                            event.status === 'ONGOING' ? 'bg-blue-500/20 text-blue-400' :
                                                'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">{event.title}</h4>
                                    <div className="space-y-1 mb-3">
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <CalendarIcon size={14} />
                                            {moment(event.date).format('MMM DD, YYYY')}
                                        </div>
                                        {event.time && (
                                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                                <Clock size={14} />
                                                {event.time}
                                            </div>
                                        )}
                                        <p className="text-sm text-gray-500">{event.location}</p>
                                    </div>
                                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(event)}
                                            className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                        >
                                            <Edit2 size={14} />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(event.id)}
                                            className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors text-sm"
                                        >
                                            <Trash2 size={14} />
                                            Delete
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#0f1e3a] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {editingItem ? 'Edit Event' : 'Add New Event'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Time</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.value} value={cat.value}>
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingItem(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : editingItem ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete Event"
                message="Are you sure you want to delete this event? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isLoading}
            />
        </div>
    );
};

export default EventsManagement;
