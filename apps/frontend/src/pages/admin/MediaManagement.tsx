import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Image as ImageIcon, X, Loader, Upload, Briefcase, FileText, Film, FolderOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';
import { API_ENDPOINTS } from '../../utils/api';

interface MediaItem {
    id?: string;
    title: string;
    description: string;
    excerpt?: string;        // Short summary for News/Blog
    imageUrl: string;
    videoUrl?: string;
    category: string;
    group: string;
    type?: string;           // ARTICLE, VIDEO, GALLERY, DOCUMENT
    publishedDate: string;
    featured: boolean;
    status: string;
    companyId?: string;
    companyName?: string;    // For display purposes
    company?: string;
    // Blog-specific
    author?: string;
    readTime?: string;
    // Media-specific
    duration?: string;       // For videos
    photoCount?: number;     // For galleries
    pageCount?: number;      // For documents
    seoMetadata?: {
        metaTitle: string;
        metaDescription: string;
        keywords: string;
    };
}

interface Company {
    id: string;
    title: string;
}

const MediaManagement = () => {
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
    const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
    const [coverImagePreview, setCoverImagePreview] = useState<string>('');
    const [activeTab, setActiveTab] = useState<string>('all');
    const [formData, setFormData] = useState<MediaItem>({
        title: '',
        description: '',
        excerpt: '',
        imageUrl: '',
        videoUrl: '',
        category: 'MEDIA',
        group: 'MEDIA_PANEL',
        type: 'VIDEO',
        publishedDate: new Date().toISOString().split('T')[0],
        featured: false,
        status: 'PUBLISHED',
        companyId: '',
        author: '',
        readTime: '',
        duration: '',
        photoCount: undefined,
        pageCount: undefined,
        seoMetadata: {
            metaTitle: '',
            metaDescription: '',
            keywords: ''
        }
    });

    const fetchCompanies = useCallback(async () => {
        try {
            const response = await fetch(API_ENDPOINTS.COMPANIES);
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
            const token = sessionStorage.getItem('adminToken');
            const response = await fetch(`${API_ENDPOINTS.ADMIN_MEDIA}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                // Enrich with company names
                const enrichedData = await Promise.all(
                    data.map(async (item: MediaItem) => {
                        if (item.companyId) {
                            const companyRes = await fetch(API_ENDPOINTS.COMPANY_BY_ID(item.companyId));
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
            console.error('Failed to fetch media:', error);
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
            // For documents, use a placeholder or icon instead of preview
            if (file.type.startsWith('application/')) {
                setImagePreview(''); // No preview for documents
            } else {
                setImagePreview(URL.createObjectURL(file));
            }
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        const isValidType = file && (
            file.type.startsWith('image/') ||
            file.type.startsWith('video/') ||
            file.type === 'application/pdf' ||
            file.type === 'application/msword' ||
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        );

        if (isValidType) {
            setImageFile(file);
            // For documents, don't create preview
            if (file.type.startsWith('application/')) {
                setImagePreview('');
            } else {
                setImagePreview(URL.createObjectURL(file));
            }
        } else {
            toast.error('Please drop a valid image, video, or document file');
        }
    };

    const uploadFile = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const token = sessionStorage.getItem('adminToken');
            const formData = new FormData();
            formData.append('file', file);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${API_ENDPOINTS.ADMIN_MEDIA_UPLOAD}?group=MEDIA_PANEL`);
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
        const token = sessionStorage.getItem('adminToken');
        const isEdit = !!currentMedia?.id;

        try {
            setUploadingFile(true);
            setUploadProgress(0);
            const updatedFormData = { ...formData };

            // Upload file if selected
            if (imageFile) {
                const fileUrl = await uploadFile(imageFile);
                updatedFormData.imageUrl = fileUrl;
            }

            // Upload cover image for documents (store in videoUrl field)
            if (coverImageFile && (formData.type === 'DOCUMENT' || currentMedia?.type === 'DOCUMENT')) {
                const coverUrl = await uploadFile(coverImageFile);
                updatedFormData.videoUrl = coverUrl;
            }

            const url = isEdit
                ? API_ENDPOINTS.ADMIN_MEDIA_BY_ID(currentMedia.id!)
                : API_ENDPOINTS.ADMIN_MEDIA;
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
                toast.success(isEdit ? 'Media item updated successfully' : 'Media item created successfully');
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.error || 'Failed to save media item');
            }
        } catch (error: any) {
            console.error('Error saving media:', error);
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

        const token = sessionStorage.getItem('adminToken');
        try {
            const response = await fetch(API_ENDPOINTS.ADMIN_MEDIA_BY_ID(itemToDelete), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchMedia();
                toast.success('Media item deleted successfully');
                setDeleteModalOpen(false);
                setItemToDelete(null);
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
            // For videos, mediaUrl is stored in imageUrl field
            // For documents, cover image is stored in videoUrl field
            setImagePreview(media.imageUrl || '');
            if (media.type === 'DOCUMENT' && media.videoUrl) {
                setCoverImagePreview(media.videoUrl);
            }
        } else {
            setCurrentMedia(null);
            setFormData({
                title: '',
                description: '',
                excerpt: '',
                imageUrl: '',
                videoUrl: '',
                category: 'MEDIA',
                group: 'MEDIA_PANEL',
                type: 'VIDEO',
                publishedDate: new Date().toISOString().split('T')[0],
                featured: false,
                status: 'PUBLISHED',
                companyId: '',
                author: '',
                readTime: '',
                duration: '',
                photoCount: undefined,
                pageCount: undefined,
                seoMetadata: {
                    metaTitle: '',
                    metaDescription: '',
                    keywords: ''
                }
            });
            setImagePreview('');
            setCoverImagePreview('');
        }
        setImageFile(null);
        setCoverImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentMedia(null);
        setImageFile(null);
        setImagePreview('');
        setCoverImageFile(null);
        setCoverImagePreview('');
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader className="animate-spin text-emerald-500" /></div>;
    }

    // Filter media items based on active tab
    const filteredMedia = mediaItems.filter(item => {
        if (activeTab === 'all') return true;
        if (activeTab === 'images') return item.type === 'IMAGE';
        if (activeTab === 'videos') return item.type === 'VIDEO';
        if (activeTab === 'albums') return item.type === 'GALLERY';
        if (activeTab === 'documents') return item.type === 'DOCUMENT';
        return true;
    });

    const tabs = [
        { id: 'all', label: 'All', icon: ImageIcon },
        { id: 'images', label: 'Images', icon: ImageIcon },
        { id: 'videos', label: 'Videos', icon: Film },
        { id: 'albums', label: 'Albums', icon: FolderOpen },
        { id: 'documents', label: 'Documents', icon: FileText },
    ];

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

            {/* Tab Navigation */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all whitespace-nowrap ${isActive
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedia.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0f1e3a] border border-white/10 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col"
                    >
                        <div className="relative h-48 overflow-hidden bg-black/40">
                            {item.type === 'DOCUMENT' ? (
                                item.videoUrl ? (
                                    <img
                                        src={item.videoUrl}
                                        alt={item.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-emerald-400 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
                                        <FileText size={48} />
                                        <span className="mt-2 text-xs text-gray-400 uppercase">
                                            {item.imageUrl?.split('.').pop()?.toUpperCase() || 'DOC'}
                                        </span>
                                    </div>
                                )
                            ) : item.imageUrl ? (
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
                                {item.type === 'DOCUMENT' && item.pageCount && (
                                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white">
                                        {item.pageCount} pages
                                    </span>
                                )}
                                <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded text-xs text-white">
                                    {item.category}
                                </span>
                                <span className={`px-2 py-1 backdrop-blur-md rounded text-xs text-white ${item.group === 'HR_PANEL' ? 'bg-blue-600/80' : 'bg-emerald-600/80'}`}>
                                    {item.group === 'HR_PANEL' ? 'HR & Talent' : 'Media Center'}
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
                                    <label className="text-sm font-medium text-gray-400">Media File</label>
                                    <div
                                        onDrop={handleFileDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer relative"
                                    >
                                        {imagePreview ? (
                                            <div className="relative">
                                                {(formData.type === 'VIDEO' || (currentMedia && currentMedia.type === 'VIDEO')) ? (
                                                    <video src={imagePreview} controls className="max-h-48 mx-auto rounded-lg w-full" />
                                                ) : (formData.type === 'DOCUMENT' || (currentMedia && currentMedia.type === 'DOCUMENT')) ? (
                                                    coverImagePreview ? (
                                                        <div className="flex flex-col items-center">
                                                            <img src={coverImagePreview} alt="Cover" className="max-h-32 mx-auto rounded-lg mb-3" />
                                                            <div className="flex flex-col items-center justify-center py-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-lg w-full">
                                                                <FileText size={48} className="text-emerald-400 mb-2" />
                                                                <p className="text-white font-medium mb-1">Document Uploaded</p>
                                                                <p className="text-xs text-gray-400 uppercase mb-2">
                                                                    {imagePreview?.split('.').pop()?.toUpperCase() || 'DOC'}
                                                                </p>
                                                                <a
                                                                    href={imagePreview}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                                                                >
                                                                    Open Document
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-lg">
                                                            <FileText size={64} className="text-emerald-400 mb-3" />
                                                            <p className="text-white font-medium mb-1">Document Uploaded</p>
                                                            <p className="text-xs text-gray-400 uppercase mb-3">
                                                                {imagePreview?.split('.').pop()?.toUpperCase() || 'DOC'}
                                                            </p>
                                                            <a
                                                                href={imagePreview}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                                                            >
                                                                Open Document
                                                            </a>
                                                        </div>
                                                    )
                                                ) : (
                                                    <img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                                )}
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
                                        ) : imageFile ? (
                                            <div className="relative">
                                                <div className="flex flex-col items-center justify-center py-8">
                                                    <FileText size={48} className="text-emerald-400 mb-2" />
                                                    <p className="text-white font-medium">{imageFile.name}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                                                    </p>
                                                </div>
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
                                                <p className="text-gray-400 mb-2">Drag and drop a file here, or click to browse</p>
                                                <p className="text-xs text-gray-600">Supports: Images (JPG, PNG, GIF, WebP), Videos (MP4, WebM), and Documents (PDF, DOC, DOCX)</p>
                                                <input
                                                    type="file"
                                                    accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                                    onChange={handleFileSelect}
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Cover Image Upload for Documents */}
                                {(formData.type === 'DOCUMENT' || (currentMedia && currentMedia.type === 'DOCUMENT')) && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">
                                            Cover Image <span className="text-xs text-gray-500">(Optional)</span>
                                        </label>
                                        <div
                                            onDrop={(e) => {
                                                e.preventDefault();
                                                const file = e.dataTransfer.files?.[0];
                                                if (file && file.type.startsWith('image/')) {
                                                    setCoverImageFile(file);
                                                    setCoverImagePreview(URL.createObjectURL(file));
                                                } else {
                                                    toast.error('Please drop a valid image file');
                                                }
                                            }}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="border-2 border-dashed border-white/20 rounded-lg p-4 text-center hover:border-emerald-500/50 transition-colors cursor-pointer relative"
                                        >
                                            {coverImagePreview ? (
                                                <div className="relative">
                                                    <img src={coverImagePreview} alt="Cover Preview" className="max-h-32 mx-auto rounded-lg" />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCoverImageFile(null);
                                                            setCoverImagePreview('');
                                                        }}
                                                        className="absolute top-1 right-1 p-1.5 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                                    >
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <ImageIcon className="mx-auto mb-2 text-gray-500" size={24} />
                                                    <p className="text-gray-400 text-sm mb-1">Add a cover image</p>
                                                    <p className="text-xs text-gray-600">Drag and drop or click to browse</p>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                setCoverImageFile(file);
                                                                setCoverImagePreview(URL.createObjectURL(file));
                                                            }
                                                        }}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">
                                        Category
                                        <span className="text-xs text-gray-500 ml-2">
                                            (Choose MEDIA or GALLERY for Media Center page)
                                        </span>
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                    >
                                        <option value="NEWS" className="bg-[#0f1e3a]">News Article</option>
                                        <option value="BLOG" className="bg-[#0f1e3a]">Blog Post</option>
                                        <option value="MEDIA" className="bg-[#0f1e3a]">Media (Video/Gallery/Doc)</option>
                                        <option value="GALLERY" className="bg-[#0f1e3a]">Home Gallery</option>
                                        <option value="PRESS_RELEASE" className="bg-[#0f1e3a]">Press Release</option>
                                    </select>
                                </div>

                                {/* Conditional: Media Type (for MEDIA category) */}
                                {formData.category === 'MEDIA' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Media Type</label>
                                        <select
                                            value={formData.type || 'VIDEO'}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        >
                                            <option value="VIDEO" className="bg-[#0f1e3a]">Video</option>
                                            <option value="IMAGE" className="bg-[#0f1e3a]">Image</option>
                                            <option value="GALLERY" className="bg-[#0f1e3a]">Photo Gallery</option>
                                            <option value="DOCUMENT" className="bg-[#0f1e3a]">Document</option>
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder="Full content or description..."
                                    />
                                </div>

                                {/* Conditional: Excerpt (for NEWS and BLOG) */}
                                {(formData.category === 'NEWS' || formData.category === 'BLOG') && (
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
                                )}

                                {/* Conditional: Blog-specific fields */}
                                {formData.category === 'BLOG' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Author</label>
                                            <input
                                                type="text"
                                                value={formData.author || ''}
                                                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                                placeholder="Author name"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Read Time</label>
                                            <input
                                                type="text"
                                                value={formData.readTime || ''}
                                                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                                placeholder="e.g., 5 min read"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Conditional: Media-specific fields */}
                                {formData.category === 'MEDIA' && formData.type === 'VIDEO' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Duration</label>
                                        <input
                                            type="text"
                                            value={formData.duration || ''}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                            placeholder="e.g., 12:45"
                                        />
                                    </div>
                                )}

                                {formData.category === 'MEDIA' && formData.type === 'GALLERY' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Photo Count</label>
                                        <input
                                            type="number"
                                            value={formData.photoCount || ''}
                                            onChange={(e) => setFormData({ ...formData, photoCount: parseInt(e.target.value) || undefined })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                            placeholder="Number of photos"
                                        />
                                    </div>
                                )}

                                {formData.category === 'MEDIA' && formData.type === 'DOCUMENT' && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Page Count</label>
                                        <input
                                            type="number"
                                            value={formData.pageCount || ''}
                                            onChange={(e) => setFormData({ ...formData, pageCount: parseInt(e.target.value) || undefined })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                            placeholder="Number of pages"
                                        />
                                    </div>
                                )}

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

                                <div className="border-t border-white/10 pt-4 mt-4">
                                    <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                                        <span className="text-emerald-400">🔍</span> SEO Configuration
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Meta Title</label>
                                            <input
                                                type="text"
                                                value={formData.seoMetadata?.metaTitle || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    seoMetadata: { ...formData.seoMetadata!, metaTitle: e.target.value }
                                                })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                                placeholder="SEO Title (defaults to Title if empty)"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Meta Description</label>
                                            <textarea
                                                rows={2}
                                                value={formData.seoMetadata?.metaDescription || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    seoMetadata: { ...formData.seoMetadata!, metaDescription: e.target.value }
                                                })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                                placeholder="SEO Description (defaults to Description if empty)"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-400">Keywords</label>
                                            <input
                                                type="text"
                                                value={formData.seoMetadata?.keywords || ''}
                                                onChange={(e) => setFormData({
                                                    ...formData,
                                                    seoMetadata: { ...formData.seoMetadata!, keywords: e.target.value }
                                                })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                                placeholder="Comma separated keywords (e.g. shipping, logistics, sri lanka)"
                                            />
                                        </div>
                                    </div>
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
                                            currentMedia ? 'Update Item' : 'Create Item'
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
                title="Delete Media Item"
                message="Are you sure you want to delete this media item? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default MediaManagement;
