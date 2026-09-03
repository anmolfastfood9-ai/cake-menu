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
  restaurantName = "Sweet Delights",
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gold-500/10 bg-[#090807]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        {/* Brand Logo & Line Art Cake with Sparkle */}
        <Link href="/menu" className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="relative text-gold-400">
            <Cake className="h-7 w-7 sm:h-8 sm:w-8 stroke-[1.5]" />
            <Sparkles className="absolute -top-1 -right-1 h-3 w-3 sm:h-3.5 sm:w-3.5 text-gold-300" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#FBF7EE]">
              {restaurantName}
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] tracking-widest text-[#C59B27] uppercase font-bold">
              100% EGGLESS • PURE VEGETARIAN
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link
            href="/menu/cakes"
            className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3.5 sm:px-4 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-gold-300 hover:bg-gold-500/20 transition-all active:scale-95 shadow-gold-sm"
          >
            All Cakes →
          </Link>
        </div>
      </div>
    </header>
  );
}
