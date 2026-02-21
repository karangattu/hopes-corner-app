import React from 'react';

export default function AnimatedGuest({ className = '' }: { className?: string }) {
    return (
        <svg
            className={`w-full h-full ${className}`}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                {`
                    @keyframes eatMove {
                        0%, 100% { transform: rotate(0deg); }
                        40%, 60% { transform: rotate(-35deg) translate(0px, -15px); }
                    }
                    @keyframes chew {
                        0%, 100% { transform: scaleY(1); }
                        45%, 55% { transform: scaleY(0.8); }
                    }
                    @keyframes foodDisappear {
                        0%, 39% { opacity: 1; }
                        40%, 100% { opacity: 0; }
                    }
                    .eating-arm {
                        animation: eatMove 2s ease-in-out infinite;
                        transform-origin: 110px 145px;
                    }
                    .mouth {
                        animation: chew 2s ease-in-out infinite;
                        transform-origin: 100px 92px;
                    }
                    .food {
                        animation: foodDisappear 2s ease-in-out infinite;
                        transform-origin: 130px 130px;
                    }
                `}
            </style>

            <defs>
                <clipPath id="guest-clip">
                    <rect x="0" y="0" width="200" height="200" rx="32" />
                </clipPath>
            </defs>

            <g clipPath="url(#guest-clip)">
                {/* Background Base */}
                <rect x="0" y="0" width="200" height="200" fill="#fffbeb" />

                {/* Wallpaper Pattern */}
                <g stroke="#fef3c7" strokeWidth="12">
                    <line x1="20" y1="0" x2="20" y2="160" />
                    <line x1="60" y1="0" x2="60" y2="160" />
                    <line x1="100" y1="0" x2="100" y2="160" />
                    <line x1="140" y1="0" x2="140" y2="160" />
                    <line x1="180" y1="0" x2="180" y2="160" />
                </g>

                {/* Painting */}
                <rect x="25" y="30" width="50" height="60" fill="#e2e8f0" stroke="#b45309" strokeWidth="4" />
                <circle cx="50" cy="55" r="14" fill="#10b981" />
                <circle cx="40" cy="70" r="10" fill="#3b82f6" opacity="0.8" />
                <circle cx="65" cy="70" r="8" fill="#f59e0b" opacity="0.8" />

                {/* Window */}
                <rect x="135" y="20" width="50" height="80" fill="#e0f2fe" stroke="#ffffff" strokeWidth="6" />
                <line x1="160" y1="20" x2="160" y2="100" stroke="#ffffff" strokeWidth="4" />
                <line x1="135" y1="60" x2="185" y2="60" stroke="#ffffff" strokeWidth="4" />

                {/* Baseboard */}
                <rect x="0" y="155" width="200" height="5" fill="#fcd34d" />

                {/* Floor */}
                <rect x="0" y="160" width="200" height="40" fill="#fef3c7" />
                <line x1="0" y1="160" x2="200" y2="160" stroke="#f59e0b" strokeWidth="2" opacity="0.2" />
                <line x1="0" y1="180" x2="200" y2="180" stroke="#f59e0b" strokeWidth="2" opacity="0.1" />

                <g transform="translate(10, 10)">
                    {/* Body */}
                    <path d="M60 180 L60 110 Q100 70 140 110 L140 180 Z" fill="#0ea5e9" /> {/* Sky 500 Shirt */}

                    {/* Head */}
                    <circle cx="100" cy="80" r="22" fill="#fcd34d" /> {/* Face */}

                    {/* Hair */}
                    <path d="M78 80 C75 60, 125 60, 122 80 C110 50, 90 50, 78 80 Z" fill="#78350f" />

                    {/* Face details */}
                    <circle cx="92" cy="75" r="2.5" fill="#4b5563" />
                    <circle cx="108" cy="75" r="2.5" fill="#4b5563" />

                    {/* Cheeks */}
                    <circle cx="85" cy="82" r="4" fill="#fbbf24" opacity="0.5" />
                    <circle cx="115" cy="82" r="4" fill="#fbbf24" opacity="0.5" />

                    {/* Mouth animated wrapper */}
                    <g className="mouth">
                        <path d="M92 90 Q100 98 108 90" stroke="#4b5563" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                        <path d="M96 92 Q100 96 104 92" stroke="#dc2626" strokeWidth="1" fill="#dc2626" opacity="0.8" />
                    </g>

                    {/* Table */}
                    <rect x="20" y="160" width="160" height="15" fill="#92400e" rx="4" />
                    <rect x="40" y="175" width="10" height="15" fill="#78350f" />
                    <rect x="150" y="175" width="10" height="15" fill="#78350f" />

                    {/* Plate */}
                    <ellipse cx="100" cy="155" rx="35" ry="8" fill="#e5e7eb" />
                    <ellipse cx="100" cy="155" rx="25" ry="5" fill="#ffffff" />

                    {/* Food on plate */}
                    <ellipse cx="90" cy="152" rx="12" ry="4" fill="#b45309" />
                    <circle cx="110" cy="153" r="4" fill="#10b981" />
                    <circle cx="105" cy="152" r="3" fill="#10b981" />

                    {/* Eating Arm wrapper */}
                    <g className="eating-arm">
                        {/* Fork */}
                        <line x1="108" y1="120" x2="115" y2="148" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
                        <path d="M103 118 Q108 123 113 118" stroke="#9ca3af" strokeWidth="1.5" fill="none" />
                        <line x1="104" y1="118" x2="105" y2="122" stroke="#9ca3af" strokeWidth="1.5" />
                        <line x1="108" y1="118" x2="108" y2="122" stroke="#9ca3af" strokeWidth="1.5" />
                        <line x1="112" y1="118" x2="111" y2="122" stroke="#9ca3af" strokeWidth="1.5" />

                        {/* Food on Fork */}
                        <circle cx="108" cy="118" r="3" fill="#b45309" className="food" />

                        {/* Arm */}
                        <path d="M125 125 L135 145 L112 145" stroke="#0ea5e9" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        <circle cx="112" cy="145" r="5" fill="#fcd34d" /> {/* Hand */}
                    </g>

                    {/* Other Arm holding knife or resting */}
                    <path d="M75 125 L65 150 L80 152" stroke="#0ea5e9" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <circle cx="80" cy="152" r="5" fill="#fcd34d" />
                </g>
            </g>

            {/* Border */}
            <rect x="1" y="1" width="198" height="198" rx="31" fill="none" stroke="#e2e8f0" strokeWidth="2" />
        </svg>
    );
}
