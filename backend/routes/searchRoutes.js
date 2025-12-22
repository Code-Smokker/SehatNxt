const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Clinic = require('../models/Clinic');
const Specialty = require('../models/Specialty');

router.get('/', async (req, res) => {
    try {
        const query = req.query.q || '';
        if (!query.trim() || query.length < 2) {
            return res.json({ doctors: [], hospitals: [], clinics: [], specialties: [] });
        }

        const regex = new RegExp(query, 'i'); // Case-insensitive regex

        // 👨‍⚕️ Search Doctors
        const doctorsPromise = Doctor.find({
            $or: [
                { name: regex },
                { speciality: regex },
                { degree: regex },
                { clinicName: regex }, // Added
                { 'address.city': regex },
                { 'address.area': regex }
            ]
        }).select('name speciality experience image address degree fees clinicName').limit(5);

        // 🏥 Search Hospitals
        const hospitalsPromise = Hospital.find({
            $or: [
                { name: regex },
                { services: regex }, // Added (assuming services is array of strings or string)
                { 'address.city': regex },
                { 'address.area': regex }
            ]
        }).select('name type address image services').limit(5);

        // 🏥 Search Clinics
        const clinicsPromise = Clinic.find({
            $or: [
                { name: regex },
                { specialties: regex }, // Added
                { 'address.city': regex },
                { 'address.area': regex }
            ]
        }).select('name address image specialties').limit(5);

        // 🩺 Search Specialties
        const specialtiesPromise = Specialty.find({
            $or: [
                { name: regex },
                { keywords: regex }
            ]
        }).select('name keywords image').limit(5);

        const [doctors, hospitals, clinics, specialties] = await Promise.all([
            doctorsPromise,
            hospitalsPromise,
            clinicsPromise,
            specialtiesPromise
        ]);

        res.json({
            doctors,
            hospitals,
            clinics,
            specialties
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ error: 'Search failed' });
    }
});

module.exports = router;
