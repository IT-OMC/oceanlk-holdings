import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Loader, Upload, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmationModal from '../../components/ConfirmationModal';

interface Company {
    id?: string;
    title: string;
    description: string;
    logoUrl?: string;
    website?: string;
    industry?: string;
    established?: string;
}

const CompanyManagement = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);
    const [currentCompany, setCurrentCompany] = useState<Company | null>(null);
    const [uploadingFile, setUploadingFile] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string>('');
    const [formData, setFormData] = useState<Company>({
        title: '',
        description: '',
        logoUrl: '',
        website: '',
        industry: '',
        established: ''
    });

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await fetch('/api/companies');
            if (response.ok) {
                const data = await response.json();
                setCompanies(data);
            }
        } catch (error) {
            console.error('Failed to fetch companies:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        } else {
            toast.error('Please drop a valid image file');
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
        const isEdit = !!currentCompany?.id;

        try {
            setUploadingFile(true);
            setUploadProgress(0);
            let updatedFormData = { ...formData };

            // Upload logo if selected
            if (logoFile) {
                const fileUrl = await uploadFile(logoFile);
                updatedFormData.logoUrl = fileUrl;
            }

            const url = isEdit
                ? `/api/admin/companies/${currentCompany.id}`
                : '/api/admin/companies';
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
                fetchCompanies();
                closeModal();
                toast.success(isEdit ? 'Company updated successfully' : 'Company created successfully');
            } else {
                const errorData = await response.json().catch(() => ({}));
                toast.error(errorData.error || 'Failed to save company');
            }
        } catch (error: any) {
            console.error('Error saving company:', error);
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
            const response = await fetch(`/api/admin/companies/${itemToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchCompanies();
                toast.success('Company deleted successfully');
                setDeleteModalOpen(false);
                setItemToDelete(null);
            } else {
                toast.error('Failed to delete company');
            }
        } catch (error) {
            console.error('Error deleting company:', error);
            toast.error('An error occurred while deleting.');
        }
    };

    const openModal = (company?: Company) => {
        if (company) {
            setCurrentCompany(company);
            setFormData(company);
            setLogoPreview(company.logoUrl || '');
        } else {
            setCurrentCompany(null);
            setFormData({
                title: '',
                description: '',
                logoUrl: '',
                website: '',
                industry: '',
                established: ''
            });
            setLogoPreview('');
        }
        setLogoFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentCompany(null);
        setLogoFile(null);
        setLogoPreview('');
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
                    <Plus size={20} /> Add Company
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                    <motion.div
                        key={company.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-[#0f1e3a] border border-white/10 rounded-2xl overflow-hidden group hover:border-emerald-500/30 transition-all flex flex-col"
                    >
                        <div className="relative h-48 overflow-hidden bg-black/40 flex items-center justify-center">
                            {company.logoUrl ? (
                                <img
                                    src={company.logoUrl}
                                    alt={company.title}
                                    className="max-w-full max-h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-600">
                                    <Building2 size={48} />
                                </div>
                            )}
                        </div>

                        <div className="p-5 flex-1 flex flex-col">
                            <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{company.title}</h3>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{company.description}</p>

                            {company.industry && (
                                <p className="text-emerald-400 text-xs mb-2">
                                    {company.industry}
                                </p>
                            )}

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                <span className="text-xs text-gray-500">
                                    {company.established || 'N/A'}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(company)}
                                        className="p-1.5 bg-white/5 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(company.id!)}
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
                                    {currentCompany ? 'Edit Company' : 'Add New Company'}
                                </h2>
                                <button onClick={closeModal}><X className="text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Company Name</label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder="Company Name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Logo</label>
                                    <div
                                        onDrop={handleFileDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-emerald-500/50 transition-colors cursor-pointer relative"
                                    >
                                        {logoPreview ? (
                                            <div className="relative">
                                                <img src={logoPreview} alt="Preview" className="max-h-48 mx-auto rounded-lg" />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setLogoFile(null);
                                                        setLogoPreview('');
                                                    }}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <Upload className="mx-auto mb-2 text-gray-500" size={32} />
                                                <p className="text-gray-400 mb-2">Drag and drop a logo, or click to browse</p>
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
                                        placeholder="Company description..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Industry</label>
                                        <input
                                            type="text"
                                            value={formData.industry || ''}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                            placeholder="e.g., Technology"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Established</label>
                                        <input
                                            type="text"
                                            value={formData.established || ''}
                                            onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                            placeholder="e.g., 2020"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Website</label>
                                    <input
                                        type="url"
                                        value={formData.website || ''}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder="https://example.com"
                                    />
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
                                            currentCompany ? 'Update Company' : 'Create Company'
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
                title="Delete Company"
                message="Are you sure you want to delete this company? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
            />
        </div>
    );
};

export default CompanyManagement;
