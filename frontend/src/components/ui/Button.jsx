import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Button = ({
    children,
    variant = 'primary',
    className,
    onClick,
    isLoading,
    ...props
}) => {
    const baseStyles = "inline-flex items-center justify-center px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-[12px] transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-sans";

    const variants = {
        primary: "bg-gradient-to-r from-accent-indigo to-indigo-600 text-white hover:brightness-110 shadow-glow",
        secondary: "bg-gradient-to-r from-accent-emerald to-emerald-600 text-white hover:brightness-110 shadow-glow-emerald",
        outline: "border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white",
        ghost: "text-slate-400 hover:bg-white/5 hover:text-white"
    };

    return (
        <button
            className={twMerge(clsx(baseStyles, variants[variant], className))}
            onClick={onClick}
            disabled={isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : children}
        </button>
    );
};

export default Button;

