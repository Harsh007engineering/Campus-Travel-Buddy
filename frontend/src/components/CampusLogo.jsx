import React from 'react';

/**
 * Custom Big-Tech Caliber Vector Logo for Campus Travel Buddy
 * Represents shared paths, convergence, and campus travel velocity
 */
const CampusLogo = ({ size = 32, className = '' }) => {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 48 48" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
        >
            <defs>
                <linearGradient id="ctb-grad-primary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
                <linearGradient id="ctb-grad-secondary" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
            </defs>

            {/* Rounded Squircle Container */}
            <rect width="48" height="48" rx="14" fill="url(#ctb-grad-primary)" />

            {/* Inner subtle specular border */}
            <rect x="1" y="1" width="46" height="46" rx="13" stroke="white" strokeOpacity="0.25" strokeWidth="1.5" />

            {/* Dynamic Converging Mobility Paths (Two cars / routes syncing) */}
            <path 
                d="M14 28C14 21.3726 19.3726 16 26 16H34M34 16L29 11M34 16L29 21" 
                stroke="white" 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
            />
            <path 
                d="M34 20C34 26.6274 28.6274 32 22 32H14M14 32L19 27M14 32L19 37" 
                stroke="white" 
                strokeWidth="3.2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeOpacity="0.9" 
            />

            {/* Central Node / Meeting Point */}
            <circle cx="24" cy="24" r="3.5" fill="#F8FAFC" />
        </svg>
    );
};

export default CampusLogo;
