import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const adminUser = localStorage.getItem('adminUser');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin');
    };



    return (
        <div className="min-h-screen bg-[#0a1628] font-sans text-gray-100">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 280 }}
                animate={{ width: isSidebarOpen ? 280 : 80 }}
                className="bg-[#0f1e3a] border-r border-white/10 fixed left-0 top-0 bottom-0 z-20 transition-all duration-300 flex flex-col overflow-hidden"
            >
                <div className="p-6 flex items-center justify-between border-b border-white/10 shrink-0">
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

                <AdminSidebar isSidebarOpen={isSidebarOpen} />

                <div className="p-4 border-t border-white/10 bg-[#0f1e3a] shrink-0">
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
            <motion.main
                animate={{ marginLeft: isSidebarOpen ? 280 : 80 }}
                transition={{ duration: 0.3 }}
                className="min-h-screen overflow-y-auto relative bg-[#0a1628]"
            >
                <div className="max-w-7xl mx-auto p-8">
                    {/* Breadcrumbs / Header could go here */}


                    <Outlet />
                </div>
            </motion.main>
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
