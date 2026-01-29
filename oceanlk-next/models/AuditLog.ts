import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAuditLog extends Document {
    username: string;
    action: string; // CREATE, UPDATE, DELETE, LOGIN
    entityType: string;
    entityId?: string;
    details?: string;
    timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>({
    username: { type: String, required: true, index: true },
    action: { type: String, required: true },
    entityType: { type: String, required: true, index: true },
    entityId: { type: String, index: true },
    details: String,
    timestamp: { type: Date, default: Date.now, index: true }
}, {
    collection: 'audit_logs',
    // Capped collection: 10MB size limit or 5000 documents
    capped: { size: 10485760, max: 5000 }
});

const AuditLog: Model<IAuditLog> = mongoose.models.AuditLog || mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export default AuditLog;
