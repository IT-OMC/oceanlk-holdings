import React, { useState, useEffect } from 'react';
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

const SuperAdminApproval: React.FC = () => {
    const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedChange, setSelectedChange] = useState<PendingChange | null>(null);
    const [reviewComments, setReviewComments] = useState('');
    const [filter, setFilter] = useState<string>('all');
    const navigate = useNavigate();

    const fetchPendingChanges = React.useCallback(async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(API_ENDPOINTS.PENDING_CHANGES, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setPendingChanges(data);
            } else if (response.status === 403) {
                alert('Access denied. Superadmin privileges required.');
                navigate('/admin');
            }
            setLoading(false);
        } catch (error: any) {
            console.error('Error fetching pending changes:', error);
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchPendingChanges();
    }, [fetchPendingChanges]);

    const handleApprove = async (changeId: string) => {
        try {
            const token = localStorage.getItem('adminToken');
            const response = await fetch(API_ENDPOINTS.PENDING_CHANGE_APPROVE(changeId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ reviewComments })
            });

            if (response.ok) {
                alert('Change approved and published successfully!');
                setSelectedChange(null);
                setReviewComments('');
                fetchPendingChanges();
            } else {
                alert('Failed to approve change');
            }
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
            const response = await fetch(API_ENDPOINTS.PENDING_CHANGE_REJECT(changeId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ reviewComments })
            });

            if (response.ok) {
                alert('Change rejected successfully!');
                setSelectedChange(null);
                setReviewComments('');
                fetchPendingChanges();
            } else {
                alert('Failed to reject change');
            }
        } catch (error) {
            console.error('Error rejecting change:', error);
            alert('Failed to reject change');
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

    const filteredChanges = filter === 'all'
        ? pendingChanges
        : pendingChanges.filter(change => change.entityType === filter);

    const entityTypes = Array.from(new Set(pendingChanges.map(c => c.entityType)));

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
                <h1>Pending Approvals</h1>
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

            {/* Filter */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ marginRight: '1rem', fontWeight: 'bold' }}>Filter by Type:</label>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    style={{
                        padding: '0.5rem',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db'
                    }}
                >
                    <option value="all">All Types</option>
                    {entityTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <span style={{ marginLeft: '1rem', color: '#6b7280' }}>
                    {filteredChanges.length} pending {filteredChanges.length === 1 ? 'change' : 'changes'}
                </span>
            </div>

            {filteredChanges.length === 0 ? (
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px'
                }}>
                    <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>
                        No pending changes to review
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
                                        <strong>Submitted by:</strong> {change.submittedBy}
                                    </p>
                                    <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>
                                        <strong>Submitted at:</strong> {formatDate(change.submittedAt)}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
                                        Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {selectedChange && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.75)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        padding: '2rem'
                    }}
                    onClick={() => setSelectedChange(null)}
                >
                    <div
                        style={{
                            backgroundColor: '#1a1f2e',
                            padding: '0',
                            borderRadius: '12px',
                            maxWidth: '1200px',
                            maxHeight: '90vh',
                            width: '100%',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                            border: '1px solid #2d3748',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderBottom: '1px solid #2d3748',
                            backgroundColor: '#0f1419',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div>
                                <h2 style={{
                                    margin: 0,
                                    fontSize: '1.5rem',
                                    fontWeight: '600',
                                    color: '#f7fafc'
                                }}>Review Change Request</h2>
                                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', alignItems: 'center' }}>
                                    <span
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: getActionColor(selectedChange.action),
                                            color: 'white',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}
                                    >
                                        {selectedChange.action}
                                    </span>
                                    <span style={{ color: '#a0aec0', fontSize: '0.875rem' }}>
                                        {selectedChange.entityType}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedChange(null)}
                                style={{
                                    padding: '0.5rem',
                                    backgroundColor: 'transparent',
                                    color: '#a0aec0',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem',
                                    lineHeight: 1,
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#2d3748';
                                    e.currentTarget.style.color = '#f7fafc';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#a0aec0';
                                }}
                            >
                                ×
                            </button>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div style={{
                            flex: 1,
                            overflow: 'auto',
                            padding: '2rem',
                            backgroundColor: '#151c2c'
                        }}>
                            {/* Metadata */}
                            <div style={{
                                marginBottom: '2rem',
                                padding: '1.25rem',
                                backgroundColor: '#1a1f2e',
                                borderRadius: '8px',
                                border: '1px solid #2d3748'
                            }}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted By</p>
                                        <p style={{ margin: '0.25rem 0 0 0', color: '#e2e8f0', fontWeight: '500' }}>{selectedChange.submittedBy}</p>
                                    </div>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Submitted At</p>
                                        <p style={{ margin: '0.25rem 0 0 0', color: '#e2e8f0', fontWeight: '500' }}>{formatDate(selectedChange.submittedAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Change Visualizer */}
                            <ChangeVisualizer
                                entityType={selectedChange.entityType}
                                action={selectedChange.action}
                                changeData={selectedChange.changeData}
                                originalData={selectedChange.originalData}
                            />

                            {/* Review Comments */}
                            <div style={{ marginTop: '2rem' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: '0.75rem',
                                    fontWeight: '600',
                                    color: '#e2e8f0',
                                    fontSize: '0.875rem'
                                }}>
                                    Review Comments
                                    <span style={{ color: '#fc8181', marginLeft: '0.25rem' }}>*</span>
                                    <span style={{ fontWeight: 'normal', color: '#718096', fontSize: '0.75rem', marginLeft: '0.5rem' }}>
                                        (required for rejection)
                                    </span>
                                </label>
                                <textarea
                                    value={reviewComments}
                                    onChange={(e) => setReviewComments(e.target.value)}
                                    placeholder="Add your comments here..."
                                    style={{
                                        width: '100%',
                                        minHeight: '120px',
                                        padding: '0.75rem',
                                        backgroundColor: '#1a1f2e',
                                        border: '1px solid #2d3748',
                                        borderRadius: '8px',
                                        fontFamily: 'inherit',
                                        color: '#e2e8f0',
                                        fontSize: '0.875rem',
                                        resize: 'vertical',
                                        transition: 'border-color 0.2s'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#4299e1'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#2d3748'}
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div style={{
                            padding: '1.5rem 2rem',
                            borderTop: '1px solid #2d3748',
                            backgroundColor: '#0f1419',
                            display: 'flex',
                            gap: '0.75rem',
                            justifyContent: 'flex-end'
                        }}>
                            <button
                                onClick={() => {
                                    setSelectedChange(null);
                                    setReviewComments('');
                                }}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    backgroundColor: '#2d3748',
                                    color: '#e2e8f0',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#4a5568'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2d3748'}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleReject(selectedChange.id)}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    backgroundColor: '#f56565',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e53e3e'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f56565'}
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => handleApprove(selectedChange.id)}
                                style={{
                                    padding: '0.625rem 1.25rem',
                                    backgroundColor: '#48bb78',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '500',
                                    fontSize: '0.875rem',
                                    transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#38a169'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#48bb78'}
                            >
                                Approve & Publish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminApproval;
