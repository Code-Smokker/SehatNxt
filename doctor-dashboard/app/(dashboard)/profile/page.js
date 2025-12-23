"use client";
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Mail, Award, Clock, Calendar, Edit3, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header / Cover */}
            <div className="relative h-48 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-white/10 pattern-grid-lg opacity-20"></div>
                <div className="absolute bottom-4 right-4">
                    <Button variant="secondary" size="sm" className="gap-2 text-blue-700 bg-white hover:bg-slate-50 border-none shadow-lg">
                        <Edit3 size={14} /> Edit Cover
                    </Button>
                </div>
            </div>

            {/* Profile Info Section */}
            <div className="relative px-4 sm:px-8 -mt-20">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Avatar */}
                    <div className="relative">
                        <div className="w-36 h-36 rounded-2xl border-4 border-white bg-slate-100 shadow-xl overflow-hidden flex items-center justify-center text-4xl font-bold text-slate-400">
                            {/* Replace with actual image later */}
                            <img src="https://ui-avatars.com/api/?name=Rahul+Sharma&background=0D8ABC&color=fff&size=256" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-white" title="Verified Doctor">
                            <ShieldCheck size={16} fill="currentColor" className="text-white" />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 pt-20 md:pt-20 space-y-1">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-slate-800">Dr. Rahul Sharma</h1>
                                <p className="text-slate-500 font-medium text-lg">Senior Cardiologist</p>
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
                                <Edit3 size={16} /> Edit Profile
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">MBBS</Badge>
                            <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">MD (Cardiology)</Badge>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">12 Years Experience</Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                {/* Left Column: Contact & Personal */}
                <div className="space-y-6">
                    <Card className="rounded-xl border-none shadow-sm h-full">
                        <CardHeader>
                            <CardTitle className="text-lg">Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500">
                                    <Phone size={16} />
                                </div>
                                <div className="text-sm">
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Phone</p>
                                    <p className="font-medium">+91 98765 43210</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500">
                                    <Mail size={16} />
                                </div>
                                <div className="text-sm">
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Email</p>
                                    <p className="font-medium">dr.rahul@sehatnxt.com</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600">
                                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-500">
                                    <MapPin size={16} />
                                </div>
                                <div className="text-sm">
                                    <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Location</p>
                                    <p className="font-medium">Bangalore, KA</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="rounded-xl border-none shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg">About Me</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 leading-relaxed text-sm">
                                Dr. Rahul Sharma is a dedicated Interventional Cardiologist with over 12 years of experience in diagnosing and treating cardiovascular diseases. He specializes in angioplasty, stenting, and heart failure management. Committed to providing patient-centric care, he stays updated with the latest advancements in cardiac medicine.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Card className="rounded-xl border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Award className="text-orange-500" size={20} /> Specializations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                                        Interventional Cardiology
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                                        Heart Failure Management
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                                        Echocardiography
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></span>
                                        Preventive Cardiology
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card className="rounded-xl border-none shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Clock className="text-purple-500" size={20} /> Clinic Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="font-semibold text-slate-800 text-sm">Heart Care Clinic</p>
                                    <p className="text-xs text-slate-500">Koramangala, Bangalore</p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Mon - Sat</span>
                                        <span className="font-medium text-slate-800">10:00 AM - 08:00 PM</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Sunday</span>
                                        <span className="font-medium text-slate-800">Closed</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
