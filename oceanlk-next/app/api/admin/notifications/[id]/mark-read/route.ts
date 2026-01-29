import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

/**
 * PATCH /api/admin/notifications/[id]/mark-read
 * Marks a specific notification as read.
 */
export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        await dbConnect();

        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
        }

        return NextResponse.json(notification);
    } catch (error) {
        console.error('Failed to mark notification as read:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
