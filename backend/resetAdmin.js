const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');
const connectDB = require('./config/db');

dotenv.config({ path: './backend/.env' });
connectDB();

const resetAdmin = async () => {
    try {
        const email = 'admin@sehatnxt.com';
        const password = 'admin'; // Simple password

        let admin = await Admin.findOne({ email });
        if (admin) {
            admin.password = password; // Pre-save hook will hash it
            await admin.save();
            console.log("Admin password reset to: admin");
        } else {
            await Admin.create({
                name: 'Super Admin',
                email,
                password,
                role: 'admin'
            });
            console.log("Admin created with password: admin");
        }
        process.exit();
    } catch (error) {
        console.error("Error", error);
        process.exit(1);
    }
};

resetAdmin();
