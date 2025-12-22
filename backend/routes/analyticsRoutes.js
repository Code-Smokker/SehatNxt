const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// Get Doctor Earnings & Analytics
router.get('/doctor/:doctorId', async (req, res) => {
    try {
        const { doctorId } = req.params;
        const period = req.query.period || 'monthly'; // daily, weekly, monthly

        // 1. Summary Cards Data
        // Total Earnings (All time)
        const totalEarningsAgg = await Appointment.aggregate([
            { $match: { doctorId: new mongoose.Types.ObjectId(doctorId), status: 'completed' } },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);

        const totalRevenue = totalEarningsAgg[0]?.total || 0;
        const totalCompleted = totalEarningsAgg[0]?.count || 0;
        const avgFee = totalCompleted > 0 ? Math.round(totalRevenue / totalCompleted) : 0;

        // Current Month Earnings
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const monthEarningsAgg = await Appointment.aggregate([
            {
                $match: {
                    doctorId: new mongoose.Types.ObjectId(doctorId),
                    status: 'completed',
                    date: { $gte: startOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }
        ]);

        const monthRevenue = monthEarningsAgg[0]?.total || 0;
        const monthPatients = monthEarningsAgg[0]?.count || 0;

        // 2. Graph Data (Revenue Trend & Patient Count)
        // Group by Month (for now, simplistic) or Day based on switch?
        // Let's do Monthly for the last 6 months default
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const graphAgg = await Appointment.aggregate([
            {
                $match: {
                    doctorId: new mongoose.Types.ObjectId(doctorId),
                    status: 'completed',
                    date: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                    },
                    earnings: { $sum: "$amount" },
                    patients: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        // Format graph data for Recharts (e.g., "Jan", "Feb")
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const graphData = graphAgg.map(item => ({
            name: monthNames[item._id.month - 1],
            earnings: item.earnings,
            patients: item.patients
        }));

        // Fill missing months if needed (optional polish)

        // 3. Recent Transactions
        const recentTransactions = await Appointment.find({
            doctorId,
            status: 'completed'
        })
            .sort({ date: -1 })
            .limit(5)
            .populate('patientId', 'name')
            .select('tokenNumber amount type date patientId');

        res.json({
            summary: {
                totalRevenue,
                monthRevenue,
                avgFee,
                totalCompleted,
                monthPatients
            },
            graphData,
            recentTransactions
        });

    } catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
