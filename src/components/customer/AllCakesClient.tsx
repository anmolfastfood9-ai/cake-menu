"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import CakeCard, { CakeItem } from "@/components/customer/CakeCard";
import Footer from "@/components/customer/Footer";
import {
  Search,
  ArrowLeft,
  MessageCircle,
  SlidersHorizontal,
  ChevronDown,
  X,
  Cake as CakeIcon,
  Sparkles,
} from "lucide-react";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";

interface AllCakesClientProps {
  initialCategories: any[];
  initialCakes: any[];
  settings?: any;
  whatsappSetting?: any;
  selectedCategorySlug?: string;
}

export default function AllCakesClient({
  initialCategories = [],
  initialCakes = [],
  settings,
  whatsappSetting,
  selectedCategorySlug = "all",
}: AllCakesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(selectedCategorySlug);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating">("featured");
  const [visibleCount, setVisibleCount] = useState<number>(24);

  const restaurantName = settings?.restaurantName || "Sweet Delights";
  const whatsappNumber = whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber = whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  const waLink = generateGeneralWhatsAppLink(whatsappNumber, restaurantName);

  // Category counts calculated dynamically from live inventory
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {
      all: initialCakes.length,
    };
    for (const cake of initialCakes) {
      if (cake.category?.slug) {
        map[cake.category.slug] = (map[cake.category.slug] || 0) + 1;
      }
    }
    return map;
  }, [initialCakes]);

  // Filter cakes
  const filteredCakes = useMemo(() => {
    let result = initialCakes.filter((cake: CakeItem) => {
      if (selectedCategory !== "all" && cake.category?.slug !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = cake.name.toLowerCase().includes(q);
        const descMatch = cake.description?.toLowerCase().includes(q);
        const catMatch = cake.category?.name?.toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }

      return true;
    });

    if (sortBy === "price-asc") {
      result.sort((a, b) => (a.prices[0]?.price || 0) - (b.prices[0]?.price || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => (b.prices[0]?.price || 0) - (a.prices[0]?.price || 0));
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.rating || 4.9) - (a.rating || 4.9));
    }

    return result;
  }, [initialCakes, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#090807] text-[#FBF7EE] selection:bg-gold-500 selection:text-luxury-950 pb-20 md:pb-0">
      {/* Top Header matching Screen 2 */}
      <header className="sticky top-0 z-40 border-b border-gold-500/15 bg-[#090807]/95 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-cream-200 hover:text-gold-400"
            aria-label="Back to Menu"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <h1 className="font-serif text-lg font-bold text-[#FBF7EE]">
            All Cakes
          </h1>

          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle className="h-4 w-4 fill-white text-white" />
          </a>
        </div>
      </header>

      <main className="flex-1 py-4 sm:py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          {/* Search Bar matching Blueprint */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-400" />
            <input
              type="text"
              placeholder="Search cakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-luxury-800 bg-[#12100e] py-2.5 pl-10 pr-10 text-xs text-cream-100 placeholder-luxury-500 focus:border-gold-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-400 hover:text-cream-100"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Tabs with Counts */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] sm:px-3.5 sm:py-1.5 sm:text-xs font-semibold transition-all duration-200 active:scale-95 ${
                selectedCategory === "all"
                  ? "border border-gold-500/80 bg-gold-500/15 text-gold-300 font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)] scale-[1.02]"
                  : "border border-white/10 bg-[#12100e] text-luxury-300 hover:border-gold-500/30 hover:text-cream-100"
              }`}
            >
              <span>All</span>
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[9px] font-mono ${
                  selectedCategory === "all"
                    ? "bg-gold-500/30 text-gold-200 font-bold"
                    : "bg-white/5 text-luxury-400 font-normal"
                }`}
              >
                {categoryCounts.all ?? initialCakes.length}
              </span>
            </button>

            {initialCategories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              const count = categoryCounts[cat.slug] ?? 0;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] sm:px-3.5 sm:py-1.5 sm:text-xs font-semibold transition-all duration-200 active:scale-95 ${
                    isSelected
                      ? "border border-gold-500/80 bg-gold-500/15 text-gold-300 font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)] scale-[1.02]"
                      : "border border-white/10 bg-[#12100e] text-luxury-300 hover:border-gold-500/30 hover:text-cream-100"
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[9px] font-mono ${
                      isSelected
                        ? "bg-gold-500/30 text-gold-200 font-bold"
                        : "bg-white/5 text-luxury-400 font-normal"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            <button className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#12100e] p-1.5 text-luxury-400 hover:text-cream-100">
              <SlidersHorizontal className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>

          {/* Showing Status & Sort */}
          <div className="flex items-center justify-between text-xs text-luxury-400 pt-1">
            <span>Showing {filteredCakes.length > 0 ? 1 : 0} - {Math.min(filteredCakes.length, visibleCount)} of {categoryCounts[selectedCategory] ?? filteredCakes.length} cakes</span>

            <div className="flex items-center space-x-1 text-luxury-300">
              <span className="text-[11px]">Sort</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>

          {/* 2-Column Responsive Cake Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 pt-1">
            {filteredCakes.slice(0, visibleCount).map((cake) => (
              <CakeCard key={cake.id} cake={cake} whatsappNumber={whatsappNumber} restaurantName={restaurantName} />
            ))}
          </div>

          {/* Load More Cakes Button */}
          {visibleCount < filteredCakes.length && (
            <div className="pt-8 pb-4 text-center space-y-2">
              <button
                onClick={() => setVisibleCount((prev) => prev + 12)}
                className="inline-flex items-center justify-center space-x-1.5 rounded-xl bg-[#C59B27] px-8 py-3 text-xs font-bold text-luxury-950 shadow-gold-sm hover:scale-102 transition-transform w-full max-w-sm"
              >
                <span>Load More Cakes ↓</span>
              </button>
              <p className="text-[11px] text-luxury-400">
                You've seen {Math.min(filteredCakes.length, visibleCount)} of {filteredCakes.length} cakes
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Global Footer */}
      <Footer
        restaurantName={restaurantName}
        phone={phoneNumber}
        whatsapp={whatsappNumber}
        address={settings?.address}
        openingHours={settings?.openingHours}
        instagram={settings?.instagram}
        facebook={settings?.facebook}
        footerText={settings?.footerText}
      />

      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gold-500/20 bg-[#0d0c0a]/95 py-2 backdrop-blur-xl md:hidden">
        {/* Menu */}
        <Link
          href="/menu"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <CakeIcon className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">Menu</span>
        </Link>

        {/* All Cakes (Active) */}
        <Link
          href="/menu/cakes"
          className="relative flex flex-col items-center space-y-0.5 px-4 py-1 rounded-xl bg-gold-500/10 text-gold-400"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-[9.5px] font-bold">All Cakes</span>
        </Link>

        {/* Order */}
        <Link
          href="/menu/order"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">Order</span>
        </Link>
      </div>
    </div>
  );
}
