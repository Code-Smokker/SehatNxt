"use client";
import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';

export default function SignatureUploadModal({ isOpen, onClose, onUploadComplete }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    // Don't render if not open
    if (!isOpen) return null;

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (f) {
            setFile(f);
            setPreview(URL.createObjectURL(f));
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Authentication missing");
                return;
            }

            // 1. Get Presigned URL
            const { data: { uploadUrl, finalUrl } } = await axios.get(
                `http://localhost:8000/api/upload/presigned-url?fileName=${file.name}&fileType=${file.type}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // 2. Upload to S3
            // Note: S3 upload usually doesn't need auth header if presigned, but needs Content-Type
            await axios.put(uploadUrl, file, {
                headers: { 'Content-Type': file.type }
            });

            // 3. Update Doctor Profile with the new signature URL
            await axios.post(
                'http://localhost:8000/api/doctor/update-profile',
                { signatureUrl: finalUrl },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            onUploadComplete(finalUrl);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Please try again. " + (error.response?.data?.message || error.message));
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4 relative animate-in fade-in zoom-in duration-200">
                {/* Close Button (Optional, maybe we want to FORCE upload so no close?) */}

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <Upload size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Digital Signature Required</h2>
                    <p className="text-sm text-slate-500 mt-2">To issue authentic prescriptions, please upload your digital signature/seal once. This will be automatically added to all your prescriptions.</p>
                </div>

                <div className="space-y-4">
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative cursor-pointer group">
                        <input type="file" onChange={handleFileChange} accept="image/png,image/jpeg" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {preview ? (
                            <div className="relative">
                                <img src={preview} alt="Signature" className="h-24 mx-auto object-contain" />
                                <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    <span className="text-xs bg-white px-2 py-1 rounded shadow text-slate-700">Change</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Click to upload image</p>
                                <p className="text-xs text-slate-400 mt-1">PNG or JPG (Transparent background recommended)</p>
                            </>
                        )}
                    </div>

                    <Button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        {uploading ? <Loader2 className="animate-spin mr-2" /> : null}
                        {uploading ? 'Uploading...' : 'Save Signature & Continue'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
