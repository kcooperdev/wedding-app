"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === "wedding123") {
            setIsAuthenticated(true);
            setError("");
        } else {
            setError("Incorrect password");
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword("");
    };

    if (isAuthenticated) {
        return <AdminDashboard onLogout={handleLogout} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-wedding-cream">
            <Card className="w-full max-w-sm">
                <h1 className="text-2xl font-serif text-wedding-gold mb-6 text-center">Admin Access</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Input
                            type="password"
                            placeholder="Enter admin password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-center"
                        />
                        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                    </div>
                    <Button type="submit" className="w-full">Login</Button>
                </form>
            </Card>
        </div>
    );
}
