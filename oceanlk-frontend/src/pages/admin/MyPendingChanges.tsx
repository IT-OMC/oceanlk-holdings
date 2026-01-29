import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChangeVisualizer from '../../components/admin/ChangeVisualizer';
import { API_ENDPOINTS } from '../../utils/api';

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

const MyPendingChanges: React.FC = () => {
    const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChange, setSelectedChange] = useState<PendingChange | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const navigate = useNavigate();

    const fetchMyPendingChanges = useCallback(async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(API_ENDPOINTS.PENDING_CHANGES_MY, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setPendingChanges(data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching pending changes:', error);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyPendingChanges();
    }, [fetchMyPendingChanges]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return '#f59e0b';
            case 'APPROVED': return '#10b981';
            case 'REJECTED': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getActionColor = (action: string) => {
        switch (action) {
            case 'CREATE': return 'green';
            case 'UPDATE': return 'blue';
            case 'DELETE': return 'red';
            default: return 'gray';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const filteredChanges = statusFilter === 'all'
        ? pendingChanges
        : pendingChanges.filter(change => change.status === statusFilter);

    const statusCounts = {
        all: pendingChanges.length,
        PENDING: pendingChanges.filter(c => c.status === 'PENDING').length,
        APPROVED: pendingChanges.filter(c => c.status === 'APPROVED').length,
        REJECTED: pendingChanges.filter(c => c.status === 'REJECTED').length
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1>My Pending Changes</h1>
                <button
                    onClick={() => navigate('/admin')}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#6b7280',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Back to Dashboard
                </button>
            </div>

            {/* Status Filter Tabs */}
            <div style={{ marginBottom: '2rem', display: 'flex', gap: '0.5rem', borderBottom: '2px solid #e5e7eb' }}>
                {['all', 'PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            backgroundColor: 'transparent',
                            borderBottom: statusFilter === status ? '3px solid #3b82f6' : '3px solid transparent',
                            cursor: 'pointer',
                            fontWeight: statusFilter === status ? 'bold' : 'normal',
                            color: statusFilter === status ? '#3b82f6' : '#6b7280'
                        }}
                    >
                        {status === 'all' ? 'All' : status} ({statusCounts[status as keyof typeof statusCounts]})
                    </button>
                ))}
            </div>

            {filteredChanges.length === 0 ? (
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                }}>
                    <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
                        No {statusFilter !== 'all' ? statusFilter.toLowerCase() : ''} changes found
                    </p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredChanges.map((change) => (
                        <div
                            key={change.id}
                            style={{
                                padding: '1.5rem',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                backgroundColor: 'white',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                                        <span
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: getStatusColor(change.status),
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {change.status}
                                        </span>
                                        <span
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: getActionColor(change.action),
                                                color: 'white',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {change.action}
                                        </span>
                                        <span
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                backgroundColor: '#f3f4f6',
                                                color: '#374151',
                                                borderRadius: '4px',
                                                fontSize: '0.875rem'
                                            }}
                                        >
                                            {change.entityType}
                                        </span>
                                    </div>

                                    <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
                                        <strong>Submitted at:</strong> {formatDate(change.submittedAt)}
                                    </p>

                                    {change.reviewedBy && (
                                        <>
                                            <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
                                                <strong>Reviewed by:</strong> {change.reviewedBy}
                                            </p>
                                            <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
                                                <strong>Reviewed at:</strong> {formatDate(change.reviewedAt!)}
                                            </p>
                                            {change.reviewComments && (
                                                <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
                                                    <strong>Comments:</strong> {change.reviewComments}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>

                                <button
                                    onClick={() => setSelectedChange(change)}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Details Modal */}
            {selectedChange && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                    onClick={() => setSelectedChange(null)}
                >
                    <div
                        style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '8px',
                            maxWidth: '800px',
                            maxHeight: '80vh',
                            overflow: 'auto',
                            width: '90%'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 style={{ marginTop: 0 }}>Change Details</h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p><strong>Status:</strong> <span style={{ color: getStatusColor(selectedChange.status) }}>{selectedChange.status}</span></p>
                            <p><strong>Action:</strong> <span style={{ color: getActionColor(selectedChange.action) }}>{selectedChange.action}</span></p>
                            <p><strong>Entity Type:</strong> {selectedChange.entityType}</p>
                            <p><strong>Submitted at:</strong> {formatDate(selectedChange.submittedAt)}</p>

                            {selectedChange.reviewedBy && (
                                <>
                                    <p><strong>Reviewed by:</strong> {selectedChange.reviewedBy}</p>
                                    <p><strong>Reviewed at:</strong> {formatDate(selectedChange.reviewedAt!)}</p>
                                    {selectedChange.reviewComments && (
                                        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                                            <strong>Review Comments:</strong>
                                            <p style={{ marginTop: '0.5rem' }}>{selectedChange.reviewComments}</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <ChangeVisualizer
                            entityType={selectedChange.entityType}
                            action={selectedChange.action}
                            changeData={selectedChange.changeData}
                            originalData={selectedChange.originalData}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedChange(null)}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    backgroundColor: '#6b7280',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyPendingChanges;
