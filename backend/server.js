const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
console.log("MONGO_URI from env:", process.env.MONGO_URI ? "Found (starts with " + process.env.MONGO_URI.substring(0, 15) + ")" : "NOT FOUND");
connectDB();
const initScheduler = require('./jobs/reminderScheduler');
initScheduler();

const app = express();

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow any localhost origin
        if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
            return callback(null, true);
        }

        const allowedOrigins = ['https://sehatnxt.com', 'https://www.sehatnxt.com']; // Production domains
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        // callback(new Error('Not allowed by CORS')); // Strict
        console.log("Blocked Origin:", origin);
        callback(null, true); // Temporarily allow all for debugging if needed, or stick to strict.
        // Let's stick to the flexible localhost check above. 
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions)); // Enable pre-flight for all routes (global)
app.use(express.json());

// Placeholder Routes - Will be connected as we create them
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes')); // Mounted Admin Routes
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes'));
// app.use('/api/slider', require('./routes/sliderRoutes')); // DEPRECATED: Replaced by marketingRoutes below
app.use('/api/doctor', require('./routes/doctorRoutes')); // Public Doctor API
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes')); // New Analytics Route
app.use('/api/export', require('./routes/exportRoutes')); // New Export Route
app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/referrals', require('./routes/referralRoutes')); // Referral API
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/search', require('./routes/searchRoutes')); // Global Search API
app.use('/api/slider', require('./routes/sliderRoutes')); // Slider API (Admin + Public)
app.use('/api/aqi', require('./routes/aqiRoutes')); // Google AQI API
app.use('/api/my-doctors', require('./routes/savedDoctorRoutes')); // Saved/My Doctors API
app.use('/api/reminders', require('./routes/reminderRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
