"use client";

import { useState, useEffect } from 'react';
import { Button } from "../ui/Button";
import InfoSection from "./InfoSection";
import PhotoFeed from "./PhotoFeed";
import PhotoUpload from "./PhotoUpload";
import CheckInSystem from "./CheckInSystem";
import Guestbook from "./Guestbook";
import GoLiveScreen from "./GoLiveScreen";
import LiveViewer from "./LiveViewer";
import { Radio, Video } from 'lucide-react';

export default function Dashboard({ user, onLogout }) {
    const [activeTab, setActiveTab] = useState('photos'); // photos, info, guestbook
    const [liveStatus, setLiveStatus] = useState(null);
    const [loadingLiveStatus, setLoadingLiveStatus] = useState(true);
    const [showGoLive, setShowGoLive] = useState(false);
    const [showViewer, setShowViewer] = useState(false);

    // Fetch live status - always use the same wedding ID as admin
    useEffect(() => {
        // Always use the same wedding ID that admin uses
        const weddingId = 'love2024_kc_wedding';

        const fetchLiveStatus = async () => {
            try {
                const response = await fetch(`/api/wedding/${weddingId}/live-status`, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache',
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('🔴 Live status fetched:', data); // Debug log
                    console.log('🔴 live_mode_enabled value:', data.live_mode_enabled, 'type:', typeof data.live_mode_enabled); // Debug log
                    // Ensure we always set the state, even if live_mode_enabled is undefined
                    setLiveStatus({
                        live_mode_enabled: data.live_mode_enabled === true || data.live_mode_enabled === 'true',
                        is_stream_active: data.is_stream_active || false,
                        playback_url: data.playback_url || null,
                    });
                } else {
                    // Initialize with default values if API fails
                    const errorData = await response.json().catch(() => ({}));
                    console.warn('Failed to fetch live status:', errorData);
                    // Set default values to ensure UI renders
                    setLiveStatus(prev => prev || {
                        live_mode_enabled: false,
                        is_stream_active: false,
                        playback_url: null,
                    });
                }
            } catch (error) {
                console.error('Error fetching live status:', error);
                // Set default values to ensure UI renders
                setLiveStatus(prev => prev || {
                    live_mode_enabled: false,
                    is_stream_active: false,
                    playback_url: null,
                });
            } finally {
                setLoadingLiveStatus(false);
            }
        };

        // Initialize with default values immediately so UI can render
        setLiveStatus({
            live_mode_enabled: false,
            is_stream_active: false,
            playback_url: null,
        });
        
        // Fetch immediately
        fetchLiveStatus();
        // Poll for updates every 2 seconds for instant sync with admin
        const interval = setInterval(fetchLiveStatus, 2000);
        return () => clearInterval(interval);
    }, []); // Empty deps since we always use the same wedding ID

    return (
        <div className="min-h-screen bg-wedding-cream pb-safe">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-wedding-sage/10 px-6 py-4 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-xl font-serif text-wedding-sage">Our Wedding</h1>
                    <p className="text-xs text-text-muted">Welcome, {user.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={onLogout} className="text-xs px-2 h-auto">Exit</Button>
            </header>

            <main className="p-4 space-y-8 max-w-lg mx-auto">

                {/* Live Stream Section - Shows when admin enables live mode */}
                {liveStatus && (liveStatus.live_mode_enabled === true || liveStatus.live_mode_enabled === 'true') && (
                    <section className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-green-500/30">
                            {liveStatus.is_stream_active && liveStatus.playback_url ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-red-600">
                                        <Radio className="w-5 h-5 animate-pulse" />
                                        <span className="font-semibold">Live Now</span>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        Someone is streaming the ceremony. Watch it live!
                                    </p>
                                    <Button
                                        className="w-full"
                                        onClick={() => setShowViewer(true)}
                                    >
                                        <Video className="w-4 h-4 mr-2" />
                                        Watch Live
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="font-semibold text-green-600">Go Live Available</span>
                                    </div>
                                    <p className="text-sm text-text-muted">
                                        Be the first to stream the ceremony for other guests!
                                    </p>
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => setShowGoLive(true)}
                                    >
                                        <Video className="w-4 h-4 mr-2" />
                                        Go Live
                                    </Button>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Check In */}
                <section>
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3 ml-1">Your Status</h2>
                    <CheckInSystem userId={user.id} userName={user.name} />
                </section>

                {/* Tab Nav */}
                <div className="flex p-1 bg-white rounded-full border border-wedding-cream shadow-sm">
                    {['photos', 'info', 'guestbook'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-200 capitalize ${activeTab === tab
                                ? "bg-wedding-gold text-white shadow-md"
                                : "text-text-muted hover:bg-wedding-cream"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[50vh]">
                    {activeTab === 'photos' && <PhotoFeed />}
                    {activeTab === 'info' && <InfoSection />}
                    {activeTab === 'guestbook' && <Guestbook userId={user.id} userName={user.name} />}
                </div>
            </main>

            {/* Floating Upload Button (Only on photos tab) */}
            {activeTab === 'photos' && <PhotoUpload userId={user.id} userName={user.name} />}

            {/* Go Live Modal */}
            {showGoLive && (
                <GoLiveScreen
                    weddingId={user?.wedding?.id || user?.wedding_id || 'love2024_kc_wedding'}
                    guestId={user.id}
                    onClose={() => setShowGoLive(false)}
                    onStreamStart={() => {
                        // Refresh live status after starting stream
                        setShowGoLive(false);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    }}
                />
            )}

            {/* Live Viewer */}
            {showViewer && liveStatus?.playback_url && (
                <LiveViewer
                    playbackUrl={liveStatus.playback_url}
                    onClose={() => setShowViewer(false)}
                />
            )}
        </div>
    );
}
