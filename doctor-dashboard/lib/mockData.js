export const MOCK_DATA = {
    dashboardStats: [
        { title: "Today's Appointments", value: "12", trend: "+4%", isPositive: true, icon: "Calendar" },
        { title: "Total Patients", value: "1,284", trend: "+12%", isPositive: true, icon: "Users" },
        { title: "Pending Requests", value: "5", trend: "-2%", isPositive: false, icon: "Clock" },
        { title: "Total Earnings", value: "₹45,200", trend: "+8%", isPositive: true, icon: "Wallet" },
    ],
    appointments: [
        { id: 1, patient: "Rahul Sharma", type: "General Checkup", time: "10:30 AM", mode: "Video Consult", status: "Upcoming", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, patient: "Priya Singh", type: "Follow up", time: "12:00 PM", mode: "In-Clinic", status: "Upcoming", image: "https://randomuser.me/api/portraits/women/44.jpg" },
        { id: 3, patient: "Amit Verma", type: "Consultation", time: "02:15 PM", mode: "Video Consult", status: "Pending", image: "https://randomuser.me/api/portraits/men/85.jpg" },
    ],
    recentActivity: [
        { id: 1, title: "New Appointment Booked", desc: "Priya Singh booked a slot for 12:00 PM", time: "2 mins ago" },
        { id: 2, title: "Lab Report Uploaded", desc: "Rahul Sharma uploaded blood test report", time: "15 mins ago" },
        { id: 3, title: "Payment Received", desc: "Received ₹500 from Amit Verma", time: "1 hour ago" },
    ],
    patients: [
        { id: 1, name: "Rahul Sharma", age: 28, gender: "Male", condition: "Fever", lastVisit: "2 days ago", image: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, name: "Priya Singh", age: 24, gender: "Female", condition: "Migraine", lastVisit: "1 week ago", image: "https://randomuser.me/api/portraits/women/44.jpg" },
        { id: 3, name: "Amit Verma", age: 45, gender: "Male", condition: "Diabetes", lastVisit: "3 days ago", image: "https://randomuser.me/api/portraits/men/85.jpg" },
    ],
    feedbacks: [
        { id: 1, patient: "Sita Verma", rating: 5, comment: "Very patient and understanding doctor.", time: "1 day ago", image: "https://randomuser.me/api/portraits/women/65.jpg" },
        { id: 2, patient: "Rajesh Kumar", rating: 4, comment: "Good treatment but wait time was long.", time: "2 days ago", image: "https://randomuser.me/api/portraits/men/22.jpg" },
    ]
};
