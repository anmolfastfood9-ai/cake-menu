"use client";

import React from "react";

interface FestivalOrnamentProps {
  festival: string;
  position: "top" | "bottom";
  className?: string;
}

/**
 * Normalizes any incoming occasion slug, name, or key to a canonical festival ID
 */
function normalizeFestival(slug: string = ""): string {
  const s = slug.toLowerCase().trim();
  if (s.includes("ganesh") || s.includes("vinayak") || s.includes("chaturthi")) return "ganesh-chaturthi";
  if (s.includes("diwali") || s.includes("deepavali") || s.includes("dhanteras")) return "diwali";
  if (s.includes("christmas") || s.includes("xmas")) return "christmas";
  if (s.includes("new-year") || s.includes("newyear")) return "new-year";
  if (s.includes("valentine")) return "valentines-day";
  if (s.includes("holi")) return "holi";
  if (s.includes("raksha") || s.includes("rakhi")) return "raksha-bandhan";
  if (s.includes("eid") || s.includes("ramadan")) return "eid-mubarak";
  if (s.includes("navratri") || s.includes("durga") || s.includes("dussehra") || s.includes("garba")) return "navratri";
  if (s.includes("makar") || s.includes("sankranti") || s.includes("pongal") || s.includes("lohri")) return "makar-sankranti";
  return "default";
}

export default function FestivalOrnament({
  festival,
  position,
  className = "",
}: FestivalOrnamentProps) {
  const key = normalizeFestival(festival);

  if (position === "top") {
    return <TopOrnament festivalKey={key} className={className} />;
  }

  return <BottomOrnament festivalKey={key} className={className} />;
}

/* =========================================================================
   TOP ORNAMENTS (Tiara / Crown / Motif with Symmetrical Flanking Wings)
   ViewBox: 0 0 300 32
   ========================================================================= */
