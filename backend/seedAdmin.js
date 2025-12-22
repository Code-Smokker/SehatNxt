const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedAdmin = async () => {
    try {
        const email = 'admin@sehatnxt.com';
        const password = 'admin'; // Simple password for now

        const exists = await Admin.findOne({ email });
        if (exists) {
            console.log('Admin already exists');
            // Check if password match? Nah, just reset it to be updated
            exists.password = password; // Pre-save hook will hash it
            await exists.save();
            console.log('Admin password reset to: admin');
        } else {
            const admin = await Admin.create({
                name: 'Super Admin',
                email,
                password
            });
            console.log('Admin created');
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedAdmin();
