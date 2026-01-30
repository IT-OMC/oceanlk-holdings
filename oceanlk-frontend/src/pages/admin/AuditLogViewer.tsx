import { useState, useEffect } from 'react';
import { Search, Filter, ShieldAlert, ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../utils/api';

interface AuditLog {
    id: string;
    username: string;
    action: string;
    entityType: string;
    entityId: string;
    details: string;
    timestamp: string;
}

const AuditLogViewer = () => {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionFilter, setActionFilter] = useState('ALL');
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        fetchLogs();
        // Get user role from localStorage or token
        const role = localStorage.getItem('adminRole');
        setUserRole(role || '');
    }, []);

    useEffect(() => {
        filterLogs();
    }, [logs, searchTerm, actionFilter]);

    const fetchLogs = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(API_ENDPOINTS.AUDIT_LOGS, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setLogs(data);
            }
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filterLogs = () => {
        let result = logs;

        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(log =>
                log.username.toLowerCase().includes(lowerTerm) ||
                log.entityType.toLowerCase().includes(lowerTerm) ||
                log.details.toLowerCase().includes(lowerTerm)
            );
        }

        if (actionFilter !== 'ALL') {
            result = result.filter(log => log.action === actionFilter);
        }

        setFilteredLogs(result);
    };

    const handleDeleteLog = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this audit log? This action cannot be undone.')) {
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(API_ENDPOINTS.AUDIT_LOG_DELETE(id), {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                // Remove the deleted log from state
                setLogs(logs.filter(log => log.id !== id));
            } else {
                alert('Failed to delete audit log. You may not have permission.');
            }
        } catch (error) {
            console.error('Error deleting audit log:', error);
            alert('An error occurred while deleting the audit log.');
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'text-emerald-400 bg-emerald-400/10';
            case 'UPDATE': return 'text-blue-400 bg-blue-400/10';
            case 'DELETE': return 'text-red-400 bg-red-400/10';
            default: return 'text-gray-400 bg-gray-400/10';
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-emerald-400" />
                        Audit Logs
                    </h1>
                    <p className="text-gray-400 mt-1">Track system activities and administrative actions</p>
                </div>
                <Link to="/admin/dashboard" className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-[#0f1e3a] border border-white/10 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[300px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by user, entity, or details..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0a1629] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="text-gray-400 w-5 h-5" />
                    <select
                        value={actionFilter}
                        onChange={(e) => setActionFilter(e.target.value)}
                        className="bg-[#0a1629] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-emerald-500"
                    >
                        <option value="ALL">All Actions</option>
                        <option value="CREATE">Create</option>
                        <option value="UPDATE">Update</option>
                        <option value="DELETE">Delete</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#0f1e3a] border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-left">
                                <th className="p-4 text-gray-400 font-medium">Timestamp</th>
                                <th className="p-4 text-gray-400 font-medium">User</th>
                                <th className="p-4 text-gray-400 font-medium">Action</th>
                                <th className="p-4 text-gray-400 font-medium">Entity</th>
                                <th className="p-4 text-gray-400 font-medium">Details</th>
                                {userRole === 'SUPER_ADMIN' && (
                                    <th className="p-4 text-gray-400 font-medium text-right">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">Loading logs...</td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-400">No logs found</td>
                                </tr>
                            ) : (
                                filteredLogs.map((log) => (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-white/5 transition-colors"
                                    >
                                        <td className="p-4 text-gray-300 text-sm whitespace-nowrap">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="p-4 text-white font-medium">{log.username}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-300">
                                            {log.entityType}
                                            <span className="text-xs text-gray-500 block font-mono mt-1">{log.entityId}</span>
                                        </td>
                                        <td className="p-4 text-gray-300 text-sm max-w-md truncate" title={log.details}>
                                            {log.details}
                                        </td>
                                        {userRole === 'SUPER_ADMIN' && (
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteLog(log.id)}
                                                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    title="Delete Log"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        )}
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogViewer;
