import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    ChevronDown,
    Image as ImageIcon,
    Mail,
    Building2,
    ShieldAlert,
    User,
    Settings,
    CheckSquare,
    MessageSquare
} from 'lucide-react';
import { useState } from 'react';

interface AdminSidebarProps {
    isSidebarOpen: boolean;
}

const AdminSidebar = ({ isSidebarOpen }: AdminSidebarProps) => {
    const [isPagesExpanded, setIsPagesExpanded] = useState(true);
    const [isMediaExpanded, setIsMediaExpanded] = useState(true);
    const [isHRExpanded, setIsHRExpanded] = useState(true);
    const location = useLocation();
    const adminRole = localStorage.getItem('adminRole');
    const isSuperAdmin = adminRole === 'SUPER_ADMIN';

    const pageMenuItems = [
        { path: '/admin/companies', icon: Building2, label: 'Companies' },
    ];

    const mediaMenuItems = [
        { path: '/admin/news-media/news', icon: ImageIcon, label: 'News' },
        { path: '/admin/news-media/blog', icon: ImageIcon, label: 'Blog' },
        { path: '/admin/news-media/gallery', icon: ImageIcon, label: 'Gallery' },
    ];

    const hrMenuItems = [
        { path: '/admin/hr/jobs', icon: Briefcase, label: 'Job Postings' },
        { path: '/admin/hr/applications', icon: Users, label: 'Applications' },
        { path: '/admin/hr/media', icon: ImageIcon, label: 'Media' },
    ];

    return (
        <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Dashboard */}
            <Link
                to="/admin/dashboard"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname === '/admin/dashboard'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                {location.pathname === '/admin/dashboard' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                )}
                <LayoutDashboard
                    size={20}
                    className={`${location.pathname === '/admin/dashboard' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'} transition-colors`}
                />
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium truncate"
                        >
                            Dashboard
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>

            {/* Profile */}
            <Link
                to="/admin/profile"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname === '/admin/profile'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                {location.pathname === '/admin/profile' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                )}
                <User
                    size={20}
                    className={`${location.pathname === '/admin/profile' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'} transition-colors`}
                />
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium truncate"
                        >
                            My Profile
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>

            {/* Admin Management (Super Admin only) */}
            {isSuperAdmin && (
                <Link
                    to="/admin/management"
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname === '/admin/management'
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {location.pathname === '/admin/management' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500 rounded-full" />
                    )}
                    <Settings
                        size={20}
                        className={`${location.pathname === '/admin/management' ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'} transition-colors`}
                    />
                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-medium truncate"
                            >
                                Admin Management
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            )}

            {/* WhatsApp Settings (Super Admin only) */}
            {isSuperAdmin && (
                <Link
                    to="/admin/whatsapp"
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname === '/admin/whatsapp'
                        ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {location.pathname === '/admin/whatsapp' && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                    )}
                    <MessageSquare
                        size={20}
                        className={`${location.pathname === '/admin/whatsapp' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'} transition-colors`}
                    />
                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                className="font-medium truncate"
                            >
                                WhatsApp Settings
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
            )}

            {/* Pending Changes (for both Admin and SuperAdmin) */}
            <Link
                to="/admin/pending-changes"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname === '/admin/pending-changes'
                    ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                {location.pathname === '/admin/pending-changes' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-full" />
                )}
                <CheckSquare
                    size={20}
                    className={`${location.pathname === '/admin/pending-changes' ? 'text-orange-400' : 'text-gray-500 group-hover:text-orange-400'} transition-colors`}
                />
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium truncate"
                        >
                            Pending Changes
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>

            {/* Companies */}
            <div className="space-y-1">
                <button
                    onClick={() => setIsPagesExpanded(!isPagesExpanded)}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                    <div className="flex items-center gap-4 min-w-0">
                        <Building2 size={20} className="text-gray-500 group-hover:text-emerald-400 transition-colors" />
                        <AnimatePresence mode="wait">
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-medium truncate"
                                >
                                    Pages
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    {isSidebarOpen && (
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isPagesExpanded ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>
                <AnimatePresence>
                    {isPagesExpanded && isSidebarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white/2 rounded-xl mx-2"
                        >
                            {pageMenuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group relative text-sm ${isActive
                                            ? 'bg-emerald-500/10 text-emerald-300'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-emerald-400 rounded-full" />
                                        )}
                                        <item.icon
                                            size={16}
                                            className={`${isActive ? 'text-emerald-400' : 'text-gray-600 group-hover:text-emerald-400'} transition-colors`}
                                        />
                                        <span className="font-medium truncate">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Media Section */}
            <div className="space-y-1">
                <button
                    onClick={() => setIsMediaExpanded(!isMediaExpanded)}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                    <div className="flex items-center gap-4 min-w-0">
                        <ImageIcon size={20} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                        <AnimatePresence mode="wait">
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-medium truncate"
                                >
                                    Media Center
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    {isSidebarOpen && (
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isMediaExpanded ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>
                <AnimatePresence>
                    {isMediaExpanded && isSidebarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white/2 rounded-xl mx-2"
                        >
                            {mediaMenuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group relative text-sm ${isActive
                                            ? 'bg-blue-500/10 text-blue-300'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-400 rounded-full" />
                                        )}
                                        <item.icon
                                            size={16}
                                            className={`${isActive ? 'text-blue-400' : 'text-gray-600 group-hover:text-blue-400'} transition-colors`}
                                        />
                                        <span className="font-medium truncate">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* HR Section */}
            <div className="space-y-1">
                <button
                    onClick={() => setIsHRExpanded(!isHRExpanded)}
                    className="w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group"
                >
                    <div className="flex items-center gap-4 min-w-0">
                        <Users size={20} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
                        <AnimatePresence mode="wait">
                            {isSidebarOpen && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="font-medium truncate"
                                >
                                    HR & Talent
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </div>
                    {isSidebarOpen && (
                        <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isHRExpanded ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>
                <AnimatePresence>
                    {isHRExpanded && isSidebarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white/2 rounded-xl mx-2"
                        >
                            {hrMenuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group relative text-sm ${isActive
                                            ? 'bg-purple-500/10 text-purple-300'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-purple-400 rounded-full" />
                                        )}
                                        <item.icon
                                            size={16}
                                            className={`${isActive ? 'text-purple-400' : 'text-gray-600 group-hover:text-purple-400'} transition-colors`}
                                        />
                                        <span className="font-medium truncate">
                                            {item.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Communication */}
            <Link
                to="/admin/contact-messages"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname === '/admin/contact-messages'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                {location.pathname === '/admin/contact-messages' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                )}
                <Mail
                    size={20}
                    className={`${location.pathname === '/admin/contact-messages' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'} transition-colors`}
                />
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium truncate"
                        >
                            Contact Messages
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>

            {/* Audit Logs */}
            <Link
                to="/admin/audit-logs"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname === '/admin/audit-logs'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                {location.pathname === '/admin/audit-logs' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                )}
                <ShieldAlert
                    size={20}
                    className={`${location.pathname === '/admin/audit-logs' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'} transition-colors`}
                />
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium truncate"
                        >
                            Audit Logs
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>
        </nav>
    );
};

export default AdminSidebar;
