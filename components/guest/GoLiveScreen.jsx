"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Video, X, Radio } from 'lucide-react';

export default function GoLiveScreen({ weddingId, guestId, onClose, onStreamStart }) {
  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [streamData, setStreamData] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Request camera access for preview
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing camera:', err);
        setError('Unable to access camera. Please check permissions.');
      });

    return () => {
      // Cleanup stream on unmount
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartStream = async () => {
    setLoading(true);
    setError('');

    try {
      // Call API to start stream
      const response = await fetch(`/api/wedding/${weddingId}/start-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guest_id: guestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start stream');
      }

      setStreamData(data.stream);
      setStreaming(true);
      
      // Note: For actual RTMP streaming, you would use a library like:
      // - OBS Studio (desktop)
      // - Larix Broadcaster (mobile)
      // - Or a WebRTC solution
      
      // For now, we'll just show success
      if (onStreamStart) {
        onStreamStart(data.stream);
      }
    } catch (err) {
      console.error('Error starting stream:', err);
      setError(err.message || 'Failed to start stream');
    } finally {
      setLoading(false);
    }
  };

  const handleStopStream = async () => {
    setLoading(true);
    try {
      await fetch(`/api/wedding/${weddingId}/end-stream`, {
        method: 'POST',
      });
      
      setStreaming(false);
      setStreamData(null);
      onClose();
    } catch (err) {
      console.error('Error stopping stream:', err);
      setError('Failed to stop stream');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white">
        <div className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-serif text-wedding-sage">Go Live</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {!streaming ? (
            <>
              <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!videoRef.current?.srcObject && (
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Camera preview</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="bg-wedding-sage-light/30 rounded-lg p-4 space-y-2 text-sm">
                  <p className="font-semibold text-wedding-sage">Streaming Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1 text-text-muted">
                    <li>Position your device for the best view</li>
                    <li>Ensure good lighting and stable connection</li>
                    <li>Tap "Start Streaming" when ready</li>
                    <li>Only one guest can stream at a time</li>
                  </ol>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleStartStream}
                    disabled={loading || !videoRef.current?.srcObject}
                  >
                    {loading ? 'Starting...' : 'Start Streaming'}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <Radio className="w-5 h-5" />
                  <span className="font-semibold">Stream Active</span>
                </div>
                <p className="text-sm text-green-600">
                  Your stream is now live! Other guests can watch your broadcast.
                </p>
              </div>

              {streamData && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <p className="font-semibold">Stream Details:</p>
                  <p className="text-text-muted">
                    <span className="font-medium">Stream Key:</span> {streamData.stream_key}
                  </p>
                  <p className="text-text-muted">
                    <span className="font-medium">RTMP URL:</span> {streamData.rtmp_url}
                  </p>
                  <p className="text-xs text-text-muted mt-2">
                    Use a streaming app (OBS, Larix) with these credentials to broadcast.
                  </p>
                </div>
              )}

              <Button
                variant="outline"
                className="w-full"
                onClick={handleStopStream}
                disabled={loading}
              >
                {loading ? 'Stopping...' : 'End Stream'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
