"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/customer/Footer";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Sparkles,
  ShieldCheck,
  Heart,
  Cake as CakeIcon,
  Crown,
  Camera,
} from "lucide-react";
import { generateWhatsAppLink, generateGeneralWhatsAppLink } from "@/lib/whatsapp";

interface CakeDetailClientProps {
  cake: any;
  relatedCakes?: any[];
  settings?: any;
  whatsappSetting?: any;
}

export default function CakeDetailClient({
  cake,
  relatedCakes = [],
  settings,
  whatsappSetting,
}: CakeDetailClientProps) {
  // Prices and selected weight
  const sortedPrices = [...(cake.prices || [])].sort((a, b) => a.price - b.price);
  const defaultIndex = sortedPrices.findIndex((p) => p.isDefault);
  const [selectedWeightIndex, setSelectedWeightIndex] = useState<number>(
    defaultIndex !== -1 ? defaultIndex : 0
  );

  const activePriceObj = sortedPrices[selectedWeightIndex] || {
    weight: "1 kg",
    price: 1399,
  };

  let galleryImages: string[] = [];
  try {
    galleryImages = typeof cake.images === "string" ? JSON.parse(cake.images) : cake.images || [];
  } catch (e) {
    galleryImages = [];
  }

  // Tier-specific photos from prices
  const tierImages = sortedPrices.map((p) => p.image).filter(Boolean) as string[];
  const allImages = Array.from(new Set([cake.coverImage, ...tierImages, ...galleryImages])).filter(Boolean);

  // Manual hero image selection (if user clicks thumbnail directly)
  const [selectedHeroImage, setSelectedHeroImage] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState<string>("");

  // Active hero image:
  // If user clicked thumbnail directly, use selectedHeroImage.
  // Else if current weight tier has its own photo, display that tier's photo!
  // Else fallback to cake.coverImage.
  const activeImage = selectedHeroImage || activePriceObj.image || cake.coverImage;
  const currentDisplayIndex = allImages.indexOf(activeImage);
  const displayIndex = currentDisplayIndex !== -1 ? currentDisplayIndex : 0;

  const restaurantName = settings?.restaurantName || "Sweet Delights";
  const whatsappNumber = whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber = whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  const waLink = generateWhatsAppLink({
    cakeName: cake.name,
    weight: activePriceObj.weight,
    price: activePriceObj.price,
    restaurantName,
    template: whatsappSetting?.defaultMessageTemplate,
    whatsappNumber,
    customMessage,
  });

  const generalWaLink = generateGeneralWhatsAppLink(whatsappNumber, restaurantName);

  return (
    <div className="min-h-screen flex flex-col bg-[#090807] text-[#FBF7EE] selection:bg-gold-500 selection:text-luxury-950 pb-20 md:pb-0">
      {/* Top Header matching Screen 3 */}
      <header className="sticky top-0 z-40 border-b border-gold-500/15 bg-[#090807]/95 backdrop-blur-md px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link
            href="/menu"
            className="flex h-8 w-8 items-center justify-center rounded-full text-cream-200 hover:text-gold-400"
            aria-label="Back to Menu"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <h1 className="font-serif text-lg font-bold text-[#FBF7EE] truncate max-w-[200px] sm:max-w-md">
            {cake.name}
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

      <main className="flex-1 py-4 sm:py-6 md:py-8">
        <div className="mx-auto max-w-md md:max-w-5xl lg:max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Main Grid: Left Gallery + Right Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Main Image & Gallery Thumbnails */}
            <div className="md:col-span-6 lg:col-span-6 space-y-3 md:space-y-4 md:sticky md:top-20">
              {/* Main Hero Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-2xl md:rounded-3xl border border-gold-500/25 bg-[#14120f] shadow-2xl">
                <Image
                  key={activeImage}
                  src={activeImage}
                  alt={`${cake.name} - ${activePriceObj.weight}`}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                  className="object-cover transition-all duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#14120f]/60 via-transparent to-transparent pointer-events-none" />

                {/* Pagination badge on top right */}
                <div className="absolute top-3.5 right-3.5 rounded-md bg-black/75 px-2.5 py-0.5 text-[10px] font-bold text-cream-100 backdrop-blur-md">
                  {displayIndex + 1}/{allImages.length || 1}
                </div>

                {/* Visual confirmation badge for weight-specific photo */}
                {activePriceObj.image && activeImage === activePriceObj.image && (
                  <div className="absolute bottom-3.5 left-3.5 rounded-full bg-black/85 border border-gold-500/50 px-3 py-1 text-[11px] font-semibold text-gold-300 backdrop-blur-md flex items-center gap-1.5 shadow-lg animate-fadeIn">
                    <Camera className="h-3.5 w-3.5 text-gold-400" />
                    <span>{activePriceObj.weight} Size Visual</span>
                  </div>
                )}
              </div>

              {/* Thumbnail Strip */}
              {allImages.length > 1 && (
                <div className="flex items-center space-x-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {allImages.slice(0, 8).map((imgUrl, idx) => {
                    const isCurrent = activeImage === imgUrl;
                    const matchedTier = sortedPrices.find((p) => p.image === imgUrl);

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedHeroImage(imgUrl);
                          if (matchedTier) {
                            const tierIdx = sortedPrices.indexOf(matchedTier);
                            if (tierIdx !== -1) setSelectedWeightIndex(tierIdx);
                          }
                        }}
                        className={`relative aspect-square h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          isCurrent
                            ? "border-gold-400 scale-105 shadow-gold-sm"
                            : "border-luxury-800 opacity-60 hover:opacity-100"
                        }`}
                      >
                        <Image src={imgUrl} alt="Thumbnail" fill sizes="64px" className="object-cover" />
                        {matchedTier && (
                          <span className="absolute bottom-0 inset-x-0 bg-black/85 text-[8px] font-bold text-gold-400 text-center py-0.5 truncate">
                            {matchedTier.weight}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4 Trust Badges on Desktop */}
              <div className="hidden md:grid grid-cols-4 gap-2 pt-2 text-center">
                <div className="flex flex-col items-center space-y-1 rounded-xl border border-luxury-800 bg-[#12100e] p-2.5">
                  <Sparkles className="h-4 w-4 text-gold-400" />
                  <span className="text-[10px] text-luxury-300">Freshly Baked</span>
                </div>
                <div className="flex flex-col items-center space-y-1 rounded-xl border border-luxury-800 bg-[#12100e] p-2.5">
                  <Crown className="h-4 w-4 text-gold-400" />
                  <span className="text-[10px] text-luxury-300">Gourmet Cocoa</span>
                </div>
                <div className="flex flex-col items-center space-y-1 rounded-xl border border-luxury-800 bg-[#12100e] p-2.5">
                  <ShieldCheck className="h-4 w-4 text-gold-400" />
                  <span className="text-[10px] text-luxury-300">Hygienic Kitchen</span>
                </div>
                <div className="flex flex-col items-center space-y-1 rounded-xl border border-luxury-800 bg-[#12100e] p-2.5">
                  <Heart className="h-4 w-4 text-gold-400" />
                  <span className="text-[10px] text-luxury-300">100% Pure Veg</span>
                </div>
              </div>
            </div>

            {/* Right Column: Cake Details & Order Form */}
            <div className="md:col-span-6 lg:col-span-6 space-y-4 text-left">
              {/* Badges Row */}
              <div className="flex items-center gap-2 flex-wrap">
                {cake.bestseller && (
                  <span className="inline-block rounded bg-[#C59B27] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-luxury-950">
                    Bestseller
                  </span>
                )}
                {cake.featured && !cake.bestseller && (
                  <span className="inline-block rounded bg-[#D97706] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Signature
                  </span>
                )}
                {cake.category && (
                  <span className="inline-block rounded border border-gold-500/30 bg-gold-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-gold-300">
                    {cake.category.name}
                  </span>
                )}
              </div>

              {/* Title & Eggless Guarantee */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Standard Indian Veg Symbol */}
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[2px] border border-emerald-500 p-[1.5px]" title="100% Pure Veg">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    </span>
                    <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#FBF7EE] leading-tight">
                      {cake.name}
                    </h1>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-bold text-gold-400 border border-gold-500/30 backdrop-blur-md shrink-0">
                    <span>★</span>
                    <span>{cake.rating || 4.9}</span>
                  </div>
                </div>

                <div className="mt-1.5 flex items-center space-x-2 text-xs sm:text-sm text-emerald-400 font-semibold">
                  <span>100% Eggless • Pure Vegetarian Confection</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-luxury-300 leading-relaxed font-light">
                {cake.description}
              </p>

              {/* Select Weight Section */}
              <div className="space-y-2.5 pt-3 border-t border-luxury-800">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-cream-100 flex items-center gap-1.5">
                    <span>Select Weight & Size</span>
                    <span className="rounded bg-gold-500/10 border border-gold-500/20 px-1.5 py-0.2 text-[9.5px] text-gold-400 font-mono">
                      Real-time Pricing
                    </span>
                  </span>
                  <span className="text-[10px] sm:text-xs text-luxury-400">Inclusive of all taxes</span>
                </div>

                {/* Weight Cards Grid */}
                <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                  {sortedPrices.map((p, idx) => {
                    const isSelected = selectedWeightIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedWeightIndex(idx);
                          setSelectedHeroImage(p.image || null);
                        }}
                        className={`flex flex-col items-center justify-center rounded-xl p-2.5 text-center transition-all active:scale-95 ${
                          isSelected
                            ? "border-2 border-gold-400 bg-gold-500/15 text-gold-300 font-bold shadow-[0_0_12px_rgba(212,175,55,0.25)] scale-[1.02]"
                            : "border border-luxury-800 bg-[#14120f] text-cream-200 hover:border-gold-500/40"
                        }`}
                      >
                        {p.image && (
                          <div className="relative mb-1 h-5 w-5 sm:h-6 sm:w-6 overflow-hidden rounded-full border border-gold-400/50 shrink-0">
                            <Image src={p.image} alt={p.weight} fill sizes="24px" className="object-cover" />
                          </div>
                        )}
                        <span className="text-[11px] sm:text-xs font-semibold">{p.weight}</span>
                        <span className={`mt-0.5 text-xs sm:text-sm font-bold ${isSelected ? "text-gold-400" : "text-cream-100"}`}>
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Serving & Portion Size Guide */}
                <div className="flex items-center justify-between rounded-xl border border-gold-500/25 bg-gold-500/10 px-3.5 py-2.5 text-xs animate-fadeIn mt-2">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                    <span className="text-cream-100 text-[11px] sm:text-xs font-medium">
                      {activePriceObj.weight === "0.5 kg" && "Serves 3–4 Guests • 6″ Standard Cake"}
                      {activePriceObj.weight === "1 kg" && "Serves 6–8 Guests • 8″ Standard Cake (Most Popular)"}
                      {activePriceObj.weight === "1.5 kg" && "Serves 10–14 Guests • 9″ Medium Tier Cake"}
                      {activePriceObj.weight === "2 kg" && "Serves 16–20 Guests • 10″ Celebration Double Layer"}
                      {activePriceObj.weight === "3 kg" && "Serves 24–30 Guests • Grand 2-Tier Cake"}
                      {activePriceObj.weight === "4 kg" && "Serves 35–45 Guests • Grand 3-Tier Luxury Cake"}
                      {!["0.5 kg", "1 kg", "1.5 kg", "2 kg", "3 kg", "4 kg"].includes(activePriceObj.weight) && `Portion: ${activePriceObj.weight}`}
                    </span>
                  </div>
                  <span className="text-[9.5px] sm:text-[10px] font-bold text-gold-400 uppercase tracking-wider shrink-0">
                    100% Eggless
                  </span>
                </div>
              </div>

              {/* Ingredients & Prep notes */}
              <div className="space-y-2 pt-2 border-t border-luxury-800 text-xs">
                <div>
                  <span className="block font-bold text-cream-200 text-[11px] sm:text-xs">
                    Ingredients
                  </span>
                  <p className="text-luxury-400 leading-relaxed text-[11px] sm:text-xs font-light">
                    {cake.ingredients || "Cocoa Powder, Dark Chocolate, Fresh Cream, Milk, Sugar, Refined Flour, Chocolate Truffle & more."}
                  </p>
                </div>
                <div>
                  <span className="block font-bold text-cream-200 text-[11px] sm:text-xs">
                    Preparation & Storage
                  </span>
                  <p className="text-luxury-400 leading-relaxed text-[11px] sm:text-xs font-light">
                    {cake.preparationNotes || "Keep refrigerated. Best enjoyed within 2 days."}
                  </p>
                </div>
              </div>

              {/* Optional Name / Message on Cake */}
              <div className="space-y-1.5 pt-2 border-t border-luxury-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] sm:text-xs font-bold text-cream-200 flex items-center gap-1.5">
                    <span>✍️ Name / Message on Cake (Optional)</span>
                  </label>
                  <span className="text-[10px] sm:text-xs text-gold-400 font-medium">Free Custom Plaque</span>
                </div>
                <input
                  type="text"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g. Happy Birthday Riya 🎂 / Happy 10th Anniversary"
                  maxLength={60}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 placeholder-luxury-500 focus:border-gold-500 focus:outline-none transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-emerald-600 to-[#25D366] py-3.5 px-4 text-center text-xs sm:text-sm font-bold text-white shadow-lg shadow-emerald-950/40 transition-all hover:brightness-110 active:scale-95"
                >
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 fill-white text-white" />
                  <span>Order on WhatsApp (₹{activePriceObj.price.toLocaleString("en-IN")})</span>
                </a>

                <a
                  href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
                  className="flex w-full items-center justify-center space-x-2 rounded-xl border border-gold-500/30 bg-[#161411] py-3 text-center text-xs sm:text-sm font-semibold text-gold-300 hover:border-gold-500 transition-colors"
                >
                  <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gold-400" />
                  <span>Call Pastry Chef</span>
                </a>
              </div>
            </div>
          </div>

          {/* You May Also Like Section (Full Width Bottom) */}
          {relatedCakes && relatedCakes.length > 0 && (
            <div className="pt-8 border-t border-luxury-800 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#FBF7EE]">
                  You May Also Like
                </h3>
                <Link href="/menu/cakes" className="text-xs font-semibold text-gold-400 hover:text-gold-300">
                  View all bakes →
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {relatedCakes.slice(0, 4).map((rel) => {
                  const price = rel.prices[0]?.price || 799;
                  return (
                    <Link
                      key={rel.id}
                      href={`/menu/cake/${rel.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-luxury-800 bg-[#14120f] p-2.5 sm:p-3 transition-all hover:border-gold-500/40 hover:shadow-gold-sm"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-luxury-950">
                        <Image
                          src={rel.coverImage}
                          alt={rel.name}
                          fill
                          sizes="(max-width: 640px) 150px, 240px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <span className="mt-2 font-serif text-xs sm:text-sm font-bold text-cream-100 truncate group-hover:text-gold-400 transition-colors">
                        {rel.name}
                      </span>
                      <span className="text-[11px] sm:text-xs text-gold-400 font-bold">
                        From ₹{price}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Sticky Mobile Order CTA */}
      <div className="fixed bottom-14 left-3 right-3 z-30 md:hidden">
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-full border border-emerald-500/50 bg-[#0d1812]/95 px-4 py-2.5 shadow-[0_4px_20px_rgba(16,185,129,0.35)] backdrop-blur-md active:scale-95 transition-transform"
        >
          <div className="flex items-center space-x-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#25D366] text-white shadow-md animate-pulse">
              <MessageCircle className="h-4 w-4 fill-white text-white" />
            </span>
            <span className="text-[11.5px] font-bold text-cream-100">
              Order {activePriceObj.weight} on WhatsApp
            </span>
          </div>
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/40">
            ₹{activePriceObj.price.toLocaleString("en-IN")} →
          </span>
        </a>
      </div>

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
        <Link
          href="/menu"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <CakeIcon className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">Menu</span>
        </Link>

        <Link
          href="/menu/cakes"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">All Cakes</span>
        </Link>

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
