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
  restaurantName = "Raman Sweet & Luxury Pâtisserie",
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gold-500/20 bg-[#090807]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        {/* Brand Logo & Crown Icon */}
        <Link href="/menu" className="flex items-center space-x-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full border border-emerald-500/40 bg-[#0d1812] text-gold-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <Cake className="h-5 w-5 stroke-[1.75]" />
            <Sparkles className="absolute -top-0.5 -right-0.5 h-3 w-3 text-emerald-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-base sm:text-lg font-bold tracking-tight text-[#FBF7EE] leading-tight">
              RAMAN SWEET BAKERY
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-wider text-gold-400/90 font-medium">
              & Family Restaurant
            </span>
          </div>
        </Link>

        {/* 100% Eggless Badge */}
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center rounded-lg border border-gold-500/40 bg-gold-500/10 px-2.5 py-1 text-[10px] sm:text-[11px] font-bold text-gold-300 tracking-wider">
            100% EGGLESS
          </span>
          <Link
            href="/menu/cakes"
            className="inline-flex items-center space-x-1 rounded-lg border border-gold-500/50 bg-gold-gradient px-3 py-1 text-[11px] font-bold text-luxury-950 shadow-md hover:opacity-95 transition-all active:scale-95 shrink-0"
          >
            <span>All Cakes →</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
