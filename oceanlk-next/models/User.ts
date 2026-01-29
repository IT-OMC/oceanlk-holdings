import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    username: string;
    password?: string;
    role: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
    phone?: string;
    active: boolean;
    verified: boolean;
    otp?: string;
    otpExpiry?: Date;
    lastLoginDate?: Date;
    createdDate: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false // Crucial for security
    },
    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'ADMIN', 'USER'],
        default: 'USER'
    },
    phone: String,
    active: { type: Boolean, default: true },
    verified: { type: Boolean, default: false },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    lastLoginDate: Date,
    createdDate: { type: Date, default: Date.now }
}, {
    timestamps: true,
    collection: 'users' // Consistent with MongoDB naming conventions
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
