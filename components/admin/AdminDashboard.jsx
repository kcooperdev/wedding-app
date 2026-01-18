"use client";

import { useEffect, useState } from 'react';
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { subscribeToGuests, subscribeToPhotos, subscribeToMessages, sendMessage, deletePhoto } from '@/lib/services';
import { Trash2, Megaphone, CheckCircle, XCircle, Radio, Video, Power } from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
    const [activeTab, setActiveTab] = useState('guests');

    return (
        <div className="min-h-screen bg-wedding-cream p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
                    <h1 className="text-2xl font-serif text-wedding-gold">Admin Dashboard</h1>
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            {['guests', 'photos', 'broadcast', 'go live'].map(tab => (
                                <Button
                                    key={tab}
                                    variant={activeTab === tab ? 'primary' : 'ghost'}
                                    size="sm"
                                    onClick={() => setActiveTab(tab)}
                                    className="capitalize"
                                >
                                    {tab}
                                </Button>
                            ))}
                        </div>
                        <Button variant="outline" size="sm" onClick={onLogout}>Logout</Button>
                    </div>
                </div>

                {activeTab === 'guests' && <GuestList />}
                {activeTab === 'photos' && <PhotoManager />}
                {activeTab === 'broadcast' && <BroadcastSender />}
                {activeTab === 'go live' && <LivestreamManager />}
            </div>
        </div>
    );
}

