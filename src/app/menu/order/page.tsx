import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/db";
import Footer from "@/components/customer/Footer";
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
    <div className="min-h-screen bg-[#090807] text-[#FBF7EE] font-sans flex flex-col justify-between selection:bg-gold-500/30 selection:text-gold-200 pb-20 md:pb-0">
      {/* 1. TOP HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-gold-500/10 bg-[#090807]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <Link
            href="/menu"
            className="flex items-center space-x-2 text-[#FBF7EE] hover:text-gold-400 transition-colors text-xs font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Digital Menu</span>
          </Link>

          <span className="font-serif text-sm font-bold text-gold-400 hidden sm:inline">
            {restaurantName}
          </span>
        </div>
      </header>

      {/* 2. MAIN BODY CONTAINER */}
      <main className="flex-1 max-w-md md:max-w-4xl lg:max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex flex-col justify-center">
        <div className="rounded-3xl border border-gold-500/20 bg-gradient-to-b from-[#14120f] to-[#0d0b09] p-6 sm:p-8 md:p-10 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
            
            {/* Left Column: Chef Illustration & Headline */}
            <div className="md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left space-y-4">
              <div className="relative h-32 w-32 sm:h-36 sm:w-36 md:h-44 md:w-44 overflow-hidden rounded-full shadow-2xl border-2 border-gold-500/30">
                <Image
                  src="/images/chef_illustration.png"
                  alt="Chef Illustration"
                  fill
                  priority
                  sizes="(max-width: 640px) 150px, 200px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gold-500/10 text-gold-400 border border-gold-500/20">
                  <Sparkles className="h-3 w-3" />
                  <span>Direct Confection Concierge</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FBF7EE] leading-tight">
                  We&apos;d Love to Bake <br />
                  Your Happiness! <span className="inline-block text-red-500">❤️</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#A69B8D] font-normal leading-relaxed">
                  For custom designer cakes, bulk celebratory orders or general queries, connect directly with our chefs.
                </p>
              </div>
            </div>

            {/* Right Column: Action Buttons & Shop Details */}
            <div className="md:col-span-7 space-y-5 w-full">
              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Chat on WhatsApp */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2.5 w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 active:scale-[0.98] transition-all font-bold text-xs sm:text-sm"
                >
                  <MessageCircle className="h-5 w-5 fill-white text-white" />
                  <span>CHAT ON WHATSAPP DIRECTLY</span>
                </a>

                {/* Call Us */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="flex items-center justify-center space-x-2.5 w-full py-3.5 px-5 rounded-2xl border border-gold-500/30 bg-[#181512] hover:bg-gold-500 hover:text-luxury-950 text-gold-300 shadow-lg active:scale-[0.98] transition-all font-bold text-xs sm:text-sm"
                >
                  <Phone className="h-4 w-4" />
                  <span>CALL US: {phoneNumber}</span>
                </a>
              </div>

              {/* Shop Details Section */}
              <div className="rounded-2xl border border-luxury-800 bg-[#0c0a09] p-4 sm:p-5 space-y-3 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400 block">
                  Bakery Location & Timings
                </span>

                <div className="space-y-2.5 text-xs text-cream-200">
                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gold-500/20 bg-[#161411] text-gold-400 mt-0.5">
                      <Store className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-semibold text-[#FBF7EE] block">{restaurantName}</span>
                      <span className="text-[11px] text-emerald-400 font-medium">100% Pure Veg & Eggless Boutique</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gold-500/20 bg-[#161411] text-gold-400 mt-0.5">
                      <MapPin className="h-3 w-3" />
                    </div>
                    <span className="text-luxury-300 text-[11.5px] leading-relaxed">{address}</span>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gold-500/20 bg-[#161411] text-gold-400 mt-0.5">
                      <Clock className="h-3 w-3" />
                    </div>
                    <span className="text-luxury-300 text-[11.5px]">{openingHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. DESKTOP FOOTER */}
      <div className="hidden md:block">
        <Footer
          restaurantName={restaurantName}
          phone={phoneNumber}
          whatsapp={whatsappNumber}
          address={address}
          openingHours={openingHours}
          instagram={settings?.instagram || undefined}
          facebook={settings?.facebook || undefined}
          footerText={settings?.footerText || undefined}
        />
      </div>

      {/* 4. FIXED MOBILE BOTTOM NAVIGATION BAR */}
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
          className="relative flex flex-col items-center space-y-0.5 px-4 py-1 rounded-xl bg-gold-500/10 text-gold-400"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-[9.5px] font-bold">Order</span>
        </Link>
      </div>
    </div>
  );
}
