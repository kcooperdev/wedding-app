"use client";

import { useState } from 'react';
import { Button } from '../ui/Button';
import { updateCheckIn } from '@/lib/services';
import { MapPin, Utensils } from 'lucide-react';
import { clsx } from 'clsx';

export default function CheckInSystem({ userId, userName }) {
    const [checkedInCeremony, setCheckedInCeremony] = useState(false);
    const [checkedInDinner, setCheckedInDinner] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCheckIn = async (type) => {
        setLoading(true);
        try {
            const newStatus = type === 'ceremony' ? !checkedInCeremony : !checkedInDinner;
            await updateCheckIn(userId, userName, type, newStatus);

            if (type === 'ceremony') setCheckedInCeremony(newStatus);
            else setCheckedInDinner(newStatus);
        } catch (error) {
            console.error("Check-in failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            <Button
                variant={checkedInCeremony ? "primary" : "outline"}
                className={clsx("h-auto py-4 flex flex-col gap-2 transition-colors",
                    checkedInCeremony ? "bg-wedding-sage border-wedding-sage text-white" : "border-wedding-sage/30 text-wedding-sage bg-white"
                )}
                onClick={() => handleCheckIn('ceremony')}
                disabled={loading}
            >
                <MapPin className={clsx("w-6 h-6", checkedInCeremony ? "animate-bounce" : "")} />
                <span className="text-sm font-medium">Ceremony</span>
                <span className="text-xs opacity-80">{checkedInCeremony ? "Checked In" : "Check In"}</span>
            </Button>

            <Button
                variant={checkedInDinner ? "primary" : "outline"}
                className={clsx("h-auto py-4 flex flex-col gap-2 transition-colors",
                    checkedInDinner ? "bg-wedding-sage border-wedding-sage text-white" : "border-wedding-sage/30 text-wedding-sage bg-white"
                )}
                onClick={() => handleCheckIn('dinner')}
                disabled={loading}
            >
                <Utensils className={clsx("w-6 h-6", checkedInDinner ? "animate-pulse" : "")} />
                <span className="text-sm font-medium">Dinner</span>
                <span className="text-xs opacity-80">{checkedInDinner ? "Checked In" : "Check In"}</span>
            </Button>
        </div>
    );
}
