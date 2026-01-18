import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function Button({ className, variant = "primary", size = "md", children, ...props }) {
    const variants = {
        primary: "bg-wedding-sage text-white hover:bg-opacity-90 active:scale-95 shadow-md",
        secondary: "bg-wedding-sage-light text-wedding-sage hover:bg-opacity-80 active:scale-95",
        outline: "border-2 border-wedding-sage text-wedding-sage hover:bg-wedding-sage hover:text-white",
        ghost: "text-wedding-sage hover:bg-wedding-sage-light",
        danger: "bg-red-500 text-white hover:bg-red-600",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg font-semibold",
        icon: "p-2",
    };

    return (
        <button
            className={cn(
                "rounded-full transition-all duration-200 flex items-center justify-center font-serif tracking-wide disabled:opacity-50 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
