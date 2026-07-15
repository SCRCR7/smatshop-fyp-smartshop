const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const promoteToAdmin = async () => {
    const email = process.argv[2];

    if (!email) {
        console.error('Please provide an email address: node scripts/promoteAdmin.js <email>');
        process.exit(1);
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        const user = await User.findOne({ email });

        if (!user) {
            console.error('User not found with that email.');
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`SUCCESS: User ${user.name} (${user.email}) has been promoted to ADMIN.`);
        process.exit(0);
    } catch (error) {
        console.error('Error promoting user:', error.message);
        process.exit(1);
    }
};

promoteToAdmin();
