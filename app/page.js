"use client";

import { useState, useEffect } from "react";
import GuestOnboarding from "@/components/guest/GuestOnboarding";
import Dashboard from "@/components/guest/Dashboard";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check local storage for existing session
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('wedding_guest');
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('wedding_guest');
    }
    setUser(null);
  };

  // Prevent hydration mismatch
  if (!mounted || loading) {
    return (
      <div className="min-h-screen bg-wedding-cream flex items-center justify-center text-wedding-gold font-serif animate-pulse">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <GuestOnboarding onComplete={handleLogin} />;
  }

  return <Dashboard user={user} onLogout={handleLogout} />;
}
