"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { ActiveOccasionResult } from "@/lib/festivals/occasionEngine";

interface OccasionShowcaseProps {
  occasionData: ActiveOccasionResult | null;
}

export default function OccasionShowcase({ occasionData }: OccasionShowcaseProps) {
  // Fallback banner text if no active occasion in DB
  const titleText = occasionData?.occasion?.name 
    ? `${occasionData.occasion.name} Special` 
    : "Krishna Janmashtami & Teachers' Day Special";

  return (
    <section className="w-full my-1 sm:my-2 px-0">
      <div className="relative overflow-hidden rounded-2xl border border-gold-500/40 bg-gradient-to-r from-[#1c150c] via-[#140e08] to-[#1c150c] px-4 py-3.5 sm:py-4 shadow-[0_4px_20px_rgba(212,175,55,0.15)] text-center flex items-center justify-center min-h-[56px]">
        {/* Left Decorative Gold Ribbon Curve SVG */}
        <div className="absolute left-0 top-0 bottom-0 w-16 pointer-events-none opacity-80 flex items-center">
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full text-gold-500/40">
            <path d="M0 10 Q30 30 0 50 L0 60 Q40 30 0 0 Z" fill="currentColor" opacity="0.3" />
            <path d="M10 5 C35 25 15 45 5 55" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Right Decorative Gold Ribbon Curve SVG */}
        <div className="absolute right-0 top-0 bottom-0 w-16 pointer-events-none opacity-80 flex items-center transform scale-x-[-1]">
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full text-gold-500/40">
            <path d="M0 10 Q30 30 0 50 L0 60 Q40 30 0 0 Z" fill="currentColor" opacity="0.3" />
            <path d="M10 5 C35 25 15 45 5 55" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Banner Title */}
        <h3 className="relative z-10 font-serif text-sm sm:text-base md:text-lg font-medium text-gold-200 tracking-wide px-6">
          {titleText}
        </h3>
      </div>
    </section>
  );
}
