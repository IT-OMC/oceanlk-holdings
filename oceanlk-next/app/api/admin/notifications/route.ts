import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

/**
 * GET /api/admin/notifications
 * Fetches all unread notifications for the system.
 */
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // In a real scenario, we'd filter by recipientId or role from the JWT token
        const notifications = await Notification.find({ isRead: false })
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Failed to fetch notifications:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
