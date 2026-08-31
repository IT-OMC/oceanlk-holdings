import { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { Plus, Trash2, Edit2, BarChart3, GripVertical, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';
import { NEXT_PUBLIC_API_BASE_URL } from '../../utils/api';

interface GlobalMetric {
    id: string;
    label: string;
    value: string;
    icon: string;
    displayOrder: number;
}

const StatsManagement = () => {
    const [stats, setStats] = useState<GlobalMetric[]>([]);
    const [isReordered, setIsReordered] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<GlobalMetric | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    // Distinct from isLoading (which covers form submits): true only until
    // the first fetch settles, so the empty state below never flashes
    // "nothing here" before the data has actually arrived.
    const [initialLoading, setInitialLoading] = useState(true);
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
            const response = await fetch(NEXT_PUBLIC_API_BASE_URL.METRICS);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
                setIsReordered(false);
            }
        } catch (error) {
            toast.error('Failed to fetch stats');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = sessionStorage.getItem('adminToken');
            const url = editingItem
                ? NEXT_PUBLIC_API_BASE_URL.METRIC_BY_ID(editingItem.id)
                : NEXT_PUBLIC_API_BASE_URL.METRICS;

            const response = await fetch(url, {
                method: editingItem ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.pendingChange) {
                    toast.success('Change submitted for approval');
                } else {
                    toast.success(editingItem ? 'Stat updated successfully' : 'Stat added successfully');
                }
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

    const handleSaveOrder = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('adminToken');
            // Sent as a single batch (not one PUT per moved stat) so a reorder
            // is exactly one pending change for a super admin to approve, not
            // one per stat whose position shifted.
            const reordered = stats.map((stat, index) => ({ ...stat, displayOrder: index + 1 }));

            const response = await fetch(NEXT_PUBLIC_API_BASE_URL.METRICS_REORDER, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reordered),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.pendingChange) {
                    toast.success('Order change submitted for approval');
                } else {
                    toast.success('Order saved successfully');
                }
            } else {
                const data = await response.json().catch(() => null);
                toast.error(data?.error || 'Failed to save order');
            }
            fetchStats();
        } catch (error) {
            toast.error('An error occurred while saving order');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsLoading(true);

        try {
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(NEXT_PUBLIC_API_BASE_URL.METRIC_BY_ID(itemToDelete), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                // Check if response has content
                const text = await response.text();
                if (text) {
                    const data = JSON.parse(text);
                    if (data.pendingChange) {
                        toast.success('Deletion submitted for approval');
                    } else {
                        toast.success('Stat deleted successfully');
                    }
                } else {
                    toast.success('Stat deleted successfully');
                }

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
                    <p className="text-gray-400">Manage the key metrics displayed on the home page</p>
                </div>
                <div className="flex gap-4">
                    {isReordered && (
                        <button
                            onClick={handleSaveOrder}
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                        >
                            <Save size={20} />
                            Save Order
                        </button>
                    )}
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
            </div>

            <Reorder.Group values={stats} onReorder={(newOrder) => { setStats(newOrder); setIsReordered(true); }} className="flex flex-col gap-4">
                {stats.map((stat, index) => (
                    <Reorder.Item
                        key={stat.id}
                        value={stat}
                        className="bg-white/5 rounded-xl p-4 px-6 border min-h-24 w-3/4 border-white/10 flex flex-row items-center justify-between hover:border-emerald-500/30 transition-colors cursor-grab active:cursor-grabbing relative"
                    >
                        <div className="flex items-center gap-8">
                            <div className="text-gray-500 flex items-center gap-4">
                                <span className="font-medium text-lg min-w-[20px]">{index + 1}.</span>
                            </div>
                            <div className="text-3xl font-bold text-emerald-400 min-w-[140px]">{stat.value}</div>
                            <div className="text-gray-300 font-medium text-lg">{stat.label}</div>
                        </div>
                        <div className="flex items-center gap-3" onPointerDown={(e) => e.stopPropagation()}>
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
                                className="p-2.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => {
                                    setItemToDelete(stat.id);
                                    setDeleteModalOpen(true);
                                }}
                                className="p-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                            <div className="text-gray-500 flex items-center gap-4 ml-8">
                                <GripVertical size={20} />
                            </div>
                        </div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>

            {!initialLoading && stats.length === 0 && (
                <div className="text-center py-16 text-gray-400 bg-white/5 rounded-xl border border-white/10">
                    <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-gray-300 font-medium">No statistics found</p>
                    <p className="text-sm mt-1">Create one using the button above.</p>
                </div>
            )}

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
