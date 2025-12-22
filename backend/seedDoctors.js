const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

// Temporary assets mock to avoid complex import issues with CommonJS vs ES Modules if assets is in frontend
// We will manually replicate the array structure here for stability as requested in plan.
const seedDoctors = [
    {
        name: 'Dr. Richard James',
        image: '/doc1.png',
        speciality: 'General physician',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. James has a strong commitment to delivering comprehensive medical care.',
        fees: 50,
        address: {
            line1: '17th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Emily Larson',
        image: '/doc2.png',
        speciality: 'Gynecologist',
        degree: 'MBBS',
        experience: '3 Years',
        about: 'Dr. Larson focuses on preventive medicine and women\'s health.',
        fees: 60,
        address: {
            line1: '27th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Sarah Patel',
        image: '/doc3.png',
        speciality: 'Dermatologist',
        degree: 'MBBS',
        experience: '1 Years',
        about: 'Dr. Patel is expert in skin care and dermatological procedures.',
        fees: 30,
        address: {
            line1: '37th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Christopher Lee',
        image: '/doc4.png',
        speciality: 'Pediatricians',
        degree: 'MBBS',
        experience: '2 Years',
        about: 'Dr. Lee loves working with children and ensuring their well-being.',
        fees: 40,
        address: {
            line1: '47th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    },
    {
        name: 'Dr. Jennifer Garcia',
        image: '/doc5.png',
        speciality: 'Neurologist',
        degree: 'MBBS',
        experience: '4 Years',
        about: 'Dr. Garcia specializes in neurological disorders and treatments.',
        fees: 50,
        address: {
            line1: '57th Cross, Richmond',
            line2: 'Circle, Ring Road, London'
        }
    }
    // Added top 5 for demo. In production full list would be here.
];

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for Seeding');

        // Always clear to ensure fresh production data
        await Doctor.deleteMany({});
        console.log('Cleared existing doctors.');

        const doctorsWithAuth = seedDoctors.map(doc => ({
            ...doc,
            email: `${doc.name.replace(/\s+/g, '').toLowerCase()}@sehatnxt.com`,
            password: 'password123', // Default password
            phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`, // Random 10 digit
            available: true,
            isActive: true,
            isProfileComplete: true
        }));

        await Doctor.insertMany(doctorsWithAuth);
        console.log('Doctors Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedDB();
