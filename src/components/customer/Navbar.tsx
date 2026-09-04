"use client";

import Link from "next/link";
import { Cake, Sparkles } from "lucide-react";

interface NavbarProps {
  restaurantName?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  showBack?: boolean;
  backHref?: string;
  pageTitle?: string;
}

export default function Navbar({
  restaurantName = "RAMAN SWEET BAKERY",
  tagline = "& Family Restaurant",
}: NavbarProps & { tagline?: string }) {
  const displayName = restaurantName.toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full px-3 pt-2 sm:pt-3 bg-[#090807]/90 backdrop-blur-md pb-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-gold-500/30 bg-[#0c0a08]/95 px-3.5 py-2.5 shadow-xl">
        {/* Left: Round Emblem Monogram & Brand Name */}
        <Link href="/menu" className="flex items-center space-x-2.5">
          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-emerald-500/60 bg-[#0a1811] text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
            <span className="font-serif text-sm font-bold tracking-tighter text-emerald-400">R</span>
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-gold-500 text-[6px] text-luxury-950 font-bold">✨</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-xs sm:text-sm font-bold tracking-wider text-[#FBF7EE] leading-tight">
              {displayName}
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-tight text-gold-400/90 font-medium">
              {tagline || "& Family Restaurant"}
            </span>
          </div>
        </Link>

        {/* Right: 100% EGGLESS Badge */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-lg border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-gold-300 tracking-wider shadow-sm">
            100% EGGLESS
          </span>
        </div>
      </div>
    </header>
  );
}
