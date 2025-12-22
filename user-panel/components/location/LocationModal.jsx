"use client";

import React, { useState, useEffect } from "react";
import { X, MapPin, Search, Navigation, Clock, ChevronRight } from "lucide-react";
import GooglePlaceSearch from "./GooglePlaceSearch";
import AddAddressForm from "./AddAddressForm";
import SavedAddressCard from "./SavedAddressCard";
import { useLocation } from "@/context/LocationContext";
import { getGoogleLib } from "@/utils/googleMaps";

// 🌍 Configuration
const ENABLE_GOOGLE_PLACES = false; // Feature flag: Default to manual search

// 🏙️ Static Data (Fallback Source)
const POPULAR_CITIES = [
    "Bangalore, Karnataka",
    "Mumbai, Maharashtra",
    "Delhi, NCR",
    "Pune, Maharashtra",
    "Hyderabad, Telangana",
    "Chennai, Tamil Nadu",
    "Indore, Madhya Pradesh",
    "Ahmedabad, Gujarat",
    "Gurgaon, Haryana",
    "Noida, Uttar Pradesh",
    "Kolkata, West Bengal",
    "Jaipur, Rajasthan",
    "Lucknow, Uttar Pradesh",
    "Chandigarh",
    "Bhopal, Madhya Pradesh",
    "Nagpur, Maharashtra",
    "Andheri East, Mumbai",
    "Whitefield, Bangalore",
    "HSR Layout, Bangalore",
    "Koramangala, Bangalore",
    "Baner, Pune",
    "Viman Nagar, Pune"
];