function TopOrnament({ festivalKey, className }: { festivalKey: string; className?: string }) {
  const baseClasses = `w-full h-auto max-w-[140px] xs:max-w-[170px] sm:max-w-[260px] md:max-w-[320px] text-[#F3D78A] ${className || ""}`;

  switch (festivalKey) {
    /* 1. GANESH CHATURTHI: Sacred Blooming Lotus + Temple Diya Apex */
    case "ganesh-chaturthi":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="gc-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#F3D78A" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="gc-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="70%" stopColor="#D4AF37" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#F3D78A" stopOpacity="1" />
            </linearGradient>
            <filter id="gc-top-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#D4AF37" floodOpacity="0.45" />
            </filter>
          </defs>
          {/* Left Wing */}
          <line x1="18" y1="18" x2="128" y2="18" stroke="url(#gc-top-l)" strokeWidth="1" />
          <circle cx="65" cy="18" r="1.3" fill="#D4AF37" opacity="0.6" />
          <polygon points="120,18 123,15.5 126,18 123,20.5" fill="#F3D78A" opacity="0.9" />

          {/* Right Wing */}
          <line x1="172" y1="18" x2="282" y2="18" stroke="url(#gc-top-r)" strokeWidth="1" />
          <polygon points="174,18 177,15.5 180,18 177,20.5" fill="#F3D78A" opacity="0.9" />
          <circle cx="235" cy="18" r="1.3" fill="#D4AF37" opacity="0.6" />

          {/* Center Royal 5-Petal Lotus Bloom (Exact Match to Reference) */}
          <g transform="translate(150, 18)" filter="url(#gc-top-glow)">
            {/* Base Pedestal Bar & Diamond Pip */}
            <line x1="-13" y1="1" x2="13" y2="1" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" />
            <polygon points="0,0 2,2 0,4 -2,2" fill="#F3D78A" />

            {/* Center Tall Flame Petal */}
            <path
              d="M0 -15 C-3.5 -8 -2.5 -1 0 1 C2.5 -1 3.5 -8 0 -15 Z"
              fill="#FFF4D0"
              stroke="#D4AF37"
              strokeWidth="0.8"
            />
            {/* Mid Left Petal */}
            <path
              d="M0 1 C-4 -1 -7.5 -6 -7 -10 C-4 -8 -1 -3 0 0"
              stroke="#F3D78A"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Mid Right Petal */}
            <path
              d="M0 1 C4 -1 7.5 -6 7 -10 C4 -8 1 -3 0 0"
              stroke="#F3D78A"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Outer Left Petal */}
            <path
              d="M-2 1 C-7 0 -13 -3 -13 -7 C-9 -6 -4 -2 -2 0"
              stroke="#D4AF37"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />
            {/* Outer Right Petal */}
            <path
              d="M2 1 C7 0 13 -3 13 -7 C9 -6 4 -2 2 0"
              stroke="#D4AF37"
              strokeWidth="1.1"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        </svg>
      );

    /* 2. DIWALI: Sacred Diya + Flame with Radiating Sparkle Rays */
    case "diwali":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="dw-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#E6C675" stopOpacity="0" />
              <stop offset="100%" stopColor="#E6C675" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="dw-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#E6C675" stopOpacity="0" />
              <stop offset="100%" stopColor="#E6C675" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="15" y1="16" x2="130" y2="16" stroke="url(#dw-top-l)" strokeWidth="1" />
          <polygon points="60,16 63,13 66,16 63,19" fill="#D4AF37" opacity="0.7" />
          <polygon points="105,16 109,12 113,16 109,20" fill="#D4AF37" opacity="0.9" />
          <line x1="170" y1="16" x2="285" y2="16" stroke="url(#dw-top-r)" strokeWidth="1" />
          <polygon points="234,16 237,13 240,16 237,19" fill="#D4AF37" opacity="0.7" />
          <polygon points="187,16 191,12 195,16 191,20" fill="#D4AF37" opacity="0.9" />
          {/* Center Diya with Radiant Flame */}
          <g transform="translate(150, 16)">
            {/* Sparkle Rays */}
            <line x1="0" y1="-15" x2="0" y2="-12" stroke="#FFF9DF" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="-5" y1="-13" x2="-3" y2="-11" stroke="#F3D78A" strokeWidth="1" strokeLinecap="round" />
            <line x1="5" y1="-13" x2="3" y2="-11" stroke="#F3D78A" strokeWidth="1" strokeLinecap="round" />
            {/* Teardrop Flame */}
            <path d="M0 -11 C-2.5 -7 -3 -3 0 0 C3 -3 2.5 -7 0 -11 Z" fill="#FFF4D4" />
            <path d="M0 -8 C-1.5 -5 -1.5 -2 0 0 C1.5 -2 1.5 -5 0 -8 Z" fill="#F5CE68" />
            {/* Brass Diya Bowl */}
            <path d="M-10 1 C-10 6 10 6 10 1 C10 0 -10 0 -10 1 Z" fill="#D4AF37" />
            <path d="M-5 6 L5 6 L3 8 L-3 8 Z" fill="#AA7C11" />
          </g>
        </svg>
      );

    /* 3. CHRISTMAS: Minimalist Winter Snowflake Star + Pine Sprig */
    case "christmas":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="xm-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="xm-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="15" y1="16" x2="130" y2="16" stroke="url(#xm-top-l)" strokeWidth="1" />
          <path d="M75 12 L79 16 L75 20 M83 12 L87 16 L83 20" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="170" y1="16" x2="285" y2="16" stroke="url(#xm-top-r)" strokeWidth="1" />
          <path d="M225 12 L221 16 L225 20 M217 12 L213 16 L217 20" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          {/* Center 8-Point Snowflake Star */}
          <g transform="translate(150, 16)">
            <line x1="0" y1="-12" x2="0" y2="12" stroke="#F3D78A" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="-12" y1="0" x2="12" y2="0" stroke="#F3D78A" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="-8.5" y1="-8.5" x2="8.5" y2="8.5" stroke="#E6C675" strokeWidth="1" strokeLinecap="round" />
            <line x1="-8.5" y1="8.5" x2="8.5" y2="-8.5" stroke="#E6C675" strokeWidth="1" strokeLinecap="round" />
            {/* Diamond chevrons on 4 axes */}
            <path d="M0 -8 L-2 -5 M0 -8 L2 -5" stroke="#F3D78A" strokeWidth="1" strokeLinecap="round" />
            <path d="M0 8 L-2 5 M0 8 L2 5" stroke="#F3D78A" strokeWidth="1" strokeLinecap="round" />
            <path d="M-8 0 L-5 -2 M-8 0 L-5 2" stroke="#F3D78A" strokeWidth="1" strokeLinecap="round" />
            <path d="M8 0 L5 -2 M8 0 L5 2" stroke="#F3D78A" strokeWidth="1" strokeLinecap="round" />
            <circle cx="0" cy="0" r="2" fill="#FFF9DF" />
          </g>
        </svg>
      );

    /* 4. NEW YEAR: Radiating Starburst + Champagne Sparkle Beams */
    case "new-year":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="ny-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="ny-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="15" y1="16" x2="130" y2="16" stroke="url(#ny-top-l)" strokeWidth="1" />
          <circle cx="55" cy="16" r="1.5" fill="#D4AF37" />
          <circle cx="90" cy="16" r="1" fill="#D4AF37" />
          <circle cx="115" cy="16" r="2" fill="#F3D78A" />
          <line x1="170" y1="16" x2="285" y2="16" stroke="url(#ny-top-r)" strokeWidth="1" />
          <circle cx="245" cy="16" r="1.5" fill="#D4AF37" />
          <circle cx="210" cy="16" r="1" fill="#D4AF37" />
          <circle cx="185" cy="16" r="2" fill="#F3D78A" />
          {/* Center Midnight Starburst */}
          <g transform="translate(150, 16)">
            <path d="M0 -14 L2.5 -3 L14 0 L2.5 3 L0 14 L-2.5 3 L-14 0 L-2.5 -3 Z" fill="#F3D78A" />
            <path d="M0 -8 L1.5 -1.5 L8 0 L1.5 1.5 L0 8 L-1.5 1.5 L-8 0 L-1.5 -1.5 Z" fill="#FFF9DF" />
            <circle cx="-9" cy="-9" r="1" fill="#F3D78A" />
            <circle cx="9" cy="-9" r="1" fill="#F3D78A" />
            <circle cx="-9" cy="9" r="1" fill="#F3D78A" />
            <circle cx="9" cy="9" r="1" fill="#F3D78A" />
          </g>
        </svg>
      );

    /* 5. VALENTINE'S DAY: Thin-line Luxury Filigree Heart + Rose Petal Apex */
    case "valentines-day":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="val-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="val-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="15" y1="16" x2="132" y2="16" stroke="url(#val-top-l)" strokeWidth="1" />
          <path d="M90 16 C95 12 105 12 110 16" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.7" />
          <line x1="168" y1="16" x2="285" y2="16" stroke="url(#val-top-r)" strokeWidth="1" />
          <path d="M190 16 C195 12 205 12 210 16" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.7" />
          {/* Center Double-Line Luxury Heart */}
          <g transform="translate(150, 16)">
            <path
              d="M0 -3 C-2 -8 -8 -9 -10 -5 C-12 0 -7 6 0 11 C7 6 12 0 10 -5 C8 -9 2 -8 0 -3 Z"
              stroke="#F3D78A"
              strokeWidth="1.2"
              fill="none"
              strokeLinejoin="round"
            />
            <path
              d="M0 -1 C-1.5 -5 -5 -6 -7 -3 C-8 1 -5 5 0 8 C5 5 8 1 7 -3 C5 -6 1.5 -5 0 -1 Z"
              stroke="#D4AF37"
              strokeWidth="0.8"
              fill="none"
              opacity="0.8"
            />
            <circle cx="0" cy="-6" r="1.2" fill="#FFF9DF" />
          </g>
        </svg>
      );

    /* 6. HOLI: Abstract Swirling Colors & Sacred Gulal Crest */
    case "holi":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="hl-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="hl-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="15" y1="16" x2="130" y2="16" stroke="url(#hl-top-l)" strokeWidth="1" />
          <path d="M80 16 C90 12 100 20 110 16" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.75" />
          <line x1="170" y1="16" x2="285" y2="16" stroke="url(#hl-top-r)" strokeWidth="1" />
          <path d="M190 16 C200 20 210 12 220 16" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.75" />
          {/* Center Swirling Gulal Plume */}
          <g transform="translate(150, 16)">
            <path d="M0 -12 C-5 -5 -8 2 -6 7 C-4 10 4 10 6 7 C8 2 5 -5 0 -12 Z" stroke="#F3D78A" strokeWidth="1.2" fill="none" />
            <circle cx="0" cy="-2" r="3" fill="#D4AF37" opacity="0.85" />
            <circle cx="-8" cy="-6" r="1.2" fill="#F3D78A" opacity="0.8" />
            <circle cx="8" cy="-6" r="1.2" fill="#F3D78A" opacity="0.8" />
            <circle cx="-5" cy="4" r="1" fill="#F3D78A" opacity="0.6" />
            <circle cx="5" cy="4" r="1" fill="#F3D78A" opacity="0.6" />
          </g>
        </svg>
      );

    /* 7. RAKSHA BANDHAN: Sacred Rakhi Medallion & Silken Thread Wings */
    case "raksha-bandhan":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="rb-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="rb-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          {/* Braided/twisted silken cord wings */}
          <path d="M15 16 L70 16 C80 13 90 19 100 16 C110 13 120 19 130 16" stroke="url(#rb-top-l)" strokeWidth="1" fill="none" />
          <path d="M285 16 L230 16 C220 19 210 13 200 16 C190 19 180 13 170 16" stroke="url(#rb-top-r)" strokeWidth="1" fill="none" />
          {/* Center Rakhi Medallion */}
          <g transform="translate(150, 16)">
            {/* Outer Petal Ring */}
            <circle cx="0" cy="0" r="10" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 2" />
            <circle cx="0" cy="0" r="7" stroke="#F3D78A" strokeWidth="1.2" />
            {/* Central Sacred Medallion / Jewel */}
            <polygon points="0,-4 3,0 0,4 -3,0" fill="#FFF9DF" />
            <circle cx="0" cy="0" r="1.5" fill="#AA7C11" />
            {/* Flanking Bead Accents */}
            <circle cx="-13" cy="0" r="1.8" fill="#F3D78A" />
            <circle cx="13" cy="0" r="1.8" fill="#F3D78A" />
          </g>
        </svg>
      );

    /* 8. EID MUBARAK: Crescent Moon + 8-Point Islamic Star */
    case "eid-mubarak":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="eid-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="eid-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="15" y1="16" x2="130" y2="16" stroke="url(#eid-top-l)" strokeWidth="1" />
          {/* Islamic Star Diamond Studs */}
          <polygon points="65,16 68,13 71,16 68,19" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
          <polygon points="105,16 109,12 113,16 109,20" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
          <line x1="170" y1="16" x2="285" y2="16" stroke="url(#eid-top-r)" strokeWidth="1" />
          <polygon points="229,16 232,13 235,16 232,19" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
          <polygon points="187,16 191,12 195,16 191,20" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
          {/* Center Crescent & Star */}
          <g transform="translate(150, 16)">
            {/* Elegant Crescent Moon */}
            <path
              d="M-2 -10 A 10 10 0 1 0 8 7 A 8 8 0 1 1 -2 -10 Z"
              fill="#F3D78A"
              stroke="#D4AF37"
              strokeWidth="0.8"
            />
            {/* 5-pointed Star inside Crescent */}
            <polygon
              points="4,-3 5,-0.5 7.5,-0.5 5.5,1 6.5,3.5 4,2 1.5,3.5 2.5,1 0.5,-0.5 3,-0.5"
              fill="#FFF9DF"
            />
          </g>
        </svg>
      );

    /* 9. NAVRATRI: Crossed Ceremonial Dandiya Sticks + Garba Tassels */
    case "navratri":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="nav-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="nav-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="15" y1="16" x2="130" y2="16" stroke="url(#nav-top-l)" strokeWidth="1" />
          <path d="M70 16 C80 12 90 20 100 16" stroke="#D4AF37" strokeWidth="1" fill="none" />
          <line x1="170" y1="16" x2="285" y2="16" stroke="url(#nav-top-r)" strokeWidth="1" />
          <path d="M200 16 C210 20 220 12 230 16" stroke="#D4AF37" strokeWidth="1" fill="none" />
          {/* Center Crossed Dandiya Sticks */}
          <g transform="translate(150, 16)">
            <line x1="-9" y1="-9" x2="9" y2="9" stroke="#F3D78A" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="-9" y1="9" x2="9" y2="-9" stroke="#F3D78A" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="0" cy="0" r="3" fill="#D4AF37" />
            <circle cx="0" cy="0" r="1.5" fill="#FFF9DF" />
            {/* Small decorative end-caps */}
            <circle cx="-9" cy="-9" r="1.5" fill="#F3D78A" />
            <circle cx="9" cy="9" r="1.5" fill="#F3D78A" />
            <circle cx="-9" cy="9" r="1.5" fill="#F3D78A" />
            <circle cx="9" cy="-9" r="1.5" fill="#F3D78A" />
          </g>
        </svg>
      );

    /* 10. MAKAR SANKRANTI: Radiant Uttarayan Sun & Flying Diamond Kites */
    case "makar-sankranti":
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="ms-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="ms-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="15" y1="16" x2="130" y2="16" stroke="url(#ms-top-l)" strokeWidth="1" />
          {/* Micro diamond kite flight */}
          <polygon points="75,16 78,13 81,16 78,19" fill="#D4AF37" opacity="0.8" />
          <polygon points="105,16 109,12 113,16 109,20" fill="#D4AF37" opacity="0.95" />
          <line x1="170" y1="16" x2="285" y2="16" stroke="url(#ms-top-r)" strokeWidth="1" />
          <polygon points="219,16 222,13 225,16 222,19" fill="#D4AF37" opacity="0.8" />
          <polygon points="187,16 191,12 195,16 191,20" fill="#D4AF37" opacity="0.95" />
          {/* Center Radiant Sun */}
          <g transform="translate(150, 16)">
            <circle cx="0" cy="0" r="4.5" fill="#F3D78A" />
            <circle cx="0" cy="0" r="2.5" fill="#FFF9DF" />
            {/* 12 Radiant Sun Rays */}
            <path
              d="M0 -9 L0 -6 M0 6 L0 9 M-9 0 L-6 0 M6 0 L9 0 M-6.5 -6.5 L-4.5 -4.5 M4.5 4.5 L6.5 6.5 M-6.5 6.5 L-4.5 4.5 M4.5 -4.5 L6.5 -6.5"
              stroke="#F3D78A"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </g>
        </svg>
      );

    /* 11. DEFAULT / SIGNATURE: Royal Pâtisserie Crown & Classical Laurel */
    default:
      return (
        <svg viewBox="0 0 300 32" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="def-top-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="def-top-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.9" />
            </linearGradient>
          </defs>
          <line x1="15" y1="16" x2="130" y2="16" stroke="url(#def-top-l)" strokeWidth="1" />
          <circle cx="70" cy="16" r="1.5" fill="#D4AF37" />
          <circle cx="105" cy="16" r="2" fill="#D4AF37" />
          <line x1="170" y1="16" x2="285" y2="16" stroke="url(#def-top-r)" strokeWidth="1" />
          <circle cx="230" cy="16" r="1.5" fill="#D4AF37" />
          <circle cx="195" cy="16" r="2" fill="#D4AF37" />
          {/* Center 5-Point Royal Crown */}
          <g transform="translate(150, 16)">
            <path
              d="M-9 5 L-11 -4 L-5 -1 L0 -7 L5 -1 L11 -4 L9 5 Z"
              stroke="#F3D78A"
              strokeWidth="1.2"
              fill="none"
              strokeLinejoin="round"
            />
            <circle cx="0" cy="-7" r="1.2" fill="#FFF9DF" />
            <circle cx="-11" cy="-4" r="1" fill="#F3D78A" />
            <circle cx="11" cy="-4" r="1" fill="#F3D78A" />
            <line x1="-9" y1="7" x2="9" y2="7" stroke="#D4AF37" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        </svg>
      );
  }
}

