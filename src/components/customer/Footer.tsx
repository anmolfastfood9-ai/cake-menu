"use client";

import {
  MapPin,
  Clock,
  Phone,
  Instagram,
  Facebook,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";
import BrandIdentity, {
  getCleanBrandData,
} from "@/components/customer/BrandIdentity";

/*
 * ============================================================
 * SUBTLE BOTANICAL CORNER ORNAMENT
 * Delicate luxury patisserie leaf-line filigree
 * ============================================================
 */
function BotanicalCornerOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Primary Stem */}
      <path
        d="M200 200C160 180 120 145 95 95C75 55 70 15 70 0"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
      {/* Secondary Stem */}
      <path
        d="M200 170C155 155 125 120 110 80C100 50 102 20 105 5"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        strokeLinecap="round"
      />
      {/* Botanical Leaves along Primary Stem */}
      <path
        d="M95 95C85 82 72 78 58 82C68 96 82 99 95 95Z"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M108 115C120 105 134 105 145 114C136 126 122 126 108 115Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M80 65C68 54 54 53 42 60C50 73 65 74 80 65Z"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M88 40C98 30 112 28 124 35C118 48 104 50 88 40Z"
        fill="currentColor"
        fillOpacity="0.25"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      <path
        d="M72 25C62 16 50 16 40 24C48 35 60 35 72 25Z"
        fill="currentColor"
        fillOpacity="0.35"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      {/* Lower Flourish Leaf */}
      <path
        d="M140 155C148 140 162 136 175 142C168 156 154 160 140 155Z"
        fill="currentColor"
        fillOpacity="0.3"
        stroke="currentColor"
        strokeWidth="0.8"
      />
      {/* Delicate Tendrils */}
      <path
        d="M125 135C138 128 152 130 162 122C168 116 168 108 160 105"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      <path
        d="M88 78C78 72 68 74 60 68C54 62 56 54 64 52"
        stroke="currentColor"
        strokeWidth="0.75"
        strokeLinecap="round"
      />
      {/* Subtle Flourish Bud Dots */}
      <circle cx="160" cy="105" r="1.5" fill="currentColor" />
      <circle cx="64" cy="52" r="1.5" fill="currentColor" />
      <circle cx="105" cy="5" r="1.5" fill="currentColor" />
    </svg>
  );
}

interface FooterProps {
  restaurantName?: string | null;
  tagline?: string | null;
  logo?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  address?: string | null;
  openingHours?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  footerText?: string | null;
}

