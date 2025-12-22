"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, HelpCircle, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";

const HelpCenterPage = () => {
    const router = useRouter();

    const faqs = [
        { q: "How do I book an appointment?", a: "You can book an appointment by selecting a doctor and choosing a suitable date and time slot." },
        { q: "Is my medical data safe?", a: "Yes, SehatNxt uses end-to-end encryption to ensure your medical records are secure." },
        { q: "Can I cancel my booking?", a: "Yes, you can cancel your appointment from the 'Appointments' section up to 1 hour before the scheduled time." },
        { q: "What is Sehat Cash?", a: "Sehat Cash is our wallet system used for seamless payments and rewards." }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-50 px-4 py-3 border-b border-slate-100 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition text-slate-600"
                >
                    <ChevronLeft size={22} />
                </button>
                <h1 className="text-lg font-bold text-slate-800">Help Center</h1>
            </div>

            <div className="p-5 flex flex-col gap-8">

                {/* Hero Section */}
                <div className="text-center py-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                        <HelpCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">How can we help you?</h2>
                    <p className="text-sm text-slate-500 mt-2 max-w-xs mx-auto">
                        Find answers to common questions or reach out to our support team.
                    </p>
                </div>

                {/* Contact Options */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 text-center hover:border-blue-200 transition">
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
                            <MessageCircle size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">Chat with Us</h3>
                        <p className="text-[10px] text-slate-400">Available 24/7</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center gap-2 text-center hover:border-blue-200 transition">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Mail size={20} />
                        </div>
                        <h3 className="text-sm font-bold text-slate-800">Email Us</h3>
                        <p className="text-[10px] text-slate-400">support@sehatnxt.com</p>
                    </div>
                </div>

                {/* FAQs */}
                <div>
                    <h3 className="text-base font-bold text-slate-800 mb-4 px-1">Frequently Asked Questions</h3>
                    <div className="flex flex-col gap-3">
                        {faqs.map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-start gap-2">
                                    <span className="text-blue-500">Q.</span> {item.q}
                                </h4>
                                <p className="text-xs text-slate-500 leading-relaxed pl-6">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA */}
                <div className="bg-slate-900 rounded-2xl p-5 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-sm font-bold mb-1">Still need help?</h3>
                        <p className="text-[10px] text-slate-400 mb-3">Our support team is just a click away.</p>
                        <button className="bg-white text-slate-900 px-6 py-2 rounded-xl text-xs font-bold hover:bg-slate-100 transition">
                            Contact Support
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HelpCenterPage;
