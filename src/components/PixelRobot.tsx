"use client";

import React from "react";

interface PixelRobotProps {
  size?: number;
  className?: string;
  animated?: boolean;
}

export default function PixelRobot({ size = 36, className = "", animated = true }: PixelRobotProps) {
  return (
    <div
      className={`pixel-robot-wrapper relative inline-flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size * 1.125 }}
    >
      <svg
        viewBox="0 0 32 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full ${animated ? "pixel-robot-animated" : ""}`}
        style={{
          imageRendering: "pixelated",
          filter: "drop-shadow(0 2px 6px rgba(0, 132, 255, 0.35))",
        }}
      >
        <defs>
          {/* Blue Screen Gradient */}
          <linearGradient id="robotScreenGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#0070F3" />
          </linearGradient>

          {/* Antenna Glow Filter */}
          <radialGradient id="antennaOrbGlow" cx="40%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#80E5FF" />
            <stop offset="40%" stopColor="#00BFFF" />
            <stop offset="100%" stopColor="#0066CC" />
          </radialGradient>

          {/* Body Bevel Gradient */}
          <linearGradient id="robotBodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="85%" stopColor="#ECEEF2" />
            <stop offset="100%" stopColor="#D4D9E2" />
          </linearGradient>

          {/* Chest Badge Gradient */}
          <linearGradient id="chestBadgeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0062D6" />
            <stop offset="100%" stopColor="#00449E" />
          </linearGradient>
        </defs>

        {/* --- ANTENNA --- */}
        <g className={animated ? "robot-antenna-anim" : ""}>
          {/* Dark Base */}
          <path d="M14 6.5H18L17 7.8H15L14 6.5Z" fill="#3B3D4A" />
          {/* Dark Angled Wire */}
          <path
            d="M16 6.5L19.5 4L22.2 2.5"
            stroke="#2B2D38"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Cyan Glow Orb */}
          <circle cx="22.5" cy="2.5" r="2.2" fill="url(#antennaOrbGlow)" />
          {/* Specular Glint */}
          <circle cx="21.8" cy="1.8" r="0.65" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* --- LEGS --- */}
        <g fill="#D8DDE6">
          <rect x="12" y="30.5" width="2.4" height="3" rx="1" />
          <rect x="17.6" y="30.5" width="2.4" height="3" rx="1" />
        </g>

        {/* --- ARMS --- */}
        <g fill="#E6EAF0">
          {/* Left Arm */}
          <path d="M7 23.8C6.3 24.8 6.5 26.5 7.5 27.5C8.3 28.3 9.4 27.6 9.8 26.5L9.8 23.5L7 23.8Z" />
          {/* Right Arm */}
          <path d="M25 23.8C25.7 24.8 25.5 26.5 24.5 27.5C23.7 28.3 22.6 27.6 22.2 26.5L22.2 23.5L25 23.8Z" />
        </g>

        {/* --- BODY / TORSO --- */}
        <rect x="9.8" y="23" width="12.4" height="8.2" rx="2.5" fill="url(#robotBodyGrad)" />
        {/* Chest Screen Badge */}
        <rect x="13.2" y="25" width="5.6" height="4.5" rx="1.2" fill="url(#chestBadgeGrad)" />
        {/* Chest Pixel Face / Space Invader Matrix inside badge */}
        <g fill="#93C5FD">
          <rect x="14.2" y="26" width="0.9" height="1" />
          <rect x="16.9" y="26" width="0.9" height="1" />
          <rect x="15" y="27" width="2" height="0.8" />
          <rect x="14.4" y="28" width="0.8" height="0.8" />
          <rect x="16.8" y="28" width="0.8" height="0.8" />
        </g>

        {/* --- HEAD / MONITOR CASING --- */}
        {/* Outer Shadow/Bevel */}
        <rect x="5.2" y="7.5" width="21.6" height="16.5" rx="4.5" fill="#C8CDD8" />
        {/* Outer White Shell */}
        <rect x="5.2" y="7" width="21.6" height="16" rx="4.5" fill="#FFFFFF" />
        {/* Inner Light Bevel */}
        <rect x="6.4" y="8" width="19.2" height="14" rx="3.5" fill="#E2E6EE" />

        {/* --- MONITOR SCREEN --- */}
        <rect x="7.4" y="8.8" width="17.2" height="12.4" rx="2.6" fill="url(#robotScreenGrad)" />

        {/* Top-Left Delta Triangle "△" */}
        <path
          d="M9.8 11.8L11.2 9.6L12.6 11.8H9.8Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.85"
          strokeLinejoin="round"
          opacity="0.95"
        />

        {/* Pixel Eyes */}
        <g fill="#181B26">
          {/* Left Eye */}
          <rect x="11.8" y="13.2" width="1.4" height="3.2" rx="0.3" className={animated ? "robot-eye-blink" : ""} />
          {/* Right Eye */}
          <rect x="18.8" y="13.2" width="1.4" height="3.2" rx="0.3" className={animated ? "robot-eye-blink" : ""} />
        </g>

        {/* Pink Blush Cheeks */}
        <g fill="#FF6B98" opacity="0.95">
          {/* Left Blush */}
          <rect x="9.5" y="16.8" width="2.8" height="1.6" rx="0.8" />
          <circle cx="10.9" cy="17.6" r="0.6" fill="#FFA3BE" />
          {/* Right Blush */}
          <rect x="19.7" y="16.8" width="2.8" height="1.6" rx="0.8" />
          <circle cx="21.1" cy="17.6" r="0.6" fill="#FFA3BE" />
        </g>

        {/* Cute Mouth */}
        <path
          d="M14.9 17.2C15.4 17.6 16.6 17.6 17.1 17.2"
          stroke="#0D3B66"
          strokeWidth="0.85"
          strokeLinecap="round"
        />

        {/* Screen Corner Glint / Scanline highlights */}
        <rect x="7.8" y="9.2" width="16.4" height="0.6" rx="0.3" fill="#FFFFFF" opacity="0.25" />
      </svg>
    </div>
  );
}
