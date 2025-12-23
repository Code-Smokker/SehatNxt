"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { User, Lock, Bell, Building, Globe, Save } from 'lucide-react';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
                <p className="text-slate-500">Manage your account preferences and clinic settings</p>
            </div>

            <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:w-auto md:grid-cols-4 lg:inline-flex bg-slate-100 p-1 mb-6">
                    <TabsTrigger value="account" className="gap-2"><User size={16} /> Account</TabsTrigger>
                    <TabsTrigger value="clinic" className="gap-2"><Building size={16} /> Clinic Profile</TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2"><Bell size={16} /> Notifications</TabsTrigger>
                    <TabsTrigger value="security" className="gap-2"><Lock size={16} /> Security</TabsTrigger>
                </TabsList>

                {/* ACCOUNT SETTINGS */}
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Update your personal details and contact info.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-slate-700">Full Name</label>
                                    <Input defaultValue="Dr. Rahul Sharma" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-slate-700">Specialization</label>
                                    <Input defaultValue="Interventional Cardiologist" />
                                </div>
                            </div>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-slate-700">Email Address</label>
                                    <Input defaultValue="dr.rahul@sehatnxt.com" type="email" />
                                </div>
                                <div className="space-y-2 flex-1">
                                    <label className="text-sm font-medium text-slate-700">Phone Number</label>
                                    <Input defaultValue="+91 98765 43210" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Bio</label>
                                <textarea
                                    className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px]"
                                    defaultValue="Dedicated Interventional Cardiologist with over 12 years of experience..."
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {isLoading ? "Saving..." : <><Save size={16} className="mr-2" /> Save Changes</>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CLINIC SETTINGS */}
                <TabsContent value="clinic">
                    <Card>
                        <CardHeader>
                            <CardTitle>Clinic Details</CardTitle>
                            <CardDescription>Manage your clinic's public profile and operating hours.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Clinic Name</label>
                                <Input defaultValue="Heart Care Clinic" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Address</label>
                                <Input defaultValue="123, 4th Block, Koramangala, Bangalore - 560034" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Consultation Fee (₹)</label>
                                    <Input defaultValue="800" type="number" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Slot Duration (mins)</label>
                                    <Input defaultValue="15" type="number" />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button onClick={handleSave} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700 text-white">
                                    {isLoading ? "Saving..." : <><Save size={16} className="mr-2" /> Save Changes</>}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* NOTIFICATIONS */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Choose how you want to be notified.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium text-slate-900">Email Notifications</label>
                                    <p className="text-sm text-slate-500">Receive emails about new appointments.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium text-slate-900">SMS Notifications</label>
                                    <p className="text-sm text-slate-500">Receive SMS alerts for urgent updates.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium text-slate-900">Patient Messages</label>
                                    <p className="text-sm text-slate-500">Notify when a patient sends a chat message.</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <label className="text-base font-medium text-slate-900">Marketing & Updates</label>
                                    <p className="text-sm text-slate-500">Receive news about new features and updates.</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* SECURITY */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your password and account security.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Current Password</label>
                                <Input type="password" placeholder="Enter current password" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">New Password</label>
                                <Input type="password" placeholder="Enter new password" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
                                <Input type="password" placeholder="Confirm new password" />
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button className="bg-slate-900 hover:bg-slate-800 text-white">
                                    Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
