"use client";

import Link from "next/link";
import {
  Cake,
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  Instagram,
  Facebook,
} from "lucide-react";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";

interface FooterProps {
  restaurantName?: string | null;
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
  phone,
  whatsapp,
  address,
  openingHours,
  instagram,
  facebook,
  footerText,
}: FooterProps) {
  const safeRestaurantName =
    restaurantName || "Raman Sweet & Luxury Pâtisserie";

  const safePhone = phone || "+91 98765 43210";
  const safeWhatsapp = whatsapp || "919876543210";
  const safeAddress =
    address || "123, Bakery Street, Patna, Bihar 800001";
  const safeOpeningHours =
    openingHours || "10:00 AM – 10:00 PM (All Days)";
  const safeFooterText =
    footerText ||
    "© 2026 Raman Sweet & Luxury Pâtisserie. All rights reserved.";

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
        border-t
        border-[#D4AF37]/15
        bg-[#070605]
        text-[#EDE4D3]
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-6xl
          px-6
          py-8
          lg:px-8
        "
      >
        {/* ======================================================
            TOP BRAND ROW
        ====================================================== */}
        <div
          className="
            flex
            flex-col
            gap-5
            border-b
            border-white/[0.07]
            pb-6
            md:flex-row
            md:items-center
            md:justify-between
          "
        >
          {/* Brand */}
          <Link
            href="/menu"
            className="
              flex
              min-w-0
              items-center
              gap-3
              transition-opacity
              hover:opacity-90
            "
          >
            <div
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-[#D4AF37]/40
                bg-[#11100D]
                text-[#D4AF37]
                shadow-[0_0_15px_rgba(212,175,55,0.10)]
              "
            >
              <Cake className="h-4.5 w-4.5" />
            </div>

            <div className="min-w-0">
              <span
                className="
                  block
                  truncate
                  font-serif
                  text-lg
                  font-bold
                  leading-tight
                  text-[#F8F0DE]
                "
              >
                {safeRestaurantName}
              </span>

              <span
                className="
                  mt-0.5
                  block
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-[#D4AF37]
                "
              >
                100% Eggless • Pure Vegetarian
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav
            className="
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-2
              text-[11px]
              text-[#C9C0B1]
              md:justify-end
            "
          >
            <Link
              href="/menu"
              className="
                transition-colors
                hover:text-[#D4AF37]
              "
            >
              Menu
            </Link>

            <Link
              href="/menu/cakes"
              className="
                transition-colors
                hover:text-[#D4AF37]
              "
            >
              All Cakes
            </Link>

            <Link
              href="/menu/order"
              className="
                transition-colors
                hover:text-[#D4AF37]
              "
            >
              Enquire / Order
            </Link>
          </nav>
        </div>

        {/* ======================================================
            CONTACT INFORMATION
        ====================================================== */}
        <div
          className="
            grid
            grid-cols-1
            gap-5
            py-6
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {/* Address */}
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />

            <div className="min-w-0">
              <p
                className="
                  mb-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#8F8678]
                "
              >
                Visit Us
              </p>

              <p className="text-[11px] leading-relaxed text-[#DED5C6]">
                {safeAddress}
              </p>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />

            <div className="min-w-0">
              <p
                className="
                  mb-1
                  text-[9px]
                  font-bold
                  uppercase
                  tracking-[0.14em]
                  text-[#8F8678]
                "
              >
                Opening Hours
              </p>

              <p className="text-[11px] leading-relaxed text-[#DED5C6]">
                {safeOpeningHours}
              </p>
            </div>
          </div>

          {/* WhatsApp + Phone */}
          <div className="flex flex-col gap-2">
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-[#8F8678]
              "
            >
              Contact
            </p>

            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                items-center
                gap-2
                text-[11px]
                text-emerald-400
                transition-colors
                hover:text-emerald-300
              "
            >
              <MessageCircle
                className="h-3.5 w-3.5 shrink-0 text-[#25D366]"
                fill="#25D366"
              />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${safePhone.replace(/[^\d+]/g, "")}`}
              className="
                flex
                items-center
                gap-2
                text-[11px]
                text-[#D4AF37]
                transition-colors
                hover:text-[#EBD699]
              "
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              <span>{safePhone}</span>
            </a>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-2">
            <p
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.14em]
                text-[#8F8678]
              "
            >
              Connect
            </p>

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
                  flex
                  items-center
                  gap-2
                  truncate
                  text-[11px]
                  text-[#C9C0B1]
                  transition-colors
                  hover:text-[#D4AF37]
                "
              >
                <Instagram className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />

                <span className="truncate">
                  {instagramHandle}
                </span>
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
                  flex
                  items-center
                  gap-2
                  truncate
                  text-[11px]
                  text-[#C9C0B1]
                  transition-colors
                  hover:text-[#D4AF37]
                "
              >
                <Facebook className="h-3.5 w-3.5 shrink-0 text-[#D4AF37]" />

                <span className="truncate">
                  /{facebookHandle}
                </span>
              </a>
            )}

            {!instagram && !facebook && (
              <span className="text-[11px] text-[#756E64]">
                Follow us on social media
              </span>
            )}
          </div>
        </div>

        {/* ======================================================
            BOTTOM COPYRIGHT
        ====================================================== */}
        <div
          className="
            border-t
            border-white/[0.07]
            pt-4
            text-center
          "
        >
          <p className="text-[9px] leading-relaxed text-[#6F685F]">
            {safeFooterText}
          </p>
        </div>
      </div>
    </footer>
  );
}