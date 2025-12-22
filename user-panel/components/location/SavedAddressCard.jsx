"use client";

import React from 'react';
import { MapPin, Home, Briefcase, Trash2, Edit2 } from 'lucide-react';

const SavedAddressCard = ({ address, onSelect, onDelete, onEdit }) => {

    const getIcon = (label) => {
        switch (label) {
            case 'Home': return <Home size={16} className="text-blue-600" />;
            case 'Work': return <Briefcase size={16} className="text-purple-600" />;
            default: return <MapPin size={16} className="text-slate-600" />;
        }
    };

    const getBgColor = (label) => {
        switch (label) {
            case 'Home': return 'bg-blue-50 group-hover:bg-blue-100';
            case 'Work': return 'bg-purple-50 group-hover:bg-purple-100';
            default: return 'bg-slate-50 group-hover:bg-slate-100';
        }
    };

    return (
        <div
            onClick={() => onSelect && onSelect(address)}
            className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm bg-white cursor-pointer transition-all group relative animate-fadeIn"
        >
            {/* Icon */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${getBgColor(address.label)}`}>
                {getIcon(address.label)}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-slate-800 text-sm">{address.label}</h4>
                    {address.landmark && (
                        <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium truncate max-w-[100px]">
                            {address.landmark}
                        </span>
                    )}
                </div>
                <p className="text-xs text-slate-500 leading-snug truncate">
                    {address.fullAddress}
                </p>
            </div>

            {/* Actions (Visible on hover or if explicitly enabled) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onEdit(address); }}
                        className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit Address"
                    >
                        <Edit2 size={14} />
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onDelete(address); }}
                        className="p-2 hover:bg-red-50 rounded-full text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete Address"
                    >
                        <Trash2 size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default SavedAddressCard;
