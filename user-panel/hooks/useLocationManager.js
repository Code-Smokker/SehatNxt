"use client";

import { useState, useCallback, useEffect } from 'react';
import { useLocation } from '@/context/LocationContext';
import { reverseGeocode } from '@/utils/geocode';
import { getAirQuality } from '@/utils/getAQI';
import { getMapsImport } from '@/utils/googleMaps';

export const useLocationManager = () => {
    const {
        selectedLocation,
        setSelectedLocation,
        savedAddresses,
        refreshAddresses,
        deleteAddress
    } = useLocation();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial Load: Check if Maps API works, or use Mock
    useEffect(() => {
        // Optional: Preload libraries
        getMapsImport("places").catch(err => console.error("Maps Load Error", err));
    }, []);

    const getCurrentLocation = useCallback(async () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            setLoading(false);
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude } = position.coords;

            // Reverse Geocode
            const addressData = await reverseGeocode(latitude, longitude);

            // AQI
            const aqiData = await getAirQuality(latitude, longitude);

            if (addressData) {
                const locationData = {
                    lat: latitude,
                    lng: longitude,
                    fullAddress: addressData.address,
                    placeId: addressData.placeId,
                    displayName: addressData.address.split(',')[0],
                    aqi: aqiData,
                    label: "Current Location"
                };
                return locationData;
            } else {
                throw new Error("Could not fetch address details.");
            }

        } catch (err) {
            console.error("GPS Error:", err);
            setError(err.message || "Failed to get location");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const saveAddress = async (addressData) => {
        setLoading(true);
        try {
            const res = await fetch('/api/address', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(addressData)
            });
            if (!res.ok) throw new Error("Failed to save address");
            await refreshAddresses();
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        selectedLocation,
        setSelectedLocation,
        savedAddresses,
        refreshAddresses, // Make sure this is exposed
        deleteAddress,
        getCurrentLocation,
        saveAddress,
        loading,
        error
    };
};
