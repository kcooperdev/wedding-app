"use client";

import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Radio, X, Users } from 'lucide-react';

export default function LiveViewer({ playbackUrl, onClose }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    if (!playbackUrl || !videoRef.current) return;

    // Use HLS.js for M3U8 playback
    const loadVideo = async () => {
      try {
        if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
          // Native HLS support (Safari, iOS)
          videoRef.current.src = playbackUrl;
        } else {
          // Use HLS.js for other browsers
          const Hls = (await import('hls.js')).default;
          if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(playbackUrl);
            hls.attachMedia(videoRef.current);
            
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              setLoading(false);
            });

            hls.on(Hls.Events.ERROR, (event, data) => {
              if (data.fatal) {
                setError('Failed to load stream');
                setLoading(false);
              }
            });

            return () => {
              hls.destroy();
            };
          } else {
            setError('HLS playback not supported in this browser');
            setLoading(false);
          }
        }

        videoRef.current.addEventListener('loadeddata', () => {
          setLoading(false);
        });

        videoRef.current.addEventListener('error', () => {
          setError('Failed to load video stream');
          setLoading(false);
        });
      } catch (err) {
        console.error('Error loading video:', err);
        setError('Failed to load stream');
        setLoading(false);
      }
    };

    loadVideo();
  }, [playbackUrl]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="w-full h-full relative">
        {/* Video Player */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          controls
          className="w-full h-full object-contain"
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Loading stream...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <Card className="max-w-md mx-4">
              <div className="p-6 text-center space-y-4">
                <p className="text-red-600">{error}</p>
                <Button onClick={onClose}>Close</Button>
              </div>
            </Card>
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="bg-red-600 text-white px-3 py-1.5 rounded-full flex items-center gap-2 text-sm font-semibold">
            <Radio className="w-4 h-4" />
            <span>LIVE</span>
          </div>
          
          <button
            onClick={onClose}
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Users className="w-4 h-4" />
            <span>Watching the ceremony</span>
          </div>
        </div>
      </div>
    </div>
  );
}
