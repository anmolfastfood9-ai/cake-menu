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
  // Cleanly split brand title and tagline if passed full string
  let title = restaurantName;
  let subtitle = tagline;

  if (title.includes("& Family Restaurant")) {
    title = title.replace("& Family Restaurant", "").trim();
    subtitle = "& Family Restaurant";
  } else if (title.includes("&")) {
    const parts = title.split("&");
    title = parts[0].trim();
    subtitle = "& " + parts.slice(1).join("&").trim();
  }

  return (
    <header className="sticky top-0 z-40 w-full px-3 pt-2 sm:pt-3 bg-[#070605]/95 backdrop-blur-md pb-2">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-[#D4AF37]/35 bg-[#12100e] px-3 py-2 shadow-xl shadow-black/60">
        {/* Left: Round Emerald/Gold Emblem Monogram & Brand Name */}
        <Link href="/menu" className="flex items-center space-x-2.5 sm:space-x-3">
          <div className="relative flex h-11 sm:h-12 w-11 sm:w-12 shrink-0 items-center justify-center rounded-full border border-gold-500/70 bg-[#052b1b] p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.35)]">
            <img
              src="/images/logo_emblem.png"
              alt="Raman Sweet Bakery Logo"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-[12.5px] sm:text-base font-bold tracking-wider text-[#EBD699] leading-tight uppercase">
              {title}
            </span>
            <span className="font-serif text-[10px] sm:text-xs tracking-wide text-[#D8CEBE]/80 font-light leading-tight mt-0.5">
              {subtitle}
            </span>
          </div>
        </Link>

        {/* Right: 2-Line 100% EGGLESS Badge Box */}
        <div className="flex items-center">
          <div className="inline-flex flex-col items-center justify-center rounded-xl border border-[#D4AF37]/80 bg-black/60 px-2.5 sm:px-3 py-1 text-center shadow-[0_0_12px_rgba(212,175,55,0.25)]">
            <span className="text-[12px] sm:text-[13px] font-extrabold text-[#EBD699] font-mono leading-none tracking-tight">
              100%
            </span>
            <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#EBD699] tracking-widest uppercase leading-tight mt-0.5">
              EGGLESS
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
