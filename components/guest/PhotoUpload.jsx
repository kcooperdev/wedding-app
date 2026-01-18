"use client";

import { useState, useRef } from 'react';
import { Button } from '../ui/Button';
import { Camera, Image as ImageIcon, X } from 'lucide-react';
import { uploadPhoto } from '@/lib/services';
import { cn } from '../ui/Button';

export default function PhotoUpload({ userId, userName }) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview({ file, url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const clearSelection = () => {
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleUpload = async () => {
        if (!preview) return;

        setUploading(true);
        try {
            await uploadPhoto(preview.file, userId, userName);
            clearSelection();
            // Optional: Show success toast
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Floating Action Button */}
            {!preview && (
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-14 h-14 bg-wedding-sage text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-wedding-sage/30"
                >
                    <Camera className="w-6 h-6" />
                </button>
            )}

            {/* Hidden Input */}
            <input
                type="file"
                accept="image/*"
                capture="environment" // prefers camera on mobile
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileSelect}
            />

            {/* Preview Modal Overlay */}
            {preview && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                        <div className="relative aspect-[4/5] bg-black">
                            <img src={preview.url} alt="Preview" className="w-full h-full object-contain" />
                            <button
                                onClick={clearSelection}
                                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="p-4 flex gap-3 bg-white">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={clearSelection}
                                disabled={uploading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? "Posting..." : "Post Photo"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
