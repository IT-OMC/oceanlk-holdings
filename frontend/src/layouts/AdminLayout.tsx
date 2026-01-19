import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Image,
    Briefcase,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Mail
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin');
    };

    const menuItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/applications', icon: FileText, label: 'Applications' },
        { path: '/admin/jobs', icon: Briefcase, label: 'Job Opportunities' },
        { path: '/admin/media', icon: Image, label: 'Media Management' },
        { path: '/admin/contact-messages', icon: Mail, label: 'Contact Messages' },
    ];

    return (
        <div className="min-h-screen bg-[#0a1628] flex font-sans text-gray-100">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-[#0f1e3a] border-r border-white/10 relative z-20 flex-shrink-0 transition-all duration-300"
            >
                <div className="p-6 flex items-center justify-between border-b border-white/10">
                    <AnimatePresence mode="wait">
                        {isSidebarOpen && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="font-bold text-xl text-white tracking-wider"
                            >
                                OCEAN<span className="text-emerald-500">LK</span> ADMIN
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                    ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-full" />
                                )}
                                <item.icon
                                    size={20}
                                    className={`${isActive ? 'text-emerald-400' : 'text-gray-500 group-hover:text-emerald-400'} transition-colors`}
                                />
                                <AnimatePresence mode="wait">
                                    {isSidebarOpen && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="font-medium truncate"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                                {!isSidebarOpen && isActive && (
                                    <div className="absolute right-2 w-2 h-2 rounded-full bg-emerald-500" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 bg-[#0f1e3a]">
                    <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'} mb-4 px-2`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg">
                            {adminUser ? adminUser.charAt(0).toUpperCase() : 'A'}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{adminUser}</p>
                                <p className="text-xs text-gray-500 truncate">Administrator</p>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center ${isSidebarOpen ? 'justify-start gap-3 px-4' : 'justify-center'} py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors`}
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto relative bg-[#0a1628]">
                <div className="max-w-7xl mx-auto p-8">
                    {/* Breadcrumbs / Header could go here */}
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-white">
                                {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
                            </h2>
                            <p className="text-gray-400 text-sm mt-1">
                                Manage your platform content and applications
                            </p>
                        </div>
                    </div>

                    <Outlet />
                </div>
            </main>
            <Toaster position="top-right" toastOptions={{
                style: {
                    background: '#0f1e3a',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.1)'
                }
            }} />
        </div>
    );
};

export default AdminLayout;
