"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import axios from 'axios';

const SearchPlaces = ({ onPlaceSelect }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce search input
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                try {
                    const res = await axios.get(`/api/maps/places/autocomplete?input=${encodeURIComponent(query)}`);
                    setSuggestions(res.data.predictions || []);
                    setShowSuggestions(true);
                } catch (error) {
                    console.error("Autocomplete Error:", error);
                    setSuggestions([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    // Close suggestions on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = async (placeId, description) => {
        setQuery(description);
        setShowSuggestions(false);
        setLoading(true);

        try {
            // Fetch Details via Backend Proxy
            const res = await axios.get(`/api/maps/places/details?placeId=${placeId}`);
            const result = res.data.result;

            if (result) {
                const lat = result.geometry.location.lat;
                const lng = result.geometry.location.lng;

                onPlaceSelect({
                    placeId: placeId,
                    lat: lat,
                    lng: lng,
                    displayName: result.name || description.split(',')[0],
                    fullAddress: result.formatted_address,
                    addressComponents: result.address_components
                });
            }
        } catch (error) {
            console.error("Place Details Error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full relative z-50" ref={wrapperRef}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length > 2 && setShowSuggestions(true)}
                    placeholder="Search for area, street name..."
                    className="w-full pl-10 pr-10 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
                />
                {query && (
                    <button
                        onClick={() => { setQuery(''); setSuggestions([]); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto divide-y divide-slate-50">
                    {suggestions.map((place) => (
                        <button
                            key={place.place_id}
                            onClick={() => handleSelect(place.place_id, place.description)}
                            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                        >
                            <MapPin className="w-5 h-5 text-slate-400 mt-0.5 group-hover:text-blue-500 transition-colors" />
                            <div>
                                <p className="text-sm font-medium text-slate-700 group-hover:text-blue-600">
                                    {place.structured_formatting?.main_text || place.description.split(',')[0]}
                                </p>
                                <p className="text-xs text-slate-500 truncate max-w-[280px]">
                                    {place.structured_formatting?.secondary_text || place.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchPlaces;