const LocationModal = ({ isOpen, onClose }) => {
    const {
        savedAddresses,
        selectAddress: contextSelectAddress, // Aliased in context
        deleteAddress
    } = useLocation();

    // Steps: 'search' | 'confirm'
    const [step, setStep] = useState('search');
    const [searchText, setSearchText] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [selectedPlace, setSelectedPlace] = useState(null); // { lat, lng, fullAddress, placeId }
    const [isDetecting, setIsDetecting] = useState(false);

    // --- 🟢 INIT & EFFECTS ---

    // Reset on open & Load Recent
    useEffect(() => {
        if (isOpen) {
            setStep('search');
            setSearchText("");
            setSelectedPlace(null);
            // Load recent
            try {
                const saved = localStorage.getItem("recent_searches");
                if (saved) setRecentSearches(JSON.parse(saved));
            } catch (e) { console.error(e); }
        }
    }, [isOpen]);

    // Filter Logic for Manual Mode
    useEffect(() => {
        if (!ENABLE_GOOGLE_PLACES) {
            if (!searchText.trim()) {
                setSuggestions([]);
                return;
            }
            const query = searchText.toLowerCase();
            const matches = POPULAR_CITIES.filter(city =>
                city.toLowerCase().includes(query)
            );
            setSuggestions(matches);
        }
    }, [searchText]);


    // --- 🎮 HANDLERS ---

    const handlePlaceSelect = (place) => {
        // Save to recent
        addToRecent(place);
        setSelectedPlace(place);
        setStep('confirm');
    };

    const handleManualSelect = (cityName) => {
        const place = {
            lat: 0, // Mock or approximate
            lng: 0,
            fullAddress: cityName,
            placeId: `manual-${Date.now()}`
        };
        handlePlaceSelect(place);
    };

    const addToRecent = (place) => {
        const newItem = {
            fullAddress: place.fullAddress || place.name,
            placeId: place.placeId || Date.now()
        };
        const updated = [newItem, ...recentSearches.filter(i => i.fullAddress !== newItem.fullAddress)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem("recent_searches", JSON.stringify(updated));
    };

    const handleUseCurrentLocation = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        setIsDetecting(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Try Reverse Geocode via our API Route
                    let address = "Current Location";
                    let placeName = "Your Location";

                    try {
                        const res = await fetch(`/api/maps/geocode?lat=${latitude}&lng=${longitude}`);
                        const data = await res.json();

                        if (data.success) {
                            address = data.fullAddress;
                            placeName = data.address; // The friendly "Area, City" format
                        } else {
                            // Fallback if API fails but raw coords work
                            address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                        }
                    } catch (err) {
                        console.warn("Geocoding failed, using fallback", err);
                        address = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    }

                    const placeData = {
                        lat: latitude,
                        lng: longitude,
                        fullAddress: address,
                        name: placeName, // Important for display
                        placeId: `gps-${Date.now()}`
                    };
                    handlePlaceSelect(placeData);

                } catch (error) {
                    console.error("GPS Error", error);
                    alert("Failed to detect location.");
                } finally {
                    setIsDetecting(false);
                }
            },
            () => {
                alert("Location access denied. Please search manually.");
                setIsDetecting(false);
            }
        );
    };

    const handleSavedAddressClick = (addr) => {
        if (contextSelectAddress) {
            contextSelectAddress(addr);
            onClose();
        }
    };

    const handleConfirmSuccess = () => {
        if (contextSelectAddress) {
            contextSelectAddress(selectedPlace);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full md:w-[480px] h-[85vh] md:h-[600px] bg-white rounded-t-3xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-slideUp">

                {/* --- HEADER --- */}
                <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                    <h2 className="text-lg font-bold text-slate-800">
                        {step === 'search' ? 'Select Location' : 'Confirm Location'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                {/* --- BODY --- */}
                <div className="flex-1 overflow-y-auto bg-slate-50/50">

                    {step === 'search' && (
                        <div className="p-5 space-y-6">

                            {/* 1. SEARCH INPUT */}
                            <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 transition-all flex items-center">
                                <Search size={20} className="text-slate-400 ml-3" />
                                {ENABLE_GOOGLE_PLACES ? (
                                    <GooglePlaceSearch onPlaceSelect={handlePlaceSelect} />
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Search for area, street name..."
                                        className="w-full p-3 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        autoFocus
                                    />
                                )}
                                {searchText && (
                                    <button onClick={() => setSearchText("")} className="p-2 text-slate-400 hover:text-slate-600">
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* 2. GPS BUTTON */}
                            <button
                                onClick={handleUseCurrentLocation}
                                disabled={isDetecting}
                                className="w-full flex items-center gap-4 p-0 hover:bg-white rounded-xl transition-all group"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                                    <Navigation size={18} className={isDetecting ? "animate-spin" : "fill-current"} />
                                </div>
                                <div className="text-left">
                                    <p className="text-blue-700 font-bold text-sm">Use Current Location</p>
                                    <p className="text-xs text-slate-500 font-medium">{isDetecting ? "Detecting..." : "Using GPS"}</p>
                                </div>
                            </button>

                            {/* 3. SUGGESTIONS LIST (Manual Mode) */}
                            {!ENABLE_GOOGLE_PLACES && suggestions.length > 0 && (
                                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                                    {suggestions.map((city, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleManualSelect(city)}
                                            className="w-full text-left px-4 py-3.5 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex items-center gap-3"
                                        >
                                            <MapPin size={16} className="text-slate-400" />
                                            <span className="text-sm font-semibold text-slate-700">{city}</span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* 4. RECENT SEARCHES */}
                            {recentSearches.length > 0 && !searchText && (
                                <div className="">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Recent Searches</p>
                                    <div className="space-y-2">
                                        {recentSearches.map((item, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handlePlaceSelect(item)}
                                                className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 hover:border-blue-200 transition-all shadow-sm group"
                                            >
                                                <Clock size={16} className="text-slate-400 group-hover:text-blue-500" />
                                                <span className="text-sm font-medium text-slate-600 flex-1 text-left truncate">{item.fullAddress}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 5. SAVED ADDRESSES */}
                            {savedAddresses.length > 0 && !searchText && (
                                <div className="pt-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 pl-1">Saved Addresses</p>
                                    <div className="space-y-3">
                                        {savedAddresses.map((addr) => (
                                            <div key={addr._id}>
                                                <SavedAddressCard
                                                    address={addr}
                                                    onSelect={handleSavedAddressClick}
                                                    onDelete={async (a) => {
                                                        if (confirm('Delete this address?')) await deleteAddress(a._id);
                                                    }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    )}

                    {step === 'confirm' && selectedPlace && (
                        <div className="p-5">
                            <AddAddressForm
                                defaultLocation={selectedPlace}
                                onCancel={() => setStep('search')}
                                onSuccess={handleConfirmSuccess}
                            />
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default LocationModal;
