import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

interface GlobalMetric {
    id: string;
    label: string;
    value: string;
    icon: string;
    displayOrder: number;
}

const StatsManagement = () => {
    const [stats, setStats] = useState<GlobalMetric[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GlobalMetric | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<Omit<GlobalMetric, 'id'>>({
        label: '',
        value: '',
        icon: 'BarChart',
        displayOrder: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/metrics');
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            toast.error('Failed to fetch stats');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const url = editingItem
                ? `http://localhost:8080/api/metrics/${editingItem.id}`
                : 'http://localhost:8080/api/metrics';

            const response = await fetch(url, {
                method: editingItem ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(editingItem ? 'Stat updated successfully' : 'Stat added successfully');
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({ label: '', value: '', icon: 'BarChart', displayOrder: 0 });
                fetchStats();
            } else {
                toast.error('Failed to save stat');
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
            const response = await fetch(`http://localhost:8080/api/metrics/${itemToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Stat deleted successfully');
                setDeleteModalOpen(false);
                setItemToDelete(null);
                fetchStats();
            } else {
                toast.error('Failed to delete stat');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white">Global Statistics</h2>
                    <p className="text-gray-400">Manage the key metrics displayed on the home page</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ label: '', value: '', icon: 'BarChart', displayOrder: 0 });
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Stat
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <motion.div
                        key={stat.id}
                        layout
                        className="bg-white/5 rounded-xl p-6 border border-white/10 flex flex-col items-center text-center hover:border-emerald-500/30 transition-colors"
                    >
                        <div className="text-4xl font-bold text-emerald-400 mb-2">{stat.value}</div>
                        <div className="text-gray-400 font-medium mb-4">{stat.label}</div>
                        <div className="mt-auto flex gap-2 w-full">
                            <button
                                onClick={() => {
                                    setEditingItem(stat);
                                    setFormData({
                                        label: stat.label,
                                        value: stat.value,
                                        icon: stat.icon,
                                        displayOrder: stat.displayOrder || 0
                                    });
                                    setIsModalOpen(true);
                                }}
                                className="flex-1 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors flex justify-center"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    setItemToDelete(stat.id);
                                    setDeleteModalOpen(true);
                                }}
                                className="flex-1 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors flex justify-center"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#0f1e3a] rounded-2xl p-6 max-w-md w-full"
                    >
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {editingItem ? 'Edit Statistic' : 'Add Statistic'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Value (e.g. "35+")</label>
                                <input
                                    type="text"
                                    value={formData.value}
                                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Label</label>
                                <input
                                    type="text"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    required
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
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                                >
                                    Save
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
                title="Delete Statistic"
                message="Are you sure?"
                confirmText="Delete"
                isLoading={isLoading}
            />
        </div>
    );
};

export default StatsManagement;
