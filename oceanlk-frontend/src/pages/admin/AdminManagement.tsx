import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, Mail, Phone, Search, AlertCircle, Loader2, X, Check, Eye, EyeOff, Edit2 } from 'lucide-react';
import { API_ENDPOINTS } from '../../utils/api';
import { AdminUser, UserCreateRequest, UserUpdateRequest, UserRole } from '../../types/api';

const AdminManagement = () => {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // New Admin State
    const [newAdmin, setNewAdmin] = useState<UserCreateRequest>({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        role: 'ADMIN'
    });
    const [adding, setAdding] = useState(false);

    // Edit Admin State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
    const [updating, setUpdating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(API_ENDPOINTS.ADMIN_LIST, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setAdmins(data);
            } else {
                setError('Failed to load admins. Are you a Super Admin?');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAdding(true);
        setError('');
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(API_ENDPOINTS.ADMIN_ADD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newAdmin)
            });

            if (res.ok) {
                setSuccess('Admin added successfully!');
                setShowAddModal(false);
                setNewAdmin({ name: '', username: '', email: '', phone: '', password: '', role: 'ADMIN' });
                fetchAdmins();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to add admin');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteAdmin = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return;

        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(API_ENDPOINTS.ADMIN_DELETE(id), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok) {
                setSuccess('Admin deleted');
                fetchAdmins();
            } else {
                setError('Failed to delete admin');
            }
        } catch (err) {
            setError('Connection error');
        }
    };

    const handleEditAdmin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingAdmin) return;
        setUpdating(true);
        setError('');
        const token = localStorage.getItem('adminToken');

        const updateRequest: UserUpdateRequest = {
            name: editingAdmin.name,
            email: editingAdmin.email,
            phone: editingAdmin.phone,
            role: editingAdmin.role,
            active: editingAdmin.active
        };

        try {
            const res = await fetch(API_ENDPOINTS.ADMIN_EDIT(editingAdmin.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateRequest)
            });

            if (res.ok) {
                setSuccess('Admin updated successfully!');
                setShowEditModal(false);
                setEditingAdmin(null);
                fetchAdmins();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update admin');
            }
        } catch (err) {
            setError('Connection error');
        } finally {
            setUpdating(false);
        }
    };

    const openEditModal = (admin: AdminUser) => {
        setEditingAdmin({ ...admin });
        setShowEditModal(true);
    };


    const filteredAdmins = admins.filter(a =>
        a.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-end">
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                >
                    <UserPlus size={20} />
                    Add New Admin
                </button>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence>
                {error && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-red-400 flex items-center gap-3">
                        <AlertCircle size={20} />
                        {error}
                        <button onClick={() => setError('')} className="ml-auto"><X size={16} /></button>
                    </motion.div>
                )}
                {success && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-emerald-400 flex items-center gap-3">
                        <Check size={20} />
                        {success}
                        <button onClick={() => setSuccess('')} className="ml-auto"><X size={16} /></button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admin Table */}
            <div className="bg-[#0f1e3a] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search admins by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:border-emerald-500 outline-none transition-colors"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                <th className="px-6 py-4 font-semibold">Admin</th>
                                <th className="px-6 py-4 font-semibold">Contact Info</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                                        <Loader2 className="animate-spin mx-auto mb-2" size={30} />
                                        Loading administrators...
                                    </td>
                                </tr>
                            ) : filteredAdmins.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-gray-500">
                                        No admins found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-white/2 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center text-white font-bold">
                                                    {admin.name ? admin.name.charAt(0).toUpperCase() : admin.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{admin.name || admin.username}</div>
                                                    <div className="text-xs text-gray-500">@{admin.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Mail size={14} className="text-gray-500" />
                                                    {admin.email}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Phone size={14} className="text-gray-500" />
                                                    {admin.phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${admin.role === 'SUPER_ADMIN'
                                                ? 'bg-purple-500/10 border-purple-500/30 text-purple-400'
                                                : admin.role === 'CONTENT_EDITOR'
                                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                                    : admin.role === 'HR_MANAGER'
                                                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                                        : admin.role === 'RECRUITER'
                                                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                                }`}>
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${admin.active ? 'bg-emerald-500' : 'bg-gray-500'}`} />
                                                <span className="text-sm text-gray-300">{admin.active ? 'Active' : 'Inactive'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(admin)}
                                                    className="p-2 text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-all"
                                                    title="Edit Admin"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                {admin.role !== 'SUPER_ADMIN' && (
                                                    <button
                                                        onClick={() => handleDeleteAdmin(admin.id)}
                                                        className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                        title="Delete Admin"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Admin Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0f1e3a] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Add New Administrator</h2>

                            <form onSubmit={handleAddAdmin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={newAdmin.name}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Username</label>
                                        <input
                                            type="text"
                                            required
                                            value={newAdmin.username}
                                            onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                required
                                                value={newAdmin.password}
                                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={newAdmin.email}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={newAdmin.phone}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Role</label>
                                    <select
                                        value={newAdmin.role}
                                        onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as UserRole })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors appearance-none"
                                    >
                                        <option value="ADMIN" className="bg-[#0f1e3a]">Standard Admin</option>
                                        <option value="SUPER_ADMIN" className="bg-[#0f1e3a]">Super Admin</option>
                                        <option value="CONTENT_EDITOR" className="bg-[#0f1e3a]">Content Editor</option>
                                        <option value="HR_MANAGER" className="bg-[#0f1e3a]">HR Manager</option>
                                        <option value="RECRUITER" className="bg-[#0f1e3a]">Recruiter</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={adding}
                                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        {adding && <Loader2 className="animate-spin" size={20} />}
                                        Create Account
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Admin Modal */}
            <AnimatePresence>
                {showEditModal && editingAdmin && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-[#0f1e3a] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
                            <h2 className="text-2xl font-bold text-white mb-6">Edit Administrator Details</h2>

                            <form onSubmit={handleEditAdmin} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingAdmin.name || ''}
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Username</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingAdmin.username}
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, username: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={editingAdmin.email}
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={editingAdmin.phone}
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Role</label>
                                    <select
                                        value={editingAdmin.role}
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, role: e.target.value as UserRole })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:border-emerald-500 outline-none transition-colors appearance-none"
                                    >
                                        <option value="ADMIN" className="bg-[#0f1e3a]">Standard Admin</option>
                                        <option value="SUPER_ADMIN" className="bg-[#0f1e3a]">Super Admin</option>
                                        <option value="CONTENT_EDITOR" className="bg-[#0f1e3a]">Content Editor</option>
                                        <option value="HR_MANAGER" className="bg-[#0f1e3a]">HR Manager</option>
                                        <option value="RECRUITER" className="bg-[#0f1e3a]">Recruiter</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-3 py-2">
                                    <input
                                        type="checkbox"
                                        id="active"
                                        checked={editingAdmin.active}
                                        onChange={(e) => setEditingAdmin({ ...editingAdmin, active: e.target.checked })}
                                        className="w-5 h-5 rounded border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <label htmlFor="active" className="text-sm font-medium text-gray-300">Active Account</label>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        {updating && <Loader2 className="animate-spin" size={20} />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminManagement;