export default function Footer({
  restaurantName,
  tagline,
  logo,
  phone,
  whatsapp,
  address,
  openingHours,
  instagram,
  facebook,
  footerText,
}: FooterProps) {
  const { title: safeRestaurantName } = getCleanBrandData({
    restaurantName,
    tagline,
    logo,
  });

  const safePhone = phone || "+91 98765 43210";
  const safeWhatsapp = whatsapp || "919876543210";
  const safeAddress =
    address || "123, Bakery Street, Patna, Bihar 800001";
  const safeOpeningHours =
    openingHours || "10:00 AM – 10:00 PM (All Days)";
  const safeFooterText =
    footerText ||
    `© 2026 ${safeRestaurantName}. All rights reserved.`;

  const waLink = generateGeneralWhatsAppLink(
    safeWhatsapp,
    safeRestaurantName
  );

  const instagramHandle = instagram
    ? instagram
        .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "@")
        .replace(/\/$/, "")
    : "";

  const facebookHandle = facebook
    ? facebook
        .replace(/^https?:\/\/(www\.)?facebook\.com\//i, "")
        .replace(/\/$/, "") || "Facebook"
    : "";

  return (
    <footer
      className="
        relative
        overflow-hidden
        border-t
        border-[#D4AF37]/20
        bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,#18140D_0%,#090807_100%)]
        text-[#EDE4D3]
      "
    >
      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-4xl
          px-6
          py-6
          sm:py-7
        "
      >
        {/* ======================================================
            1. BRAND HEADER (Canonical Brand Identity)
        ====================================================== */}
        <BrandIdentity
          variant="footer"
          restaurantName={restaurantName}
          tagline={tagline}
          logo={logo}
        />

        {/* ======================================================
            2. LUXURY DIVIDER WITH DIAMOND ACCENT
        ====================================================== */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
          <span className="absolute bg-[#0D0B08] px-2.5 text-[8px] text-[#D4AF37]/75 select-none">
            ✦
          </span>
        </div>

        {/* ======================================================
            MAIN INFO (Jewel Icon Badges & Micro-Pill Buttons)
        ====================================================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-4
            text-left
            sm:gap-5
            md:grid-cols-2
            md:gap-6
            lg:grid-cols-4
          "
        >
          {/* 3. VISIT US */}
          <div className="flex flex-col">
            <div className="mb-1.5 flex items-center gap-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#C5A059]/35 bg-[#14120D] text-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.12)]">
                <MapPin className="h-2.5 w-2.5" />
              </div>
              <span
                className="
                  text-[9.5px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#C5A96A]
                "
              >
                VISIT US
              </span>
            </div>

            <p className="text-[12px] leading-relaxed text-[#F0EAE1]">
              {safeAddress}
            </p>
          </div>

          {/* 4. OPENING HOURS */}
          <div className="flex flex-col">
            <div className="mb-1.5 flex items-center gap-2">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#C5A059]/35 bg-[#14120D] text-[#D4AF37] shadow-[0_0_8px_rgba(212,175,55,0.12)]">
                <Clock className="h-2.5 w-2.5" />
              </div>
              <span
                className="
                  text-[9.5px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#C5A96A]
                "
              >
                OPENING HOURS
              </span>
            </div>

            <p className="text-[12px] leading-relaxed text-[#F0EAE1]">
              {safeOpeningHours}
            </p>
          </div>

          {/* 5. CONTACT */}
          <div className="flex flex-col">
            <span
              className="
                mb-1.5
                text-[9.5px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#C5A96A]
              "
            >
              CONTACT
            </span>

            <div className="flex flex-col items-start gap-1.5">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  group
                  inline-flex
                  w-fit
                  max-w-full
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-[#25D366]/30
                  bg-[#0C1A11]/75
                  px-2.5
                  py-1.5
                  text-[11.5px]
                  text-[#25D366]
                  shadow-[0_2px_8px_rgba(37,211,102,0.1)]
                  transition-all
                  duration-200
                  hover:border-[#25D366]/60
                  hover:bg-[#0C1A11]
                  hover:shadow-[0_2px_12px_rgba(37,211,102,0.2)]
                "
              >
                <WhatsAppIcon
                  className="h-4 w-4 shrink-0 text-[#25D366]"
                />
                <span className="font-medium">WhatsApp</span>
                <span className="text-[9px] text-[#25D366]/60 transition-transform duration-200 group-hover:translate-x-0.5">
                  →
                </span>
              </a>

              <a
                href={`tel:${safePhone.replace(/[^\d+]/g, "")}`}
                className="
                  inline-flex
                  w-fit
                  max-w-full
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-[#C5A059]/30
                  bg-[#15120C]/75
                  px-2.5
                  py-1.5
                  text-[11.5px]
                  text-[#F0EAE1]
                  shadow-[0_2px_8px_rgba(197,160,89,0.08)]
                  transition-all
                  duration-200
                  hover:border-[#C5A059]/60
                  hover:bg-[#15120C]
                  hover:text-[#D4AF37]
                  hover:shadow-[0_2px_12px_rgba(212,175,55,0.18)]
                "
              >
                <Phone className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                <span className="truncate">{safePhone}</span>
              </a>
            </div>
          </div>

          {/* 6. CONNECT */}
          <div className="flex flex-col">
            <span
              className="
                mb-1.5
                text-[9.5px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[#C5A96A]
              "
            >
              CONNECT
            </span>

            <div className="flex flex-col items-start gap-1.5">
              {instagram && (
                <a
                  href={
                    instagram.startsWith("http")
                      ? instagram
                      : `https://${instagram}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    w-fit
                    max-w-full
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-white/[0.08]
                    bg-[#12110D]/75
                    px-2.5
                    py-1.5
                    text-[11.5px]
                    text-[#F0EAE1]
                    transition-all
                    duration-200
                    hover:border-[#C5A059]/50
                    hover:bg-[#15120C]
                    hover:text-[#D4AF37]
                  "
                >
                  <Instagram className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                  <span className="truncate">{instagramHandle}</span>
                </a>
              )}

              {facebook && (
                <a
                  href={
                    facebook.startsWith("http")
                      ? facebook
                      : `https://${facebook}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    w-fit
                    max-w-full
                    items-center
                    gap-2
                    rounded-lg
                    border
                    border-white/[0.08]
                    bg-[#12110D]/75
                    px-2.5
                    py-1.5
                    text-[11.5px]
                    text-[#F0EAE1]
                    transition-all
                    duration-200
                    hover:border-[#C5A059]/50
                    hover:bg-[#15120C]
                    hover:text-[#D4AF37]
                  "
                >
                  <Facebook className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />
                  <span className="truncate">/{facebookHandle}</span>
                </a>
              )}

              {!instagram && !facebook && (
                <span className="text-[11px] text-[#8E867A]">
                  Follow us on social media
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ======================================================
            7. BOTTOM DIVIDER WITH DIAMOND ACCENT
        ====================================================== */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent" />
          <span className="absolute bg-[#0D0B08] px-2.5 text-[8px] text-[#D4AF37]/75 select-none">
            ✦
          </span>
        </div>

        {/* ======================================================
            8. COPYRIGHT
        ====================================================== */}
        <div className="text-center">
          <p className="text-[10px] leading-relaxed text-[#948D82]">
            {safeFooterText}
          </p>
        </div>
      </div>

      {/* ======================================================
          DECORATIVE BOTANICAL CORNER ORNAMENTS
      ====================================================== */}
      {/* Right Corner (Primary) */}
      <div
        className="
          pointer-events-none
          select-none
          absolute
          bottom-0
          right-0
          z-0
          overflow-hidden
          text-[#C5A059]
          opacity-[0.08]
          transition-opacity
          duration-500
          sm:opacity-[0.12]
          md:opacity-[0.15]
        "
        aria-hidden="true"
      >
        <BotanicalCornerOrnament
          className="
            h-24
            w-24
            translate-x-2
            translate-y-2
            sm:h-36
            sm:w-36
            sm:translate-x-1
            sm:translate-y-1
            md:h-48
            md:w-48
            md:translate-x-0
            md:translate-y-0
            lg:h-56
            lg:w-56
          "
        />
      </div>

      {/* Left Corner (Subtle Mirrored Accent) */}
      <div
        className="
          pointer-events-none
          select-none
          absolute
          bottom-0
          left-0
          z-0
          overflow-hidden
          text-[#C5A059]
          opacity-[0.05]
          transition-opacity
          duration-500
          sm:opacity-[0.07]
          md:opacity-[0.09]
          -scale-x-100
        "
        aria-hidden="true"
      >
        <BotanicalCornerOrnament
          className="
            h-20
            w-20
            translate-x-2
            translate-y-2
            sm:h-28
            sm:w-28
            md:h-36
            md:w-36
          "
        />
      </div>
    </footer>
  );
}