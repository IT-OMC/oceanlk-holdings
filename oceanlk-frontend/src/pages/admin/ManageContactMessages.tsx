import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Calendar,
    Eye,
    EyeOff,
    Search,
    Filter,
    Trash2,
    X,
    CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    submittedDate: string;
    status: string;
    isRead: boolean;
}

const ManageContactMessages = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [stats, setStats] = useState({ total: 0, unread: 0, read: 0 });

    useEffect(() => {
        fetchMessages();
        fetchStats();
    }, []);

    const applyFilters = useCallback(() => {
        let filtered = messages;

        // Apply read/unread filter
        if (filter === 'read') {
            filtered = filtered.filter(m => m.isRead);
        } else if (filter === 'unread') {
            filtered = filtered.filter(m => !m.isRead);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(m =>
                m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                m.subject.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredMessages(filtered);
    }, [messages, filter, searchTerm]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    const toggleReadStatus = async (message: ContactMessage) => {
        const token = localStorage.getItem('adminToken');
        const endpoint = message.isRead ? 'unread' : 'read';

        try {
            const response = await fetch(`http://localhost:8080/api/contact/messages/${message.id}/${endpoint}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const updated = await response.json();
                setMessages(messages.map(m => m.id === message.id ? updated : m));
                if (selectedMessage?.id === message.id) {
                    setSelectedMessage(updated);
                }
                fetchStats();
                toast.success(`Message marked as ${endpoint === 'read' ? 'read' : 'unread'}`);
            }
        } catch (error) {
            console.error('Failed to update message status:', error);
            toast.error('Failed to update message status');
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:8080/api/contact/messages/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setMessages(messages.filter(m => m.id !== id));
                setSelectedMessage(null);
                fetchStats();
                toast.success('Message deleted successfully');
            } else {
                toast.error('Failed to delete message');
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
            toast.error('An error occurred while deleting the message');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    const getSubjectDisplay = (subject: string) => {
        const subjectMap: Record<string, string> = {
            'general': 'General Inquiry',
            'partnership': 'Partnership',
            'investment': 'Investment',
            'career': 'Career',
            'other': 'Other'
        };
        return subjectMap[subject] || subject;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Messages</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats.total}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-3 flex items-center justify-center">
                            <Mail className="text-white" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Unread Messages</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats.unread}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 p-3 flex items-center justify-center">
                            <Eye className="text-white" />
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Read Messages</p>
                            <h3 className="text-3xl font-bold text-white mt-2">{stats.read}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 flex items-center justify-center">
                            <CheckCircle className="text-white" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by name, email, or subject..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-3 rounded-xl font-medium transition-all ${filter === 'all'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-3 rounded-xl font-medium transition-all ${filter === 'unread'
                                ? 'bg-orange-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            Unread
                        </button>
                        <button
                            onClick={() => setFilter('read')}
                            className={`px-4 py-3 rounded-xl font-medium transition-all ${filter === 'read'
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            Read
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages List */}
            <div className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Messages</h2>

                <div className="space-y-4">
                    {filteredMessages.length === 0 ? (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400">No messages found</p>
                        </div>
                    ) : (
                        filteredMessages.map((message) => (
                            <motion.div
                                key={message.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`p-4 rounded-xl border cursor-pointer transition-all hover:border-emerald-500/50 ${message.isRead
                                    ? 'bg-white/5 border-white/10'
                                    : 'bg-orange-500/10 border-orange-500/30'
                                    }`}
                                onClick={() => setSelectedMessage(message)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-white">{message.name}</h3>
                                            {!message.isRead && (
                                                <span className="px-2 py-1 text-xs rounded-full bg-orange-500/20 text-orange-400 font-medium">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-2">{message.email}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Filter className="w-3 h-3" />
                                                {getSubjectDisplay(message.subject)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(message.submittedDate)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleReadStatus(message);
                                            }}
                                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                            title={message.isRead ? 'Mark as unread' : 'Mark as read'}
                                        >
                                            {message.isRead ? (
                                                <EyeOff className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-emerald-400" />
                                            )}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteMessage(message.id);
                                            }}
                                            className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                            title="Delete message"
                                        >
                                            <Trash2 className="w-5 h-5 text-red-400" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Message Detail Modal */}
            <AnimatePresence>
                {selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0f1e3a] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-white/10">
                                <h3 className="text-2xl font-bold text-white">Message Details</h3>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-6 h-6 text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-6">
                                {/* Contact Info */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-wide">Name</label>
                                        <p className="text-white font-medium mt-1">{selectedMessage.name}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-wide">Email</label>
                                        <a
                                            href={`mailto:${selectedMessage.email}`}
                                            className="text-emerald-400 font-medium mt-1 block hover:underline"
                                        >
                                            {selectedMessage.email}
                                        </a>
                                    </div>
                                    {selectedMessage.phone && (
                                        <div>
                                            <label className="text-xs text-gray-400 uppercase tracking-wide">Phone</label>
                                            <a
                                                href={`tel:${selectedMessage.phone}`}
                                                className="text-emerald-400 font-medium mt-1 block hover:underline"
                                            >
                                                {selectedMessage.phone}
                                            </a>
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-wide">Subject</label>
                                        <p className="text-white font-medium mt-1">{getSubjectDisplay(selectedMessage.subject)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-wide">Date</label>
                                        <p className="text-white font-medium mt-1">{formatDate(selectedMessage.submittedDate)}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-wide">Status</label>
                                        <p className="text-white font-medium mt-1">
                                            <span className={`px-3 py-1 rounded-full text-sm ${selectedMessage.isRead
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-orange-500/20 text-orange-400'
                                                }`}>
                                                {selectedMessage.isRead ? 'Read' : 'Unread'}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div>
                                    <label className="text-xs text-gray-400 uppercase tracking-wide">Message</label>
                                    <div className="mt-2 p-4 bg-white/5 border border-white/10 rounded-xl">
                                        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => toggleReadStatus(selectedMessage)}
                                        className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium text-white transition-colors"
                                    >
                                        {selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                    </button>
                                    <a
                                        href={`mailto:${selectedMessage.email}`}
                                        className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-xl font-medium text-white text-center transition-colors"
                                    >
                                        Reply via Email
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageContactMessages;
