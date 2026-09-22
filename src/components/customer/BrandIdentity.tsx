"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

/*
 * ============================================================
 * CANONICAL BRAND DEFAULTS (Single Source of Truth)
 * ============================================================
 */
export const DEFAULT_BRAND_NAME = "Raman Sweet Bakery";
export const DEFAULT_BRAND_TAGLINE = "& Family Restaurant";
export const DEFAULT_BRAND_LOGO = "/images/logo_emblem.png";

/**
 * Normalizes dynamic brand fields from WebsiteSetting
 */
export function getCleanBrandData({
  restaurantName,
  tagline,
  logo,
}: {
  restaurantName?: string | null;
  tagline?: string | null;
  logo?: string | null;
}) {
  let rawTitle = (restaurantName || DEFAULT_BRAND_NAME).trim();
  let rawTagline = (tagline || DEFAULT_BRAND_TAGLINE).trim();

  // If restaurantName contains '& Family Restaurant', cleanly split it
  if (rawTitle.toLowerCase().includes("& family restaurant")) {
    rawTitle = rawTitle.replace(/&\s*family\s*restaurant/i, "").trim();
    if (!tagline) rawTagline = DEFAULT_BRAND_TAGLINE;
  } else if (rawTitle.toLowerCase().includes("family restaurant")) {
    rawTitle = rawTitle.replace(/family\s*restaurant/i, "").trim();
    if (!tagline) rawTagline = DEFAULT_BRAND_TAGLINE;
  }

  const cleanLogo =
    logo && logo.trim() && !logo.includes("placeholder")
      ? logo.trim()
      : DEFAULT_BRAND_LOGO;

  return {
    title: rawTitle || DEFAULT_BRAND_NAME,
    subtitle: rawTagline || DEFAULT_BRAND_TAGLINE,
    logo: cleanLogo,
  };
}

/**
 * Reusable Brand Logo component with uniform fallback and styling
 */
export function BrandLogo({
  logo,
  alt = "Brand Logo",
  size = 44,
  className = "",
  priority = false,
}: {
  logo?: string | null;
  alt?: string;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const [imgError, setImgError] = useState(false);

  // Reset error state when logo prop updates
  useEffect(() => {
    setImgError(false);
  }, [logo]);

  const cleanLogoSrc =
    !imgError && logo && logo.trim() && !logo.includes("placeholder")
      ? logo.trim()
      : DEFAULT_BRAND_LOGO;

  return (
    <div
      className={`
        relative
        shrink-0
        rounded-full
        overflow-hidden
        border
        border-[#C5A059]/50
        bg-[#12100C]
        shadow-[0_0_16px_rgba(212,175,55,0.18)]
        ${className}
      `}
      style={{ width: size, height: size }}
    >
      <Image
        src={cleanLogoSrc}
        alt={alt}
        fill
        sizes={`${size}px`}
        priority={priority}
        className="rounded-full object-cover"
        onError={() => setImgError(true)}
      />
    </div>
  );
}

export interface BrandIdentityProps {
  restaurantName?: string | null;
  tagline?: string | null;
  logo?: string | null;
  variant?: "header" | "footer" | "back";
  pageTitle?: string | null;
  className?: string;
}

/**
 * Canonical BrandIdentity Component for Header, Footer & Back Nav
 */
export default function BrandIdentity({
  restaurantName,
  tagline,
  logo,
  variant = "header",
  pageTitle,
  className = "",
}: BrandIdentityProps) {
  const { title, subtitle, logo: cleanLogo } = getCleanBrandData({
    restaurantName,
    tagline,
    logo,
  });

  if (variant === "footer") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <Link
          href="/menu"
          className="group flex flex-col items-center transition-opacity hover:opacity-90"
        >
          {/* Royal Medallion Logo Frame */}
          <div className="relative mb-2 flex items-center justify-center">
            <div className="absolute -inset-1 rounded-full border border-[#D4AF37]/25 opacity-70 transition-transform duration-300 group-hover:scale-105" />
            <BrandLogo
              logo={cleanLogo}
              alt={`${title} Logo`}
              size={44}
              className="border-[#D4AF37]/60 shadow-[0_0_18px_rgba(212,175,55,0.22)] transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          {/* Restaurant Title with subtle royal gold shimmer */}
          <h3 className="font-sans text-[18px] font-bold tracking-tight text-[#FAF5EB] sm:text-[20px]">
            {title}
          </h3>

          {/* Tagline with elegant micro-accents */}
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[10.5px] font-medium tracking-wide text-[#C5A96A] sm:text-[11.5px]">
            <span className="text-[7px] text-[#D4AF37]/60">✦</span>
            <span>{subtitle}</span>
            <span className="text-[7px] text-[#D4AF37]/60">✦</span>
          </div>
        </Link>
      </div>
    );
  }

  if (variant === "back") {
    return (
      <Link
        href="/menu"
        className={`flex min-w-0 flex-1 items-center justify-center sm:justify-start gap-2 transition-opacity hover:opacity-95 ${className}`}
      >
        <BrandLogo
          logo={cleanLogo}
          alt={`${title} Logo`}
          size={36}
          className="hidden sm:block shrink-0 sm:h-[38px] sm:w-[38px]"
        />
        <div className="min-w-0 flex flex-col text-center sm:text-left justify-center overflow-hidden">
          <span className="truncate font-sans text-[11.5px] xs:text-[12.5px] sm:text-[14px] font-bold uppercase leading-tight tracking-[0.025em] text-[#E7CA85]">
            {title}
          </span>
          <span className="truncate font-sans text-[9.5px] xs:text-[10px] sm:text-[11.5px] font-normal leading-tight tracking-normal text-[#EAE2D3]">
            {pageTitle || subtitle}
          </span>
        </div>
      </Link>
    );
  }

  // Default: Header / Navbar
  return (
    <Link
      href="/menu"
      className={`flex min-w-0 flex-1 items-center gap-3 transition-opacity hover:opacity-95 ${className}`}
    >
      <BrandLogo
        logo={cleanLogo}
        alt={`${title} Logo`}
        size={44}
        priority
        className="sm:h-[48px] sm:w-[48px]"
      />

      <div className="min-w-0 flex flex-col text-left justify-center">
        <span className="font-sans text-[14px] font-bold uppercase leading-tight tracking-[0.025em] text-[#E7CA85] sm:text-[16px] md:text-[17px] whitespace-nowrap">
          {title}
        </span>

        <span className="mt-0.5 font-sans text-[11.5px] font-normal leading-tight tracking-normal text-[#EAE2D3] sm:text-[13px] md:text-[13.5px] whitespace-nowrap">
          {subtitle}
        </span>
      </div>
    </Link>
  );
}
