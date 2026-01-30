import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, Calendar, Mail, Phone, Briefcase, Filter, X, Clock, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_ENDPOINTS } from '../../utils/api';

interface Application {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    position: string;
    experience: string;
    message: string;
    cvFilename: string;
    submittedDate: string;
    status: string;
}

const ApplicationViewer = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [filteredApps, setFilteredApps] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [deleteConfirmation, setDeleteConfirmation] = useState<{ appId: string; appName: string } | null>(null);
    const [isDownloading, setIsLoadingDownloading] = useState(false);

    useEffect(() => {
        fetchApplications();
    }, []);

    useEffect(() => {
        // Filter logic
        let result = applications;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(app =>
                app.fullName.toLowerCase().includes(query) ||
                app.position.toLowerCase().includes(query) ||
                app.email.toLowerCase().includes(query)
            );
        }

        if (statusFilter !== 'ALL') {
            result = result.filter(app => app.status === statusFilter);
        }

        setFilteredApps(result);
    }, [searchQuery, statusFilter, applications]);

    const fetchApplications = async () => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(API_ENDPOINTS.TALENT_POOL_APPLICATIONS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
                setFilteredApps(data);
            }
        } catch (error) {
            console.error('Failed to fetch applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadCV = async (appId: string, filename: string) => {
        const token = localStorage.getItem('adminToken');
        setIsLoadingDownloading(true);
        try {
            const response = await fetch(API_ENDPOINTS.TALENT_POOL_CV(appId), {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename || 'resume.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                toast.success('CV downloaded successfully');
            } else {
                toast.error('CV not found or unavailable');
            }
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download CV');
        } finally {
            setIsLoadingDownloading(false);
        }
    };

    const handleStatusUpdate = async (appId: string, newStatus: string) => {
        const token = localStorage.getItem('adminToken');
        try {
            const response = await fetch(`${API_ENDPOINTS.TALENT_POOL_STATUS(appId)}?status=${newStatus}`, {
                method: 'PATCH',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Update local state
                const updatedApps = applications.map(app =>
                    app.id === appId ? { ...app, status: newStatus } : app
                );
                setApplications(updatedApps);
                if (selectedApp && selectedApp.id === appId) {
                    setSelectedApp({ ...selectedApp, status: newStatus });
                }
                toast.success(`Status updated to ${newStatus}`);
            } else {
                toast.error('Failed to update status');
            }
        } catch (error) {
            console.error('Status update failed:', error);
            toast.error('An error occurred while updating status');
        }
    };

    const handleDeleteApplication = async () => {
        if (!deleteConfirmation) return;

        const { appId } = deleteConfirmation;
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(API_ENDPOINTS.TALENT_POOL_DELETE(appId), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Remove from local state
                const updatedApps = applications.filter(app => app.id !== appId);
                setApplications(updatedApps);

                // Close modal if the deleted app was selected
                if (selectedApp && selectedApp.id === appId) {
                    setSelectedApp(null);
                }

                toast.success('Application deleted successfully');
            } else {
                // Try to parse error message, but handle non-JSON responses
                let errorMessage = 'Failed to delete application';
                try {
                    const error = await response.json();
                    errorMessage = error.error || errorMessage;
                } catch (e) {
                    // If JSON parsing fails, use status text
                    errorMessage = `Failed to delete application: ${response.status} ${response.statusText}`;
                }
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('An error occurred while deleting the application');
        } finally {
            setDeleteConfirmation(null);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Job Applications</h1>
                <p className="text-gray-400 text-sm mt-1">View and manage candidate applications</p>
            </div>

            {/* Header / Controls */}
            <div className="bg-[#0f1e3a] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search applicants..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/10 text-gray-400">
                        <Filter size={18} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent border-none focus:ring-0 text-white outline-none cursor-pointer"
                        >
                            <option value="ALL" className="bg-[#0f1e3a]">All Status</option>
                            <option value="NEW" className="bg-[#0f1e3a]">New</option>
                            <option value="REVIEWED" className="bg-[#0f1e3a]">Reviewed</option>
                            <option value="INTERVIEWED" className="bg-[#0f1e3a]">Interviewed</option>
                            <option value="HIRED" className="bg-[#0f1e3a]">Hired</option>
                            <option value="REJECTED" className="bg-[#0f1e3a]">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredApps.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No applications found matching your criteria.
                    </div>
                ) : (
                    filteredApps.map((app) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group bg-[#0f1e3a] border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all cursor-pointer relative overflow-hidden"
                            onClick={() => setSelectedApp(app)}
                        >
                            {/* Status Stripe */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${app.status === 'NEW' ? 'bg-blue-500' :
                                app.status === 'HIRED' ? 'bg-emerald-500' :
                                    app.status === 'REJECTED' ? 'bg-red-500' :
                                        'bg-gray-500'
                                }`} />

                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pl-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                                            {app.fullName}
                                        </h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${app.status === 'NEW' ? 'bg-blue-500/20 text-blue-400' :
                                            app.status === 'HIRED' ? 'bg-emerald-500/20 text-emerald-400' :
                                                app.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <Briefcase size={14} />
                                            {app.position}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={14} />
                                            {app.experience} Years Exp.
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} />
                                            {new Date(app.submittedDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDownloadCV(app.id, app.cvFilename);
                                        }}
                                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-emerald-500/20 text-gray-300 hover:text-emerald-400 transition-colors flex items-center gap-2 text-sm font-medium"
                                    >
                                        <Download size={16} />
                                        Download CV
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteConfirmation({ appId: app.id, appName: app.fullName });
                                        }}
                                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2 text-sm font-medium"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedApp && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0a1628] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-white/10 max-h-[90vh] flex flex-col"
                        >
                            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#0f1e3a]">
                                <h2 className="text-2xl font-bold text-white">Applicant Details</h2>
                                <button
                                    onClick={() => setSelectedApp(null)}
                                    className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-8 flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-3xl font-bold text-white mb-2">{selectedApp.fullName}</h3>
                                        <p className="text-emerald-400 text-lg font-medium">{selectedApp.position}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <label className="text-xs text-gray-500 font-bold uppercase tracking-wider">Status</label>
                                        <select
                                            value={selectedApp.status}
                                            onChange={(e) => handleStatusUpdate(selectedApp.id, e.target.value)}
                                            className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm focus:border-emerald-500 outline-none"
                                        >
                                            <option value="NEW" className="bg-[#0f1e3a]">New</option>
                                            <option value="REVIEWED" className="bg-[#0f1e3a]">Reviewed</option>
                                            <option value="INTERVIEWED" className="bg-[#0f1e3a]">Interviewed</option>
                                            <option value="HIRED" className="bg-[#0f1e3a]">Hired</option>
                                            <option value="REJECTED" className="bg-[#0f1e3a]">Rejected</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Mail className="text-emerald-500 w-5 h-5" />
                                            <a href={`mailto:${selectedApp.email}`} className="hover:text-white transition-colors">
                                                {selectedApp.email}
                                            </a>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Phone className="text-emerald-500 w-5 h-5" />
                                            <a href={`tel:${selectedApp.phone}`} className="hover:text-white transition-colors">
                                                {selectedApp.phone}
                                            </a>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Calendar className="text-emerald-500 w-5 h-5" />
                                            <span>{selectedApp.experience} Years Experience</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-gray-300">
                                            <Clock className="text-emerald-500 w-5 h-5" />
                                            <span>Applied: {new Date(selectedApp.submittedDate).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Cover Letter / Message</h4>
                                    <p className="text-gray-200 leading-relaxed whitespace-pre-wrap">
                                        {selectedApp.message || "No message provided."}
                                    </p>
                                </div>

                                <div className="flex flex-col md:flex-row justify-end gap-3 pt-4">
                                    <button
                                        onClick={() => setDeleteConfirmation({ appId: selectedApp.id, appName: selectedApp.fullName })}
                                        className="w-full md:w-auto px-8 py-4 rounded-xl font-bold bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 transition-all flex items-center justify-center gap-3"
                                    >
                                        <Trash2 size={20} />
                                        Delete Application
                                    </button>
                                    <button
                                        onClick={() => handleDownloadCV(selectedApp.id, selectedApp.cvFilename)}
                                        disabled={isDownloading}
                                        className="w-full md:w-auto px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-blue-600 text-white shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Download size={20} className={isDownloading ? 'animate-bounce' : ''} />
                                        {isDownloading ? 'Downloading...' : 'Download Resume'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {deleteConfirmation && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#0a1628] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-red-500/20"
                        >
                            <div className="p-6 border-b border-red-500/20 bg-red-500/5">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                                        <Trash2 className="text-red-400" size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">Confirm Deletion</h2>
                                        <p className="text-sm text-gray-400">This action cannot be undone</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-gray-300">
                                    Are you sure you want to delete the application from{' '}
                                    <span className="font-bold text-white">{deleteConfirmation.appName}</span>?
                                </p>
                                <p className="text-sm text-gray-400">
                                    This will permanently remove the application and all associated files from the system.
                                </p>
                            </div>

                            <div className="p-6 pt-0 flex gap-3">
                                <button
                                    onClick={() => setDeleteConfirmation(null)}
                                    className="flex-1 px-6 py-3 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors border border-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteApplication}
                                    className="flex-1 px-6 py-3 rounded-xl font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors shadow-lg shadow-red-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApplicationViewer;
