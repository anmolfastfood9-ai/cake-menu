"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BrandIdentity from "@/components/customer/BrandIdentity";

interface NavbarProps {
  restaurantName?: string | null;
  tagline?: string | null;
  logo?: string | null;
  whatsappNumber?: string | null;
  phoneNumber?: string | null;
  showBack?: boolean;
  backHref?: string;
  backLabel?: string;
  pageTitle?: string | null;
}

export default function Navbar({
  restaurantName,
  tagline,
  logo,
  showBack = false,
  backHref = "/menu",
  backLabel = "Back to Menu",
  pageTitle,
}: NavbarProps) {
  /*
   * ------------------------------------------------------------
   * Back / Page Title Mode
   * ------------------------------------------------------------
   */
  if (showBack) {
    return (
      <header
        className="
          sticky
          top-0
          z-40
          w-full
          bg-[#050505]/90
          px-3
          pt-[max(8px,env(safe-area-inset-top))]
          pb-2
          backdrop-blur-md
          supports-[backdrop-filter]:bg-[#050505]/80
          sm:px-4
          sm:pt-3
        "
      >
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-6xl
            items-center
            justify-between
            gap-2.5
            rounded-[22px]
            border
            border-[#BFA15F]/65
            bg-[radial-gradient(ellipse_at_55%_50%,#262015_0%,#14120E_55%,#0B0A08_100%)]
            px-3
            py-2
            shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_0_24px_rgba(212,175,55,0.05)]
            sm:px-4
          "
        >
          {/* Back Button */}
          <Link
            href={backHref}
            aria-label={backLabel}
            className="
              flex
              shrink-0
              items-center
              gap-1
              xs:gap-1.5
              rounded-full
              border
              border-[#D4AF37]/50
              bg-[#15120E]
              px-2
              xs:px-2.5
              py-1.5
              text-[#EBD699]
              transition
              hover:border-[#D4AF37]
              hover:bg-[#1A1711]
              active:scale-95
            "
          >
            <ArrowLeft className="h-3 w-3 xs:h-3.5 xs:w-3.5 text-[#D4AF37] shrink-0" />
            <span className="text-[10px] xs:text-[11px] sm:text-xs font-semibold tracking-tight xs:tracking-wide whitespace-nowrap">
              {backLabel}
            </span>
          </Link>

          {/* Canonical Brand Identity */}
          <BrandIdentity
            variant="back"
            restaurantName={restaurantName}
            tagline={tagline}
            logo={logo}
            pageTitle={pageTitle}
          />

          {/* 100% EGGLESS Badge */}
          <div
            aria-label="100% Eggless"
            className="
              flex
              shrink-0
              flex-col
              items-center
              justify-center
              rounded-[12px]
              border
              border-[#C5A059]/90
              bg-[#12100C]/90
              px-1.5
              xs:px-2.5
              py-1
              text-center
              shadow-[0_0_14px_rgba(212,175,55,0.18)]
              sm:px-3.5
              sm:py-1.5
            "
          >
            <span className="font-mono text-[9.5px] xs:text-[10.5px] font-extrabold leading-none tracking-tight text-[#ECD599] sm:text-xs">
              100%
            </span>
            <span className="mt-0.5 text-[6.5px] xs:text-[7.5px] font-extrabold uppercase tracking-[0.1em] xs:tracking-[0.14em] leading-tight text-[#ECD599] sm:text-[8.5px]">
              EGGLESS
            </span>
          </div>
        </div>
      </header>
    );
  }

  /*
   * ------------------------------------------------------------
   * Default Main Counter Menu Header
   * ------------------------------------------------------------
   */
  return (
    <header
      className="
        sticky
        top-0
        z-40
        w-full
        bg-[#050505]/90
        px-3
        pt-[max(8px,env(safe-area-inset-top))]
        pb-2
        backdrop-blur-md
        supports-[backdrop-filter]:bg-[#050505]/80
        sm:px-4
        sm:pt-3
      "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[430px]
          items-center
          justify-between
          gap-2.5
          rounded-[22px]
          border
          border-[#BFA15F]/65
          bg-[radial-gradient(ellipse_at_55%_50%,#262015_0%,#14120E_55%,#0B0A08_100%)]
          px-3.5
          py-2.5
          shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_0_24px_rgba(212,175,55,0.05)]
          sm:max-w-4xl
          sm:px-4
          md:max-w-6xl
        "
      >
        {/* ======================================================
            LEFT: CANONICAL BRAND IDENTITY
        ====================================================== */}
        <BrandIdentity
          variant="header"
          restaurantName={restaurantName}
          tagline={tagline}
          logo={logo}
        />

        {/* ======================================================
            RIGHT: 100% EGGLESS Badge
        ====================================================== */}
        <div
          aria-label="100% Eggless"
          className="
            flex
            shrink-0
            flex-col
            items-center
            justify-center
            rounded-[14px]
            border
            border-[#C5A059]/90
            bg-[#12100C]/90
            px-3
            py-1.5
            text-center
            shadow-[0_0_14px_rgba(212,175,55,0.18)]
            sm:px-3.5
          "
        >
          <span
            className="
              font-mono
              text-[12.5px]
              font-extrabold
              leading-none
              tracking-tight
              text-[#ECD599]
              sm:text-[13.5px]
            "
          >
            100%
          </span>

          <span
            className="
              mt-0.5
              text-[8.5px]
              font-extrabold
              uppercase
              tracking-[0.14em]
              leading-tight
              text-[#ECD599]
              sm:text-[9.5px]
            "
          >
            EGGLESS
          </span>
        </div>
      </div>
    </header>
  );
}