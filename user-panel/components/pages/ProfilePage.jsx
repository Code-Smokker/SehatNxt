"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    User,
    Activity,
    Heart,
    Save,
    Loader2,
    LogOut,
    Edit2,
    MapPin
} from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/actions/user";
import { logout } from "@/actions/auth";

const ProfilePage = () => {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("personal");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [locLoading, setLocLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        name: "",
        phone: "",
        email: "",
        gender: "",
        dob: "",
        bloodGroup: "",
        maritalStatus: "",
        height: "",
        weight: "",
        emergencyContact: "",
        location: "",
        allergies: "",
        currentMedicine: "",
        pastMedicine: "",
        chronicDiseases: "",
        injuries: "",
        surgeries: "",
        smoking: "",
        alcohol: "",
        activityLevel: "",
        foodPreference: "",
        occupation: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const data = await getUserProfile();
                if (data) {
                    // Start with defaults, override with DB data (ignoring nulls from DB if any)
                    setProfileData(prev => ({
                        ...prev,
                        ...Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== null && v !== undefined))
                    }));
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);
    const handleChange = (key, value) => {
        setProfileData(prev => ({ ...prev, [key]: value }));
    };

    const calculateCompletion = (data) => {
        const totalFields = Object.keys(data).length;
        const filledFields = Object.values(data).filter(val => val && val.toString().trim() !== "").length;
        return Math.round((filledFields / totalFields) * 100);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await updateUserProfile(profileData);

            if (res?.success && res.user) {
                // 1. Rehydrate state from backend (Source of Truth)
                setProfileData(prev => ({ ...prev, ...res.user }));

                // 2. Sync with Sidebar via LocalStorage
                const currentStorage = localStorage.getItem('sehat_user');
                if (currentStorage) {
                    try {
                        const parsed = JSON.parse(currentStorage);
                        // Calculate completion based on SERVER data
                        const completion = calculateCompletion(res.user);

                        const updatedUser = {
                            ...parsed,
                            name: res.user.name,
                            email: res.user.email,
                            phone: res.user.phone, // Ensure phone is synced
                            completion: completion
                        };
                        localStorage.setItem('sehat_user', JSON.stringify(updatedUser));

                        // Force update event
                        window.dispatchEvent(new Event("storage"));
                    } catch (e) {
                        console.error("Storage update error", e);
                    }
                }
                // Optional: Success Toast could go here
            }
        } catch (e) {
            console.error(e);
            alert("Failed to save profile");
        }
        setSaving(false);
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }
        setLocLoading(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                // Free reverse geocoding API (OpenStreetMap based)
                const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                const data = await res.json();

                const city = data.city || data.locality || "";
                const principalSubdivision = data.principalSubdivision || ""; // State
                const countryName = data.countryName || "";

                const locString = [city, principalSubdivision, countryName].filter(Boolean).join(", ");
                handleChange("location", locString);
            } catch (error) {
                console.error("Location Error:", error);
                alert("Failed to fetch location address");
            } finally {
                setLocLoading(false);
            }
        }, (error) => {
            console.error("Geo Error:", error);
            setLocLoading(false);
            alert("Unable to retrieve your location");
        });
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" />
            </div>
        );
    }

    const tabs = [
        { id: "personal", label: "Personal", icon: User },
        { id: "medical", label: "Medical", icon: Activity },
        { id: "lifestyle", label: "Lifestyle", icon: Heart }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-32">

            {/* Header */}
            <div className="sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center gap-3 shadow-sm">
                <button
                    onClick={() => router.push("/home")}
                    className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
                >
                    <ArrowLeft size={18} />
                </button>
                <h1 className="font-bold text-slate-900 text-lg">My Profile</h1>

                <div className="ml-auto flex items-center gap-2">
                    <button
                        onClick={logout}
                        className="text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 px-3 py-2 rounded-lg transition-colors"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>

            {/* Profile Card */}
            <div className="bg-white mx-4 mt-6 rounded-3xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-3xl font-extrabold shadow-sm border border-blue-100">
                        {profileData.name ? profileData.name.charAt(0).toUpperCase() : "P"}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">
                            {profileData.name || "Patient"}
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mt-1">{profileData.email || "No email provided"}</p>
                        <div className="inline-flex items-center gap-1.5 mt-2 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">Patient</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mx-4 mt-6 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all
              ${activeTab === tab.id
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : "text-slate-500 hover:bg-slate-50"
                            }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="mx-4 mt-6 space-y-6">
                {activeTab === "personal" && (
                    <Section title="Personal Information">
                        <Field label="Full Name" value={profileData.name} onChange={v => handleChange("name", v)} />
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Mobile Number" value={profileData.phone} onChange={() => { }} type="tel" disabled={true} placeholder="Registered Mobile" />
                            <Field label="Email Address" value={profileData.email} onChange={v => handleChange("email", v)} type="email" />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <Field label="Height (cm)" value={profileData.height} onChange={v => handleChange("height", v)} placeholder="e.g. 175" />
                            <Field label="Weight (kg)" value={profileData.weight} onChange={v => handleChange("weight", v)} placeholder="e.g. 70" />
                            <Field label="Emergency Contact" value={profileData.emergencyContact} onChange={v => handleChange("emergencyContact", v)} placeholder="Phone" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Gender" value={profileData.gender} onChange={v => handleChange("gender", v)} placeholder="e.g. Male" />
                            <Field label="Date of Birth" type="date" value={profileData.dob} onChange={v => handleChange("dob", v)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Blood Group" value={profileData.bloodGroup} onChange={v => handleChange("bloodGroup", v)} placeholder="e.g. O+" />
                            <Field label="Marital Status" value={profileData.maritalStatus} onChange={v => handleChange("maritalStatus", v)} placeholder="e.g. Single" />
                        </div>
                        <Field
                            label="Location"
                            value={profileData.location}
                            onChange={v => handleChange("location", v)}
                            action={
                                <button
                                    onClick={handleGetLocation}
                                    className="p-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                    title="Get Current Location"
                                >
                                    {locLoading ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />}
                                </button>
                            }
                        />
                    </Section>
                )}

                {activeTab === "medical" && (
                    <Section title="Medical History">
                        <Field label="Allergies" value={profileData.allergies} onChange={v => handleChange("allergies", v)} placeholder="e.g. Peanuts, Penicillin" />
                        <Field label="Current Medication" value={profileData.currentMedicine} onChange={v => handleChange("currentMedicine", v)} placeholder="e.g. Paracetamol" />
                        <Field label="Chronic Conditions" value={profileData.chronicDiseases} onChange={v => handleChange("chronicDiseases", v)} placeholder="e.g. Diabetes" />
                        <Field label="Surgeries" value={profileData.surgeries} onChange={v => handleChange("surgeries", v)} placeholder="e.g. None" />
                    </Section>
                )}

                {activeTab === "lifestyle" && (
                    <Section title="Lifestyle">
                        <Field label="Smoking" value={profileData.smoking} onChange={v => handleChange("smoking", v)} placeholder="e.g. Never" />
                        <Field label="Alcohol" value={profileData.alcohol} onChange={v => handleChange("alcohol", v)} placeholder="e.g. Occasionally" />
                        <Field label="Activity Level" value={profileData.activityLevel} onChange={v => handleChange("activityLevel", v)} placeholder="e.g. Moderate" />
                        <Field label="Occupation" value={profileData.occupation} onChange={v => handleChange("occupation", v)} placeholder="e.g. Software Engineer" />
                    </Section>
                )}
            </div>

            {/* Bottom Save Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-40">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
                <div className="w-full h-4"></div>{/* Safe Area Spacer */}
            </div>
        </div>
    );
};

// Extracted Components to fix focus issue
const Field = ({ label, value, onChange, type = "text", placeholder, action, disabled = false }) => (
    <div className="flex flex-col gap-1.5 w-full">
        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">{label}</label>
        <div className="relative flex items-center">
            <input
                type={type}
                value={value || ""}
                onChange={e => onChange(e.target.value)}
                placeholder={placeholder || `Enter ${label}`}
                disabled={disabled}
                className={`w-full rounded-xl border px-4 py-3 text-sm font-bold transition-all focus:outline-none focus:ring-2
                    ${disabled
                        ? "bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed"
                        : "bg-white text-slate-900 border-slate-300 placeholder:text-slate-400 focus:border-blue-600 focus:ring-blue-50"
                    }`}
            />
            {action && (
                <div className="absolute right-2">
                    {action}
                </div>
            )}
        </div>
    </div>
);

const Section = ({ title, children }) => (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-5">
        <h3 className="font-bold text-slate-800 text-lg border-b border-slate-50 pb-2">{title}</h3>
        {children}
    </div>
);

export default ProfilePage;
