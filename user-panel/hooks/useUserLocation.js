"use client";

import { useState, useEffect } from "react";

// In Next.js, env vars prefixed with NEXT_PUBLIC_ are available on the client
// const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY; // REMOVED: Using Backend Proxy

export const useUserLocation = () => {
    const [location, setLocation] = useState(null); // { lat, lng, address, label? }
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Initial Load
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("userLocation");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setLocation(parsed);
                } catch (e) {
                    console.error("Failed to parse location", e);
                }
            }
            setLoading(false);
        }
    }, []);

    // Helper: Reverse Geocode (Lat/Lng -> Address) via Backend Proxy
    const getAddressFromCoords = async (lat, lng) => {
        try {
            const res = await fetch(`/api/maps/geocode?lat=${lat}&lng=${lng}`);
            const data = await res.json();

            if (data.success && data.address) {
                return data.address;
            }
        } catch (err) {
            console.error("Geocoding failed:", err);
        }
        return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    };

    // 1. Detect Current Location
    const detectLocation = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                // Fetch Address
                const readableAddress = await getAddressFromCoords(latitude, longitude);

                const newLocation = {
                    lat: latitude,
                    lng: longitude,
                    address: readableAddress,
                    label: "Current Location"
                };

                updateLocationState(newLocation);
            },
            (err) => {
                console.error("Error detecting location:", err);
                setError("Unable to retrieve your location. Please enable GPS.");
                setLoading(false);
            }
        );
    };

    // 2. Set Manual Location (from Autocomplete or Saved List)
    const manualSetLocation = (lat, lng, address, label = "Selected Location") => {
        const newLocation = { lat, lng, address, label };
        updateLocationState(newLocation);
    };

    // Internal Updater
    const updateLocationState = (newLoc) => {
        setLocation(newLoc);
        setLoading(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem("userLocation", JSON.stringify(newLoc));
            // Event for other components (like Navbar) to listen to
            window.dispatchEvent(new Event("locationUpdated"));
        }
    };

    return {
        location,
        address: location?.address || "Select Location",
        coords: location ? { lat: location.lat, lng: location.lng } : null,
        loading,
        error,
        detectLocation,
        manualSetLocation
    };
};
