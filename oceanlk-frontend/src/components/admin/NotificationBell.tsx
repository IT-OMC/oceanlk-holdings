import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Check, ExternalLink, Clock, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_ENDPOINTS } from '../../utils/api';

interface Notification {
    id: string;
    message: string;
    type: 'INFO' | 'WARNING' | 'ERROR';
    isRead: boolean;
    createdAt: string;
    link?: string;
}

const NotificationBell = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) return;

            const res = await fetch(API_ENDPOINTS.NOTIFICATIONS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(API_ENDPOINTS.MARK_READ(id), {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllRead = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(API_ENDPOINTS.MARK_ALL_READ, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setNotifications([]);
            }
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        markAsRead(notification.id);
        if (notification.link) {
            navigate(notification.link);
        }
        setIsOpen(false);
    };

    const getTypeStyles = (type: string) => {
        switch (type) {
            case 'WARNING': return { icon: <AlertTriangle size={16} />, color: 'text-amber-500', bg: 'bg-amber-500/10' };
            case 'ERROR': return { icon: <AlertCircle size={16} />, color: 'text-red-500', bg: 'bg-red-500/10' };
            default: return { icon: <Info size={16} />, color: 'text-blue-500', bg: 'bg-blue-500/10' };
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all duration-200"
            >
                <Bell size={22} />
                {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#0a1628]">
                        {notifications.length > 9 ? '9+' : notifications.length}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0f1e3a] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <h3 className="font-bold text-white flex items-center gap-2">
                                Notifications
                                {notifications.length > 0 && (
                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full">
                                        {notifications.length} New
                                    </span>
                                )}
                            </h3>
                            {notifications.length > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <Check size={14} />
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bell className="text-gray-500" size={24} />
                                    </div>
                                    <p className="text-gray-400 font-medium">No new notifications</p>
                                    <p className="text-gray-500 text-xs mt-1">You're all caught up!</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-white/5">
                                    {notifications.map((notification) => {
                                        const styles = getTypeStyles(notification.type);
                                        return (
                                            <div
                                                key={notification.id}
                                                onClick={() => handleNotificationClick(notification)}
                                                className="p-4 hover:bg-white/5 transition-colors cursor-pointer group relative"
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`shrink-0 w-10 h-10 rounded-xl ${styles.bg} flex items-center justify-center ${styles.color}`}>
                                                        {styles.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm text-gray-200 leading-tight mb-1 group-hover:text-white transition-colors">
                                                            {notification.message}
                                                        </p>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                                <Clock size={10} />
                                                                {formatTime(notification.createdAt)}
                                                            </span>
                                                            {notification.link && (
                                                                <span className="text-[10px] text-blue-400 flex items-center gap-1 font-medium">
                                                                    View Details
                                                                    <ExternalLink size={10} />
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-3 border-t border-white/10 bg-white/5 text-center">
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                                    System Alerts
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
