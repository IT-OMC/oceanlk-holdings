import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Linkedin, Mail, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';
import { API_ENDPOINTS } from '../../utils/api';

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

interface LeadershipCategory {
    id: string;
    code: string;
    title: string;
    subtitle: string;
    displayOrder: number;
}

const LeadershipManagement = () => {
    const [leaders, setLeaders] = useState<Leader[]>([]);
    const [categories, setCategories] = useState<LeadershipCategory[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Leader | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [categoryEditMode, setCategoryEditMode] = useState(false);
    const [editingCategory, setEditingCategory] = useState<LeadershipCategory | null>(null);
    const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<LeadershipCategory | null>(null);

    // New Section Modal State
    const [sectionModalOpen, setSectionModalOpen] = useState(false);
    const [newSection, setNewSection] = useState({
        title: '',
        subtitle: '',
        code: ''
    });

    // Image Upload State
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

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
        fetchCategories();
    }, []);

    const fetchLeaders = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.LEADERSHIP);
            if (response.ok) {
                const data = await response.json();
                setLeaders(data);
            }
        } catch (error) {
            toast.error('Failed to fetch leadership team');
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.LEADERSHIP_CATEGORIES);
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            }
        } catch (error) {
            toast.error('Failed to fetch categories');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const url = editingItem
                ? API_ENDPOINTS.LEADERSHIP_BY_ID(editingItem.id)
                : API_ENDPOINTS.LEADERSHIP;

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
            const response = await fetch(API_ENDPOINTS.LEADERSHIP_BY_ID(itemToDelete), {
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

    const handleCreateSection = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(API_ENDPOINTS.LEADERSHIP_CATEGORIES, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: newSection.title,
                    subtitle: newSection.subtitle,
                    code: newSection.code.toUpperCase().replace(/\s+/g, '_'),
                    displayOrder: categories.length + 1
                }),
            });

            if (response.ok) {
                toast.success('Section created successfully');
                setSectionModalOpen(false);
                setNewSection({ title: '', subtitle: '', code: '' });
                fetchCategories();
            } else {
                toast.error('Failed to create section');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(API_ENDPOINTS.ADMIN_MEDIA_UPLOAD, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setFormData(prev => ({ ...prev, image: data.url }));
                toast.success('Image uploaded successfully');
            } else {
                toast.error('Failed to upload image');
            }
        } catch (error) {
            toast.error('Error uploading image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdateCategory = async (category: LeadershipCategory) => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(API_ENDPOINTS.LEADERSHIP_CATEGORY_BY_CODE(category.code), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: category.title,
                    subtitle: category.subtitle
                }),
            });

            if (response.ok) {
                toast.success('Category updated successfully');
                setCategoryEditMode(false);
                setEditingCategory(null);
                fetchCategories();
            } else {
                toast.error('Failed to update category');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(API_ENDPOINTS.LEADERSHIP_CATEGORY_BY_CODE(categoryToDelete.code), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Category deleted successfully');
                setDeleteCategoryModalOpen(false);
                setCategoryToDelete(null);
                fetchCategories();
            } else {
                toast.error('Failed to delete category');
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
                <div className="flex gap-3">
                    <button
                        onClick={() => setSectionModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Plus size={20} />
                        Add Section
                    </button>
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
            </div>

            {/* Add Section Modal */}
            {sectionModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#0f1e3a] rounded-2xl p-6 max-w-lg w-full"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-white">Add Leadership Section</h2>
                            <button onClick={() => setSectionModalOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateSection} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Section Code (Unique ID)</label>
                                <input
                                    type="text"
                                    value={newSection.code}
                                    onChange={(e) => setNewSection({ ...newSection, code: e.target.value })}
                                    required
                                    placeholder="e.g. ADVISORY_BOARD"
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none uppercase"
                                />
                                <p className="text-xs text-gray-500 mt-1">This will be used as the internal identifier. Use uppercase letters and underscores.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={newSection.title}
                                    onChange={(e) => setNewSection({ ...newSection, title: e.target.value })}
                                    required
                                    placeholder="e.g. Advisory Board"
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label>
                                <textarea
                                    value={newSection.subtitle}
                                    onChange={(e) => setNewSection({ ...newSection, subtitle: e.target.value })}
                                    rows={3}
                                    placeholder="Brief description of this group..."
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-white/10 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setSectionModalOpen(false)}
                                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Creating...' : 'Create Section'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}


            {/* Category Management Section */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-lg font-bold text-white mb-4">Category Titles</h3>
                <p className="text-sm text-gray-400 mb-4">Customize the titles for each leadership category</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {categories.map((category) => (
                        <div key={category.code} className="bg-white/5 rounded-lg p-4 border border-white/10">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 uppercase mb-1">{category.code}</p>
                                    <p className="text-white font-semibold">{category.title}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingCategory(category);
                                            setCategoryEditMode(true);
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-blue-400 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setCategoryToDelete(category);
                                            setDeleteCategoryModalOpen(true);
                                        }}
                                        className="p-1.5 hover:bg-white/10 rounded-lg text-red-400 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 line-clamp-2">{category.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.code} className="space-y-4">
                        <h3 className="text-xl font-bold text-emerald-400 border-b border-white/10 pb-2">
                            {category.title}
                        </h3>
                        {leaders.filter(l => l.department === category.code).map((leader) => (
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
                        {leaders.filter(l => l.department === category.code).length === 0 && (
                            <p className="text-gray-500 italic text-sm">No members in this section</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Create/Edit Modal */}
            {
                isModalOpen && (
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
                                            {categories.map((cat) => (
                                                <option key={cat.code} value={cat.code}>{cat.title}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Profile Image</label>
                                        <div
                                            className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors ${dragActive ? 'border-emerald-500 bg-emerald-500/10' : 'border-white/10 hover:border-emerald-500/50 hover:bg-white/5'
                                                }`}
                                            onDragEnter={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDragActive(true);
                                            }}
                                            onDragLeave={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDragActive(false);
                                            }}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                            }}
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setDragActive(false);
                                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                                    handleImageUpload(e.dataTransfer.files[0]);
                                                }
                                            }}
                                        >
                                            <input
                                                type="file"
                                                id="image-upload"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        handleImageUpload(e.target.files[0]);
                                                    }
                                                }}
                                            />
                                            {formData.image ? (
                                                <div className="relative w-full">
                                                    <img
                                                        src={formData.image}
                                                        alt="Preview"
                                                        className="w-24 h-24 mx-auto rounded-full object-cover mb-2"
                                                    />
                                                    <p className="text-xs text-emerald-400">Image uploaded!</p>
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, image: '' })}
                                                        className="absolute top-0 right-0 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                                    >
                                                        <X size={12} className="text-white" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <label htmlFor="image-upload" className="cursor-pointer">
                                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                                    <p className="text-sm text-gray-300 font-medium">
                                                        {isUploading ? 'Uploading...' : 'Click or drop image here'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Supports JPG, PNG, WEBP
                                                    </p>
                                                </label>
                                            )}
                                        </div>
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
                )
            }

            {/* Category Edit Modal */}
            {
                categoryEditMode && editingCategory && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-[#0f1e3a] rounded-2xl p-6 max-w-lg w-full"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Edit Category</h2>
                                <button
                                    onClick={() => {
                                        setCategoryEditMode(false);
                                        setEditingCategory(null);
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Code (Read-only)</label>
                                    <input
                                        type="text"
                                        value={editingCategory.code}
                                        disabled
                                        className="w-full px-4 py-2 bg-white/10 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={editingCategory.title}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Subtitle</label>
                                    <textarea
                                        value={editingCategory.subtitle}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, subtitle: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6 border-t border-white/10 mt-6">
                                <button
                                    onClick={() => {
                                        setCategoryEditMode(false);
                                        setEditingCategory(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUpdateCategory(editingCategory)}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50"
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )
            }

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

            <ConfirmationModal
                isOpen={deleteCategoryModalOpen}
                onClose={() => setDeleteCategoryModalOpen(false)}
                onConfirm={handleDeleteCategory}
                title="Delete Category"
                message={`Are you sure you want to delete the "${categoryToDelete?.title}" section? This action cannot be undone.`}
                confirmText="Delete Section"
                cancelText="Cancel"
                isLoading={isLoading}
            />
        </div >
    );
};

export default LeadershipManagement;
