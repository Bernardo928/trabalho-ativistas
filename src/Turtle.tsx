import React from 'react';

// Flat side-view sea turtle. `flap` in [-1, 1] swings the flippers.
export const Turtle: React.FC<{
  width?: number;
  flap?: number;
  sad?: boolean;
  style?: React.CSSProperties;
}> = ({width = 420, flap = 0, sad = false, style}) => (
  <svg width={width} height={width * 0.7} viewBox="0 0 200 140" style={style}>
    <g transform={`rotate(${-15 + flap * 18} 62 96)`}>
      <ellipse cx="44" cy="104" rx="26" ry="9" fill="#2e8a5c" />
    </g>
    <ellipse cx="170" cy="80" rx="25" ry="18" fill="#5cc28d" />
    <circle cx="178" cy="73" r="5.5" fill="#10243a" />
    <circle cx="179.8" cy="71.2" r="1.8" fill="#fff" />
    <path
      d={sad ? 'M182 88 q6 -4 11 0' : 'M182 85 q6 4 11 -1'}
      stroke="#10243a"
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
    />
    <path d="M28 94 Q36 28 98 26 Q158 28 164 94 Z" fill="#2a7350" />
    <path d="M28 94 L164 94 Q158 104 98 106 Q36 104 28 94Z" fill="#efd894" />
    <path d="M78 38 L118 38 L132 64 L98 84 L64 64Z" fill="#3f9e6c" />
    <path d="M46 72 L64 64 L98 84 L88 93 L38 92Z" fill="#3f9e6c" opacity=".85" />
    <path d="M132 64 L150 72 L156 92 L108 93 L98 84Z" fill="#3f9e6c" opacity=".85" />
    <path d="M40 56 Q60 40 78 38 L64 64 L46 72Z" fill="#358c5e" />
    <path d="M118 38 Q144 42 150 72 L132 64Z" fill="#358c5e" />
    <g transform={`rotate(${18 - flap * 28} 124 96)`}>
      <path d="M112 96 Q150 104 168 128 Q140 124 110 104Z" fill="#45ad78" />
    </g>
  </svg>
);
