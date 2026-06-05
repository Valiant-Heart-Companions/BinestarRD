import React from 'react';

interface LogoProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
    const dimensions = {
        sm: { width: 40, height: 40, fontSize: '24px' },
        md: { width: 60, height: 60, fontSize: '36px' },
        lg: { width: 120, height: 120, fontSize: '72px' },
    }[size];

    return (
        <div
            className={`relative inline-flex items-center justify-center font-serif ${className}`}
            style={{
                width: dimensions.width,
                height: dimensions.height,
                color: 'var(--color-primary)'
            }}
        >
            <span style={{ fontSize: dimensions.fontSize, fontWeight: 700 }}>B</span>
            {/* 
          Since we can't easily reproduce the Metallic Gold Map silhouette exactly in SVG without a complex path, 
          we use a simplified SVG overlay for the 'Sanctuary' vibe.
      */}
            <svg
                className="absolute"
                style={{
                    width: '45%',
                    height: '45%',
                    bottom: '15%',
                    right: '15%',
                    filter: 'drop-shadow(0px 1px 1px rgba(0,0,0,0.1))'
                }}
                viewBox="0 0 100 100"
                fill="var(--color-accent)"
            >
                <path d="M10,40 Q30,20 50,40 T90,40 Q80,60 50,80 T10,40 Z" /> {/* Simplified Map abstraction */}
            </svg>
        </div>
    );
}
