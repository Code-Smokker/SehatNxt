export const APP_NAME = "SehatNxt Doctor";

export const MENU_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Appointments", href: "/appointments", icon: "CalendarCheck" },
    { label: "Patients", href: "/patients", icon: "Users" },
    { label: "Prescriptions", href: "/prescriptions", icon: "FileText" },
    { label: "Reviews", href: "/reviews", icon: "Star" },
    { label: "My Wallet", href: "/wallet", icon: "Wallet" }, // Added
    { label: "Earnings", href: "/earnings", icon: "Wallet" }, // Added Earnings
    { label: "Data Export", href: "/export", icon: "Download" }, // Added Data Export
    { label: "Settings", href: "/settings", icon: "Settings" }
];

export const MOCK_USER = {
    name: "Dr. Rahul Sharma",
    specialty: "Cardiologist",
    clinic: "Heart Care Clinic",
    image: "https://ui-avatars.com/api/?name=Rahul+Sharma&background=0D8ABC&color=fff",
    notifications: 3
};
