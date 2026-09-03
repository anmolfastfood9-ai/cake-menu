"use client";

import { MessageCircle, Phone, Sparkles } from "lucide-react";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";

interface FloatingContactProps {
  whatsappNumber?: string;
  phoneNumber?: string;
  restaurantName?: string;
}

export default function FloatingContact({
  whatsappNumber = "919876543210",
  phoneNumber = "+919876543210",
  restaurantName = "Raman Sweet Cake",
}: FloatingContactProps) {
  const waLink = generateGeneralWhatsAppLink(whatsappNumber, restaurantName);

  return (
    <aside aria-label="Quick contact actions" className="fixed bottom-0 left-0 right-0 z-30 border-t border-gold-500/30 bg-luxury-950/95 p-3 backdrop-blur-lg sm:hidden">
      <div className="flex items-center space-x-2.5">
        <a
          href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
          className="flex flex-1 items-center justify-center space-x-1.5 rounded-xl border border-gold-500/30 bg-luxury-900 py-2.5 text-xs font-semibold text-cream-100 active:scale-98 transition-transform"
        >
          <Phone className="h-4 w-4 text-gold-400" />
          <span>Call Bakery</span>
        </a>

        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-[1.4] items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 active:scale-98 transition-transform"
        >
          <MessageCircle className="h-4 w-4" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>
    </aside>
  );
}
