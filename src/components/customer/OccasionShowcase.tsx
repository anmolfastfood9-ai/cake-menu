"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { ActiveOccasionResult } from "@/lib/festivals/occasionEngine";

interface OccasionShowcaseProps {
  occasionData: ActiveOccasionResult | null;
}

export default function OccasionShowcase({ occasionData }: OccasionShowcaseProps) {
  const text = occasionData?.occasion?.name || "Krishna Janmashtami & Teachers' Day Special";

  // Split text if it contains & or and
  let line1 = text;
  let line2 = "";

  if (text.includes(" & ")) {
    const parts = text.split(" & ");
    line1 = parts[0] + " &";
    line2 = parts.slice(1).join(" & ");
  } else if (text.includes(" Special")) {
    line1 = text.replace(" Special", "");
    line2 = "Special";
  }

  return (
    <section className="w-full my-1 px-0">
      <div className="relative overflow-hidden rounded-2xl border border-[#D4AF37]/50 bg-[#120d08] shadow-[0_4px_20px_rgba(212,175,55,0.2)] text-center min-h-[66px] flex flex-col items-center justify-center py-2.5 px-4">
        {/* Background Image of Gold Ribbon & Mandala Banner Frame */}
        <div className="absolute inset-0 z-0 opacity-95">
          <img
            src="/images/festival_banner_frame.png"
            alt="Festival Occasion Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Dynamic Fallback Text Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center space-y-0.5 pointer-events-none">
          {line2 ? (
            <>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#F1E0AE] tracking-wide leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {line1}
              </h3>
              <h4 className="font-serif text-xs sm:text-sm font-bold text-[#EBD699] tracking-wider leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
                {line2}
              </h4>
            </>
          ) : (
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#EBD699] tracking-wide leading-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
              {line1}
            </h3>
          )}

          {/* Filigree Gold Rule Divider */}
          <div className="flex items-center justify-center gap-2 pt-0.5 opacity-80">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
            <span className="text-[8px] text-[#D4AF37]">❖</span>
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
