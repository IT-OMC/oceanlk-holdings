import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { createAuditLog } from '@/lib/audit';

/**
 * GET /api/admin/users/[id]
 * Fetches a single administrative user.
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const user = await User.findById(params.id).select('-password -otp -otpExpiry');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * DELETE /api/admin/users/[id]
 * Deletes an administrative user.
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const deletedUser = await User.findByIdAndDelete(params.id);

        if (!deletedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Log the deletion
        await createAuditLog({
            username: req.headers.get('x-admin-user') || 'SYSTEM',
            action: 'DELETE_USER',
            entityType: 'User',
            entityId: params.id,
            details: `Deleted user: ${deletedUser.username}`
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Failed to delete user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
