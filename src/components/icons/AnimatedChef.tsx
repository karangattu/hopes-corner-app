import React from 'react';

export default function AnimatedChef({ className = '' }: { className?: string }) {
    return (
        <svg
            className={`w-full h-full ${className}`}
            viewBox="0 0 200 200"
            xmlns="http://www.w3.org/2000/svg"
        >
            <style>
                {`
                    @keyframes flip {
                        0%, 100% { transform: translateY(0) rotate(0deg); }
                        40% { transform: translateY(-30px) rotate(180deg); }
                        60% { transform: translateY(-30px) rotate(180deg); }
                    }
                    @keyframes panMove {
                        0%, 100% { transform: rotate(0deg); }
                        40% { transform: rotate(-15deg); }
                        60% { transform: rotate(-15deg); }
                    }
                    @keyframes steamRise {
                        0% { transform: translateY(0) scale(1); opacity: 0; }
                        50% { transform: translateY(-20px) scale(1.2); opacity: 0.6; }
                        100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
                    }
                    @keyframes armStir {
                        0%, 100% { transform: rotate(0deg); }
                        50% { transform: rotate(5deg); }
                    }
                    .flip-item {
                        animation: flip 2s ease-in-out infinite;
                        transform-origin: 140px 105px;
                    }
                    .pan {
                        animation: panMove 2s ease-in-out infinite;
                        transform-origin: 120px 115px;
                    }
                    .steam-1 {
                        animation: steamRise 3s ease-in-out infinite;
                        transform-origin: 140px 90px;
                    }
                    .steam-2 {
                        animation: steamRise 3s ease-in-out infinite 1s;
                        transform-origin: 140px 90px;
                    }
                    .steam-3 {
                        animation: steamRise 3s ease-in-out infinite 2s;
                        transform-origin: 140px 90px;
                    }
                    .arm {
                        animation: armStir 2s ease-in-out infinite;
                        transform-origin: 80px 100px;
                    }
                `}
            </style>

            <defs>
                <clipPath id="chef-clip">
                    <rect x="0" y="0" width="200" height="200" rx="32" />
                </clipPath>
            </defs>

            <g clipPath="url(#chef-clip)">
                {/* Background Base */}
                <rect x="0" y="0" width="200" height="200" fill="#f8fafc" />

                {/* Subway Tiles */}
                <g stroke="#e2e8f0" strokeWidth="1">
                    {/* Horizontal lines */}
                    <line x1="0" y1="120" x2="200" y2="120" />
                    <line x1="0" y1="140" x2="200" y2="140" />
                    <line x1="0" y1="160" x2="200" y2="160" />
                    <line x1="0" y1="180" x2="200" y2="180" />
                    {/* Vertical lines */}
                    <line x1="20" y1="120" x2="20" y2="140" />
                    <line x1="60" y1="120" x2="60" y2="140" />
                    <line x1="100" y1="120" x2="100" y2="140" />
                    <line x1="140" y1="120" x2="140" y2="140" />
                    <line x1="180" y1="120" x2="180" y2="140" />

                    <line x1="40" y1="140" x2="40" y2="160" />
                    <line x1="80" y1="140" x2="80" y2="160" />
                    <line x1="120" y1="140" x2="120" y2="160" />
                    <line x1="160" y1="140" x2="160" y2="160" />

                    <line x1="20" y1="160" x2="20" y2="180" />
                    <line x1="60" y1="160" x2="60" y2="180" />
                    <line x1="100" y1="160" x2="100" y2="180" />
                    <line x1="140" y1="160" x2="140" y2="180" />
                    <line x1="180" y1="160" x2="180" y2="180" />
                </g>

                {/* Window */}
                <rect x="130" y="20" width="60" height="70" fill="#e0f2fe" stroke="#cbd5e1" strokeWidth="4" />
                <line x1="160" y1="20" x2="160" y2="90" stroke="#cbd5e1" strokeWidth="4" />
                <line x1="130" y1="55" x2="190" y2="55" stroke="#cbd5e1" strokeWidth="4" />
                <circle cx="170" cy="35" r="8" fill="#fef08a" />

                {/* Cabinet */}
                <rect x="10" y="10" width="70" height="70" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
                <line x1="45" y1="10" x2="45" y2="80" stroke="#cbd5e1" strokeWidth="2" />
                <circle cx="38" cy="45" r="3" fill="#94a3b8" />
                <circle cx="52" cy="45" r="3" fill="#94a3b8" />

                {/* Countertop */}
                <rect x="0" y="180" width="200" height="20" fill="#475569" />
                <rect x="0" y="180" width="200" height="4" fill="#64748b" />

                <g transform="translate(10, 20)">
                    {/* Body */}
                    <path d="M40 160 L40 100 Q80 70 120 100 L120 160 Z" fill="#059669" /> {/* Emerald 600 */}
                    <path d="M50 160 L50 110 Q80 95 110 110 L110 160 Z" fill="#ffffff" opacity="0.9" /> {/* Apron */}

                    {/* Head */}
                    <circle cx="80" cy="80" r="20" fill="#fcd34d" /> {/* Face */}

                    {/* Chef Hat */}
                    <path d="M65 65 C60 50, 75 40, 80 50 C85 40, 100 50, 95 65 Z" fill="#ffffff" />
                    <rect x="68" y="60" width="24" height="15" fill="#ffffff" />

                    {/* Face details */}
                    <circle cx="75" cy="78" r="2" fill="#4b5563" />
                    <circle cx="85" cy="78" r="2" fill="#4b5563" />
                    <path d="M75 85 Q80 90 85 85" stroke="#4b5563" strokeWidth="2" fill="none" />

                    {/* Arm and Pan Wrapper */}
                    <g className="arm">
                        {/* Arm */}
                        <path d="M95 105 L120 115 L125 110" stroke="#059669" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

                        {/* Pan Wrapper to apply pan movement */}
                        <g className="pan">
                            <line x1="120" y1="115" x2="135" y2="105" stroke="#4b5563" strokeWidth="4" strokeLinecap="round" />
                            <path d="M130 105 Q145 115 160 105 L155 100 L135 100 Z" fill="#374151" />

                            {/* Food Flipping */}
                            <g className="flip-item">
                                <ellipse cx="145" cy="98" rx="8" ry="3" fill="#fbbf24" />
                            </g>
                        </g>
                    </g>

                    {/* Steam container fixed relative to the pan's general area */}
                    <g>
                        <path className="steam-1" d="M140 85 Q145 75 140 65" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0" />
                        <path className="steam-2" d="M150 85 Q145 75 150 65" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0" />
                        <path className="steam-3" d="M145 90 Q150 80 145 70" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0" />
                    </g>
                </g>
            </g>

            {/* Border */}
            <rect x="1" y="1" width="198" height="198" rx="31" fill="none" stroke="#e2e8f0" strokeWidth="2" />
        </svg>
    );
}
