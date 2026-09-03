"use client";

import Link from "next/link";
import {
  Cake,
  MessageCircle,
  MapPin,
  Clock,
  Phone,
  Instagram,
} from "lucide-react";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";

interface FooterProps {
  restaurantName?: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  openingHours?: string;
  instagram?: string;
  facebook?: string;
  footerText?: string;
}

export default function Footer({
  restaurantName = "Raman Sweet & Luxury Pâtisserie",
  phone = "+91 98765 43210",
  whatsapp = "919876543210",
  address = "123, Bakery Street, Patna, Bihar 800001",
  openingHours = "10:00 AM – 10:00 PM (All Days)",
  instagram,
  facebook,
  footerText = "© 2026 Raman Sweet & Luxury Pâtisserie. All rights reserved.",
}: FooterProps) {
  const waLink = generateGeneralWhatsAppLink(whatsapp, restaurantName);

  // Extract Instagram handle if a full URL is provided
  const instagramHandle = instagram
    ? instagram.replace(/^https?:\/\/(www\.)?instagram\.com\//i, "@").replace(/\/$/, "")
    : "@ramansweetcake";

  return (
    <footer className="border-t border-gold-500/15 bg-[#080706] text-[#EDE4D3] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top: Compact Brand & Identity */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-luxury-800 pb-6 text-center sm:text-left">
          <div className="flex items-center space-x-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-gold-500/30 bg-[#14120f] text-gold-400">
              <Cake className="h-4 w-4" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#FBF7EE] block">
                {restaurantName}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-gold-400 font-bold">
                100% Eggless • Pure Vegetarian
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-luxury-300">
            <Link href="/menu" className="hover:text-gold-400 transition-colors">
              Menu
            </Link>
            <Link href="/menu/cakes" className="hover:text-gold-400 transition-colors">
              All Cakes
            </Link>
            <Link href="/menu/order" className="hover:text-gold-400 transition-colors">
              Enquire / Order
            </Link>
          </div>
        </div>

        {/* Middle: Compact Contact Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-luxury-300">
          {/* Address */}
          <div className="flex items-start space-x-2">
            <MapPin className="h-3.5 w-3.5 text-gold-400 shrink-0 mt-0.5" />
            <span className="text-[11px] text-cream-200">{address}</span>
          </div>

          {/* Hours */}
          <div className="flex items-start space-x-2">
            <Clock className="h-3.5 w-3.5 text-gold-400 shrink-0 mt-0.5" />
            <span className="text-[11px] text-cream-200">{openingHours}</span>
          </div>

          {/* WhatsApp & Call */}
          <div className="flex items-center space-x-3">
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 text-emerald-400 hover:underline text-[11px]"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-[#25D366] text-[#25D366]" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="flex items-center space-x-1.5 text-gold-400 hover:underline text-[11px]"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>{phone}</span>
            </a>
          </div>

          {/* Instagram / Social */}
          <div className="flex items-center space-x-2">
            <Instagram className="h-3.5 w-3.5 text-gold-400 shrink-0" />
            {instagram ? (
              <a
                href={instagram.startsWith("http") ? instagram : `https://${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-luxury-300 hover:text-gold-400 transition-colors"
              >
                {instagramHandle}
              </a>
            ) : (
              <span className="text-[11px] text-luxury-400">{restaurantName}</span>
            )}
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="text-center text-[10px] text-luxury-500 pt-2 border-t border-luxury-800/60">
          <p>{footerText}</p>
        </div>
      </div>
    </footer>
  );
}
