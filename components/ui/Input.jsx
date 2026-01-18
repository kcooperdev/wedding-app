import { cn } from './Button';

export function Input({ className, ...props }) {
    return (
        <input
            className={cn(
                "w-full px-4 py-3 rounded-xl border border-wedding-champagne bg-white text-text-main focus:outline-none focus:ring-2 focus:ring-wedding-sage focus:border-transparent transition-all placeholder:text-text-muted/50 font-sans",
                className
            )}
            {...props}
        />
    );
}
