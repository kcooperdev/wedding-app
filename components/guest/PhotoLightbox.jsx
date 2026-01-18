"use client";

import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PhotoLightbox({ photos, currentIndex, onClose }) {
  const [index, setIndex] = useState(currentIndex);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setIndex(currentIndex);
    setImageLoaded(false);
  }, [currentIndex]);

  const currentPhoto = photos[index];
  const hasNext = index < photos.length - 1;
  const hasPrev = index > 0;

  const handleNext = () => {
    if (hasNext) {
      setIndex(index + 1);
      setImageLoaded(false);
    }
  };

  const handlePrev = () => {
    if (hasPrev) {
      setIndex(index - 1);
      setImageLoaded(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) handlePrev();
      if (e.key === 'ArrowRight' && hasNext) handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [index, hasNext, hasPrev, onClose]);

  if (!currentPhoto) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Buttons */}
      {hasPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
          aria-label="Previous photo"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
          aria-label="Next photo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Photo Container */}
      <div
        className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}
        
        <img
          src={currentPhoto.url}
          alt={currentPhoto.uploaderName ? `Photo by ${currentPhoto.uploaderName}` : "Wedding photo"}
          className="max-w-full max-h-full object-contain"
          onLoad={() => setImageLoaded(true)}
          style={{ display: imageLoaded ? 'block' : 'none' }}
        />
      </div>

      {/* Photo Info */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm">
        {currentPhoto.uploaderName && (
          <span>Photo by {currentPhoto.uploaderName}</span>
        )}
        <span className="mx-2">•</span>
        <span>{index + 1} of {photos.length}</span>
      </div>
    </div>
  );
}
