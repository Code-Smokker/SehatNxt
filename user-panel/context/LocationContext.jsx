"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    // Current Selected Location (Persisted)
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [loadingAddresses, setLoadingAddresses] = useState(false);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // Initial Load
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("selected_location");
            if (saved) {
                try {
                    setSelectedLocation(JSON.parse(saved));
                } catch (e) {
                    console.error("Error parsing saved location", e);
                }
            }
        }
        refreshAddresses();
    }, []);

    // Update LocalStorage when location changes
    useEffect(() => {
        if (selectedLocation && typeof window !== 'undefined') {
            localStorage.setItem("selected_location", JSON.stringify(selectedLocation));
        }
    }, [selectedLocation]);

    // Fetch Saved Addresses
    const refreshAddresses = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            if (!token || !userId) return; // Can't fetch without auth

            setLoadingAddresses(true);
            const res = await fetch(`http://localhost:8000/api/addresses/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setSavedAddresses(data);
            }
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        } finally {
            setLoadingAddresses(false);
        }
    };

    const deleteAddress = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://localhost:8000/api/addresses/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            refreshAddresses();
        } catch (error) {
            console.error("Delete failed", error);
        }
    }

    return (
        <LocationContext.Provider value={{
            selectedLocation, // { lat, lng, fullAddress, placeId, label, aqi? }
            setSelectedLocation,
            selectAddress: setSelectedLocation, // Alias for backwards compat / clarity
            savedAddresses,
            refreshAddresses,
            loadingAddresses,
            deleteAddress,
            // Modal Control
            isLocationModalOpen,
            openLocationModal: () => setIsLocationModalOpen(true),
            closeLocationModal: () => setIsLocationModalOpen(false)
        }}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => useContext(LocationContext);
