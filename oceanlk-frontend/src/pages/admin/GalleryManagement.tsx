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
    galleryImages?: string[];
}

interface Company {
    id: string;
    title: string;
}

const GalleryManagement = () => {
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
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>([]);
    const [expandedAlbum, setExpandedAlbum] = useState<MediaItem | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isAlbumMode, setIsAlbumMode] = useState(false);
    const [activeTab, setActiveTab] = useState<'images' | 'videos' | 'albums'>('images');
    const [formData, setFormData] = useState<MediaItem>({
        title: '',
        description: '',
        excerpt: '',
        imageUrl: '',
        videoUrl: '',
        category: 'GALLERY',
        type: 'GALLERY',
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
                // Filter items based on category/type
                // We'll filter in the render or effect, but let's store all and filter later
                const galleryItems = data.filter((item: MediaItem) => item.category === 'GALLERY' || item.type === 'ALBUM' || item.type === 'VIDEO');

                // Enrich with company names
                const enrichedData = await Promise.all(
                    galleryItems.map(async (item: MediaItem) => {
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
            console.error('Failed to fetch gallery items:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMedia();
        fetchCompanies();
    }, [fetchMedia, fetchCompanies]);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (isAlbumMode) {
            // Multiple files for album mode
            const filesArray = Array.from(files);
            setImageFiles(prev => [...prev, ...filesArray]);
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        } else {
            // Single file for normal mode
            const file = files[0];
            if (file.size > 50 * 1024 * 1024) {
                toast.error('File size exceeds 50MB limit');
                return;
            }
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (!files || files.length === 0) return;

        if (isAlbumMode) {
            // Multiple files for album mode
            const filesArray = Array.from(files).filter(file => file.type.startsWith('image/'));
            if (filesArray.length === 0) {
                toast.error('Please drop valid image files');
                return;
            }
            setImageFiles(prev => [...prev, ...filesArray]);
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        } else {
            // Single file for normal mode
            const file = files[0];
            const isVideo = activeTab === 'videos';

            if (isVideo) {
                if (file && (file.type.startsWith('video/'))) {
                    if (file.size > 50 * 1024 * 1024) {
                        toast.error('File size exceeds 50MB limit');
                        return;
                    }
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                } else {
                    toast.error('Please drop a valid video file');
                }
            } else {
                if (file && file.type.startsWith('image/')) {
                    setImageFile(file);
                    setImagePreview(URL.createObjectURL(file));
                } else {
                    toast.error('Please drop a valid image file');
                }
            }
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

            if (isAlbumMode) {
                // Batch upload for album mode
                const totalFiles = imageFiles.length;
                const uploadedUrls: string[] = [];
                let uploadedCount = 0;

                // 1. Upload new files
                if (totalFiles > 0) {
                    for (const file of imageFiles) {
                        try {
                            const fileUrl = await uploadFile(file);
                            uploadedUrls.push(fileUrl);
                            uploadedCount++;
                            setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
                        } catch (error) {
                            console.error(`Error uploading ${file.name}:`, error);
                            toast.error(`Failed to upload ${file.name}`);
                        }
                    }
                }

                // 2. Combine with existing images
                const finalGalleryImages = [...existingGalleryImages, ...uploadedUrls];

                if (finalGalleryImages.length > 0) {
                    const mediaData = {
                        title: formData.title || `Album ${new Date().toLocaleDateString()}`,
                        description: formData.description || '',
                        excerpt: formData.excerpt || '',
                        imageUrl: finalGalleryImages[0], // Use first image as cover
                        galleryImages: finalGalleryImages,
                        videoUrl: formData.videoUrl || '',
                        category: 'GALLERY',
                        type: 'ALBUM',
                        companyId: formData.companyId || '',
                        featured: formData.featured || false,
                        publishedDate: formData.publishedDate ? new Date(formData.publishedDate).toISOString() : new Date().toISOString(),
                        status: formData.status || 'PUBLISHED'
                    };

                    const url = isEdit
                        ? `/api/admin/media/${currentMedia!.id}`
                        : '/api/admin/media';
                    const method = isEdit ? 'PUT' : 'POST';

                    const response = await fetch(url, {
                        method,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(mediaData)
                    });

                    if (!response.ok) {
                        throw new Error('Failed to save album');
                    }

                    fetchMedia();
                    closeModal();
                    toast.success(isEdit ? 'Album updated successfully' : 'Album created successfully');
                } else {
                    toast.error('Album must have at least one image');
                }
            } else {
                // Single file upload (existing logic)
                const updatedFormData = {
                    ...formData,
                    category: 'GALLERY',
                    publishedDate: formData.publishedDate ? new Date(formData.publishedDate).toISOString() : new Date().toISOString()
                };

                // Upload file if selected
                if (imageFile) {
                    const fileUrl = await uploadFile(imageFile);
                    if (updatedFormData.type === 'VIDEO') {
                        updatedFormData.videoUrl = fileUrl;
                        updatedFormData.imageUrl = ''; // Clear image url if it was there? or keep as thumbnail? 
                        // Ideally we might want a thumbnail for video, but for now let's just use empty or maybe the same URL if backend handles it? 
                        // No, backend model has separate fields. 
                        // Let's assume for now we don't auto-generate thumbnail, so imageUrl might be empty.
                    } else {
                        updatedFormData.imageUrl = fileUrl;
                    }
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
                    const responseData = await response.json();

                    if (responseData.pendingChange) {
                        toast.success('Media item submitted for approval');
                    } else {
                        toast.success(isEdit ? 'Item updated successfully' : 'Item created successfully');
                    }

                    fetchMedia();
                    closeModal();
                } else {
                    const errorData = await response.json().catch(() => ({}));
                    toast.error(errorData.error || 'Failed to save item');
                }
            }
        } catch (error: any) {
            console.error('Error saving gallery item:', error);
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
                const data = await response.json().catch(() => ({}));

                if (data.pendingChange) {
                    toast.success('Deletion submitted for approval');
                } else {
                    toast.success('Gallery item deleted successfully');
                }

                fetchMedia();
                setDeleteModalOpen(false);
                setItemToDelete(null);
            } else {
                toast.error('Failed to delete gallery item');
            }
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            toast.error('An error occurred while deleting.');
        }
    };

    const openModal = (media?: MediaItem, albumMode: boolean = false, type?: string) => {
        setIsAlbumMode(albumMode);
        if (media) {
            setCurrentMedia(media);
            setFormData(media);
            // If it's a video, use videoUrl as preview if available, else imageUrl
            if (media.type === 'VIDEO') {
                setImagePreview(media.videoUrl || media.imageUrl || '');
            } else {
                setImagePreview(media.imageUrl || '');
            }

            if (media.type === 'ALBUM' && media.galleryImages) {
                setIsAlbumMode(true);
                setExistingGalleryImages(media.galleryImages);
                setImagePreviews(media.galleryImages);
                setImageFiles([]);
                setImageFile(null);
            } else {
                // Not an album, or album without images (weird, but handle it)
                setImageFiles([]);
                setImagePreviews([]);
                setImageFile(null);
            }
        } else {
            setCurrentMedia(null);
            setFormData({
                title: '',
                description: '',
                excerpt: '',
                imageUrl: '',
                videoUrl: '',
                category: 'GALLERY',
                type: type || (albumMode ? 'ALBUM' : 'GALLERY'), // Default based on mode or explicit type
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
            setImageFile(null);
            setImageFiles([]);
            setImagePreviews([]);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentMedia(null);
        setImageFile(null);
        setImageFiles([]);
        setImagePreviews([]);
        setImagePreview('');
        setIsAlbumMode(false);
        setExistingGalleryImages([]);
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><Loader className="animate-spin text-emerald-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gallery</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage homepage gallery images</p>
                </div>
                <div className="flex gap-3">
                    {activeTab === 'albums' && (
                        <button
                            onClick={() => {
                                setIsAlbumMode(true);
                                openModal(undefined, true);
                            }}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                        >
                            <Plus size={20} /> Add Album
                        </button>
                    )}
                    {activeTab === 'images' && (
                        <button
                            onClick={() => {
                                setIsAlbumMode(false);
                                openModal(undefined, false, 'GALLERY');
                            }}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                        >
                            <Plus size={20} /> Add Image
                        </button>
                    )}
                    {activeTab === 'videos' && (
                        <button
                            onClick={() => {
                                setIsAlbumMode(false);
                                openModal(undefined, false, 'VIDEO');
                            }}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                        >
                            <Plus size={20} /> Add Video
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button
                    onClick={() => setActiveTab('images')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'images' ? 'text-emerald-500' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Images
                    {activeTab === 'images' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('videos')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'videos' ? 'text-emerald-500' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Videos
                    {activeTab === 'videos' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('albums')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'albums' ? 'text-emerald-500' : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Albums
                    {activeTab === 'albums' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500" />
                    )}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mediaItems
                    .filter(item => {
                        if (activeTab === 'albums') return item.type === 'ALBUM';
                        if (activeTab === 'videos') return item.type === 'VIDEO' || !!item.videoUrl;
                        return item.type !== 'ALBUM' && item.type !== 'VIDEO' && !item.videoUrl;
                    })
                    .map((item) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[#0f1e3a] border border-white/10 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col cursor-pointer"
                            onClick={() => {
                                if (item.type === 'ALBUM') {
                                    setExpandedAlbum(item);
                                }
                            }}
                        >
                            <div className="relative h-48 overflow-hidden bg-black/40">
                                {item.type === 'ALBUM' && item.galleryImages && item.galleryImages.length > 0 ? (
                                    <div className="grid grid-cols-2 h-full gap-0.5">
                                        {item.galleryImages.slice(0, 4).map((img, idx) => (
                                            <div key={idx} className="relative w-full h-full overflow-hidden">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                {idx === 3 && item.galleryImages && item.galleryImages.length > 4 && (
                                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-lg">
                                                        +{item.galleryImages.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : item.type === 'VIDEO' && item.videoUrl ? (
                                    <video
                                        src={item.videoUrl}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
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
                                    <span className={`px-2 py-1 backdrop-blur-md rounded text-xs text-white ${item.type === 'ALBUM' ? 'bg-blue-500/80' : 'bg-black/60'}`}>
                                        {item.type === 'ALBUM' ? 'ALBUM' : 'GALLERY'}
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
                                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openModal(item);
                                            }}
                                            className="p-1.5 bg-white/5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openDeleteModal(item.id!);
                                            }}
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
                                    {currentMedia ? `Edit ${isAlbumMode ? 'Album' : activeTab === 'videos' ? 'Video' : 'Image'}` : isAlbumMode ? 'Create Album' : activeTab === 'videos' ? 'Add Video' : 'Add Image'}
                                </h2>
                                <button onClick={closeModal}><X className="text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">
                                        Title {isAlbumMode && <span className="text-xs text-gray-500">(optional, will use filenames if empty)</span>}
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required={!isAlbumMode}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder={isAlbumMode ? "Album title (optional)" : activeTab === 'videos' ? "Video title" : "Image title"}
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
                                        <label className="text-sm font-medium text-gray-400">Date</label>
                                        <input
                                            type="date"
                                            value={formData.publishedDate}
                                            onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">
                                        {isAlbumMode ? 'Images (Multiple)' : activeTab === 'videos' ? 'Video' : 'Image'}
                                    </label>
                                    <div
                                        onDrop={handleFileDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer relative"
                                    >
                                        {/* Display Existing Images + New Preview Images */}
                                        {(existingGalleryImages.length > 0 || imagePreviews.length > existingGalleryImages.length) && isAlbumMode ? (
                                            <div className="grid grid-cols-3 gap-3">
                                                {/* We just use imagePreviews because it should contain both existing AND new previews */}
                                                {imagePreviews.map((preview, index) => (
                                                    <div key={index} className="relative group">
                                                        <img src={preview} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                // Calculate correct index removal
                                                                if (index < existingGalleryImages.length) {
                                                                    // Removing an existing image
                                                                    setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
                                                                    setImagePreviews(prev => prev.filter((_, i) => i !== index));
                                                                } else {
                                                                    // Removing a new file
                                                                    const newFileIndex = index - existingGalleryImages.length;
                                                                    setImageFiles(prev => prev.filter((_, i) => i !== newFileIndex));
                                                                    setImagePreviews(prev => prev.filter((_, i) => i !== index));
                                                                }
                                                            }}
                                                            className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <X size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* Add Image Tile */}
                                                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-emerald-500/50 hover:bg-white/5 transition-colors">
                                                    <Plus className="text-gray-400" size={24} />
                                                    <span className="text-xs text-gray-400 mt-1">Add Image</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleFileSelect}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        ) : !isAlbumMode && imagePreview ? (
                                            <div className="relative">
                                                {activeTab === 'videos' || (currentMedia && currentMedia.type === 'VIDEO') ? (
                                                    <video src={imagePreview} controls className="max-h-48 mx-auto rounded-lg w-full" />
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
                                        ) : (
                                            <>
                                                <Upload className="mx-auto mb-2 text-gray-500" size={32} />
                                                <p className="text-gray-400 mb-2">
                                                    {isAlbumMode ? 'Drag and drop multiple images here, or click to browse' : activeTab === 'videos' ? 'Drag and drop a video here, or click to browse' : 'Drag and drop an image here, or click to browse'}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    {activeTab === 'videos' ? "Supports: MP4, WebM" : "Supports: JPG, PNG, GIF, WebP"}
                                                </p>
                                                <input
                                                    type="file"
                                                    accept={activeTab === 'videos' ? "video/*" : "image/*"}
                                                    multiple={isAlbumMode}
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
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder={activeTab === 'videos' ? "Video description..." : "Image description..."}
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
                                            currentMedia ? (activeTab === 'videos' ? 'Update Video' : 'Update Image') : isAlbumMode ? 'Upload Album' : activeTab === 'videos' ? 'Add Video' : 'Add Image'
                                        )}
                                    </button>
                                </div>
                            </form >
                        </motion.div >
                    </div >
                )}
            </AnimatePresence >
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                }}
                onConfirm={confirmDelete}
                title="Delete Gallery Image"
                message="Are you sure you want to delete this gallery image? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />

            {/* Album Expansion Modal */}
            <AnimatePresence>
                {expandedAlbum && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setExpandedAlbum(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-[#0a1628] w-full max-w-6xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0f1e3a]">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{expandedAlbum.title}</h2>
                                    <p className="text-gray-400 text-sm">{expandedAlbum.galleryImages?.length || 0} Images</p>
                                </div>
                                <button onClick={() => setExpandedAlbum(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="text-white" size={24} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {expandedAlbum.galleryImages?.map((img, idx) => (
                                    <div key={idx} className="relative group aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                        <img src={img} alt={`Album image ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default GalleryManagement;
