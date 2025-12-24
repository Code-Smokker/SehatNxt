const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config({ path: '.env' });

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('MongoDB Connected');

        const adminEmail = "admin@sehatnxt.com";
        const adminPassword = "adminpassword123";

        // Always clear existing admin to ensure fresh seed
        await User.deleteOne({ email: adminEmail });
        console.log('Cleared existing admin user.');

        const newAdmin = new User({
            name: "Super Admin",
            email: adminEmail,
            password: adminPassword, // Pass plain text, model pre-save hook will hash it
            role: "admin",
            phone: "0000000000" // Dummy phone for schema validation
        });

        await newAdmin.save();
        console.log('Admin User Created Successfully');
        console.log('Email:', adminEmail);
        console.log('Password:', adminPassword);
        process.exit();

    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
