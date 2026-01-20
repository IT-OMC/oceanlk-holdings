import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

interface Partner {
    id: string;
    name: string;
    logoUrl: string;
    websiteUrl: string;
    category: 'PARTNER' | 'MEMBERSHIP';
    displayOrder: number;
}

const PartnerManagement = () => {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partner | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<Omit<Partner, 'id'>>({
        name: '',
        logoUrl: '',
        websiteUrl: '',
        category: 'PARTNER',
        displayOrder: 0
    });

    useEffect(() => {
        fetchPartners();
    }, []);

    const fetchPartners = async () => {
        try {
            const response = await fetch('/api/partners');
            if (response.ok) {
                const data = await response.json();
                setPartners(data);
            }
        } catch (error) {
            toast.error('Failed to fetch partners');
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            let currentLogoUrl = formData.logoUrl;

            // Upload file if selected
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);

                const uploadResponse = await fetch('/api/admin/media/upload', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: uploadFormData,
                });

                if (uploadResponse.ok) {
                    const uploadData = await uploadResponse.json();
                    currentLogoUrl = uploadData.url;
                } else {
                    const error = await uploadResponse.json().catch(() => ({ error: 'Upload failed' }));
                    throw new Error(error.error || 'Failed to upload logo');
                }
            }

            if (!currentLogoUrl) {
                toast.error('Please upload a logo');
                setIsLoading(false);
                return;
            }

            const url = editingItem
                ? `/api/partners/${editingItem.id}`
                : '/api/partners';

            const response = await fetch(url, {
                method: editingItem ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ ...formData, logoUrl: currentLogoUrl }),
            });

            if (response.ok) {
                toast.success(editingItem ? 'Partner updated successfully' : 'Partner added successfully');
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({ name: '', logoUrl: '', websiteUrl: '', category: 'PARTNER', displayOrder: 0 });
                setSelectedFile(null);
                fetchPartners();
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.error || 'Failed to save partner');
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`/api/partners/${itemToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Partner deleted successfully');
                setDeleteModalOpen(false);
                setItemToDelete(null);
                fetchPartners();
            } else {
                toast.error('Failed to delete partner');
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
                    <h2 className="text-2xl font-bold text-white">Partners & Memberships</h2>
                    <p className="text-gray-400">Manage partner logos and membership affiliations</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ name: '', logoUrl: '', websiteUrl: '', category: 'PARTNER', displayOrder: 0 });
                        setSelectedFile(null);
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Partner
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {partners.map((partner) => (
                    <motion.div
                        key={partner.id}
                        layout
                        className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 transition-colors flex flex-col items-center"
                    >
                        <div className="w-full h-32 bg-white/5 rounded-lg mb-4 flex items-center justify-center p-4">
                            <img
                                src={partner.logoUrl}
                                alt={partner.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                        <h3 className="font-bold text-white mb-1">{partner.name}</h3>
                        <span className="text-xs px-2 py-1 bg-white/10 rounded-full text-gray-400 mb-4">{partner.category}</span>

                        <div className="flex gap-2 w-full mt-auto">
                            <button
                                onClick={() => {
                                    setEditingItem(partner);
                                    setFormData({
                                        name: partner.name,
                                        logoUrl: partner.logoUrl,
                                        websiteUrl: partner.websiteUrl,
                                        category: partner.category,
                                        displayOrder: partner.displayOrder || 0
                                    });
                                    setSelectedFile(null);
                                    setIsModalOpen(true);
                                }}
                                className="flex-1 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors flex justify-center"
                            >
                                <Edit2 size={16} />
                            </button>
                            <button
                                onClick={() => {
                                    setItemToDelete(partner.id);
                                    setDeleteModalOpen(true);
                                }}
                                className="flex-1 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors flex justify-center"
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
                            {editingItem ? 'Edit Partner' : 'Add Partner'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            {/* Logo Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Logo</label>
                                <div className="space-y-3">
                                    {(formData.logoUrl || selectedFile) && (
                                        <div className="w-full h-32 bg-white/5 rounded-lg border border-dashed border-white/20 flex items-center justify-center p-4 relative group">
                                            <img
                                                src={selectedFile ? URL.createObjectURL(selectedFile) : formData.logoUrl}
                                                alt="Preview"
                                                className="max-w-full max-h-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, logoUrl: '' });
                                                    setSelectedFile(null);
                                                }}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <input
                                            type="file"
                                            onChange={handleFileSelect}
                                            accept="image/*"
                                            className="hidden"
                                            id="logo-upload"
                                        />
                                        <label
                                            htmlFor="logo-upload"
                                            className="w-full px-4 py-3 bg-white/5 border border-dashed border-white/20 hover:border-emerald-500/50 hover:bg-white/10 rounded-lg text-gray-400 flex flex-col items-center justify-center cursor-pointer transition-all gap-2"
                                        >
                                            <Upload className="w-6 h-6" />
                                            <span className="text-sm">Click to upload logo</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="PARTNER">Partner</option>
                                    <option value="MEMBERSHIP">Membership</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Website URL (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.websiteUrl}
                                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
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
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                                >
                                    {isLoading ? 'Saving...' : 'Save'}
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
                title="Delete Partner"
                message="Are you sure?"
                confirmText="Delete"
                isLoading={isLoading}
            />
        </div>
    );
};

export default PartnerManagement;
