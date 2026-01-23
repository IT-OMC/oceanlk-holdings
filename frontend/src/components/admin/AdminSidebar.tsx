import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Briefcase,
    Users,
    ChevronDown,
    ChevronRight,
    Calendar,
    MessageSquare,
    ImageIcon,
    Newspaper,
    BookOpen,
    Camera,
    Mail,
    Building2,
    Home
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



    const mediaMenuItems = [
        { path: '/admin/news-media/news', icon: Newspaper, label: 'News' },
        { path: '/admin/news-media/blog', icon: BookOpen, label: 'Blog' },
        { path: '/admin/news-media/gallery', icon: Camera, label: 'Gallery' },
    ];

    const hrMenuItems = [
        { path: '/admin/hr/jobs', icon: Briefcase, label: 'Job Postings' },
        { path: '/admin/hr/applications', icon: FileText, label: 'Applications' },
        { path: '/admin/hr/events', icon: Calendar, label: 'Events' },
        { path: '/admin/hr/testimonials', icon: MessageSquare, label: 'Testimonials' },
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

            {/* Companies */}
            <Link
                to="/admin/companies"
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${location.pathname === '/admin/companies'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                {location.pathname === '/admin/companies' && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                )}
                <Building2
                    size={20}
                    className={`${location.pathname === '/admin/companies' ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'} transition-colors`}
                />
                <AnimatePresence mode="wait">
                    {isSidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="font-medium truncate"
                        >
                            Companies
                        </motion.span>
                    )}
                </AnimatePresence>
            </Link>

            {/* Content Management Section */}
            <div className="mt-2">
                <button
                    onClick={() => setIsPagesExpanded(!isPagesExpanded)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${location.pathname.startsWith('/admin/content')
                        ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Home
                        size={20}
                        className={`${location.pathname.startsWith('/admin/content') ? 'text-blue-400' : 'text-gray-500 group-hover:text-blue-400'} transition-colors`}
                    />
                    {isSidebarOpen && (
                        <>
                            <span className="font-medium truncate flex-1 text-left">Content Management</span>
                            {isPagesExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </>
                    )}
                </button>

                <AnimatePresence>
                    {isPagesExpanded && isSidebarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-4 mt-1 space-y-1"
                        >
                            <Link
                                to="/admin/content/pages"
                                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group relative text-sm ${location.pathname === '/admin/content/pages'
                                    ? 'bg-blue-500/10 text-blue-300'
                                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {location.pathname === '/admin/content/pages' && (
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-400 rounded-full" />
                                )}
                                <FileText
                                    size={16}
                                    className={`${location.pathname === '/admin/content/pages' ? 'text-blue-400' : 'text-gray-600 group-hover:text-blue-400'} transition-colors`}
                                />
                                <span className="font-medium truncate">
                                    Pages
                                </span>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Media Section */}
            <div className="mt-2">
                <button
                    onClick={() => setIsMediaExpanded(!isMediaExpanded)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${location.pathname.startsWith('/admin/news-media')
                        ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Newspaper
                        size={20}
                        className={`${location.pathname.startsWith('/admin/news-media') ? 'text-amber-400' : 'text-gray-500 group-hover:text-amber-400'} transition-colors`}
                    />
                    {isSidebarOpen && (
                        <>
                            <span className="font-medium truncate flex-1 text-left">Media</span>
                            {isMediaExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </>
                    )}
                </button>

                <AnimatePresence>
                    {isMediaExpanded && isSidebarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-4 mt-1 space-y-1"
                        >
                            {mediaMenuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 group relative text-sm ${isActive
                                            ? 'bg-amber-500/10 text-amber-300'
                                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-400 rounded-full" />
                                        )}
                                        <item.icon
                                            size={16}
                                            className={`${isActive ? 'text-amber-400' : 'text-gray-600 group-hover:text-amber-400'} transition-colors`}
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

            {/* HR & Careers Section */}
            <div className="mt-2">
                <button
                    onClick={() => setIsHRExpanded(!isHRExpanded)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${location.pathname.startsWith('/admin/hr')
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    <Users
                        size={20}
                        className={`${location.pathname.startsWith('/admin/hr') ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'} transition-colors`}
                    />
                    {isSidebarOpen && (
                        <>
                            <span className="font-medium truncate flex-1 text-left">HR & Careers</span>
                            {isHRExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </>
                    )}
                </button>

                <AnimatePresence>
                    {isHRExpanded && isSidebarOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-4 mt-1 space-y-1"
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
        </nav>
    );
};

export default AdminSidebar;
