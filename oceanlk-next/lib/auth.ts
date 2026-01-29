import bcrypt from 'bcryptjs';
import dbConnect from './db';
import User from '../models/User';
import { LoginInput, RegisterUserInput } from './validators';

export async function authenticateUser({ username, password }: LoginInput) {
    await dbConnect();

    // Explicitly select password since it's hidden by default in the schema
    const user = await User.findOne({ username }).select('+password');

    if (!user) {
        throw new Error('Invalid credentials');
    }

    if (!user.active) {
        throw new Error('Account is deactivated. Please contact the administrator.');
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    // Remove password from the returned object
    const userObj = user.toObject();
    delete userObj.password;

    return userObj;
}

export async function registerUser(data: RegisterUserInput) {
    await dbConnect();

    const existingUser = await User.findOne({
        $or: [{ email: data.email }, { username: data.username }]
    });

    if (existingUser) {
        throw new Error('User with this email or username already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const newUser = await User.create({
        ...data,
        password: hashedPassword,
        createdDate: new Date(),
        verified: false,
        active: true
    });

    const userObj = newUser.toObject();
    delete userObj.password;

    return userObj;
}