/* =========================================================================
   BOTTOM ORNAMENTS (Pedestal / Symmetrical Royal Thematic Dividers)
   ViewBox: 0 0 320 28
   ========================================================================= */
function BottomOrnament({ festivalKey, className }: { festivalKey: string; className?: string }) {
  const baseClasses = `w-full h-auto max-w-[170px] xs:max-w-[210px] sm:max-w-[290px] md:max-w-[360px] text-[#F3D78A] drop-shadow-[0_1px_6px_rgba(0,0,0,0.95)] ${className || ""}`;

  switch (festivalKey) {
    /* 1. GANESH CHATURTHI: Authentic Kundan Floral Jewel Divider (Exact Match to User Reference) */
    case "ganesh-chaturthi":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="gc-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="65%" stopColor="#D4AF37" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#F3D78A" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="gc-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="65%" stopColor="#D4AF37" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#F3D78A" stopOpacity="1" />
            </linearGradient>
            <filter id="gc-gold-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.2" floodColor="#D4AF37" floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Left Wing Line (Hairline Gold Gradient) */}
          <line x1="22" y1="14" x2="132" y2="14" stroke="url(#gc-b-l)" strokeWidth="1" />
          {/* Left Accent Pearl Dot & Diamond Accent */}
          <circle cx="120" cy="14" r="1.3" fill="#D4AF37" opacity="0.8" />
          <polygon points="136,14 139,11.5 142,14 139,16.5" fill="#F3D78A" stroke="#D4AF37" strokeWidth="0.6" />

          {/* Right Wing Line (Hairline Gold Gradient) */}
          <line x1="188" y1="14" x2="298" y2="14" stroke="url(#gc-b-r)" strokeWidth="1" />
          {/* Right Accent Diamond Accent & Pearl Dot */}
          <polygon points="178,14 181,11.5 184,14 181,16.5" fill="#F3D78A" stroke="#D4AF37" strokeWidth="0.6" />
          <circle cx="200" cy="14" r="1.3" fill="#D4AF37" opacity="0.8" />

          {/* Central 4-Lobed Kundan Floral Diamond Jewel (Matches media_1789038038168.png) */}
          <g transform="translate(160, 14)" filter="url(#gc-gold-glow)">
            {/* 4 Petal Rings / Lobes in Fine-Line Wireframe Gold */}
            {/* Top Petal Ring */}
            <circle cx="0" cy="-5.5" r="3.2" stroke="#F3D78A" strokeWidth="1.1" fill="#0B0806" fillOpacity="0.4" />
            <circle cx="0" cy="-5.5" r="1" fill="#FFF9DF" />
            {/* Bottom Petal Ring */}
            <circle cx="0" cy="5.5" r="3.2" stroke="#F3D78A" strokeWidth="1.1" fill="#0B0806" fillOpacity="0.4" />
            <circle cx="0" cy="5.5" r="1" fill="#FFF9DF" />
            {/* Left Petal Ring */}
            <circle cx="-5.5" cy="0" r="3.2" stroke="#F3D78A" strokeWidth="1.1" fill="#0B0806" fillOpacity="0.4" />
            <circle cx="-5.5" cy="0" r="1" fill="#FFF9DF" />
            {/* Right Petal Ring */}
            <circle cx="5.5" cy="0" r="3.2" stroke="#F3D78A" strokeWidth="1.1" fill="#0B0806" fillOpacity="0.4" />
            <circle cx="5.5" cy="0" r="1" fill="#FFF9DF" />

            {/* Central Diamond Eye Core */}
            <polygon points="0,-4.2 4.2,0 0,4.2 -4.2,0" fill="#F3D78A" stroke="#D4AF37" strokeWidth="0.8" />
            <polygon points="0,-2.3 2.3,0 0,2.3 -2.3,0" fill="#0B0806" />
            <circle cx="0" cy="0" r="1" fill="#FFFDF0" />

            {/* Connecting Links to Flanking Diamonds */}
            <line x1="-8.7" y1="0" x2="-14" y2="0" stroke="#F3D78A" strokeWidth="1" />
            <line x1="8.7" y1="0" x2="14" y2="0" stroke="#F3D78A" strokeWidth="1" />
          </g>
        </svg>
      );

    /* 2. DIWALI: Royal Deepasthambha Sparkle & Firework Diamond Crest */
    case "diwali":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="dw-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="dw-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="134" y2="14" stroke="url(#dw-b-l)" strokeWidth="1" />
          <polygon points="80,14 83,11 86,14 83,17" fill="#D4AF37" opacity="0.6" />
          <line x1="186" y1="14" x2="300" y2="14" stroke="url(#dw-b-r)" strokeWidth="1" />
          <polygon points="234,14 237,11 240,14 237,17" fill="#D4AF37" opacity="0.6" />
          {/* Central Firework Sparkle & Twin Diya Crest */}
          <g transform="translate(160, 14)">
            {/* 8-Point Diamond Radiance */}
            <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#FFF9DF" />
            <circle cx="0" cy="0" r="2.5" fill="#D4AF37" />
            <circle cx="0" cy="0" r="1.2" fill="#FFF9DF" />
            {/* Left & Right Mini Diya Bowls with Teardrop Flame */}
            <path d="M-15 -3 C-17 0 -17 3 -15 5 C-13 3 -13 0 -15 -3 Z" fill="#F3D78A" />
            <path d="M-19 5 C-19 8 -11 8 -11 5 Z" fill="#D4AF37" />
            <path d="M15 -3 C13 0 13 3 15 5 C17 3 17 0 15 -3 Z" fill="#F3D78A" />
            <path d="M11 5 C11 8 19 8 19 5 Z" fill="#D4AF37" />
          </g>
        </svg>
      );

    /* 3. CHRISTMAS: Symmetrical Winter Holly Sprig & Crystalline Pine Needles */
    case "christmas":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="xm-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="xm-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="132" y2="14" stroke="url(#xm-b-l)" strokeWidth="1" />
          <path d="M85 10 L89 14 L85 18" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="188" y1="14" x2="300" y2="14" stroke="url(#xm-b-r)" strokeWidth="1" />
          <path d="M235 10 L231 14 L235 18" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          {/* Winter Holly Sprig & Three Faceted Gold Berries */}
          <g transform="translate(160, 14)">
            {/* Holly Leaves */}
            <path d="M-4 0 C-10 -7 -20 -4 -24 0 C-18 4 -8 7 -4 0" stroke="#D4AF37" strokeWidth="1.1" fill="none" />
            <path d="M4 0 C10 -7 20 -4 24 0 C18 4 8 7 4 0" stroke="#D4AF37" strokeWidth="1.1" fill="none" />
            {/* Berries with Faceted Luster */}
            <circle cx="0" cy="-3" r="2.8" fill="#F3D78A" />
            <circle cx="0" cy="-3" r="1.2" fill="#FFF9DF" />
            <circle cx="-3.5" cy="3" r="2.4" fill="#D4AF37" />
            <circle cx="3.5" cy="3" r="2.4" fill="#D4AF37" />
          </g>
        </svg>
      );

    /* 4. NEW YEAR: Sovereign Midnight Chronometer Dial & Sparkle Radiance */
    case "new-year":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="ny-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="ny-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="136" y2="14" stroke="url(#ny-b-l)" strokeWidth="1" />
          <circle cx="85" cy="14" r="1.5" fill="#D4AF37" opacity="0.6" />
          <circle cx="120" cy="14" r="2" fill="#F3D78A" />
          <line x1="184" y1="14" x2="300" y2="14" stroke="url(#ny-b-r)" strokeWidth="1" />
          <circle cx="235" cy="14" r="1.5" fill="#D4AF37" opacity="0.6" />
          <circle cx="200" cy="14" r="2" fill="#F3D78A" />
          {/* Midnight Chronometer & Radiating Arcs */}
          <g transform="translate(160, 14)">
            <circle cx="0" cy="0" r="9" stroke="#D4AF37" strokeWidth="1.1" fill="none" />
            <circle cx="0" cy="0" r="7" stroke="#F3D78A" strokeWidth="0.6" strokeDasharray="1.5 1.5" fill="none" />
            {/* Midnight Hands */}
            <line x1="0" y1="0" x2="0" y2="-6.5" stroke="#FFF9DF" strokeWidth="1.3" strokeLinecap="round" />
            <line x1="0" y1="0" x2="-2.5" y2="-5" stroke="#F3D78A" strokeWidth="1.1" strokeLinecap="round" />
            <circle cx="0" cy="0" r="1.5" fill="#FFF9DF" />
            {/* Flanking Sparkles */}
            <circle cx="-14" cy="0" r="1.2" fill="#D4AF37" />
            <circle cx="14" cy="0" r="1.2" fill="#D4AF37" />
          </g>
        </svg>
      );

    /* 5. VALENTINE'S DAY: Symmetrical Victorian Botanical Rose Blossom Crest */
    case "valentines-day":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="val-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="val-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="136" y2="14" stroke="url(#val-b-l)" strokeWidth="1" />
          <path d="M100 14 C105 11 115 11 120 14" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6" />
          <line x1="184" y1="14" x2="300" y2="14" stroke="url(#val-b-r)" strokeWidth="1" />
          <path d="M200 14 C205 11 215 11 220 14" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6" />
          {/* Botanical Rose Blossom & Vine Tendrils */}
          <g transform="translate(160, 14)">
            {/* Rose Core */}
            <path d="M0 -6 C-4 -6 -7 -2 -5 2 C-3 6 0 8 0 8 C0 8 3 6 5 2 C7 -2 4 -6 0 -6 Z" stroke="#F3D78A" strokeWidth="1.2" fill="none" />
            <circle cx="0" cy="-1" r="2" fill="#D4AF37" />
            {/* Flanking Heart Vine Curves */}
            <path d="M-8 0 C-12 -4 -16 2 -20 0" stroke="#D4AF37" strokeWidth="1" fill="none" />
            <path d="M8 0 C12 -4 16 2 20 0" stroke="#D4AF37" strokeWidth="1" fill="none" />
            <circle cx="-14" cy="0" r="1.2" fill="#FFF9DF" />
            <circle cx="14" cy="0" r="1.2" fill="#FFF9DF" />
          </g>
        </svg>
      );

    /* 6. HOLI: Concentric Ceremonial Gulal Burst & Wave Ripple Divider */
    case "holi":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="hl-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="hl-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="134" y2="14" stroke="url(#hl-b-l)" strokeWidth="1" />
          <path d="M90 14 C100 10 110 18 120 14" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.7" />
          <line x1="186" y1="14" x2="300" y2="14" stroke="url(#hl-b-r)" strokeWidth="1" />
          <path d="M200 14 C210 18 220 10 230 14" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.7" />
          {/* Concentric Color Ripple & Droplets */}
          <g transform="translate(160, 14)">
            <circle cx="0" cy="0" r="9" stroke="#D4AF37" strokeWidth="1" strokeDasharray="1.5 2" fill="none" />
            <circle cx="0" cy="0" r="5.5" stroke="#F3D78A" strokeWidth="1.2" fill="none" />
            <circle cx="0" cy="0" r="2" fill="#FFF9DF" />
            <circle cx="-14" cy="0" r="1.3" fill="#F3D78A" />
            <circle cx="14" cy="0" r="1.3" fill="#F3D78A" />
          </g>
        </svg>
      );

    /* 7. RAKSHA BANDHAN: Sacred Zari Knot & Thread Medallion Divider */
    case "raksha-bandhan":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="rb-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="rb-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="134" y2="14" stroke="url(#rb-b-l)" strokeWidth="1" />
          <line x1="186" y1="14" x2="300" y2="14" stroke="url(#rb-b-r)" strokeWidth="1" />
          {/* Sacred Infinite Knot & Bead Medallion */}
          <g transform="translate(160, 14)">
            <path
              d="M-8 -5 C-13 -5 -13 5 -8 5 C-3 5 3 -5 8 -5 C13 -5 13 5 8 5 C3 5 -3 -5 -8 -5 Z"
              stroke="#F3D78A"
              strokeWidth="1.3"
              fill="none"
            />
            <circle cx="0" cy="0" r="2.2" fill="#FFF9DF" />
            <circle cx="-15" cy="0" r="1.5" fill="#D4AF37" />
            <circle cx="15" cy="0" r="1.5" fill="#D4AF37" />
          </g>
        </svg>
      );

    /* 8. EID MUBARAK: 8-Point Rub el Hizb Geometric Islamic Star Divider */
    case "eid-mubarak":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="eid-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="eid-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="134" y2="14" stroke="url(#eid-b-l)" strokeWidth="1" />
          <polygon points="90,14 93,11 96,14 93,17" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
          <line x1="186" y1="14" x2="300" y2="14" stroke="url(#eid-b-r)" strokeWidth="1" />
          <polygon points="224,14 227,11 230,14 227,17" stroke="#D4AF37" strokeWidth="0.8" fill="none" />
          {/* Symmetrical Rub el Hizb (Overlapping Square Star) */}
          <g transform="translate(160, 14)">
            <rect x="-6" y="-6" width="12" height="12" stroke="#F3D78A" strokeWidth="1.1" fill="none" />
            <rect x="-6" y="-6" width="12" height="12" stroke="#D4AF37" strokeWidth="1.1" fill="none" transform="rotate(45)" />
            <circle cx="0" cy="0" r="2.2" fill="#FFF9DF" />
            <polygon points="-14,0 -16,-2 -18,0 -16,2" fill="#D4AF37" />
            <polygon points="14,0 16,-2 18,0 16,2" fill="#D4AF37" />
          </g>
        </svg>
      );

    /* 9. NAVRATRI: Garba Floral Mandala & Sacred Kalash Divider */
    case "navratri":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="nav-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="nav-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="134" y2="14" stroke="url(#nav-b-l)" strokeWidth="1" />
          <path d="M85 14 C95 10 105 18 115 14" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6" />
          <line x1="186" y1="14" x2="300" y2="14" stroke="url(#nav-b-r)" strokeWidth="1" />
          <path d="M205 14 C215 18 225 10 235 14" stroke="#D4AF37" strokeWidth="1" fill="none" opacity="0.6" />
          {/* Garba Circular Dance Mandala */}
          <g transform="translate(160, 14)">
            <circle cx="0" cy="0" r="8" stroke="#D4AF37" strokeWidth="1" strokeDasharray="1.5 2" fill="none" />
            <polygon points="0,-5 2.5,-1 5,0 2.5,1 0,5 -2.5,1 -5,0 -2.5,-1" fill="#F3D78A" />
            <circle cx="0" cy="0" r="1.6" fill="#FFF9DF" />
            <circle cx="-14" cy="0" r="1.3" fill="#D4AF37" />
            <circle cx="14" cy="0" r="1.3" fill="#D4AF37" />
          </g>
        </svg>
      );

    /* 10. MAKAR SANKRANTI: Interlocked Diamond Kites & Soaring String Flight */
    case "makar-sankranti":
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="ms-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="ms-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="136" y2="14" stroke="url(#ms-b-l)" strokeWidth="1" />
          <polygon points="85,14 88,11 91,14 88,17" fill="#D4AF37" opacity="0.7" />
          <line x1="184" y1="14" x2="300" y2="14" stroke="url(#ms-b-r)" strokeWidth="1" />
          <polygon points="229,14 232,11 235,14 232,17" fill="#D4AF37" opacity="0.7" />
          {/* Symmetrical Twin Diamond Kites */}
          <g transform="translate(160, 14)">
            <polygon points="0,-7 5,0 0,7 -5,0" stroke="#F3D78A" strokeWidth="1.2" fill="none" />
            <line x1="0" y1="-7" x2="0" y2="7" stroke="#D4AF37" strokeWidth="0.9" />
            <line x1="-5" y1="0" x2="5" y2="0" stroke="#D4AF37" strokeWidth="0.9" />
            <circle cx="-12" cy="0" r="1.4" fill="#D4AF37" />
            <circle cx="12" cy="0" r="1.4" fill="#D4AF37" />
          </g>
        </svg>
      );

    /* 11. DEFAULT / SIGNATURE: Sovereign Raman Sweet Pâtisserie Crest */
    default:
      return (
        <svg viewBox="0 0 320 28" fill="none" className={baseClasses} aria-hidden="true">
          <defs>
            <linearGradient id="def-b-l" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="def-b-r" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.95" />
            </linearGradient>
          </defs>
          <line x1="20" y1="14" x2="134" y2="14" stroke="url(#def-b-l)" strokeWidth="1" />
          <circle cx="85" cy="14" r="1.5" fill="#D4AF37" opacity="0.6" />
          <line x1="186" y1="14" x2="300" y2="14" stroke="url(#def-b-r)" strokeWidth="1" />
          <circle cx="235" cy="14" r="1.5" fill="#D4AF37" opacity="0.6" />
          {/* Classical Royal Diamond Flourish with Acanthus Scrolls */}
          <g transform="translate(160, 14)">
            <polygon points="0,-7 3,-2 8,0 3,2 0,7 -3,2 -8,0 -3,-2" fill="#F3D78A" />
            <circle cx="0" cy="0" r="2.2" fill="#0B0806" />
            <circle cx="0" cy="0" r="1.2" fill="#FFF9DF" />
            <circle cx="-14" cy="0" r="1.4" fill="#D4AF37" />
            <circle cx="14" cy="0" r="1.4" fill="#D4AF37" />
          </g>
        </svg>
      );
  }
}
