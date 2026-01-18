"use client";

import { useState } from 'react';
import { Card } from '../ui/Card';
import { ChevronDown, ChevronUp, MapPin, Clock, Info, Navigation, ExternalLink, UtensilsCrossed } from 'lucide-react';

export default function InfoSection() {
    const [openSection, setOpenSection] = useState(null);

    const toggle = (section) => {
        setOpenSection(openSection === section ? null : section);
    };

    // Venue addresses (update these with actual addresses)
    const ceremonyAddress = "123 Wedding Lane, Love City, ST 12345";
    const receptionAddress = "456 Party Blvd, Love City, ST 12345";
    
    // Encode addresses for URL parameters
    const encodeAddress = (address) => encodeURIComponent(address);
    
    // Google Maps URLs
    const googleMapsCeremony = `https://www.google.com/maps/search/?api=1&query=${encodeAddress(ceremonyAddress)}`;
    const googleMapsReception = `https://www.google.com/maps/search/?api=1&query=${encodeAddress(receptionAddress)}`;
    
    // Waze URLs
    const wazeCeremony = `https://waze.com/ul?q=${encodeAddress(ceremonyAddress)}`;
    const wazeReception = `https://waze.com/ul?q=${encodeAddress(receptionAddress)}`;

    const sections = [
        {
            id: "schedule",
            title: "Schedule",
            icon: <Clock className="w-5 h-5" />,
            content: (
                <ul className="space-y-3 text-text-muted">
                    <li className="flex justify-between items-start">
                        <div>
                            <span className="font-semibold">Arrival</span>
                            <p className="text-xs text-text-muted/80">Please arrive by</p>
                        </div>
                        <span className="text-wedding-sage font-semibold">2:30 PM</span>
                    </li>
                    <li className="flex justify-between"><span>Ceremony</span> <span>3:00 PM</span></li>
                    <li className="flex justify-between"><span>Cocktail Hour</span> <span>4:00 PM</span></li>
                    <li className="flex justify-between"><span>Dinner & Toasts</span> <span>5:30 PM</span></li>
                    <li className="flex justify-between"><span>Dancing</span> <span>7:00 PM</span></li>
                    <li className="flex justify-between"><span>Reception Ends</span> <span>10:00 PM</span></li>
                </ul>
            )
        },
        {
            id: "location",
            title: "Locations & Directions",
            icon: <MapPin className="w-5 h-5" />,
            content: (
                <div className="space-y-6 text-text-muted">
                    <div>
                        <p className="font-semibold text-wedding-sage mb-1">Ceremony</p>
                        <p className="text-sm mb-2">The Old Chapel</p>
                        <p className="text-xs mb-3">{ceremonyAddress}</p>
                        <div className="flex gap-2 flex-wrap">
                            <a 
                                href={googleMapsCeremony}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-wedding-sage/30 rounded-lg text-xs text-wedding-sage hover:bg-wedding-sage-light/20 transition-colors"
                            >
                                <Navigation className="w-3.5 h-3.5" />
                                Google Maps
                                <ExternalLink className="w-3 h-3" />
                            </a>
                            <a 
                                href={wazeCeremony}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-wedding-sage/30 rounded-lg text-xs text-wedding-sage hover:bg-wedding-sage-light/20 transition-colors"
                            >
                                <Navigation className="w-3.5 h-3.5" />
                                Waze
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                    <div className="border-t border-wedding-sage-light/30 pt-4">
                        <p className="font-semibold text-wedding-sage mb-1">Reception</p>
                        <p className="text-sm mb-2">Grand Ballroom</p>
                        <p className="text-xs mb-3">{receptionAddress}</p>
                        <div className="flex gap-2 flex-wrap">
                            <a 
                                href={googleMapsReception}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-wedding-sage/30 rounded-lg text-xs text-wedding-sage hover:bg-wedding-sage-light/20 transition-colors"
                            >
                                <Navigation className="w-3.5 h-3.5" />
                                Google Maps
                                <ExternalLink className="w-3 h-3" />
                            </a>
                            <a 
                                href={wazeReception}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-wedding-sage/30 rounded-lg text-xs text-wedding-sage hover:bg-wedding-sage-light/20 transition-colors"
                            >
                                <Navigation className="w-3.5 h-3.5" />
                                Waze
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "menu",
            title: "Reception Menu - Nola Seafood",
            icon: <UtensilsCrossed className="w-5 h-5" />,
            content: (
                <div className="space-y-4 text-text-muted text-sm">
                    <div>
                        <p className="font-semibold text-wedding-sage mb-1">Reception</p>
                        <p className="text-sm mb-3">View the full menu from Nola Seafood</p>
                        <a 
                            href="https://nolaseafoodandspirits.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-wedding-sage/30 rounded-lg text-sm text-wedding-sage hover:bg-wedding-sage-light/20 transition-colors font-medium"
                        >
                            <UtensilsCrossed className="w-4 h-4" />
                            View Menu
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>
                    <div className="bg-wedding-sage-light/20 rounded-lg p-3 mt-4">
                        <p className="text-xs text-text-muted">
                            <span className="font-semibold text-wedding-sage">Note:</span> Please inform us of any dietary restrictions or allergies when you check in.
                        </p>
                    </div>
                </div>
            )
        },
        {
            id: "details",
            title: "Important Details",
            icon: <Info className="w-5 h-5" />,
            content: (
                <div className="space-y-3 text-text-muted text-sm">
                    <div>
                        <p className="font-semibold text-wedding-sage mb-1">Dress Code</p>
                        <p>Cocktail Attire - We'd love to see you dressed up for our special day!</p>
                    </div>
                    <div>
                        <p className="font-semibold text-wedding-sage mb-1">Parking</p>
                        <p>Complimentary valet parking available at both venues. Street parking is also available nearby.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-wedding-sage mb-1">RSVP</p>
                        <p>Please confirm your attendance through this app. We're keeping it intimate, so every guest matters!</p>
                    </div>
                    <div>
                        <p className="font-semibold text-wedding-sage mb-1">Photography</p>
                        <p>We encourage you to take photos and share them here! Our photographer will also be capturing moments throughout the day.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-wedding-sage mb-1">Gifts</p>
                        <p>Your presence is the greatest gift! If you'd like to celebrate with us, a contribution to our honeymoon fund is appreciated.</p>
                    </div>
                    <div>
                        <p className="font-semibold text-wedding-sage mb-1">Special Requests</p>
                        <p>Please let us know of any dietary restrictions or accessibility needs when you check in.</p>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-3">
            {sections.map((section) => (
                <Card
                    key={section.id}
                    className="p-0 overflow-hidden cursor-pointer transition-all active:scale-[0.99]"
                    onClick={() => toggle(section.id)}
                >
                    <div className="p-4 flex items-center justify-between bg-white text-wedding-sage">
                        <div className="flex items-center gap-3">
                            {section.icon}
                            <span className="font-semibold font-serif text-lg">{section.title}</span>
                        </div>
                        {openSection === section.id ? <ChevronUp /> : <ChevronDown />}
                    </div>

                    {openSection === section.id && (
                        <div className="p-4 bg-wedding-sage-light/30 border-t border-wedding-sage-light text-sm animate-in slide-in-from-top-2 duration-200">
                            {section.content}
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}
