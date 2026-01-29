import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogOut,
    Menu,
    X,
    ShieldAlert,
    Mail,
    Lock,
    ArrowRight,
    Loader2,
    CheckCircle
} from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';
import AdminSidebar from '../components/admin/AdminSidebar';
import NotificationBell from '../components/admin/NotificationBell';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const adminName = localStorage.getItem('adminName') || 'Administrator';
    const adminUsername = localStorage.getItem('adminUsername') || 'admin';
    const adminRole = localStorage.getItem('adminRole');

    // Verification State
    const [isVerified, setIsVerified] = useState(() => {
        // Super Admins are always verified, or rely on the flag
        // However, for safety, we trust the flag. 
        // Note: localStorage stores strings
        return localStorage.getItem('adminVerified') === 'true';
    });

    const [verificationStep, setVerificationStep] = useState<'initial' | 'sent'>('initial');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkVerification = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                if (!token) return;

                const res = await fetch('http://localhost:8080/api/admin/validate', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setIsVerified(data.verified);
                    localStorage.setItem('adminVerified', String(data.verified));
                }
            } catch (e) {
                console.error("Failed to validate token", e);
            }
        };
        checkVerification();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminName');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminRole');
        localStorage.removeItem('adminVerified');
        navigate('/admin');
    };

    const sendOtp = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/admin/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: adminUsername, method: 'email' })
            });
            if (res.ok) {
                toast.success('Verification code sent to your email');
                setVerificationStep('sent');
            } else {
                toast.error('Failed to send verification code');
            }
        } catch (error) {
            toast.error('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/admin/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: adminUsername, otp })
            });
            const data = await res.json();

            if (res.ok) {
                toast.success('Account verified successfully!');
                setIsVerified(true);
                localStorage.setItem('adminVerified', 'true');
            } else {
                toast.error(data.error || 'Invalid OTP');
            }
        } catch (error) {
            toast.error('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return 'Dashboard';
        if (path.includes('/profile')) return 'My Profile';
        if (path.includes('/management')) return 'Admin Management';
        if (path.includes('/companies')) return 'Companies';
        if (path.includes('/news-media/news')) return 'News Articles';
        if (path.includes('/news-media/blog')) return 'Blog Posts';
        if (path.includes('/news-media/gallery')) return 'Gallery';
        if (path.includes('/contact-messages')) return 'Contact Messages';
        if (path.includes('/content/pages')) return 'Page Content';
        if (path.includes('/content/leadership')) return 'Leadership';
        if (path.includes('/content/stats')) return 'Statistics';
        if (path.includes('/content/partners')) return 'Partners';
        if (path.includes('/audit-logs')) return 'Audit Logs';
        if (path.includes('/pending-changes')) return 'Pending Changes';
        if (path.includes('/hr/media')) return 'HR Media';
        if (path.includes('/hr/events')) return 'Events';
        if (path.includes('/hr/testimonials')) return 'Testimonials';
        if (path.includes('/hr/applications')) return 'Applications';
        if (path.includes('/hr/jobs')) return 'Job Postings';
        if (path.includes('/media')) return 'Media Management';
        return 'Admin Panel';
    };


    // If not verified, show blocking UI
    if (!isVerified) {
        return (
            <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 font-sans relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-md w-full bg-[#0f1e3a] border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                            <ShieldAlert className="w-10 h-10 text-amber-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Account Verification Required</h2>
                        <p className="text-gray-400 text-sm">
                            For security purposes, please verify your identity before accessing the admin dashboard.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {verificationStep === 'initial' ? (
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Email Verification</h3>
                                        <p className="text-xs text-gray-400">We'll send a code to your registered email</p>
                                    </div>
                                </div>
                                <button
                                    onClick={sendOtp}
                                    disabled={loading}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            Send Verification Code
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={verifyOtp} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Enter 6-digit Code</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            maxLength={6}
                                            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500 transition-colors tracking-widest text-lg font-mono"
                                            placeholder="000000"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" /> : (
                                        <>
                                            Verify Account
                                            <CheckCircle size={18} />
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setVerificationStep('initial')}
                                    className="w-full py-2 text-sm text-gray-500 hover:text-white transition-colors"
                                >
                                    Use a different method
                                </button>
                            </form>
                        )}

                        <div className="pt-6 border-t border-white/5">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
                <Toaster position="bottom-center" toastOptions={{
                    style: {
                        background: '#0f1e3a',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }
                }} />
            </div>
        );
    }

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
                            {adminName ? adminName.charAt(0).toUpperCase() : 'A'}
                        </div>
                        {isSidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{adminName}</p>
                                <p className="text-xs text-gray-500 truncate">@{adminUsername}</p>
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
                    {/* Top Header / Navbar */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-white tracking-tight">{getPageTitle()}</h1>
                            <p className="text-gray-400 text-sm">Welcome back, {adminName}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <NotificationBell />
                            <div className="h-6 w-px bg-white/10" />
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-white">{adminName}</p>
                                    <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">{adminRole?.replace('ROLE_', '')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

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
