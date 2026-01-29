import AuditLog from '@/models/AuditLog';

export interface AuditLogParams {
    username: string;
    action: string;
    entityType: string;
    entityId?: string;
    details?: string;
}

export async function createAuditLog(params: AuditLogParams) {
    try {
        await AuditLog.create(params);
    } catch (error) {
        console.error('Failed to create audit log:', error);
        // We don't throw here to avoid failing the main action if logging fails
    }
}
