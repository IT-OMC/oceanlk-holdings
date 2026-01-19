import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Link as LinkIcon, Image as ImageIcon, X, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface MediaItem {
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    category: string;
    publishedDate: string;
    featured: boolean;
    status: string;
}

const MediaManagement = () => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
    const [formData, setFormData] = useState<MediaItem>({
        title: '',
        description: '',
        imageUrl: '',
        videoUrl: '',
        category: 'News',
        publishedDate: new Date().toISOString().split('T')[0],
        featured: false,
        status: 'PUBLISHED'
    });

    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/media');
            if (response.ok) {
                const data = await response.json();
                setMediaItems(data);
            }
        } catch (error) {
            console.error('Failed to fetch media:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const isEdit = !!currentMedia?.id;
        const url = isEdit
            ? `http://localhost:8080/api/admin/media/${currentMedia.id}`
            : 'http://localhost:8080/api/admin/media';
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchMedia();
                closeModal();
                toast.success(isEdit ? 'Media item updated successfully' : 'Media item created successfully');
            } else {
                toast.error('Failed to save media item');
            }
        } catch (error) {
            console.error('Error saving media:', error);
            toast.error('An error occurred while saving.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:8080/api/admin/media/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchMedia();
                toast.success('Media item deleted successfully');
            } else {
                toast.error('Failed to delete media item');
            }
        } catch (error) {
            console.error('Error deleting media:', error);
            toast.error('An error occurred while deleting.');
        }
    };

    const openModal = (media?: MediaItem) => {
        if (media) {
            setCurrentMedia(media);
            setFormData(media);
        } else {
            setCurrentMedia(null);
            setFormData({
                title: '',
                description: '',
                imageUrl: '',
                videoUrl: '',
                category: 'News',
                publishedDate: new Date().toISOString().split('T')[0],
                featured: false,
                status: 'PUBLISHED'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentMedia(null);
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader className="animate-spin text-emerald-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Media & Content</h1>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus size={20} /> Add New Item
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0f1e3a] border border-white/10 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col"
                    >
                        <div className="relative h-48 overflow-hidden bg-black/40">
                            {item.imageUrl ? (
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2">
                                <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white">
                                    {item.category}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                <span className="text-xs text-gray-500">
                                    {new Date(item.publishedDate).toLocaleDateString()}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="p-1.5 bg-white/5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id!)}
                                        className="p-1.5 bg-white/5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0a1628] w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0f1e3a]">
                                <h2 className="text-xl font-bold text-white">
                                    {currentMedia ? 'Edit Media Item' : 'Add New Media'}
                                </h2>
                                <button onClick={closeModal}><X className="text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder="Headline or Title"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        >
                                            <option value="News" className="bg-[#0f1e3a]">News</option>
                                            <option value="Blog" className="bg-[#0f1e3a]">Blog</option>
                                            <option value="Press Release" className="bg-[#0f1e3a]">Press Release</option>
                                            <option value="Gallery" className="bg-[#0f1e3a]">Gallery</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Publish Date</label>
                                        <input
                                            type="date"
                                            value={formData.publishedDate}
                                            onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Image URL</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input
                                            type="url"
                                            value={formData.imageUrl}
                                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-3 py-3 text-white focus:border-emerald-500 outline-none"
                                            placeholder="https://test.com/image.jpg"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder="Short summary or content..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                    >
                                        <option value="PUBLISHED" className="bg-[#0f1e3a]">Published</option>
                                        <option value="DRAFT" className="bg-[#0f1e3a]">Draft</option>
                                        <option value="ARCHIVED" className="bg-[#0f1e3a]">Archived</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors"
                                    >
                                        {currentMedia ? 'Update Item' : 'Create Item'}
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

export default MediaManagement;
