import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, Lock, Shield, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const AdminProfile = () => {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Password Change State
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordStep, setPasswordStep] = useState(1); // 1: New Password, 2: OTP Verification
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const username = localStorage.getItem('adminUsername');
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`http://localhost:8080/api/admin/management/profile/${username}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
            }
        } catch (err) {
            setError('Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordResetInit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setError('');
        setOtpLoading(true);

        const username = localStorage.getItem('adminUsername');
        try {
            const res = await fetch('http://localhost:8080/api/admin/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, method: 'email' })
            });

            if (res.ok) {
                setPasswordStep(2);
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setOtpLoading(false);
        }
    };

    const handlePasswordResetComplete = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setOtpLoading(true);

        const username = localStorage.getItem('adminUsername');
        try {
            // Re-verify OTP for security
            const verifyRes = await fetch('http://localhost:8080/api/admin/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, otp })
            });

            if (verifyRes.ok) {
                const changeRes = await fetch('http://localhost:8080/api/admin/management/change-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, newPassword, otp })
                });

                if (changeRes.ok) {
                    setSuccess('Password updated successfully!');
                    setShowPasswordModal(false);
                    setPasswordStep(1);
                    setNewPassword('');
                    setConfirmPassword('');
                    setOtp('');
                } else {
                    setError('Failed to update password');
                }
            } else {
                setError('Invalid or expired OTP');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setOtpLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-emerald-500" size={40} /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white">My Profile</h1>
                    <p className="text-gray-400 mt-2">Manage your account information and security</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-gray-300">
                    <Shield size={16} className="text-emerald-400" />
                    {profile?.role}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-8 space-y-8">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                                {profile?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">{profile?.username}</h2>
                                <p className="text-gray-400">{profile?.email}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl text-white">
                                    <Mail size={18} className="text-gray-400" />
                                    <span>{profile?.email || 'Not set'}</span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl text-white">
                                    <Phone size={18} className="text-gray-400" />
                                    <span>{profile?.phone || 'Not set'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-white mb-6">Security Settings</h3>
                        <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-red-500/10 rounded-lg text-red-400">
                                    <Lock size={20} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-white">Password</h4>
                                    <p className="text-sm text-gray-400">Regularly updating your password improves security</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6">
                        <h3 className="font-bold text-white mb-4">Account Status</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Verified Status</span>
                                <div className="flex items-center gap-1.5 text-emerald-400">
                                    <CheckCircle size={14} />
                                    <span>Verified</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Account Type</span>
                                <span className="text-white font-medium">{profile?.role}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Member Since</span>
                                <span className="text-white font-medium">Jan 26, 2026</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPasswordModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative bg-[#0f1e3a] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl"
                        >
                            <h2 className="text-2xl font-bold text-white mb-2">Change Password</h2>
                            <p className="text-gray-400 text-sm mb-6">
                                {passwordStep === 1
                                    ? 'Enter your new password below. You will need to verify via OTP.'
                                    : `A 6-digit code has been sent to ${profile?.email}.`}
                            </p>

                            {error && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                                    <AlertCircle size={18} />
                                    {error}
                                </div>
                            )}

                            {passwordStep === 1 ? (
                                <form onSubmit={handlePasswordResetInit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={otpLoading}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {otpLoading && <Loader2 className="animate-spin" size={20} />}
                                        Get OTP Code
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handlePasswordResetComplete} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Enter 6-Digit Code</label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={otp}
                                            placeholder="000000"
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-center text-2xl font-bold tracking-[1em] focus:border-emerald-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button
                                            type="submit"
                                            disabled={otpLoading}
                                            className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2"
                                        >
                                            {otpLoading && <Loader2 className="animate-spin" size={20} />}
                                            Verify & Update Password
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setPasswordStep(1)}
                                            className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
                                        >
                                            Back to password
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminProfile;
