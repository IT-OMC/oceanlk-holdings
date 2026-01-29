import { z } from 'zod';

// --- User Validators ---

export const LoginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const RegisterUserSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'USER']).optional(),
    phone: z.string().optional(),
});

export const UpdateUserSchema = z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    username: z.string().min(3).optional(),
    phone: z.string().optional(),
    active: z.boolean().optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'USER']).optional(),
});

// --- Notification Validators ---

export const CreateNotificationSchema = z.object({
    message: z.string().min(1, 'Message is required'),
    type: z.enum(['INFO', 'WARNING', 'ERROR']).default('INFO'),
    recipientId: z.string().optional(),
    recipientRole: z.enum(['ROLE_ADMIN', 'ROLE_SUPER_ADMIN']).optional(),
    link: z.string().url().optional().or(z.literal('')),
});

// --- Audit Log Validators ---

export const CreateAuditLogSchema = z.object({
    username: z.string().min(1),
    action: z.string().min(1),
    entityType: z.string().min(1),
    entityId: z.string().optional(),
    details: z.string().optional(),
});

// --- Generic Types extracted from Zod ---
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type CreateNotificationInput = z.infer<typeof CreateNotificationSchema>;
