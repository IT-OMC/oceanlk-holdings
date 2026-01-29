import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
    message: string;
    type: 'INFO' | 'WARNING' | 'ERROR';
    isRead: boolean;
    link?: string;
    recipientRole?: 'ROLE_ADMIN' | 'ROLE_SUPER_ADMIN';
    recipientId?: string;
    createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
    message: { type: String, required: true },
    type: {
        type: String,
        enum: ['INFO', 'WARNING', 'ERROR'],
        default: 'INFO'
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    link: String,
    recipientRole: {
        type: String,
        enum: ['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'],
        index: true
    },
    recipientId: {
        type: String,
        index: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: '90d' } // Automatic cleanup after 90 days
    }
}, {
    collection: 'notifications'
});

const Notification: Model<INotification> = mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
