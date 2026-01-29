import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Loader, Upload, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

interface MediaItem {
    id?: string;
    title: string;
    description: string;
    excerpt?: string;
    imageUrl: string;
    videoUrl?: string;
    category: string;
    type?: string;
    publishedDate: string;
    featured: boolean;
    status: string;
    companyId?: string;
    companyName?: string;
    company?: string;
    author?: string;
    readTime?: string;
    duration?: string;
    photoCount?: number;
    pageCount?: number;
}

interface Company {
    id: string;
    title: string;
}

const NewsManagement = () => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [formData, setFormData] = useState<MediaItem>({
        title: '',
        description: '',
        excerpt: '',
        imageUrl: '',
        videoUrl: '',
        category: 'NEWS',
        type: 'ARTICLE',
        publishedDate: new Date().toISOString().split('T')[0],
        featured: false,
        status: 'PUBLISHED',
        companyId: '',
        author: '',
        readTime: '',
        duration: '',
        photoCount: undefined,
        pageCount: undefined
    });

    const fetchCompanies = useCallback(async () => {
        try {
            const response = await fetch('/api/companies');
            if (response.ok) {
                const data = await response.json();
                setCompanies(data);
            }
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        }
    }, []);

    const fetchMedia = useCallback(async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('/api/admin/media', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Filter only NEWS items
                const newsItems = data.filter((item: MediaItem) => item.category === 'NEWS');

                // Enrich with company names
                const enrichedData = await Promise.all(
                    newsItems.map(async (item: MediaItem) => {
                        if (item.companyId) {
                            const companyRes = await fetch(`/api/companies/${item.companyId}`);
                            if (companyRes.ok) {
                                const company = await companyRes.json();
                                item.companyName = company.title;
                            }
                        }
                        return item;
                    })
                );
                setMediaItems(enrichedData);
            }
        } catch (error) {
            console.error('Failed to fetch news:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedia();
        fetchCompanies();
    }, [fetchMedia, fetchCompanies]);

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
            xhr.open('POST', '/api/admin/media/upload');
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
                    try {
                        const error = JSON.parse(xhr.responseText);
                        reject(new Error(error.error || 'File upload failed'));
                    } catch (e) {
                        reject(new Error('File upload failed'));
                    }
                }
            };

            xhr.onerror = () => reject(new Error('File upload failed'));
            xhr.send(formData);
        });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const isEdit = !!currentMedia?.id;

        try {
            setUploadingFile(true);
            setUploadProgress(0);
            const updatedFormData = { ...formData, category: 'NEWS' };

            // Upload file if selected
            if (imageFile) {
                const fileUrl = await uploadFile(imageFile);
                updatedFormData.imageUrl = fileUrl;
            }

            const url = isEdit
                ? `/api/admin/media/${currentMedia.id}`
                : '/api/admin/media';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedFormData)
            });

            if (response.ok) {
                fetchMedia();
                closeModal();
                toast.success(isEdit ? 'News article updated successfully' : 'News article created successfully');
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.error || 'Failed to save news article');
            }
        } catch (error: any) {
            console.error('Error saving news:', error);
            toast.error(error.message || 'An error occurred while saving.');
        } finally {
            setUploadingFile(false);
        }
    };

    const openDeleteModal = (id: string) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!itemToDelete) return;

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`/api/admin/media/${itemToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchMedia();
                toast.success('News article deleted successfully');
                setDeleteModalOpen(false);
                setItemToDelete(null);
            } else {
                toast.error('Failed to delete news article');
            }
        } catch (error) {
            console.error('Error deleting news:', error);
            toast.error('An error occurred while deleting.');
        }
    };

    const openModal = (media?: MediaItem) => {
        if (media) {
            setCurrentMedia(media);
            setFormData(media);
            setImagePreview(media.imageUrl || '');
        } else {
            setCurrentMedia(null);
            setFormData({
                title: '',
                description: '',
                excerpt: '',
                imageUrl: '',
                videoUrl: '',
                category: 'NEWS',
                type: 'ARTICLE',
                publishedDate: new Date().toISOString().split('T')[0],
                featured: false,
                status: 'PUBLISHED',
                companyId: '',
                author: '',
                readTime: '',
                duration: '',
                photoCount: undefined,
                pageCount: undefined
            });
            setImagePreview('');
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentMedia(null);
        setImageFile(null);
        setImagePreview('');
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader className="animate-spin text-emerald-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus size={20} /> Add News Article
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
                                    NEWS
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{item.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{item.description}</p>
                            {item.companyName && (
                                <p className="text-emerald-400 text-xs mb-2 flex items-center gap-1">
                                    <Briefcase size={12} /> {item.companyName}
                                </p>
                            )}

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
                                        onClick={() => openDeleteModal(item.id!)}
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
                                    {currentMedia ? 'Edit News Article' : 'Add News Article'}
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
                                        placeholder="News headline"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Company (Optional)</label>
                                        <select
                                            value={formData.companyId || ''}
                                            onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        >
                                            <option value="" className="bg-[#0f1e3a]">None</option>
                                            {companies.map((company) => (
                                                <option key={company.id} value={company.id} className="bg-[#0f1e3a]">
                                                    {company.title}
                                                </option>
                                            ))}
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
                                    <label className="text-sm font-medium text-gray-400">Image</label>
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
                                                <p className="text-gray-400 mb-2">Drag and drop an image here, or click to browse</p>
                                                <p className="text-xs text-gray-600">Supports: JPG, PNG, GIF, WebP</p>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileSelect}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder="Full article content..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Excerpt (Short Summary)</label>
                                    <textarea
                                        value={formData.excerpt || ''}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        rows={2}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder="Brief summary for preview..."
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
                                        disabled={uploadingFile}
                                        className="px-6 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {uploadingFile ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                <span>{uploadProgress}% Uploading...</span>
                                            </div>
                                        ) : (
                                            currentMedia ? 'Update Article' : 'Create Article'
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
                onConfirm={confirmDelete}
                title="Delete News Article"
                message="Are you sure you want to delete this news article? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default NewsManagement;
