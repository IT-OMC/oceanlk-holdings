import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import AuditLog from '@/models/AuditLog';

/**
 * GET /api/admin/audit-logs
 * Fetches recent administrative logs.
 */
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // In a production app, we would add pagination and filtering by entityType or username
        const logs = await AuditLog.find()
            .sort({ timestamp: -1 })
            .limit(100);

        return NextResponse.json(logs);
    } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
