"use client";

import { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Heart, AlertCircle } from 'lucide-react';
import { createUser } from '@/lib/services';

export default function GuestOnboarding({ onComplete }) {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Simple ID generator
    const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Please enter your name');
            return;
        }

        setLoading(true);
        setError('');
        
        try {
            // Authenticate with just name (uses default wedding)
            const response = await fetch('/api/auth/guest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    guest_name: name.trim(),
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to join wedding');
            }

            // Create local user record
            const userId = generateId();
            const userData = {
                id: userId,
                name: name.trim(),
                wedding_id: data.wedding.id,
                wedding: data.wedding,
            };

            // Persist to local storage
            localStorage.setItem('wedding_guest', JSON.stringify(userData));

            // Save to Firestore (for check-ins, etc.)
            await createUser(userId, name.trim());

            onComplete(userData);
        } catch (error) {
            console.error("Error joining:", error);
            setError(error.message || 'Failed to join. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-wedding-sage-light bg-[url('/pattern.png')]">
            <Card className="w-full max-w-md text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 bg-wedding-sage/10 rounded-full flex items-center justify-center text-wedding-sage mb-4">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <h1 className="text-3xl font-serif text-wedding-sage">Welcome</h1>
                    <p className="text-text-muted">Join us in celebrating our special day.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700 text-sm">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    
                    <div className="space-y-2 text-left">
                        <label className="text-sm font-medium text-text-muted ml-1">Your Name</label>
                        <Input
                            placeholder="e.g. Aunt May"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>
                    
                    <Button
                        type="submit"
                        size="lg"
                        className="w-full"
                        disabled={!name.trim() || loading}
                    >
                        {loading ? "Joining..." : "Enter Wedding"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
