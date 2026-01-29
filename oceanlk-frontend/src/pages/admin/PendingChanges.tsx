import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, X, ChevronRight, Clock,
    Eye, Filter, ArrowLeft,
    User, Calendar, Search
} from 'lucide-react';

interface PendingChange {
    id: string;
    entityType: string;
    entityId: string | null;
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submittedBy: string;
    submittedAt: string;
    reviewedBy?: string;
    reviewedAt?: string;
    reviewComments?: string;
    changeData: string;
    originalData?: string;
}

const PendingChanges: React.FC = () => {
    const [allPendingChanges, setAllPendingChanges] = useState<PendingChange[]>([]);
    const [myPendingChanges, setMyPendingChanges] = useState<PendingChange[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChange, setSelectedChange] = useState<PendingChange | null>(null);
    const [reviewComments, setReviewComments] = useState('');
    const [activeTab, setActiveTab] = useState<'pending-approvals' | 'my-changes'>('pending-approvals');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [entityTypeFilter, setEntityTypeFilter] = useState<string>('all');
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const adminRole = localStorage.getItem('adminRole');
    const isSuperAdmin = adminRole === 'SUPER_ADMIN';


    const fetchData = React.useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');

            // Fetch data based on role
            if (isSuperAdmin) {
                // SuperAdmin: Fetch all pending changes for approval
                const allResponse = await axios.get(`${API_URL}/api/pending-changes`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllPendingChanges(allResponse.data);
            }

            // Fetch user's own submissions
            const myResponse = await axios.get(`${API_URL}/api/pending-changes/my-submissions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyPendingChanges(myResponse.data);

        } catch (error: any) {
            console.error('Error fetching pending changes:', error);
            if (error.response?.status === 403) {
                // Silently handle 403 for regular admins trying to access all changes
            } else if (axios.isAxiosError(error) && error.response?.status !== 404) {
                // Don't show alert for empty list or 404
            }
        } finally {
            setLoading(false);
        }
    }, [isSuperAdmin, API_URL]);

    useEffect(() => {
        fetchData();
        // Set active tab based on role
        if (isSuperAdmin) {
            setActiveTab('pending-approvals');
        } else {
            setActiveTab('my-changes');
        }
    }, [fetchData, isSuperAdmin]);

    const handleApprove = async (changeId: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(
                `${API_URL}/api/pending-changes/${changeId}/approve`,
                { reviewComments },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Change approved and published successfully!');
            setSelectedChange(null);
            setReviewComments('');
            fetchData();
        } catch (error) {
            console.error('Error approving change:', error);
            alert('Failed to approve change');
        }
    };

    const handleReject = async (changeId: string) => {
        if (!reviewComments.trim()) {
            alert('Please provide review comments for rejection');
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(
                `${API_URL}/api/pending-changes/${changeId}/reject`,
                { reviewComments },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Change rejected successfully!');
            setSelectedChange(null);
            setReviewComments('');
            fetchData();
        } catch (error) {
            console.error('Error rejecting change:', error);
            alert('Failed to reject change');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'APPROVED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'REJECTED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'UPDATE': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'DELETE': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const parseChangeData = (dataString: string) => {
        try {
            return JSON.parse(dataString);
        } catch {
            return null;
        }
    };

    // Get the current dataset based on active tab
    const currentDataset = activeTab === 'pending-approvals' ? allPendingChanges : myPendingChanges;

    // Apply filters
    let filteredChanges = currentDataset;

    // Filter by status (only for my-changes tab)
    if (activeTab === 'my-changes' && statusFilter !== 'all') {
        filteredChanges = filteredChanges.filter(change => change.status === statusFilter);
    }

    // Filter by entity type
    if (entityTypeFilter !== 'all') {
        filteredChanges = filteredChanges.filter(change => change.entityType === entityTypeFilter);
    }

    // For pending approvals, only show PENDING status
    if (activeTab === 'pending-approvals') {
        filteredChanges = filteredChanges.filter(change => change.status === 'PENDING');
    }

    // Get unique entity types
    const entityTypes = Array.from(new Set(currentDataset.map(c => c.entityType)));

    // Status counts for my-changes tab
    const statusCounts = {
        all: myPendingChanges.length,
        PENDING: myPendingChanges.filter(c => c.status === 'PENDING').length,
        APPROVED: myPendingChanges.filter(c => c.status === 'APPROVED').length,
        REJECTED: myPendingChanges.filter(c => c.status === 'REJECTED').length
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
                    <p className="text-gray-400 animate-pulse">Loading changes...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B1120] text-gray-100 p-6 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Pending Changes
                        </h1>
                        <p className="text-gray-400 mt-1">Manage and track system modifications</p>
                    </div>
                    <button
                        onClick={() => navigate('/admin')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700"
                    >
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </button>
                </div>

                {/* Main Content Card */}
                <div className="bg-[#151C2C] rounded-xl border border-gray-800 shadow-xl overflow-hidden">
                    {/* Tabs */}
                    <div className="border-b border-gray-800 px-6 pt-6">
                        <div className="flex gap-6">
                            {isSuperAdmin && (
                                <button
                                    onClick={() => setActiveTab('pending-approvals')}
                                    className={`relative pb-4 px-2 text-sm font-medium transition-colors ${activeTab === 'pending-approvals' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
                                        }`}
                                >
                                    <span className="flex items-center gap-2">
                                        Pending Approvals
                                        <span className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full text-xs font-bold border border-amber-500/20">
                                            {allPendingChanges.filter(c => c.status === 'PENDING').length}
                                        </span>
                                    </span>
                                    {activeTab === 'pending-approvals' && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                                        />
                                    )}
                                </button>
                            )}
                            <button
                                onClick={() => setActiveTab('my-changes')}
                                className={`relative pb-4 px-2 text-sm font-medium transition-colors ${activeTab === 'my-changes' ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
                                    }`}
                            >
                                <span className="flex items-center gap-2">
                                    My Changes
                                    <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full text-xs font-bold border border-blue-500/20">
                                        {myPendingChanges.length}
                                    </span>
                                </span>
                                {activeTab === 'my-changes' && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400"
                                    />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Filters & Actions */}
                    <div className="p-6 border-b border-gray-800 bg-[#151C2C]/50">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                                {/* Entity Type Filter */}
                                <div className="relative group">
                                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-blue-400" />
                                    <select
                                        value={entityTypeFilter}
                                        onChange={(e) => setEntityTypeFilter(e.target.value)}
                                        className="pl-10 pr-8 py-2 bg-[#0B1120] border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 appearance-none min-w-[160px]"
                                    >
                                        <option value="all">All Types</option>
                                        {entityTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Status Filter Pills (Only for My Changes) */}
                                {activeTab === 'my-changes' && (
                                    <div className="flex bg-[#0B1120] p-1 rounded-lg border border-gray-700">
                                        {['all', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => setStatusFilter(status)}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${statusFilter === status
                                                    ? 'bg-gray-700 text-white shadow-sm'
                                                    : 'text-gray-400 hover:text-gray-200'
                                                    }`}
                                            >
                                                {status === 'all' ? 'All' : status} ({statusCounts[status as keyof typeof statusCounts]})
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="text-sm text-gray-500">
                                Showing {filteredChanges.length} {filteredChanges.length === 1 ? 'change' : 'changes'}
                            </div>
                        </div>
                    </div>

                    {/* List Content */}
                    <div className="p-6 bg-[#0B1120]/30 min-h-[400px]">
                        {filteredChanges.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 text-gray-600">
                                    <Search size={32} />
                                </div>
                                <h3 className="text-lg font-medium text-gray-300">No changes found</h3>
                                <p className="text-gray-500 mt-2 max-w-sm">
                                    {activeTab === 'pending-approvals'
                                        ? "There are no pending changes requiring your approval at this moment."
                                        : "You haven't submitted any changes matching the current filters."}
                                </p>
                            </div>
                        ) : (
                            <div className="grid gap-4">
                                <AnimatePresence mode='popLayout'>
                                    {filteredChanges.map((change) => (
                                        <motion.div
                                            key={change.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            layout
                                            className="group bg-[#151C2C] border border-gray-800 hover:border-gray-700 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-blue-900/10"
                                        >
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="flex-1 space-y-3">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(change.status)}`}>
                                                            {change.status === 'PENDING' && <Clock size={12} />}
                                                            {change.status === 'APPROVED' && <Check size={12} />}
                                                            {change.status === 'REJECTED' && <X size={12} />}
                                                            {change.status}
                                                        </span>
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActionColor(change.action)}`}>
                                                            {change.action}
                                                        </span>
                                                        <span className="text-sm text-gray-400 font-medium flex items-center gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                                                            {change.entityType}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap gap-6 text-sm text-gray-500">
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} className="text-gray-600" />
                                                            <span>by <span className="text-gray-300">{change.submittedBy}</span></span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Calendar size={14} className="text-gray-600" />
                                                            <span>{formatDate(change.submittedAt)}</span>
                                                        </div>
                                                    </div>

                                                    {change.reviewedBy && (
                                                        <div className="mt-2 pt-3 border-t border-gray-800/50 flex flex-wrap gap-6 text-xs text-gray-500">
                                                            <div className="flex items-center gap-2">
                                                                <Check size={12} className="text-emerald-500" />
                                                                <span>Reviewed by <span className="text-gray-300">{change.reviewedBy}</span></span>
                                                            </div>
                                                            <span>{formatDate(change.reviewedAt!)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-start">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedChange(change);
                                                            setReviewComments('');
                                                        }}
                                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pending-approvals' && change.status === 'PENDING'
                                                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'
                                                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700'
                                                            }`}
                                                    >
                                                        {activeTab === 'pending-approvals' && change.status === 'PENDING' ? (
                                                            <>Review Request <ChevronRight size={16} /></>
                                                        ) : (
                                                            <>View Details <Eye size={16} /></>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedChange && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedChange(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-[#151C2C] border border-gray-700 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0B1120]/50">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                        {activeTab === 'pending-approvals' && selectedChange.status === 'PENDING'
                                            ? 'Review Change Request'
                                            : 'Change Details'}
                                        <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(selectedChange.status)}`}>
                                            {selectedChange.status}
                                        </span>
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">ID: {selectedChange.id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedChange(null)}
                                    className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                {/* Meta Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-800/30 rounded-lg border border-gray-800">
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Action Type</span>
                                            <div className="mt-1 flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded text-xs font-bold border ${getActionColor(selectedChange.action)}`}>
                                                    {selectedChange.action}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Entity</span>
                                            <p className="text-gray-200 mt-1 font-medium">{selectedChange.entityType}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Submission</span>
                                            <div className="mt-1">
                                                <p className="text-gray-200">{selectedChange.submittedBy}</p>
                                                <p className="text-xs text-gray-500">{formatDate(selectedChange.submittedAt)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Review Comments (If Exists) */}
                                {selectedChange.reviewComments && selectedChange.status !== 'PENDING' && (
                                    <div className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-4">
                                        <span className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Reviewer Comments</span>
                                        <p className="text-gray-300 mt-2 text-sm italic">"{selectedChange.reviewComments}"</p>
                                    </div>
                                )}

                                {/* Data Comparison */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedChange.action === 'UPDATE' && selectedChange.originalData && (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-semibold text-gray-400">Original Data</h3>
                                                <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">Before</span>
                                            </div>
                                            <pre className="bg-[#0B1120] p-4 rounded-lg border border-gray-800 overflow-x-auto text-xs text-red-300 font-mono h-[300px]">
                                                {JSON.stringify(parseChangeData(selectedChange.originalData), null, 2)}
                                            </pre>
                                        </div>
                                    )}

                                    <div className={`space-y-2 ${selectedChange.action !== 'UPDATE' ? 'col-span-full' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-gray-400">
                                                {selectedChange.action === 'DELETE' ? 'Data to Delete' : 'New Data'}
                                            </h3>
                                            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                                                {selectedChange.action === 'DELETE' ? 'Target' : 'After'}
                                            </span>
                                        </div>
                                        <pre className="bg-[#0B1120] p-4 rounded-lg border border-gray-800 overflow-x-auto text-xs text-emerald-300 font-mono h-[300px]">
                                            {JSON.stringify(parseChangeData(selectedChange.changeData), null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                {/* Review Actions (Super Admin Only) */}
                                {activeTab === 'pending-approvals' && isSuperAdmin && selectedChange.status === 'PENDING' && (
                                    <div className="mt-6 pt-6 border-t border-gray-800">
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Review Comments <span className="text-gray-600">(Required for rejection)</span>
                                        </label>
                                        <textarea
                                            value={reviewComments}
                                            onChange={(e) => setReviewComments(e.target.value)}
                                            placeholder="Add your comments here..."
                                            className="w-full bg-[#0B1120] border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-600 min-h-[100px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-gray-800 bg-[#0B1120]/30 flex justify-end gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedChange(null);
                                        setReviewComments('');
                                    }}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {activeTab === 'pending-approvals' && isSuperAdmin && selectedChange.status === 'PENDING' ? 'Cancel' : 'Close'}
                                </button>

                                {activeTab === 'pending-approvals' && isSuperAdmin && selectedChange.status === 'PENDING' && (
                                    <>
                                        <button
                                            onClick={() => handleReject(selectedChange.id)}
                                            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/50 hover:border-rose-500 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                                        >
                                            <X size={16} /> Reject
                                        </button>
                                        <button
                                            onClick={() => handleApprove(selectedChange.id)}
                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                                        >
                                            <Check size={16} /> Approve & Publish
                                        </button>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PendingChanges;
