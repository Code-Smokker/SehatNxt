"use client";

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import axios from 'axios';

const GooglePlaceSearch = ({ onPlaceSelect, placeholder = "Search for area, street name..." }) => {
    const [input, setInput] = useState("");
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            if (input.length > 2) {
                fetchPredictions(input);
            } else {
                setPredictions([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [input]);

    const fetchPredictions = async (text) => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/maps/places/autocomplete?input=${encodeURIComponent(text)}`);
            if (res.data.predictions) {
                setPredictions(res.data.predictions);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error("Autocomplete error", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = async (prediction) => {
        setInput(prediction.description);
        setShowSuggestions(false);

        try {
            // Fetch Details (Lat/Lng)
            const res = await axios.get(`/api/maps/places/details?placeId=${prediction.place_id}`);
            const result = res.data.result;

            if (result) {
                // Extract Place Name friendly
                const address = result.formatted_address;
                const name = result.name;

                const placeObj = {
                    lat: result.geometry.location.lat,
                    lng: result.geometry.location.lng,
                    fullAddress: address,
                    name: name,
                    placeId: result.place_id
                };

                onPlaceSelect(placeObj);
            }
        } catch (error) {
            console.error("Details error", error);
        }
    };

    return (
        <div className="w-full relative">
            <input
                type="text"
                placeholder={placeholder}
                className="w-full p-3 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    if (e.target.value === '') setShowSuggestions(false);
                }}
                onFocus={() => {
                    if (predictions.length > 0) setShowSuggestions(true);
                }}
            />

            {showSuggestions && predictions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b-2xl border-x border-b border-slate-100 z-50 max-h-60 overflow-y-auto">
                    {predictions.map((p) => (
                        <button
                            key={p.place_id}
                            className="w-full text-left p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-start gap-3 transition-colors"
                            onClick={() => handleSelect(p)}
                        >
                            <MapPin size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-slate-700 line-clamp-1">{p.structured_formatting?.main_text || p.description}</p>
                                <p className="text-xs text-slate-500 line-clamp-1">{p.structured_formatting?.secondary_text}</p>
                            </div>
                        </button>
                    ))}
                    <div className="p-2 text-center text-[10px] text-slate-300">
                        Powered by Google
                    </div>
                </div>
            )}
        </div>
    );
};

export default GooglePlaceSearch;
