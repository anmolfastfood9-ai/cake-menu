import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/customer/Navbar";
import Footer from "@/components/customer/Footer";
import CakeCard from "@/components/customer/CakeCard";
import FloatingContact from "@/components/customer/FloatingContact";
import { ArrowLeft, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      cakes: {
        where: { available: true },
        include: {
          category: true,
          prices: {
            orderBy: { price: "asc" },
          },
        },
        orderBy: [{ featured: "desc" }, { bestseller: "desc" }, { createdAt: "desc" }],
      },
    },
  });

  if (!category) {
    notFound();
  }

  const settings = await prisma.websiteSetting.findUnique({
    where: { id: "default" },
  });

  const whatsappSetting = await prisma.whatsAppSetting.findUnique({
    where: { id: "default" },
  });

  const restaurantName = settings?.restaurantName || "Raman Sweet & Luxury Pâtisserie";
  const whatsappNumber = whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210";
  const phoneNumber = whatsappSetting?.callNumber || settings?.phone || "+91 98765 43210";

  return (
    <div className="min-h-screen flex flex-col bg-luxury-950 text-cream-100">
      <Navbar
        restaurantName={restaurantName}
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
      />

      <main className="flex-1 py-10 lg:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back */}
          <div className="mb-6">
            <Link
              href="/menu"
              className="inline-flex items-center space-x-2 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Full Menu</span>
            </Link>
          </div>

          {/* Category Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-gold-500/20 bg-gradient-to-r from-luxury-900 via-luxury-850 to-luxury-900 p-8 sm:p-10 shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center space-x-1.5 rounded-full border border-gold-500/30 bg-luxury-950/80 px-3 py-1 text-xs font-semibold text-gold-300">
                <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                <span>Specialty Collection</span>
              </span>
              <h1 className="mt-4 font-serif text-3xl font-extrabold text-cream-50 sm:text-4xl">
                {category.name}
              </h1>
              {category.description && (
                <p className="mt-2 text-sm leading-relaxed text-luxury-300">
                  {category.description}
                </p>
              )}
              <span className="mt-4 inline-block text-xs font-medium text-gold-400">
                {category.cakes.length} artisanal {category.cakes.length === 1 ? "cake" : "cakes"} available
              </span>
            </div>
          </div>

          {/* Cake Grid */}
          <div className="mt-10">
            {category.cakes.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {category.cakes.map((cake) => (
                  <CakeCard
                    key={cake.id}
                    cake={cake}
                    whatsappNumber={whatsappNumber}
                    restaurantName={restaurantName}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-luxury-400">
                No cakes currently available in this category.
              </div>
            )}
          </div>
        </div>
      </main>

      <FloatingContact
        whatsappNumber={whatsappNumber}
        phoneNumber={phoneNumber}
        restaurantName={restaurantName}
      />

      <Footer
        restaurantName={restaurantName}
        phone={phoneNumber}
        whatsapp={whatsappNumber}
        address={settings?.address}
        openingHours={settings?.openingHours}
      />
    </div>
  );
}
