import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/db";
import {
  ArrowLeft,
  MessageCircle,
  Phone,
  Store,
  MapPin,
  Clock,
  Cake as CakeIcon,
  Sparkles,
} from "lucide-react";
import { generateGeneralWhatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function OrderPage() {
  const settings = await prisma.websiteSetting.findUnique({
    where: { id: "default" },
  });

  const whatsappSetting = await prisma.whatsAppSetting.findUnique({
    where: { id: "default" },
  });

  const restaurantName = settings?.restaurantName || "Sweet Delights Cakes";
  const whatsappNumber =
    whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber =
    whatsappSetting?.callNumber || settings?.phone || "+919876543210";
  const cleanPhone = phoneNumber.replace(/\s+/g, "");
  const address =
    settings?.address || "123, Bakery Street, Patna, Bihar";
  const openingHours =
    settings?.openingHours || "10:00 AM – 10:00 PM (All Days)";

  const waLink = generateGeneralWhatsAppLink(whatsappNumber, restaurantName);

  return (
    <div className="min-h-screen bg-[#090807] text-[#FBF7EE] font-sans flex flex-col justify-between selection:bg-gold-500/30 selection:text-gold-200 pb-20">
      {/* 1. TOP HEADER: "← Enquire / Order" */}
      <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#090807]/95 backdrop-blur-md">
        <div className="max-w-[430px] mx-auto flex items-center px-4 py-3.5">
          <Link
            href="/menu"
            className="flex items-center space-x-3 text-[#FBF7EE] hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2]" />
            <span className="font-sans text-base font-semibold tracking-tight">
              Enquire / Order
            </span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN BODY CONTAINER */}
      <main className="flex-1 max-w-[430px] w-full mx-auto px-5 py-6 flex flex-col items-center text-center space-y-5">
        {/* Circular Chef Illustration */}
        <div className="relative h-36 w-36 sm:h-40 sm:w-40 overflow-hidden rounded-full shadow-2xl border border-white/5 mt-1">
          <Image
            src="/images/chef_illustration.png"
            alt="Chef Illustration"
            fill
            priority
            sizes="(max-width: 430px) 160px, 160px"
            className="object-cover"
          />
        </div>

        {/* Headline & Subtitle */}
        <div className="space-y-2 pt-1">
          <h1 className="font-serif text-[22px] sm:text-2xl font-bold tracking-tight text-[#FBF7EE] leading-snug">
            We&apos;d Love to Bake <br />
            Your Happiness! <span className="inline-block text-red-500">❤️</span>
          </h1>
          <p className="text-[11.5px] sm:text-xs text-[#A69B8D] font-normal leading-relaxed max-w-[290px] mx-auto">
            For orders, custom cakes or any enquiries, <br />
            connect with us on WhatsApp or call us.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-2">
          {/* Chat on WhatsApp */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2.5 w-full py-3.5 px-4 rounded-2xl bg-[#2D7A47] hover:bg-[#256d3e] text-white shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="h-5 w-5 fill-white text-white" />
            <span className="text-xs font-bold uppercase tracking-wider">
              CHAT ON WHATSAPP
            </span>
          </a>

          {/* Call Us */}
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center justify-center space-x-2.5 w-full py-3.5 px-4 rounded-2xl bg-[#C28F52] hover:bg-[#b07f45] text-white shadow-lg shadow-amber-950/40 active:scale-[0.98] transition-all"
          >
            <Phone className="h-4 w-4 fill-white text-white" />
            <span className="text-xs font-bold uppercase tracking-wider">
              CALL US
            </span>
          </a>
        </div>

        {/* Shop Details Section */}
        <div className="w-full pt-4 text-left space-y-3">
          <h2 className="text-xs font-semibold text-luxury-300">
            Shop Details
          </h2>

          <div className="space-y-2.5">
            {/* Store Name */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gold-500/20 bg-[#161411] text-gold-400">
                <Store className="h-3.5 w-3.5" />
              </div>
              <span className="font-medium text-[#FBF7EE]">{restaurantName}</span>
            </div>

            {/* Address */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gold-500/20 bg-[#161411] text-gold-400">
                <MapPin className="h-3.5 w-3.5" />
              </div>
              <span className="text-luxury-200">{address}</span>
            </div>

            {/* Opening Hours */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-gold-500/20 bg-[#161411] text-gold-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <span className="text-luxury-200">{openingHours}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 pb-2 text-center">
          <p className="font-serif italic text-xs text-gold-400/90">
            Thank you for supporting local{" "}
            <span className="inline-block text-red-500 not-italic">❤️</span>
          </p>
        </div>
      </main>

      {/* 3. FIXED MOBILE BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-gold-500/20 bg-[#0d0c0a]/95 py-2 backdrop-blur-xl md:hidden">
        {/* Menu */}
        <Link
          href="/menu"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <CakeIcon className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">Menu</span>
        </Link>

        {/* All Cakes */}
        <Link
          href="/menu/cakes"
          className="flex flex-col items-center space-y-0.5 px-4 py-1 text-luxury-400 hover:text-cream-100 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span className="text-[9.5px] font-medium">All Cakes</span>
        </Link>

        {/* Order (Active Tab) */}
        <Link
          href="/menu/order"
          className="relative flex flex-col items-center space-y-0.5 px-4 py-1 rounded-xl bg-gold-500/10 text-gold-400"
        >
          <MessageCircle className="h-4 w-4 fill-gold-500/20" />
          <span className="text-[9.5px] font-bold">Order</span>
        </Link>
      </div>
    </div>
  );
}
