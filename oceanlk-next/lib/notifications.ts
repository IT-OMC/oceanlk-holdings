import dbConnect from './db';
import Notification from '../models/Notification';
import { CreateNotificationInput } from './validators';

/**
 * Global helper to create notifications across the application.
 * This can be used in API routes, server actions, or webhooks.
 */
export async function createNotification(data: CreateNotificationInput) {
    try {
        await dbConnect();

        const notification = await Notification.create({
            ...data,
            isRead: false,
            createdAt: new Date()
        });

        return notification;
    } catch (error) {
        console.error('Failed to create notification:', error);
        // We don't want notification failure to break the main transaction/action
        return null;
    }
}

/**
 * Helper to mark notification as read
 */
export async function markAsRead(notificationId: string) {
    await dbConnect();
    return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
}