function GuestList() {
    const [guests, setGuests] = useState([]);

    useEffect(() => {
        const unsub = subscribeToGuests(setGuests);
        return () => unsub();
    }, []);

    const ceremonyCount = guests.filter(g => g.checkIn_ceremony).length;
    const dinnerCount = guests.filter(g => g.checkIn_dinner).length;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <Card className="text-center py-6">
                    <p className="text-3xl font-serif text-wedding-sage">{ceremonyCount}</p>
                    <p className="text-text-muted text-sm">Ceremony Check-ins</p>
                </Card>
                <Card className="text-center py-6">
                    <p className="text-3xl font-serif text-wedding-sage">{dinnerCount}</p>
                    <p className="text-text-muted text-sm">Dinner Check-ins</p>
                </Card>
            </div>

            <Card className="overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-text-muted">Name</th>
                            <th className="p-4 font-semibold text-text-muted text-center">Ceremony</th>
                            <th className="p-4 font-semibold text-text-muted text-center">Dinner</th>
                            <th className="p-4 font-semibold text-text-muted text-right">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {guests.map(guest => (
                            <tr key={guest.id} className="hover:bg-gray-50/50">
                                <td className="p-4 font-medium">{guest.name}</td>
                                <td className="p-4 text-center">
                                    {guest.checkIn_ceremony
                                        ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                        : <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />}
                                </td>
                                <td className="p-4 text-center">
                                    {guest.checkIn_dinner
                                        ? <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                                        : <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />}
                                </td>
                                <td className="p-4 text-right text-text-muted text-xs">
                                    {new Date(guest.createdAt || guest.lastActive).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        {guests.length === 0 && (
                            <tr><td colSpan="4" className="p-8 text-center text-text-muted">No guests yet</td></tr>
                        )}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

function PhotoManager() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        const unsub = subscribeToPhotos(setPhotos);
        return () => unsub();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Delete this photo?")) {
            await deletePhoto(id);
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map(photo => (
                <div key={photo.id} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <img src={photo.url} alt="User upload" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                        <p className="text-white text-xs truncate w-full text-center">By {photo.uploaderName}</p>
                        <Button variant="danger" size="icon" onClick={() => handleDelete(photo.id)} className="w-8 h-8">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

function BroadcastSender() {
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await sendMessage(message, 'admin', 'The Couple', 'broadcast');
            setMessage("");
            alert("Broadcast sent!");
        } catch (e) {
            console.error(e);
        } finally {
            setSending(false);
        }
    };

    return (
        <Card className="max-w-lg mx-auto p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-wedding-gold/10 rounded-full flex items-center justify-center text-wedding-gold">
                <Megaphone className="w-8 h-8" />
            </div>
            <div>
                <h3 className="text-xl font-serif text-wedding-gold">Send Broadcast</h3>
                <p className="text-text-muted">Message will appear at the top of guestbooks.</p>
            </div>
            <form onSubmit={handleSend} className="space-y-4">
                <Input
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="e.g. Please make your way to the patio!"
                />
                <Button type="submit" className="w-full" disabled={!message || sending}>
                    {sending ? "Sending..." : "Notify Guests"}
                </Button>
            </form>
        </Card>
    );
}

function LivestreamManager() {
    // Use default wedding ID - no need to enter it
    const weddingId = 'love2024_kc_wedding';
    // Initialize with default values so toggle always shows
    const [liveStatus, setLiveStatus] = useState({
        live_mode_enabled: false,
        is_stream_active: false,
        playback_url: null,
        stream_session: null,
    });
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState(false);
    const [ending, setEnding] = useState(false);
    const [isPolling, setIsPolling] = useState(true);

    // Fetch live status
    useEffect(() => {
        if (!isPolling) return; // Don't poll if disabled

        const fetchStatus = async () => {
            try {
                const response = await fetch(`/api/wedding/${weddingId}/live-status`, { cache: 'no-store' });
                if (response.ok) {
                    const data = await response.json();
                    setLiveStatus(prev => ({
                        ...prev,
                        ...data,
                    }));
                } else {
                    // If wedding doesn't exist, keep default values
                    const errorData = await response.json().catch(() => ({}));
                    console.warn('Failed to fetch live status:', errorData);
                }
            } catch (error) {
                console.error('Error fetching live status:', error);
                // Keep existing state on error, don't reset
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();
        // Poll every 3 seconds (slightly longer to reduce conflicts)
        const interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [weddingId, isPolling]);

    const handleToggleLiveMode = async (enabled) => {
        // Pause polling during toggle to prevent conflicts
        setIsPolling(false);

        // Optimistic update - update UI immediately
        setLiveStatus(prev => ({
            ...prev,
            live_mode_enabled: enabled,
            is_stream_active: false,
            playback_url: null
        }));

        setToggling(true);
        try {
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

            const response = await fetch(`/api/admin/wedding/${weddingId}/toggle-live-mode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enabled }),
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                // Update with server response
                setLiveStatus(prev => ({
                    ...prev,
                    live_mode_enabled: data.live_mode_enabled,
                    is_stream_active: false,
                    playback_url: null
                }));
            } else {
                // Revert on error
                const errorData = await response.json();
                setLiveStatus(prev => ({
                    ...prev,
                    live_mode_enabled: !enabled
                }));
                const errorMsg = errorData.error || errorData.details || 'Failed to toggle live mode';
                console.error('Toggle error:', errorData);
                alert(errorMsg);
            }
        } catch (error) {
            console.error('Error toggling live mode:', error);
            // Revert on error
            setLiveStatus(prev => ({
                ...prev,
                live_mode_enabled: !enabled
            }));

            if (error.name === 'AbortError') {
                alert('Request timed out. Please check your connection and try again.');
            } else {
                const errorMsg = error.message || 'Failed to toggle live mode. Please check the console for details.';
                alert(errorMsg);
            }
        } finally {
            setToggling(false);
            // Resume polling after a short delay
            setTimeout(() => {
                setIsPolling(true);
            }, 1000);
        }
    };

    const handleEndStream = async () => {
        if (!confirm('Are you sure you want to force end the current stream?')) {
            return;
        }

        setEnding(true);
        try {
            const response = await fetch(`/api/wedding/${weddingId}/end-stream`, {
                method: 'POST',
            });

            if (response.ok) {
                setLiveStatus(prev => ({ ...prev, is_stream_active: false, playback_url: null }));
                alert('Stream ended successfully');
            } else {
                alert('Failed to end stream');
            }
        } catch (error) {
            console.error('Error ending stream:', error);
            alert('Failed to end stream');
        } finally {
            setEnding(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {weddingId && (
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`w-3 h-3 rounded-full ${liveStatus?.live_mode_enabled
                                ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50'
                                : 'bg-red-500'
                            }`} />
                        <h3 className="text-xl font-serif text-wedding-gold">Live Stream Control</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Live Mode Toggle */}
                        <div className={`rounded-lg p-4 space-y-4 border-2 transition-all ${liveStatus.live_mode_enabled
                                ? 'bg-green-50 border-green-500/50'
                                : 'bg-red-50 border-red-300'
                            }`}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-4 h-4 rounded-full transition-all ${liveStatus.live_mode_enabled
                                            ? 'bg-green-500 animate-pulse shadow-lg shadow-green-500/50'
                                            : 'bg-red-500'
                                        }`}></div>
                                    <div>
                                        <p className={`font-semibold ${liveStatus.live_mode_enabled
                                                ? 'text-green-700'
                                                : 'text-red-700'
                                            }`}>
                                            Ceremony Live Mode
                                        </p>
                                        <p className="text-sm text-text-muted">
                                            {liveStatus.live_mode_enabled
                                                ? 'ON - Guests can go live'
                                                : 'OFF - Guests cannot go live'}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleToggleLiveMode(!liveStatus.live_mode_enabled)}
                                    disabled={toggling}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${liveStatus.live_mode_enabled
                                            ? 'bg-green-500 focus:ring-green-500'
                                            : 'bg-red-500 focus:ring-red-500'
                                        } ${toggling ? 'opacity-70 cursor-wait' : 'cursor-pointer'}`}
                                    role="switch"
                                    aria-checked={liveStatus.live_mode_enabled}
                                    aria-label={liveStatus.live_mode_enabled ? 'Disable live mode' : 'Enable live mode'}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 shadow-sm ${liveStatus.live_mode_enabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* Stream Status */}
                        {liveStatus.is_stream_active && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
                                <div className="flex items-center gap-2 text-red-700">
                                    <Radio className="w-5 h-5 animate-pulse" />
                                    <span className="font-semibold">Stream Active</span>
                                </div>
                                {liveStatus.playback_url && (
                                    <div className="space-y-2">
                                        <p className="text-sm text-text-muted">Playback URL:</p>
                                        <div className="bg-white rounded p-2 text-xs font-mono break-all">
                                            {liveStatus.playback_url}
                                        </div>
                                        <a
                                            href={liveStatus.playback_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-wedding-sage hover:underline"
                                        >
                                            <Video className="w-4 h-4" />
                                            Watch Stream
                                        </a>
                                    </div>
                                )}
                                <Button
                                    variant="outline"
                                    onClick={handleEndStream}
                                    disabled={ending}
                                    className="w-full"
                                >
                                    {ending ? 'Ending...' : 'Force End Stream'}
                                </Button>
                            </div>
                        )}

                        {!liveStatus.is_stream_active && liveStatus.live_mode_enabled && (
                            <div className="bg-gray-50 rounded-lg p-4 text-center text-text-muted text-sm">
                                No active stream. Waiting for a guest to go live...
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
