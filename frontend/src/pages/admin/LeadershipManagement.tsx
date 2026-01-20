import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, Users, Save, X, Linkedin, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

interface Leader {
    id: string;
    name: string;
    position: string;
    department: 'BOARD' | 'EXECUTIVE' | 'SENIOR';
    image: string;
    bio: string;
    shortDescription: string;
    linkedin: string;
    email: string;
    displayOrder: number;
}

const LeadershipManagement = () => {
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Leader | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Omit<Leader, 'id'>>({
        name: '',
        position: '',
        department: 'EXECUTIVE',
        image: '',
        bio: '',
        shortDescription: '',
        linkedin: '',
        email: '',
        displayOrder: 0
    });

    useEffect(() => {
        fetchLeaders();
    }, []);

    const fetchLeaders = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/leadership');
            if (response.ok) {
                const data = await response.json();
                setLeaders(data);
            }
        } catch (error) {
            toast.error('Failed to fetch leadership team');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const url = editingItem
                ? `http://localhost:8080/api/leadership/${editingItem.id}`
                : 'http://localhost:8080/api/leadership';

            const response = await fetch(url, {
                method: editingItem ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingItem ? 'Leader updated successfully' : 'Leader added successfully');
                setIsModalOpen(false);
                setEditingItem(null);
                resetForm();
                fetchLeaders();
            } else {
                toast.error('Failed to save leader');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:8080/api/leadership/${itemToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Leader deleted successfully');
                setDeleteModalOpen(false);
                setItemToDelete(null);
                fetchLeaders();
            } else {
                toast.error('Failed to delete leader');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            position: '',
            department: 'EXECUTIVE',
            image: '',
            bio: '',
            shortDescription: '',
            linkedin: '',
            email: '',
            displayOrder: 0
        });
    };

    const openEditModal = (item: Leader) => {
        setEditingItem(item);
        setFormData({
            name: item.name,
            position: item.position,
            department: item.department,
            image: item.image,
            bio: item.bio,
            shortDescription: item.shortDescription,
            linkedin: item.linkedin,
            email: item.email,
            displayOrder: item.displayOrder || 0
        });
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Leadership Team</h2>
                    <p className="text-gray-400">Manage Board Members, Executives, and Senior Management</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        resetForm();
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Member
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['BOARD', 'EXECUTIVE', 'SENIOR'].map((dept) => (
                    <div key={dept} className="space-y-4">
                        <h3 className="text-xl font-bold text-emerald-400 border-b border-white/10 pb-2">
                            {dept === 'BOARD' ? 'Board of Directors' :
                                dept === 'EXECUTIVE' ? 'Executive Leadership' : 'Senior Management'}
                        </h3>
                        {leaders.filter(l => l.department === dept).map((leader) => (
                            <motion.div
                                key={leader.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={leader.image || 'https://via.placeholder.com/150'}
                                        alt={leader.name}
                                        className="w-16 h-16 rounded-full object-cover bg-white/10"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-white truncate">{leader.name}</h4>
                                        <p className="text-sm text-gray-400 truncate">{leader.position}</p>
                                        <div className="flex gap-2 mt-2">
                                            <button
                                                onClick={() => openEditModal(leader)}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setItemToDelete(leader.id);
                                                    setDeleteModalOpen(true);
                                                }}
                                                className="p-1.5 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                        {leaders.filter(l => l.department === dept).length === 0 && (
                            <p className="text-gray-500 italic text-sm">No members in this section</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#0f1e3a] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">
                                {editingItem ? 'Edit Member' : 'Add New Member'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                                    <input
                                        type="text"
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Department</label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value as any })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="BOARD">Board of Directors</option>
                                        <option value="EXECUTIVE">Executive Leadership</option>
                                        <option value="SENIOR">Senior Management</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Display Order</label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Sort Description (Card)</label>
                                    <textarea
                                        value={formData.shortDescription}
                                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Full Bio</label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn URL</label>
                                        <div className="relative">
                                            <Linkedin size={18} className="absolute left-3 top-2.5 text-gray-500" />
                                            <input
                                                type="url"
                                                value={formData.linkedin}
                                                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                                className="w-full pl-10 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                        <div className="relative">
                                            <Mail size={18} className="absolute left-3 top-2.5 text-gray-500" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full pl-10 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-2 flex gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isLoading && <span className="animate-spin">⏳</span>}
                                    {editingItem ? 'Update Member' : 'Add Member'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Leader"
                message="Are you sure you want to remove this member from the leadership team?"
                confirmText="Remove"
                cancelText="Cancel"
                isLoading={isLoading}
            />
        </div>
    );
};

export default LeadershipManagement;
