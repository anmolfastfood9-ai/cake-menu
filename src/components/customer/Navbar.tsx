"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface NavbarProps {
  restaurantName?: string;
  tagline?: string;
  whatsappNumber?: string;
  phoneNumber?: string;
  showBack?: boolean;
  backHref?: string;
  pageTitle?: string;
}

export default function Navbar({
  restaurantName = "RAMAN SWEET BAKERY",
  tagline = "& Family Restaurant",
  showBack = false,
  backHref = "/menu",
  pageTitle,
}: NavbarProps) {
  /*
   * ------------------------------------------------------------
   * Brand text handling
   * ------------------------------------------------------------
   */
  let title = restaurantName?.trim() || "RAMAN SWEET BAKERY";
  let subtitle = tagline?.trim() || "& Family Restaurant";

  if (title.includes("& Family Restaurant")) {
    title = title.replace("& Family Restaurant", "").trim();
    subtitle = "& Family Restaurant";
  } else if (title.includes("&")) {
    const parts = title.split("&");
    title = parts[0].trim();
    subtitle = `& ${parts.slice(1).join("&").trim()}`;
  }

  /*
   * ------------------------------------------------------------
   * Back/Page title mode
   * ------------------------------------------------------------
   */
  if (showBack) {
    return (
      <header className="sticky top-0 z-40 w-full bg-[#050505]/95 px-3 pt-2 pb-2 backdrop-blur-md sm:px-4 sm:pt-3">
        <div className="mx-auto flex w-full max-w-6xl items-center gap-3 rounded-2xl border border-[#D4AF37]/35 bg-[#0D0C0A]/95 px-3 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.45)] sm:px-4">
          <Link
            href={backHref}
            aria-label="Go back"
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#D4AF37]/45
              bg-[#15120E]
              text-[#EBD699]
              transition
              hover:border-[#D4AF37]
              hover:bg-[#1A1711]
              active:scale-95
            "
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div className="min-w-0 flex-1">
            <p className="truncate font-serif text-sm font-bold text-[#EBD699] sm:text-base">
              {pageTitle || title}
            </p>

            <p className="truncate text-[10px] text-[#BDB4A3] sm:text-[11px]">
              {subtitle}
            </p>
          </div>

          <div
            className="
              flex
              shrink-0
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              border-[#D4AF37]/70
              bg-[#090806]
              px-2.5
              py-1.5
              text-center
              shadow-[0_0_12px_rgba(212,175,55,0.16)]
            "
          >
            <span className="font-mono text-[11px] font-extrabold leading-none text-[#EBD699] sm:text-xs">
              100%
            </span>

            <span className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.14em] leading-tight text-[#EBD699] sm:text-[9px]">
              EGGLESS
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="
        sticky
        top-0
        z-40
        w-full
        bg-[#050505]/95
        px-3
        pt-2
        pb-2
        backdrop-blur-md
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
          gap-3
          rounded-[18px]
          border
          border-[#D4AF37]/40
          bg-[linear-gradient(120deg,#0E0D0A_0%,#13110D_55%,#0A0907_100%)]
          px-3
          py-2.5
          shadow-[0_8px_30px_rgba(0,0,0,0.48),inset_0_0_24px_rgba(212,175,55,0.035)]
          sm:max-w-4xl
          sm:px-3.5
          md:max-w-6xl
          md:px-4
        "
      >
        {/* ======================================================
            LEFT: LOGO + BRAND
        ====================================================== */}
        <Link
          href="/menu"
          className="
            flex
            min-w-0
            flex-1
            items-center
            gap-2.5
            sm:gap-3
          "
        >
          {/* Logo */}
          <div
            className="
              relative
              h-[45px]
              w-[45px]
              shrink-0
              overflow-hidden
              rounded-full
              border
              border-[#D4AF37]/75
              bg-[#062919]
              p-[2px]
              shadow-[0_0_16px_rgba(16,185,129,0.25),0_0_8px_rgba(212,175,55,0.16)]
              sm:h-12
              sm:w-12
            "
          >
            <img
              src="/images/logo_emblem.png"
              alt={`${title} logo`}
              className="h-full w-full rounded-full object-cover"
            />

            {/* Small gold accent dot */}
            <span
              aria-hidden="true"
              className="
                absolute
                bottom-0.5
                right-0.5
                h-2.5
                w-2.5
                rounded-full
                border
                border-[#0B0B09]
                bg-[#D4AF37]
                shadow-[0_0_7px_rgba(212,175,55,0.65)]
              "
            />
          </div>

          {/* Brand text */}
          <div className="min-w-0 flex flex-col text-left">
            <span
              className="
                truncate
                font-serif
                text-[13px]
                font-bold
                uppercase
                leading-[1.05]
                tracking-[0.045em]
                text-[#EBD699]
                sm:text-[15px]
                md:text-base
              "
            >
              {title}
            </span>

            <span
              className="
                mt-0.5
                truncate
                font-serif
                text-[9.5px]
                font-normal
                leading-tight
                tracking-wide
                text-[#D8CEBE]/85
                sm:text-[10.5px]
                md:text-xs
              "
            >
              {subtitle}
            </span>
          </div>
        </Link>

        {/* ======================================================
            RIGHT: 100% EGGLESS
        ====================================================== */}
        <div
          className="
            flex
            shrink-0
            items-center
            justify-center
          "
        >
          <div
            className="
              flex
              min-w-[68px]
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              border-[#D4AF37]/80
              bg-[#090806]
              px-2.5
              py-1.5
              text-center
              shadow-[0_0_14px_rgba(212,175,55,0.16)]
              sm:min-w-[73px]
              sm:px-3
            "
          >
            <span
              className="
                font-mono
                text-[11px]
                font-extrabold
                leading-none
                tracking-tight
                text-[#F0DEA3]
                sm:text-xs
              "
            >
              100%
            </span>

            <span
              className="
                mt-0.5
                text-[8px]
                font-bold
                uppercase
                tracking-[0.12em]
                leading-tight
                text-[#EBD699]
                sm:text-[8.5px]
              "
            >
              EGGLESS
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}