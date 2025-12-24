const { clerkClient } = require('@clerk/clerk-sdk-node');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Verify Token using Clerk (Expects CLERK_SECRET_KEY in .env)
            const decoded = await clerkClient.verifyToken(token);

            // Sync Strategy: Fetch email from Clerk to map to MongoDB User/Doctor
            const clerkUser = await clerkClient.users.getUser(decoded.sub);
            const email = clerkUser.emailAddresses[0].emailAddress;

            // Try to find user first, then doctor
            req.user = await User.findOne({ email }).select('-password');

            if (!req.user) {
                req.doctor = await Doctor.findOne({ email }).select('-password');
            }

            if (!req.user && !req.doctor) {
                // Future: Auto-create logic could go here
                console.log("Clerk User validated but not found in MongoDB:", email);
                throw new Error('User/Doctor not linked in database');
            }

            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const protectAdmin = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check Admin Model
            const Admin = require('../models/Admin');
            req.admin = await Admin.findById(decoded.id).select('-password');

            if (!req.admin) {
                // Fallback: Check if User is admin
                const User = require('../models/User');
                const user = await User.findById(decoded.id);
                if (user && user.role === 'admin') {
                    req.admin = user; // Treat as admin
                } else {
                    throw new Error('Not authorized as admin');
                }
            }
            next();
        } catch (error) {
            console.error("Admin Auth Error:", error.message);
            res.status(401).json({ message: 'Not authorized as admin' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect, protectAdmin };
