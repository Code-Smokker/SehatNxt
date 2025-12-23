const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            // console.log("Middleware received token:", token.substring(0, 10) + "..."); 
            console.log("Backend Verifying using Secret:", process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 5) + "..." : "MISSING");
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Token Decoded ID:", decoded.id);

            // Try to find user first, then doctor
            req.user = await User.findById(decoded.id).select('-password');
            if (req.user) console.log("User Found:", req.user._id);

            if (!req.user) {
                req.doctor = await Doctor.findById(decoded.id).select('-password');
                if (req.doctor) console.log("Doctor Found:", req.doctor._id);
            }

            if (!req.user && !req.doctor) {
                console.log("No User or Doctor found for ID:", decoded.id);
                throw new Error('Not authorized - User/Doctor not found');
            }

            next();
        } catch (error) {
            console.error("Auth Middleware Error:", error.message);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
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
