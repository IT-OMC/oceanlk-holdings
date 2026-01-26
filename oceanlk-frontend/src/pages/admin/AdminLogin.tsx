import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Forgot Password Flow
    const [showForgotModal, setShowForgotModal] = useState(false);
    const [resetStep, setResetStep] = useState(1);
    const [resetEmail, setResetEmail] = useState('');
    const [resetOtp, setResetOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [resetLoading, setResetLoading] = useState(false);
    const [resetError, setResetError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                if (response.status === 401) throw new Error('Invalid username or password');
                throw new Error('Login failed. Please try again.');
            }

            const data = await response.json();
            localStorage.setItem('adminToken', data.token);
            localStorage.setItem('adminName', data.name || '');
            localStorage.setItem('adminUsername', data.username);
            localStorage.setItem('adminRole', data.role);
            localStorage.setItem('adminVerified', String(data.verified));
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        setResetError('');
        try {
            const res = await fetch('http://localhost:8080/api/admin/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail })
            });
            if (res.ok) {
                // Also trigger OTP send for real use
                await fetch('http://localhost:8080/api/admin/otp/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: 'admin', method: 'email' }) // This should ideally be linked better, but for demo:
                });
                setResetStep(2);
            } else {
                setResetError('Failed to initiate reset.');
            }
        } catch (err) {
            setResetError('Connection error');
        } finally {
            setResetLoading(false);
        }
    };

    const handleOtpVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetStep(3);
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/admin/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: resetEmail, otp: resetOtp, newPassword })
            });
            if (res.ok) {
                alert('Password reset successful! Please log in.');
                setShowForgotModal(false);
                setResetStep(1);
            } else {
                setResetError('Failed to reset password.');
            }
        } catch (err) {
            setResetError('Connection error');
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a1628] relative overflow-hidden flex items-center justify-center p-4 font-inter">
            {/* Background Effects */}
            <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px]" />
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
                <div className="relative p-10 rounded-3xl backdrop-blur-xl border border-white/10 shadow-2xl bg-[#0f1e3a]/80">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/20">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
                        <p className="text-gray-400">Secure entry for OceanLK administrators</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-400 ml-1">Username</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type="text" name="username" value={formData.username} onChange={handleChange} required
                                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-emerald-500 outline-none transition-all"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-sm font-semibold text-gray-400">Password</label>
                                <button type="button" onClick={() => setShowForgotModal(true)} className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition-colors">
                                    Forgot?
                                </button>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required
                                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:border-emerald-500 outline-none transition-all"
                                    placeholder="••••••••"
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-200 text-sm">
                                <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit" disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl font-bold text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin mx-auto" /> : "Sign In"}
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {showForgotModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowForgotModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0f1e3a] border border-white/10 rounded-[2rem] p-10 w-full max-w-md shadow-2xl">
                            <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                                {resetStep === 1
                                    ? 'Lost your access? No worries. Enter your email and we\'ll send a code.'
                                    : resetStep === 2
                                        ? `A verification code has been sent to ${resetEmail}.`
                                        : 'Almost there. Create a new secure password.'}
                            </p>

                            {resetError && (
                                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-center gap-3 font-medium">
                                    <AlertCircle size={18} />
                                    {resetError}
                                </div>
                            )}

                            {resetStep === 1 && (
                                <form onSubmit={handleForgotSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-500 ml-1">Work Email</label>
                                        <input
                                            type="email" required value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all placeholder-gray-600"
                                            placeholder="admin@oceanlk.com"
                                        />
                                    </div>
                                    <button type="submit" disabled={resetLoading} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center">
                                        {resetLoading ? <Loader2 className="animate-spin" /> : 'Request Code'}
                                    </button>
                                </form>
                            )}

                            {resetStep === 2 && (
                                <form onSubmit={handleOtpVerify} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-500 ml-1 text-center block">6-Digit Code</label>
                                        <input
                                            type="text" required maxLength={6} value={resetOtp} onChange={(e) => setResetOtp(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-5 text-white text-center text-3xl font-black tracking-[0.5em] focus:border-emerald-500 outline-none transition-all"
                                            placeholder="000000"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all">
                                            Verify & Continue
                                        </button>
                                        <button type="button" onClick={() => setResetStep(1)} className="text-sm text-gray-500 flex items-center justify-center gap-2 hover:text-white transition-colors">
                                            <ArrowLeft size={16} /> Back to email
                                        </button>
                                    </div>
                                </form>
                            )}

                            {resetStep === 3 && (
                                <form onSubmit={handlePasswordReset} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-500 ml-1">New Secure Password</label>
                                        <input
                                            type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <button type="submit" disabled={resetLoading} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all flex items-center justify-center">
                                        {resetLoading ? <Loader2 className="animate-spin" /> : 'Set New Password'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminLogin;
