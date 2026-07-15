import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

const ImageWithFallback = ({ src, alt, className, ...props }) => {
    const [error, setError] = useState(false);

    if (error || !src) {
        return (
            <div className={`flex items-center justify-center bg-white/[0.02] border border-white/5 ${className}`}>
                <div className="text-center text-slate-500 font-sans">
                    <ImageOff size={24} className="mx-auto mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-widest block">No Image</span>
                </div>
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            {...props}
        />
    );
};

export default ImageWithFallback;

