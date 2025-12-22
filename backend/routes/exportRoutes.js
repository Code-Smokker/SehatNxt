const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User'); // Patients
const Appointment = require('../models/Appointment');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit-table');

// Export Data API
router.get('/download', async (req, res) => {
    try {
        const { doctorId, format, range } = req.query;
        const types = req.query.types ? req.query.types.split(',') : [];

        if (!doctorId || !format) return res.status(400).json({ message: "Missing required params" });

        // 1. Fetch Data based on filters
        const data = {};

        // Date Filter
        let dateFilter = {};
        if (range === 'last_30_days') {
            const d = new Date(); d.setDate(d.getDate() - 30);
            dateFilter = { createdAt: { $gte: d } };
        } else if (range === 'last_12_months') {
            const d = new Date(); d.setMonth(d.getMonth() - 12);
            dateFilter = { createdAt: { $gte: d } };
        }

        // Fetch Patients
        if (types.includes('patients')) {
            // Find patients linked to doctor OR with appointments
            // Simplified: linkedDoctorId or appointments
            // Re-using logic from patientRoutes roughly or simpler filter
            // For export, strict doctor filtering:
            data.patients = await User.find({
                role: 'patient',
                linkedDoctorId: doctorId,
                ...dateFilter
            }).select('-password');
        }

        // Fetch Appointments
        if (types.includes('appointments')) {
            const query = { doctorId, ...dateFilter };
            // Adjust date filter field for appointments if needed (usually 'date' or 'createdAt')
            if (dateFilter.createdAt) {
                query.date = dateFilter.createdAt;
                delete query.createdAt;
            }
            data.appointments = await Appointment.find(query).populate('patientId', 'name phone');
        }

        // Fetch Prescriptions (Mocking structure for now as Prescription model might differ, but assuming exists)
        if (types.includes('prescriptions')) {
            // Assuming Prescription model uses createdAt
            const Prescription = require('../models/Prescription'); // Try lazy require
            try {
                data.prescriptions = await Prescription.find({ doctorId, ...dateFilter }).populate('patientId', 'name');
            } catch (e) {
                data.prescriptions = []; // Model might not exist yet or error
            }
        }

        // Fetch Earnings
        if (types.includes('earnings')) {
            const query = { doctorId, status: 'completed', ...dateFilter };
            if (dateFilter.createdAt) {
                query.date = dateFilter.createdAt;
                delete query.createdAt;
            }
            data.earnings = await Appointment.find(query).select('amount date paymentMode patientId status');
        }

        // 2. Generate File
        if (format === 'excel') {
            const workbook = new ExcelJS.Workbook();

            // Sheet 1: Patients
            if (data.patients?.length) {
                const sheet = workbook.addWorksheet('Patients');
                sheet.columns = [
                    { header: 'ID', key: '_id', width: 25 },
                    { header: 'Name', key: 'name', width: 20 },
                    { header: 'Phone', key: 'phone', width: 15 },
                    { header: 'Age', key: 'age', width: 10 },
                    { header: 'Gender', key: 'gender', width: 10 },
                    { header: 'Created At', key: 'createdAt', width: 20 }
                ];
                data.patients.forEach(p => sheet.addRow(p));
            }

            // Sheet 2: Appointments
            if (data.appointments?.length) {
                const sheet = workbook.addWorksheet('Appointments');
                sheet.columns = [
                    { header: 'Date', key: 'date', width: 15 },
                    { header: 'Time', key: 'time', width: 10 },
                    { header: 'Patient', key: 'patientName', width: 20 },
                    { header: 'Type', key: 'type', width: 10 },
                    { header: 'Status', key: 'status', width: 10 },
                    { header: 'Amount', key: 'amount', width: 10 }
                ];
                data.appointments.forEach(a => sheet.addRow({
                    date: a.date,
                    time: a.time,
                    patientName: a.patientId?.name,
                    type: a.type,
                    status: a.status,
                    amount: a.amount
                }));
            }

            // Sheet 3: Earnings
            if (data.earnings?.length) {
                const sheet = workbook.addWorksheet('Earnings');
                sheet.columns = [
                    { header: 'Date', key: 'date', width: 15 },
                    { header: 'Amount', key: 'amount', width: 10 },
                    { header: 'Status', key: 'status', width: 10 }
                ];
                data.earnings.forEach(e => sheet.addRow(e));
            }

            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=clinic_data.xlsx');
            await workbook.xlsx.write(res);
            res.end();

        } else if (format === 'pdf') {
            const doc = new PDFDocument({ margin: 30, size: 'A4' });

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=clinic_report.pdf');
            doc.pipe(res);

            // Header
            doc.fontSize(20).text('Clinic Data Export', { align: 'center' });
            doc.fontSize(12).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'center' });
            doc.moveDown();

            // Patients Table
            if (data.patients?.length) {
                doc.addPage();
                doc.fontSize(16).text('Patients List', { underline: true });
                doc.moveDown();

                const table = {
                    title: "Patients",
                    headers: ["Name", "Phone", "Age", "Gender"],
                    rows: data.patients.map(p => [p.name, p.phone, p.age || '-', p.gender || '-'])
                };
                await doc.table(table);
            }

            // Appointments Table
            if (data.appointments?.length) {
                doc.addPage();
                doc.fontSize(16).text('Appointments History', { underline: true });
                doc.moveDown();

                const table = {
                    title: "Appointments",
                    headers: ["Date", "Time", "Patient", "Status"],
                    rows: data.appointments.map(a => [
                        new Date(a.date).toLocaleDateString(),
                        a.time,
                        a.patientId?.name || 'Unknown',
                        a.status
                    ])
                };
                await doc.table(table);
            }

            doc.end();
        } else {
            res.status(400).json({ message: "Invalid format" });
        }

    } catch (error) {
        console.error("Export Error:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
