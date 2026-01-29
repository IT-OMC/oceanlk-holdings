import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { createAuditLog } from '@/lib/audit';

const UserSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    username: z.string().min(3),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'SUPER_ADMIN']),
    phone: z.string().optional(),
});

/**
 * GET /api/admin/users
 * Lists all administrative users.
 */
export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        // Fetch only admins, excluding users if any
        const admins = await User.find({ role: { $in: ['ADMIN', 'SUPER_ADMIN'] } })
            .select('-password -otp -otpExpiry')
            .sort({ createdDate: -1 });

        return NextResponse.json(admins);
    } catch (error) {
        console.error('Failed to fetch admins:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

/**
 * POST /api/admin/users
 * Creates a new administrative user.
 */
export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();

        const validatedData = UserSchema.parse(body);

        const existingUser = await User.findOne({
            $or: [
                { email: validatedData.email.toLowerCase() },
                { username: validatedData.username.toLowerCase() }
            ]
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User with this email or username already exists' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        const newUser = await User.create({
            ...validatedData,
            password: hashedPassword,
            verified: true, // Auto-verify admins created by super admins
        });

        const { password, ...userWithoutPassword } = newUser.toObject();

        // Log the creation
        await createAuditLog({
            username: req.headers.get('x-admin-user') || 'SYSTEM',
            action: 'CREATE_USER',
            entityType: 'User',
            entityId: (newUser._id as string).toString(),
            details: `Created user: ${validatedData.username}`
        });

        return NextResponse.json(userWithoutPassword, { status: 201 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error('Failed to create user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
