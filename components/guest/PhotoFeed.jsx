"use client";

import { useEffect, useState } from 'react';
import { subscribeToPhotos } from '@/lib/services';
import { Card } from '../ui/Card';
import PhotoLightbox from './PhotoLightbox';

export default function PhotoFeed() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(null);

    useEffect(() => {
        const unsubscribe = subscribeToPhotos((data) => {
            setPhotos(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="text-center p-8 text-text-muted animate-pulse">Loading gallery...</div>;
    }

    if (photos.length === 0) {
        return (
            <div className="text-center py-12 px-6 bg-wedding-sage-light/30 rounded-xl border border-dashed border-wedding-sage/30">
                <p className="text-wedding-sage font-serif text-lg mb-2">No photos yet</p>
                <p className="text-text-muted text-sm">Be the first to share a moment!</p>
            </div>
        );
    }

    // Filter out photos without valid URLs
    const validPhotos = photos.filter(photo => photo.url && photo.url.trim() !== '');

    if (validPhotos.length === 0) {
        return (
            <div className="text-center py-12 px-6 bg-wedding-sage-light/30 rounded-xl border border-dashed border-wedding-sage/30">
                <p className="text-wedding-sage font-serif text-lg mb-2">No photos yet</p>
                <p className="text-text-muted text-sm">Be the first to share a moment!</p>
            </div>
        );
    }

    const openLightbox = (index) => {
        setLightboxIndex(index);
    };

    const closeLightbox = () => {
        setLightboxIndex(null);
    };

    return (
        <>
            <div className="grid grid-cols-2 gap-2 md:gap-4 pb-20">
                {validPhotos.map((photo, index) => (
                    <div
                        key={photo.id}
                        className="aspect-square relative rounded-lg overflow-hidden bg-gray-100 shadow-sm group break-inside-avoid cursor-pointer"
                        onClick={() => openLightbox(index)}
                    >
                        <img
                            src={photo.url}
                            alt={photo.uploaderName ? `Photo by ${photo.uploaderName}` : "Wedding photo"}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                                // Hide broken images
                                e.target.style.display = 'none';
                                e.target.parentElement.style.display = 'none';
                            }}
                        />
                        {photo.uploaderName && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                                <p className="text-white text-xs font-medium truncate">{photo.uploaderName}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {lightboxIndex !== null && (
                <PhotoLightbox
                    photos={validPhotos}
                    currentIndex={lightboxIndex}
                    onClose={closeLightbox}
                />
            )}
        </>
    );
}
