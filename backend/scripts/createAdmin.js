const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@gmail.com';
        const password = 'password123';
        const hashedPassword = bcrypt.hashSync(password, 10);

        let user = await User.findOne({ email });

        if (user) {
            user.password = hashedPassword;
            user.role = 'admin'; // Ensure role is admin
            await user.save();
            console.log(`Admin user updated: ${email}`);
        } else {
            user = await User.create({
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'admin'
            });
            console.log(`Admin user created: ${email}`);
        }

        console.log(`Credentials:`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
