"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, X } from "lucide-react";

const Footer = () => {
    const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy'

    return (
        <>
            <footer className="bg-white border-t border-slate-200 mt-16">
                <div className="max-w-6xl mx-auto px-6 py-12 grid gap-10 text-center">

                    {/* Brand */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-28 h-14">
                            <Image
                                src="/logo.png"
                                alt="SehatNxt – Digital Healthcare Platform"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <p className="text-sm text-slate-500 max-w-sm">
                            Book doctors, track health, and manage care — all in one place.
                        </p>
                    </div>

                    {/* Social */}
                    <div className="flex justify-center gap-4">
                        <SocialIcon><Facebook size={18} /></SocialIcon>
                        <SocialIcon><Instagram size={18} /></SocialIcon>
                        <SocialIcon><Linkedin size={18} /></SocialIcon>
                    </div>

                    {/* Legal */}
                    <div className="flex justify-center gap-6 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        <button
                            onClick={() => setActiveModal("terms")}
                            className="hover:text-blue-600 transition"
                        >
                            Terms
                        </button>
                        <button
                            onClick={() => setActiveModal("privacy")}
                            className="hover:text-blue-600 transition"
                        >
                            Privacy
                        </button>
                    </div>

                    {/* Copyright */}
                    <p className="text-xs text-slate-400">
                        © {new Date().getFullYear()} SehatNxt. All rights reserved.
                    </p>
                </div>
            </footer>

            {/* Modal */}
            {activeModal && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10"
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-5">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">
                                    {activeModal === "privacy" ? "Privacy Policy" : "Terms & Conditions"}
                                </h3>
                                <div className="h-1 w-10 bg-blue-600 rounded-full mt-2" />
                            </div>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="text-sm text-slate-600 leading-relaxed space-y-3 max-h-[55vh] overflow-y-auto">
                            {activeModal === "privacy" ? (
                                <>
                                    <p><strong>Data Protection:</strong> Your data is securely stored and never sold.</p>
                                    <p><strong>Usage:</strong> Used only to improve healthcare services.</p>
                                    <p><strong>Security:</strong> Industry-standard encryption is applied.</p>
                                </>
                            ) : (
                                <>
                                    <p><strong>Acceptance:</strong> Using SehatNxt means you agree to these terms.</p>
                                    <p><strong>Medical Disclaimer:</strong> Doctors provide independent advice.</p>
                                    <p><strong>Platform Role:</strong> We facilitate healthcare access.</p>
                                </>
                            )}
                        </div>

                        {/* CTA */}
                        <button
                            onClick={() => setActiveModal(null)}
                            className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition active:scale-95"
                        >
                            I Understand
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const SocialIcon = ({ children }) => (
    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition cursor-pointer">
        {children}
    </div>
);

export default Footer;
