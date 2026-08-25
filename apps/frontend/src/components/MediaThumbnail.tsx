'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface MediaImageProps {
    src: string;
    alt: string;
    className?: string;
}

/**
 * Fills its positioned ancestor with an image, showing a pulsing skeleton
 * until the image has actually finished loading instead of popping in
 * abruptly (or leaving a blank gap) once the network request completes.
 */
export function MediaImage({ src, alt, className = '' }: MediaImageProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            {!loaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                onLoad={() => setLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
            />
        </>
    );
}

interface MediaVideoProps {
    src: string;
    className?: string;
}

export function MediaVideo({ src, className = '' }: MediaVideoProps) {
    const [loaded, setLoaded] = useState(false);

    return (
        <>
            {!loaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
                </div>
            )}
            <video
                src={src}
                muted
                loop
                playsInline
                autoPlay
                onLoadedData={() => setLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
            />
        </>
    );
}
