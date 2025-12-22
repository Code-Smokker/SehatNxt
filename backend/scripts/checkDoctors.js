const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('../models/Doctor');

dotenv.config();

const checkDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const count = await Doctor.countDocuments();
        console.log(`Total Doctors: ${count}`);

        const activeDocs = await Doctor.find({ isActive: true }).select('name speciality isActive');
        console.log("Active Doctors:", activeDocs);

        process.exit();
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
};

checkDoctors();
