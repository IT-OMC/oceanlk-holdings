import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env.local from the root directory
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

import dbConnect from '../lib/db';
import User from '../models/User';
import Notification from '../models/Notification';

/**
 * Backfill script to ensure all existing records have required fields
 * and follow the new schema constraints.
 */
async function migrate() {
    await dbConnect();
    console.log('Connected to database for migration...');

    // 1. Backfill User fields
    const userResult = await User.updateMany(
        {
            $or: [
                { active: { $exists: false } },
                { verified: { $exists: false } },
                { role: { $exists: false } }
            ]
        },
        {
            $set: {
                active: true,
                verified: true, // Assuming existing users are verified
                role: 'ADMIN'   // Default for existing users
            }
        }
    );
    console.log(`Updated ${userResult.modifiedCount} user records.`);

    // 2. Backfill Notification fields
    const notificationResult = await Notification.updateMany(
        { isRead: { $exists: false } },
        { $set: { isRead: false } }
    );
    console.log(`Updated ${notificationResult.modifiedCount} notification records.`);

    console.log('Migration completed successfully.');
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
