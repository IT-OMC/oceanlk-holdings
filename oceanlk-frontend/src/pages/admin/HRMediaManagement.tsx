import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Upload, Trash2, Edit2, Image as ImageIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

interface MediaItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    videoUrl?: string;
    category: string;
    group: string;
    companyId?: string;
    featured: boolean;
}

const HRMediaManagement = () => {
    const [galleryItems, setGalleryItems] = useState<MediaItem[]>([]);
    const [lifeAtOchItems, setLifeAtOchItems] = useState<MediaItem[]>([]);
    const [eventsItems, setEventsItems] = useState<MediaItem[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);


    // Upload states
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        imageUrl: '',
        category: 'GALLERY',
        group: 'HR_PANEL',
    });


    const fetchMediaItems = useCallback(async () => {
        try {
            const response = await fetch('http://localhost:8080/api/admin/media?group=HR_PANEL', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Separate items by category
                setGalleryItems(data.filter((item: MediaItem) => item.category === 'GALLERY'));
                setLifeAtOchItems(data.filter((item: MediaItem) => item.category === 'LIFE_AT_OCH'));
                setEventsItems(data.filter((item: MediaItem) => item.category === 'EVENTS'));
            }
        } catch (error) {
            toast.error('Failed to fetch media items');
        }
    }, []);

    useEffect(() => {
        fetchMediaItems();
    }, [fetchMediaItems]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        } else {
            toast.error('Please drop a valid image or video file');
        }
    };

    const uploadFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const token = localStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://localhost:8080/api/admin/media/upload?group=HR_PANEL');
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = (event.loaded / event.total) * 100;
                    setUploadProgress(Math.round(percentComplete));
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data.url);
                } else {
                    reject(new Error('File upload failed'));
                }
            };

            xhr.onerror = () => reject(new Error('File upload failed'));
            xhr.send(formData);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setUploadingFile(true);
            setUploadProgress(0);
            let updatedFormData = { ...formData };

            // Upload file if selected
            if (imageFile) {
                const fileUrl = await uploadFile(imageFile);
                updatedFormData.imageUrl = fileUrl;
            }

            const token = localStorage.getItem('adminToken');
            const url = editingItem
                ? `http://localhost:8080/api/admin/media/${editingItem.id}`
                : 'http://localhost:8080/api/admin/media';

            const response = await fetch(url, {
                method: editingItem ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...updatedFormData,
                    featured: false,
                }),
            });

            if (response.ok) {
                toast.success(editingItem ? 'Media updated successfully' : 'Media created successfully');
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({ title: '', description: '', imageUrl: '', category: 'GALLERY', group: 'HR_PANEL' });
                setImageFile(null);
                setImagePreview('');
                fetchMediaItems();
            } else {
                toast.error('Failed to save media');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setUploadingFile(false);
        }
    };

    const handleDelete = async () => {
        if (!itemToDelete) return;
        setIsLoading(true);

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(`http://localhost:8080/api/admin/media/${itemToDelete}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                toast.success('Media deleted successfully');
                setDeleteModalOpen(false);
                setItemToDelete(null);
                fetchMediaItems();
            } else {
                toast.error('Failed to delete media');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const openEditModal = (item: MediaItem) => {
        setEditingItem(item);
        setFormData({
            title: item.title,
            description: item.description,
            imageUrl: item.imageUrl,
            category: item.category,
            group: 'HR_PANEL',
        });
        setImagePreview(item.imageUrl || '');
        setImageFile(null);
        setIsModalOpen(true);
    };

    const openDeleteModal = (id: string) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-gray-400">Manage media for the culture page gallery</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ title: '', description: '', imageUrl: '', category: 'GALLERY', group: 'HR_PANEL' });
                        setImagePreview('');
                        setImageFile(null);
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Media
                </button>
            </div>

            {/* Gallery Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Gallery</h2>
                    <span className="text-sm text-gray-400">{galleryItems.length} items</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryItems.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -5 }}
                            className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
                        >
                            <div className="h-48 bg-white/5 relative">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={48} className="text-gray-600" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(item.id)}
                                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {galleryItems.length === 0 && (
                    <div className="text-center py-12 text-gray-400 bg-white/5 rounded-xl">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No gallery items found</p>
                    </div>
                )}
            </div>

            {/* Life at OCH Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Life at OCH</h2>
                    <span className="text-sm text-gray-400">{lifeAtOchItems.length} items</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {lifeAtOchItems.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -5 }}
                            className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
                        >
                            <div className="h-48 bg-white/5 relative">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={48} className="text-gray-600" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(item.id)}
                                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {lifeAtOchItems.length === 0 && (
                    <div className="text-center py-12 text-gray-400 bg-white/5 rounded-xl">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No Life at OCH items found</p>
                    </div>
                )}
            </div>

            {/* Events Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Events</h2>
                    <span className="text-sm text-gray-400">{eventsItems.length} items</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {eventsItems.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ y: -5 }}
                            className="bg-white/5 rounded-xl overflow-hidden border border-white/10"
                        >
                            <div className="h-48 bg-white/5 relative">
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={48} className="text-gray-600" />
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded">
                                    {item.category}
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openEditModal(item)}
                                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(item.id)}
                                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {eventsItems.length === 0 && (
                    <div className="text-center py-12 text-gray-400 bg-white/5 rounded-xl">
                        <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No events items found</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0f1e3a] rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingItem ? 'Edit Media' : 'Add New Media'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)}><X className="text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Image/Video</label>
                                    <div
                                        onDrop={handleFileDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer relative"
                                    >
                                        {imagePreview ? (
                                            <div className="relative">
                                                <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImageFile(null);
                                                        setImagePreview('');
                                                    }}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto mb-2 text-gray-500" size={32} />
                                                <p className="text-gray-400 mb-2">Drag and drop file here</p>
                                                <p className="text-xs text-gray-600 mb-2">Supports: Images (JPG, PNG, WebP) and Videos (MP4)</p>
                                                <input
                                                    type="file"
                                                    accept="image/*,video/*"
                                                    onChange={handleFileSelect}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="hidden">
                                    {/* Hidden manual URL input in case needed for debugging, but hidden for UX */}
                                    <input
                                        type="url"
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                        className="hidden"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                    >
                                        <option value="GALLERY" className="bg-[#0f1e3a] text-white">Gallery</option>
                                        <option value="LIFE_AT_OCH" className="bg-[#0f1e3a] text-white">Life at OCH</option>
                                        <option value="EVENTS" className="bg-[#0f1e3a] text-white">Events</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            setEditingItem(null);
                                            setImageFile(null);
                                            setImagePreview('');
                                        }}
                                        className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploadingFile}
                                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors disabled:opacity-50 flex justify-center items-center"
                                    >
                                        {uploadingFile ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>{uploadProgress}% Uploading...</span>
                                            </div>
                                        ) : (
                                            editingItem ? 'Update' : 'Create'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Delete Media"
                message="Are you sure you want to delete this media item? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                isLoading={isLoading}
            />
        </div>
    );
};

export default HRMediaManagement;
