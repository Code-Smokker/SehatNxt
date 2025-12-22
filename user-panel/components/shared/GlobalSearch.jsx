"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight, Stethoscope, Building2, MapPin, Activity, Loader2 } from "lucide-react";

const GlobalSearch = () => {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef(null);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length >= 2) {
                performSearch(query);
            } else {
                setResults(null);
                setLoading(false);
            }
        }, 300); // 300ms debounce

        return () => clearTimeout(timer);
    }, [query]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const performSearch = async (text) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(text)}`);
            if (res.ok) {
                const data = await res.json();

                const hasResults =
                    data.doctors.length > 0 ||
                    data.hospitals.length > 0 ||
                    data.clinics.length > 0 ||
                    data.specialties.length > 0;

                if (hasResults) {
                    setResults(data);
                    setIsOpen(true);
                } else {
                    setResults(null);
                }
            }
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (type, item) => {
        setIsOpen(false);
        setQuery("");

        switch (type) {
            case 'doctor':
                router.push(`/doctor/${item._id}`);
                break;
            case 'hospital':
                router.push(`/hospital/${item._id}`);
                break;
            case 'clinic':
                router.push(`/clinic/${item._id}`);
                break;
            case 'specialty':
                router.push(`/doctors?specialty=${item.name}`);
                break;
            default:
                break;
        }
    };

    return (
        <div ref={searchRef} className="relative w-full z-50">
            {/* Input Field */}
            <div className="bg-white w-full rounded-2xl px-4 py-3.5 border border-blue-100 flex items-center gap-3 shadow-lg shadow-blue-900/5 focus-within:ring-4 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-300">
                <Search size={20} className="text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen && e.target.value.length >= 2) setIsOpen(true);
                        if (e.target.value.length >= 2) setLoading(true); // Show loading immediately on type
                    }}
                    onFocus={() => {
                        if (query.length >= 2 && results) setIsOpen(true);
                    }}
                    placeholder="Search doctors, clinics, specialties..."
                    className="flex-1 text-slate-700 focus:outline-none text-sm font-medium placeholder-slate-400 bg-transparent"
                />

                {loading ? (
                    <Loader2 size={16} className="text-blue-500 animate-spin" />
                ) : query && (
                    <button onClick={() => { setQuery(""); setResults(null); setIsOpen(false); }} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (results || loading) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden max-h-[70vh] overflow-y-auto animate-slideDown">

                    {loading && !results && (
                        <div className="p-4 text-center text-slate-400 text-sm">Searching...</div>
                    )}

                    {!loading && results && (
                        <>
                            {/* Specialties */}
                            {results.specialties.length > 0 && (
                                <div className="p-2 border-b border-slate-50">
                                    <h4 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Specialties</h4>
                                    {results.specialties.map(s => (
                                        <div
                                            key={s._id}
                                            onClick={() => handleSelect('specialty', s)}
                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer group"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                <Stethoscope size={14} />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                                            <ChevronRight size={14} className="ml-auto text-slate-300" />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Doctors */}
                            {results.doctors.length > 0 && (
                                <div className="p-2 border-b border-slate-50">
                                    <h4 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Doctors</h4>
                                    {results.doctors.map(d => (
                                        <div
                                            key={d._id}
                                            onClick={() => handleSelect('doctor', d)}
                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer"
                                        >
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                                <img
                                                    src={d.image || "/default-avatar.png"}
                                                    alt={d.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => e.target.src = "/default-avatar.png"}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 leading-tight">{d.name}</p>
                                                <p className="text-xs text-slate-500">{d.speciality} • {d.experience}y exp</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Hospitals */}
                            {results.hospitals.length > 0 && (
                                <div className="p-2 border-b border-slate-50">
                                    <h4 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Hospitals</h4>
                                    {results.hospitals.map(h => (
                                        <div
                                            key={h._id}
                                            onClick={() => handleSelect('hospital', h)}
                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                                <Building2 size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 leading-tight">{h.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{h.address?.city || ""}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Clinics */}
                            {results.clinics.length > 0 && (
                                <div className="p-2">
                                    <h4 className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Clinics</h4>
                                    {results.clinics.map(c => (
                                        <div
                                            key={c._id}
                                            onClick={() => handleSelect('clinic', c)}
                                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 rounded-xl cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                                                <Activity size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 leading-tight">{c.name}</p>
                                                <p className="text-xs text-slate-500 truncate">{c.address?.city || ""}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Footer */}
                            <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">See all results for "{query}"</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
