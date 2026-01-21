import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface JobOpportunity {
    id?: string;
    title: string;
    company: string;
    location: string;
    type: string;
    category: string;
    description: string;
    featured: boolean;
    level: string;
    status: string;
}

const JobManagement = () => {
    const [jobs, setJobs] = useState<JobOpportunity[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [jobToDelete, setJobToDelete] = useState<string | null>(null);
    const [currentJob, setCurrentJob] = useState<JobOpportunity | null>(null);
    const [formData, setFormData] = useState<JobOpportunity>({
        title: '',
        company: 'Ocean Ceylon Holdings', // Default
        location: 'Colombo, Sri Lanka',
        type: 'Full-time',
        category: 'Engineering',
        description: '',
        featured: false,
        level: 'Mid-Senior',
        status: 'ACTIVE'
    });

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch('http://localhost:8080/api/admin/jobs', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setJobs(data);
            } else {
                console.error('Failed to fetch jobs:', response.status);
                toast.error('Failed to load jobs');
            }
        } catch (error) {
            console.error('Failed to fetch jobs', error);
            toast.error('An error occurred while loading jobs');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('adminToken');
        const isEdit = !!currentJob?.id;
        const url = isEdit
            ? `http://localhost:8080/api/admin/jobs/${currentJob.id}`
            : 'http://localhost:8080/api/admin/jobs';
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
                fetchJobs();
                closeModal();
                toast.success(isEdit ? 'Job updated successfully' : 'Job posted successfully');
            } else {
                toast.error('Failed to save job');
            }
        } catch (error) {
            console.error('Error saving job:', error);
            toast.error('An error occurred while saving the job');
        }
    };

    const openDeleteModal = (id: string) => {
        setJobToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setJobToDelete(null);
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;

        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`http://localhost:8080/api/admin/jobs/${jobToDelete}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                fetchJobs();
                toast.success('Job deleted successfully');
                closeDeleteModal();
            } else {
                toast.error('Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('An error occurred while deleting the job');
        }
    };

    const openModal = (job?: JobOpportunity) => {
        if (job) {
            setCurrentJob(job);
            setFormData(job);
        } else {
            setCurrentJob(null);
            setFormData({
                title: '',
                company: 'Ocean Ceylon Holdings',
                location: 'Colombo, Sri Lanka',
                type: 'Full-time',
                category: 'Engineering',
                description: '',
                featured: false,
                level: 'Mid-Senior',
                status: 'ACTIVE'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentJob(null);
    };

    if (isLoading) {
        return <div className="flex justify-center p-10"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Job Postings</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage open positions and job descriptions</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg flex items-center gap-2 font-medium transition-colors"
                >
                    <Plus size={20} /> Add New Job
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#0f1e3a] border border-white/10 rounded-2xl p-6 relative group hover:border-emerald-500/30 transition-all"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">{job.title}</h3>
                                <p className="text-sm text-gray-400">{job.company} • {job.location}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openModal(job)}
                                    className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => openDeleteModal(job.id!)}
                                    className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">{job.type}</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">{job.level}</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">{job.category}</span>
                            {job.featured && (
                                <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-medium">Featured</span>
                            )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${job.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                                }`}>
                                {job.status}
                            </span>
                            <span className="text-xs text-gray-500">
                                Posted: {new Date().toLocaleDateString()} {/* Assuming postedDate exists in real data */}
                            </span>
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
                                    {currentJob ? 'Edit Job' : 'Post New Job'}
                                </h2>
                                <button onClick={closeModal}><X className="text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Job Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                            placeholder="e.g. Senior Product Designer"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Company</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Location</label>
                                        <input
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                            placeholder="e.g. Colombo, Sri Lanka"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        >
                                            <option value="Engineering" className="bg-[#0f1e3a]">Engineering</option>
                                            <option value="Design" className="bg-[#0f1e3a]">Design</option>
                                            <option value="Marketing" className="bg-[#0f1e3a]">Marketing</option>
                                            <option value="Sales" className="bg-[#0f1e3a]">Sales</option>
                                            <option value="Operations" className="bg-[#0f1e3a]">Operations</option>
                                            <option value="Finance" className="bg-[#0f1e3a]">Finance</option>
                                            <option value="HR" className="bg-[#0f1e3a]">HR</option>
                                            <option value="Other" className="bg-[#0f1e3a]">Other</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Level</label>
                                        <select
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        >
                                            <option value="Entry Level" className="bg-[#0f1e3a]">Entry Level</option>
                                            <option value="Mid Level" className="bg-[#0f1e3a]">Mid Level</option>
                                            <option value="Mid-Senior" className="bg-[#0f1e3a]">Mid-Senior</option>
                                            <option value="Senior" className="bg-[#0f1e3a]">Senior</option>
                                            <option value="Director" className="bg-[#0f1e3a]">Director</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        >
                                            <option value="Full-time" className="bg-[#0f1e3a]">Full-time</option>
                                            <option value="Part-time" className="bg-[#0f1e3a]">Part-time</option>
                                            <option value="Contract" className="bg-[#0f1e3a]">Contract</option>
                                            <option value="Remote" className="bg-[#0f1e3a]">Remote</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={5}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-emerald-500 outline-none"
                                        placeholder="Job description, requirements, etc."
                                    />
                                </div>

                                <div className="flex items-center gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.featured ? 'bg-emerald-500 border-emerald-500' : 'border-gray-500 group-hover:border-emerald-400'}`}>
                                            {formData.featured && <Check size={14} className="text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="hidden"
                                        />
                                        <span className="text-gray-300 group-hover:text-white">Featured Job</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div className="text-sm text-gray-400">Status:</div>
                                        <select
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            className="bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-sm focus:border-emerald-500 outline-none"
                                        >
                                            <option value="ACTIVE" className="bg-[#0f1e3a]">Active</option>
                                            <option value="CLOSED" className="bg-[#0f1e3a]">Closed</option>
                                            <option value="DRAFT" className="bg-[#0f1e3a]">Draft</option>
                                        </select>
                                    </label>
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
                                        {currentJob ? 'Update Job' : 'Post Job'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0a1628] w-full max-w-md rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 bg-[#0f1e3a]">
                                <h2 className="text-xl font-bold text-white">Delete Job</h2>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                                        <Trash2 className="text-red-400" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-gray-200 font-medium mb-1">Are you sure you want to delete this job?</p>
                                        <p className="text-gray-400 text-sm">This action cannot be undone.</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={closeDeleteModal}
                                        className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                                    >
                                        Delete Job
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default JobManagement;
