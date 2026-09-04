"use client";

import Link from "next/link";
import { Cake, MessageCircle, Sparkles } from "lucide-react";

type ActiveTab = "menu" | "cakes" | "order";

interface MobileBottomNavProps {
  active?: ActiveTab;
}

const items = [
  { key: "menu", label: "Menu", href: "/menu", icon: Cake },
  { key: "cakes", label: "Cakes", href: "/menu/cakes", icon: Sparkles },
  { key: "order", label: "Order", href: "/menu/order", icon: MessageCircle },
] as const;

export default function MobileBottomNav({ active = "menu" }: MobileBottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#D4AF37]/20 bg-[#090806]/95 px-3 pb-[calc(8px+env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-[430px] grid-cols-3 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex min-h-[44px] flex-col items-center justify-center rounded-2xl px-2 text-[10px] font-semibold transition-all active:scale-95 ${
                isActive
                  ? "border border-[#D4AF37]/45 bg-[#D4AF37]/12 text-[#EBD699] shadow-[0_0_14px_rgba(212,175,55,0.14)]"
                  : "text-[#8D8375] hover:text-[#F4E7C1]"
              }`}
            >
              <Icon className="mb-0.5 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
