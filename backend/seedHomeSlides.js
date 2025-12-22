const mongoose = require('mongoose');
const dotenv = require('dotenv');
const HomeSlide = require('./models/HomeSlide');
const connectDB = require('./config/db');

dotenv.config({ path: './backend/.env' }); // try backend/.env or just .env if running from root
connectDB();

const seedSlides = async () => {
    try {
        const count = await HomeSlide.countDocuments();
        if (count === 0) {
            console.log("Seeding Home Slides...");
            const slides = [
                {
                    type: 'aqi',
                    title: 'Air Quality Index',
                    subtitle: 'Bangalore',
                    description: 'Good (45)',
                    order: 1,
                    image: '/icons/aqi.png',
                    isActive: true
                },
                {
                    type: 'referral',
                    title: 'Refer & Earn',
                    subtitle: 'Invite your friends',
                    description: 'Get ₹500 for every referral',
                    ctaText: 'Invite Now',
                    ctaLink: '/refer',
                    order: 2,
                    image: '/images/referral_banner.png',
                    isActive: true
                },
                {
                    type: 'health_tip',
                    title: 'Daily Health Tip',
                    subtitle: 'Hydration',
                    description: 'Drink at least 8 glasses of water daily to stay hydrated.',
                    ctaText: 'Read More',
                    order: 3,
                    isActive: true
                },
                {
                    type: 'marketing',
                    title: 'Full Body Checkup',
                    subtitle: 'Special Offer',
                    description: 'Get 50% off on all packages',
                    ctaText: 'Book Now',
                    ctaLink: '/packages',
                    order: 4,
                    image: 'https://img.freepik.com/free-vector/medical-healthcare-banner-design_1017-25916.jpg',
                    isActive: true
                },
                {
                    type: 'highlight',
                    title: 'Dr. Anjali Gupta',
                    subtitle: 'Top Gynecologist',
                    description: 'Specialist in high-risk pregnancies.',
                    ctaText: 'View Profile',
                    ctaLink: '/doctor/d5',
                    order: 5,
                    image: '/doctor.png',
                    isActive: true
                }
            ];
            await HomeSlide.insertMany(slides);
            console.log("Slides Seeded!");
        } else {
            console.log("Slides already exist.");
        }
        process.exit();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedSlides();
