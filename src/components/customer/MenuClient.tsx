"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/customer/Navbar";
import {
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Cake as CakeIcon,
  Clock,
  Sparkles,
  Leaf,
  Heart,
} from "lucide-react";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";
import OccasionShowcase from "@/components/customer/OccasionShowcase";

interface MenuClientProps {
  initialCategories?: any[];
  initialCakes?: any[];
  settings?: any;
  whatsappSetting?: any;
  activeOccasion?: any;
}

export default function MenuClient({
  settings,
  whatsappSetting,
  activeOccasion,
}: MenuClientProps) {
  const restaurantName = settings?.restaurantName || "Sweet Delights";
  const whatsappNumber = whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber = whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  // Exact 4 Signature Cakes as defined in specification
  const signatureCakes = [
    {
      id: "1",
      name: "Chocolate Truffle",
      slug: "chocolate-truffle",
      price: 799,
      badge: "Bestseller",
      badgeClass: "bg-[#C59B27] text-luxury-950 font-bold",
      image: "/images/hero_cake.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "2",
      name: "Pistachio Rose",
      slug: "pistachio-rose",
      price: 899,
      badge: "Signature",
      badgeClass: "bg-[#D97706] text-white font-bold",
      image: "/images/pistachio_rose.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "3",
      name: "Red Velvet",
      slug: "red-velvet",
      price: 849,
      badge: "New",
      badgeClass: "bg-[#B45309] text-white font-bold",
      image: "/images/red_velvet.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: "4",
      name: "Mango Delight",
      slug: "mango-delight",
      price: 799,
      badge: null,
      badgeClass: "",
      image: "/images/mango_delight.jpg",
      fallbackImage: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?q=80&w=600&auto=format&fit=crop",
    },
  ];

  // Exact 8 Categories as defined in target specification (Popular Categories)
  const categoriesList = [
    {
      id: "all",
      name: "All Cakes",
      isAll: true,
      slug: "all",
      image: "/images/categories/all_cakes.svg",
    },
    {
      id: "chocolate",
      name: "Chocolate",
      slug: "chocolate",
      image: "/images/categories/chocolate.png",
    },
    {
      id: "fruit-berry",
      name: "Fruit & Berry",
      slug: "fruit-berry",
      image: "/images/categories/fruit_berry.png",
    },
    {
      id: "birthday",
      name: "Birthday",
      slug: "birthday",
      image: "/images/categories/birthday.png",
    },
    {
      id: "premium",
      name: "Premium",
      slug: "premium",
      image: "/images/categories/premium.png",
    },
    {
      id: "photo-cakes",
      name: "Photo Cakes",
      slug: "photo-cakes",
      image: "/images/categories/photo_cakes.png",
    },
    {
      id: "designer-cakes",
      name: "Designer Cakes",
      slug: "designer-cakes",
      image: "/images/categories/designer_cakes.png",
    },
    {
      id: "anniversary",
      name: "Anniversary",
      slug: "anniversary",
      image: "/images/categories/anniversary.png",
    },
  ];

  const waLink = generateGeneralWhatsAppLink(whatsappNumber, restaurantName);

  return (
    <div className="min-h-screen bg-[#090807] text-[#FBF7EE] selection:bg-gold-500 selection:text-luxury-950 pb-20 font-sans">
      {/* 1. COMPACT HEADER */}
      <Navbar
        restaurantName={restaurantName}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
      />

      {/* MOBILE CONTENT CONTAINER (390px - 430px) */}
      <div className="max-w-[430px] mx-auto px-3 pt-2 pb-6 space-y-3.5">
        
        {/* 2. CELEBRATION HERO SECTION (EXACT REFERENCE MATCH) */}
        <section className="relative w-full pt-1 pb-0 text-left">
          <div className="px-1 space-y-1">
            <h1 className="font-serif text-[27px] xs:text-[29px] sm:text-[31px] font-bold tracking-tight text-[#FBF7EE] leading-[1.12]">
              Every Celebration <br />
              Deserves a <br />
              <span className="text-[#D4AF37] inline-flex items-center gap-1.5">
                Perfect Cake
                <Heart className="inline-block h-5 w-5 text-[#D4AF37] stroke-[1.8] fill-none -rotate-12 translate-y-0.5" />
              </span>
            </h1>

            <p className="text-[11px] sm:text-[11.5px] text-[#A69B8D] font-normal leading-snug pt-1">
              Freshly baked. Beautifully crafted. <br />
              Made just for you.
            </p>
          </div>

          {/* Hero Chocolate Cake on Pedestal Stand */}
          <div className="relative w-full aspect-[282/215] max-w-[340px] mx-auto mt-0.5">
            <Image
              src="/images/celebration_hero_cake_clean.png"
              alt="Every Celebration Deserves a Perfect Cake"
              fill
              priority
              sizes="(max-width: 430px) 100vw, 340px"
              className="object-contain"
            />
            {/* Seamless Vignette Fades to blend into background */}
            <div className="absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-[#080706] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-5 bg-gradient-to-l from-[#080706] to-transparent pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-[#080706] to-transparent pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#080706] to-transparent pointer-events-none" />
          </div>
        </section>

        {/* 3. DYNAMIC OCCASION SHOWCASE (AUTOMATIC FESTIVAL & OCCASION ENGINE) */}
        <OccasionShowcase occasionData={activeOccasion} />

        {/* 4. POPULAR CATEGORIES (4 per row on mobile, 2 rows of 4 - EXACT TARGET MATCH) */}
        <section className="space-y-2 pt-1">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-serif text-[15px] sm:text-base font-bold text-[#FBF7EE] tracking-tight">
              Popular Categories
            </h2>
            <Link
              href="/menu/cakes"
              className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {categoriesList.map((cat) => (
              <Link
                key={cat.id}
                href={cat.isAll ? "/menu/cakes" : `/menu/cakes?category=${cat.slug}`}
                className={`group flex flex-col items-center justify-center rounded-2xl py-2 px-1 sm:p-2.5 text-center transition-all duration-300 ${
                  cat.isAll
                    ? "border border-[#C59B27] bg-[#161310] shadow-[0_0_12px_rgba(197,155,39,0.18)]"
                    : "border border-white/5 bg-[#14120f] hover:border-gold-500/40 hover:bg-[#181512]"
                }`}
              >
                <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-[#0d0b09] border border-white/5 shadow-inner">
                  {cat.isAll ? (
                    <div className="relative flex h-full w-full items-center justify-center p-1.5">
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={30}
                        height={30}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      sizes="48px"
                      className="object-cover group-hover:scale-108 transition-transform duration-300"
                    />
                  )}
                </div>
                <span
                  className={`mt-1.5 text-[9.5px] sm:text-[10px] font-medium leading-tight tracking-tight truncate w-full text-center ${
                    cat.isAll
                      ? "text-[#FBF7EE] font-semibold"
                      : "text-cream-100 group-hover:text-gold-400"
                  } transition-colors`}
                >
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* 5. SIGNATURE CAKES (Strictly 4 Cakes in 2-Column Grid) */}
        <section className="space-y-1.5 pt-0.5">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="font-serif text-sm font-bold text-[#FBF7EE]">
                Signature Cakes
              </h2>
              <p className="text-[9.5px] text-luxury-400">
                Handpicked favorites for you.
              </p>
            </div>
            <Link
              href="/menu/cakes"
              className="text-[10.5px] font-semibold text-gold-400 hover:text-gold-300"
            >
              View all
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {signatureCakes.map((cake) => (
              <Link
                key={cake.id}
                href={`/menu/cake/${cake.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-luxury-800/80 bg-[#14120f] p-2 transition-all hover:border-gold-500/40"
              >
                {/* Cake Image & Badges */}
                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-luxury-950">
                  <Image
                    src={cake.image}
                    alt={cake.name}
                    fill
                    sizes="180px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Top-Left Badge */}
                  {cake.badge && (
                    <div className="absolute top-1.5 left-1.5 z-10">
                      <span className={`rounded px-1.5 py-0.5 text-[8px] uppercase tracking-wider ${cake.badgeClass}`}>
                        {cake.badge}
                      </span>
                    </div>
                  )}

                  {/* Top-Right Heart Icon */}
                  <div className="absolute top-1.5 right-1.5 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-luxury-300">
                    <Heart className="h-3 w-3" />
                  </div>
                </div>

                {/* Cake Details */}
                <div className="mt-2 space-y-1">
                  <h3 className="font-serif text-xs font-bold text-[#FBF7EE] group-hover:text-gold-400 transition-colors truncate">
                    {cake.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-1">
                      <span className="text-[9.5px] text-luxury-400">From</span>
                      <span className="text-xs font-bold text-gold-400">
                        ₹{cake.price}
                      </span>
                    </div>
                    <span className="text-[9px] font-semibold text-gold-400 group-hover:translate-x-0.5 transition-transform">
                      View Cake →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. SMALL CUSTOM CAKE CTA (COMPACT BANNER) */}
        <section className="rounded-2xl border border-gold-500/20 bg-[#14120f] p-3.5 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            {/* Left Content */}
            <div className="space-y-1.5 text-left max-w-[60%]">
              <h3 className="font-serif text-sm font-bold text-[#FBF7EE]">
                Looking for a Custom Cake?
              </h3>
              <p className="text-[10px] text-luxury-300 font-light leading-snug">
                Personalised eggless cakes for birthdays, weddings, anniversaries and special moments.
              </p>
              <div className="pt-0.5">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 rounded-xl bg-[#25D366] px-3 py-1.5 text-[10.5px] font-bold text-white shadow-md hover:bg-emerald-500 transition-colors"
                >
                  <MessageCircle className="h-3 w-3 fill-white text-white" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right Bespoke Cake Image */}
            <div className="relative aspect-square w-24 shrink-0 overflow-hidden rounded-xl border border-gold-500/20 bg-luxury-950">
              <Image
                src="/images/custom_cake.jpg"
                alt="Custom Celebration Cake"
                fill
                sizes="100px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Bottom 3 Mini Badges */}
          <div className="mt-2.5 pt-2 border-t border-luxury-800/80 grid grid-cols-3 gap-1 text-center text-[8.5px] text-cream-200">
            <div className="flex items-center justify-center space-x-1">
              <Leaf className="h-2.5 w-2.5 text-gold-400 shrink-0" />
              <span className="truncate">Fresh Ingredients Top Quality</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <ShieldCheck className="h-2.5 w-2.5 text-gold-400 shrink-0" />
              <span className="truncate">Hygienic Kitchen</span>
            </div>
            <div className="flex items-center justify-center space-x-1">
              <Clock className="h-2.5 w-2.5 text-gold-400 shrink-0" />
              <span className="truncate">On-time Everytime</span>
            </div>
          </div>
        </section>
      </div>

      {/* 7. FIXED MOBILE BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gold-500/20 bg-[#0d0c0a]/95 py-2 backdrop-blur-xl md:hidden">
        {/* Menu (Active Tab with Gold Glow) */}
        <Link
          href="/menu"
          className="relative flex flex-col items-center space-y-0.5 px-4 py-1 rounded-xl bg-gold-500/10 text-gold-400"
        >
          <CakeIcon className="h-4 w-4" />
          <span className="text-[9.5px] font-bold">Menu</span>
        </Link>

        {/* All Cakes */}
        <Link
          href="/menu/cakes"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">All Cakes</span>
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
