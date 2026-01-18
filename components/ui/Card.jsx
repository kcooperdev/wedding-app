import { cn } from './Button';

export function Card({ className, children, ...props }) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl shadow-xl border border-wedding-sage-light/50 p-6 backdrop-blur-sm bg-opacity-95",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
