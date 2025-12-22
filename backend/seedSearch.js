const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Hospital = require('./models/Hospital');
const Clinic = require('./models/Clinic');
const Specialty = require('./models/Specialty');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const seedData = async () => {
    try {
        // Clear existing (optional, maybe safe check first)
        // await Hospital.deleteMany({});
        // await Clinic.deleteMany({});
        // await Specialty.deleteMany({});

        const specialtyCount = await Specialty.countDocuments();
        if (specialtyCount === 0) {
            console.log("Seeding Specialties...");
            await Specialty.insertMany([
                { name: "Dermatologist", keywords: ["skin", "hair", "acne"] },
                { name: "Cardiologist", keywords: ["heart", "bp", "cardio"] },
                { name: "General Physician", keywords: ["fever", "flu", "cold"] },
                { name: "Gynecologist", keywords: ["pregnancy", "period", "women"] },
                { name: "Orthopedic", keywords: ["bone", "joint", "fracture"] }
            ]);
        }

        const hospitalCount = await Hospital.countDocuments();
        if (hospitalCount === 0) {
            console.log("Seeding Hospitals...");
            await Hospital.insertMany([
                { name: "Apollo Hospital", type: "Multispeciality", address: { city: "Bangalore", area: "Bannerghatta" } },
                { name: "Manipal Hospital", type: "General", address: { city: "Bangalore", area: "Old Airport Road" } },
                { name: "Fortis Hospital", type: "Speciality", address: { city: "Mumbai", area: "Mulund" } }
            ]);
        }

        const clinicCount = await Clinic.countDocuments();
        if (clinicCount === 0) {
            console.log("Seeding Clinics...");
            await Clinic.insertMany([
                { name: "HealthPlus Clinic", address: { city: "Mumbai", area: "Andheri East" } },
                { name: "Skin Care Centre", address: { city: "Bangalore", area: "Koramangala" } }
            ]);
        }

        console.log("Search Data Seeded Successfully");
        process.exit();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedData();
