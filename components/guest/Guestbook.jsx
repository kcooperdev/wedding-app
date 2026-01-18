"use client";

import { useEffect, useState } from 'react';
import { subscribeToMessages, sendMessage } from '@/lib/services';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Send } from 'lucide-react';
import { Card } from '../ui/Card';

export default function Guestbook({ userId, userName }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const unsubscribe = subscribeToMessages(setMessages);
        return () => unsubscribe();
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        setSending(true);
        try {
            await sendMessage(newMessage.trim(), userId, userName, "guest-to-couple");
            setNewMessage("");
        } catch (error) {
            console.error("Message failed", error);
        } finally {
            setSending(false);
        }
    };

    return (
        <Card className="flex flex-col h-[400px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-wedding-gold/20">
                {messages.length === 0 && (
                    <p className="text-center text-text-muted text-sm py-10">Write a message for the happy couple!</p>
                )}
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.senderId === userId ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${msg.type === 'broadcast'
                                ? "bg-wedding-gold text-white w-full text-center font-serif"
                                : msg.senderId === userId
                                    ? "bg-wedding-sage-light text-text-main rounded-tr-none"
                                    : "bg-gray-100 text-text-main rounded-tl-none"
                            }`}>
                            {msg.type !== 'broadcast' && <p className="text-xs font-semibold opacity-50 mb-1">{msg.senderName}</p>}
                            <p>{msg.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSend} className="flex gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Write a message..."
                    className="flex-1"
                />
                <Button size="icon" type="submit" disabled={!newMessage.trim() || sending} className="w-12 h-12 rounded-xl">
                    <Send className="w-5 h-5 ml-0.5" />
                </Button>
            </form>
        </Card>
    );
}
