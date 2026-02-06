import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Shield, Lock, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { API_ENDPOINTS } from '../../utils/api';
import { toast } from 'react-hot-toast';

const AdminProfile = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [admin, setAdmin] = useState<any>(null);

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Password Change State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [activeTab, setActiveTab] = useState<'details' | 'security'>('details');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        const username = sessionStorage.getItem('adminUsername');
        const token = sessionStorage.getItem('adminToken');

        if (!username || !token) {
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(API_ENDPOINTS.ADMIN_PROFILE(username), {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setAdmin(data);
                setName(data.name);
                setEmail(data.email);
                setPhone(data.phone);
            } else {
                toast.error("Failed to load profile");
            }
        } catch (error) {
            console.error(error);
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const username = sessionStorage.getItem('adminUsername');
        const token = sessionStorage.getItem('adminToken');

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/profile/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, name, email, phone })
            });

            if (res.ok) {
                toast.success("Profile updated successfully");
                // Update session storage if name changed
                sessionStorage.setItem('adminName', name);
                fetchProfile();
            } else {
                const data = await res.json();
                toast.error(data.error || "Update failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setSaving(true);
        const username = sessionStorage.getItem('adminUsername');
        const token = sessionStorage.getItem('adminToken');

        try {
            const res = await fetch(API_ENDPOINTS.ADMIN_CHANGE_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ username, currentPassword, newPassword }) // Note: Backend usually handles auth verification properly
            });

            if (res.ok) {
                toast.success("Password changed successfully");
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const data = await res.json();
                toast.error(data.error || "Password change failed");
            }
        } catch (error) {
            toast.error("Network error");
        } finally {
            setSaving(false);
        }
    };

    // Exposed for future use in UI or other tabs
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleInitiateContactUpdate = (type: 'email' | 'phone', value: string) => {
        initiateContactUpdate(type, value);
    };

    const initiateContactUpdate = async (type: 'email' | 'phone', value: string) => {
        toast.promise(
            (async () => {
                const username = sessionStorage.getItem('adminUsername');
                const token = sessionStorage.getItem('adminToken');
                const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/admin/management/profile/contact-update/init`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ username, type, value })
                });
                if (!res.ok) throw new Error("Failed to send verification");
                return res.json();
            })(),
            {
                loading: 'Sending verification code...',
                success: 'Verification code sent!',
                error: 'Failed to send code'
            }
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header Card */}
            <div className="bg-[#0f1e3a] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                        {admin?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold text-white mb-2">{admin?.name}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                <User size={14} /> @{admin?.username}
                            </span>
                            <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                <Shield size={14} /> {admin?.role}
                            </span>
                            {admin?.verified && (
                                <span className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                                    <CheckCircle2 size={14} /> Verified Account
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Sidebar Nav */}
                <div className="space-y-4">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`w-full text-left px-6 py-4 rounded-xl transition-all flex items-center gap-3 font-medium ${activeTab === 'details'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-[#0f1e3a] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
                            }`}
                    >
                        <User size={18} />
                        Personal Details
                    </button>
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full text-left px-6 py-4 rounded-xl transition-all flex items-center gap-3 font-medium ${activeTab === 'security'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                            : 'bg-[#0f1e3a] text-gray-400 hover:text-white hover:bg-white/5 border border-white/5'
                            }`}
                    >
                        <Lock size={18} />
                        Security & Password
                    </button>
                </div>

                {/* Content Area */}
                <div className="md:col-span-2">
                    <AnimatePresence mode="wait">
                        {activeTab === 'details' ? (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6"
                            >
                                <h3 className="text-xl font-bold text-white mb-6">Personal Information</h3>
                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Full Name</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:border-emerald-500 outline-none transition-colors"
                                            />
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Email Address</label>
                                            <div className="relative group">
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:border-emerald-500 outline-none transition-colors"
                                                />
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-white focus:border-emerald-500 outline-none transition-colors"
                                                />
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6"
                            >
                                <h3 className="text-xl font-bold text-white mb-6">Change Password</h3>
                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">New Password</label>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                                            placeholder="Enter new password"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                                            placeholder="Confirm new password"
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2"
                                        >
                                            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                            Update Password
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
