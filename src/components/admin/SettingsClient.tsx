"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Check, Settings, Store, Clock, MapPin, Phone, MessageCircle, Globe, AlertCircle } from "lucide-react";

interface SettingsClientProps {
  initialSettings?: any;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState(
    initialSettings?.restaurantName || "Raman Sweet & Luxury Pâtisserie"
  );
  const [tagline, setTagline] = useState(
    initialSettings?.tagline || "Handcrafted Artisanal Cakes & Luxury Confections"
  );
  const [heroTitle, setHeroTitle] = useState(
    initialSettings?.heroTitle || "Artisanal Elegance In Every Slice"
  );
  const [heroSubtitle, setHeroSubtitle] = useState(
    initialSettings?.heroSubtitle ||
      "Indulge in our curated collection of master-crafted cakes, baked fresh with premium Belgian cocoa, organic vanilla & French butter."
  );
  const [heroImage, setHeroImage] = useState(
    initialSettings?.heroImage ||
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop"
  );
  const [about, setAbout] = useState(
    initialSettings?.about ||
      "Welcome to Raman Sweet Cake. Every creation is an edible masterpiece made to elevate your moments of joy and celebration."
  );
  const [phone, setPhone] = useState(initialSettings?.phone || "+91 98765 43210");
  const [whatsapp, setWhatsapp] = useState(initialSettings?.whatsapp || "919876543210");
  const [address, setAddress] = useState(
    initialSettings?.address || "Plot 42, Haute Pâtisserie Boulevard, Luxury District, Delhi NCR, India"
  );
  const [openingHours, setOpeningHours] = useState(
    initialSettings?.openingHours || "Monday - Sunday: 9:00 AM - 11:00 PM"
  );
  const [instagram, setInstagram] = useState(
    initialSettings?.instagram || "https://instagram.com/ramansweetcake"
  );
  const [facebook, setFacebook] = useState(
    initialSettings?.facebook || "https://facebook.com/ramansweetcake"
  );
  const [footerText, setFooterText] = useState(
    initialSettings?.footerText || "© 2026 Raman Sweet & Luxury Pâtisserie. Handcrafted with passion."
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantName,
          tagline,
          heroTitle,
          heroSubtitle,
          heroImage,
          about,
          phone,
          whatsapp,
          address,
          openingHours,
          instagram,
          facebook,
          footerText,
        }),
      });

      if (!res.ok) throw new Error("Failed to update settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
          Branding & Identity
        </span>
        <h1 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl">
          Website & Bakery Settings
        </h1>
        <p className="text-xs text-luxury-400">
          Changes configured here instantly appear on the customer digital menu without touching code.
        </p>
      </div>

      {success && (
        <div className="flex items-center space-x-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-4 text-xs font-semibold text-emerald-400">
          <Check className="h-4 w-4 shrink-0" />
          <span>Website settings updated successfully! Live menu is in sync.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 rounded-2xl border border-red-500/40 bg-red-950/60 p-4 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Hero Banner Card */}
        <div className="rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-6 sm:p-8 shadow-xl space-y-5">
          <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
            <Store className="h-4 w-4 text-gold-400" />
            <span>Bakery Brand & Hero Section</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Restaurant / Bakery Name
              </label>
              <input
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Hero Section Title
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Hero Section Subtitle
              </label>
              <textarea
                rows={2}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-3 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Hero Showcase Image URL
              </label>
              <input
                type="url"
                value={heroImage}
                onChange={(e) => setHeroImage(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Location Details */}
        <div className="rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-6 sm:p-8 shadow-xl space-y-5">
          <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
            <Phone className="h-4 w-4 text-gold-400" />
            <span>Contact & Physical Boutique Details</span>
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cream-200">
                Direct Call Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cream-200">
                WhatsApp Number (with Country Code e.g. 919876543210)
              </label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Bakery Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-cream-200">
                Opening Hours
              </label>
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Story, Social & Footer */}
        <div className="rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-6 sm:p-8 shadow-xl space-y-5">
          <h2 className="font-serif text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
            <Globe className="h-4 w-4 text-gold-400" />
            <span>Bakery Story & Social Channels</span>
          </h2>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cream-200">
                Bakery Story / About Text
              </label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-3 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-cream-200">
                  Instagram Profile URL
                </label>
                <input
                  type="url"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-cream-200">
                  Facebook Page URL
                </label>
                <input
                  type="url"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold text-cream-200">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={footerText}
                onChange={(e) => setFooterText(e.target.value)}
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-4 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 rounded-xl bg-gold-gradient px-7 py-3 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity"
          >
            {saving ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Save All Website Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
