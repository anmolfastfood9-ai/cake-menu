"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Cake,
  FolderTree,
  Image as ImageIcon,
  Sparkles,
  Plus,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Settings,
  CheckCircle2,
  Clock,
  Eye,
  ShieldCheck,
  Zap,
  Smartphone,
  Sliders,
  Check,
} from "lucide-react";

interface AdminDashboardClientProps {
  totalCakes: number;
  totalCategories: number;
  totalImages: number;
  recentCakes: any[];
  sampleImages: any[];
  settings?: any;
  whatsappSetting?: any;
}

export default function AdminDashboardClient({
  totalCakes,
  totalCategories,
  totalImages,
  recentCakes = [],
  sampleImages = [],
  settings,
  whatsappSetting,
}: AdminDashboardClientProps) {
  const [waNumber, setWaNumber] = useState(
    whatsappSetting?.whatsappNumber || settings?.whatsapp || "919876543210"
  );
  const [savingWa, setSavingWa] = useState(false);
  const [savedWa, setSavedWa] = useState(false);

  const handleSaveWa = async () => {
    setSavingWa(true);
    try {
      await fetch("/api/whatsapp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappNumber: waNumber }),
      });
      setSavedWa(true);
      setTimeout(() => setSavedWa(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSavingWa(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header matching blueprint */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
            Dashboard
          </h1>
          <p className="text-xs text-luxury-400">
            Welcome back! Here's what's happening.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/menu"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 rounded-xl border border-gold-500/30 bg-luxury-900 px-4 py-2 text-xs font-semibold text-gold-300 hover:border-gold-500/60"
          >
            <span>View Website</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          <div className="rounded-xl border border-luxury-800 bg-luxury-900 px-3 py-2 text-xs font-semibold text-cream-200">
            <span>Sweet Delights</span>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards matching approved mockup */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1: Total Cakes */}
        <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-[#14120f] to-[#0d0c0a] p-4 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-luxury-400 block uppercase tracking-wider">Total Cakes</span>
            <span className="font-serif text-3xl font-extrabold text-cream-50">{totalCakes}</span>
            <span className="text-[10px] text-emerald-400 font-medium block">↗ Active Menu Items</span>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400 border border-gold-500/30 shadow-inner">
            <Cake className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 2: Categories */}
        <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-br from-[#14120f] to-[#0d0c0a] p-4 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-luxury-400 block uppercase tracking-wider">Active Categories</span>
            <span className="font-serif text-3xl font-extrabold text-cream-50">{totalCategories}</span>
            <span className="text-[10px] text-gold-400 font-medium block">↗ Specialty Collections</span>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-500/15 text-gold-400 border border-gold-500/30 shadow-inner">
            <FolderTree className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 3: Today's QR Scans */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#14120f] to-[#0a1811] p-4 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-luxury-400 block uppercase tracking-wider">Today's QR Scans</span>
            <span className="font-serif text-3xl font-extrabold text-emerald-400">1,420</span>
            <span className="text-[10px] text-emerald-400 font-medium block">↗ Table & Counter Scans</span>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <Smartphone className="h-6 w-6" />
          </div>
        </div>

        {/* Stat 4: WhatsApp Inquiries */}
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-[#14120f] to-[#0a1811] p-4 shadow-xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-luxury-400 block uppercase tracking-wider">WhatsApp Inquiries</span>
            <span className="font-serif text-3xl font-extrabold text-emerald-400">85</span>
            <span className="text-[10px] text-emerald-400 font-medium block">↗ Instant Order Queries</span>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-inner">
            <MessageCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Quick Action Hub matching approved mockup */}
      <div className="space-y-3">
        <h2 className="font-serif text-base font-bold text-cream-50 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gold-400" />
          <span>Quick Action Hub</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Quick Action 1: QR Code Generator Studio */}
          <Link
            href="/admin/qr"
            className="group rounded-2xl border border-gold-500/25 bg-gradient-to-r from-[#161410] to-[#12100d] p-4 shadow-lg hover:border-gold-500/60 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30 group-hover:scale-105 transition-transform">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                  QR Code Generator
                </h3>
                <p className="text-[11px] text-luxury-400">Printable tabletop QR studio</p>
              </div>
            </div>
          </Link>

          {/* Quick Action 2: Festive Occasion Manager */}
          <Link
            href="/admin/occasions"
            className="group rounded-2xl border border-gold-500/25 bg-gradient-to-r from-[#161410] to-[#12100d] p-4 shadow-lg hover:border-gold-500/60 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30 group-hover:scale-105 transition-transform">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                  Festive Occasion Manager
                </h3>
                <p className="text-[11px] text-luxury-400">Edit seasonal collections</p>
              </div>
            </div>
          </Link>

          {/* Quick Action 3: Website Settings */}
          <Link
            href="/admin/settings"
            className="group rounded-2xl border border-gold-500/25 bg-gradient-to-r from-[#161410] to-[#12100d] p-4 shadow-lg hover:border-gold-500/60 transition-all"
          >
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/30 group-hover:scale-105 transition-transform">
                <Settings className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold text-cream-100 group-hover:text-gold-300 transition-colors">
                  Website Settings
                </h3>
                <p className="text-[11px] text-luxury-400">General configs & WhatsApp</p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Recent Cakes + Right Quick Actions & Live Website Preview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Col: Recent Cakes Table */}
        <div className="lg:col-span-7 rounded-3xl border border-gold-500/20 bg-[#14120f] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
            <h2 className="font-serif text-base font-bold text-cream-50">
              Cake Inventory Status
            </h2>
            <Link href="/admin/cakes" className="text-xs font-semibold text-gold-400 hover:underline">
              View All Cakes →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-luxury-800 text-luxury-400">
                  <th className="pb-2.5 font-semibold">Cake</th>
                  <th className="pb-2.5 font-semibold">Category</th>
                  <th className="pb-2.5 font-semibold">Starting Price</th>
                  <th className="pb-2.5 font-semibold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-luxury-800/60">
                {recentCakes.map((cake) => (
                  <tr key={cake.id} className="hover:bg-luxury-800/30">
                    <td className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-gold-500/20 bg-luxury-950">
                          <Image src={cake.coverImage} alt={cake.name} fill sizes="40px" className="object-cover" />
                        </div>
                        <span className="font-semibold text-cream-100">{cake.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-luxury-300">
                      {cake.category?.name || "Chocolate"}
                    </td>
                    <td className="py-3 font-bold text-gold-400">
                      ₹{cake.prices[0]?.price || 799}
                    </td>
                    <td className="py-3 text-right">
                      <span className="rounded-full bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        ● Available
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Quick Actions & Live Website Preview Frame */}
        <div className="lg:col-span-5 space-y-6">
          {/* Quick Actions Card matching blueprint */}
          <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-5 shadow-xl space-y-3">
            <h2 className="font-serif text-sm font-bold text-cream-50">
              Cake Management
            </h2>

            <div className="space-y-2">
              <Link
                href="/admin/cakes/new"
                className="flex items-center space-x-2 rounded-xl bg-gold-gradient px-4 py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Cake</span>
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center space-x-2 rounded-xl border border-luxury-800 bg-[#1a1713] px-4 py-2.5 text-xs font-semibold text-cream-200 hover:border-gold-500/40"
              >
                <FolderTree className="h-4 w-4 text-gold-400" />
                <span>Manage Categories</span>
              </Link>

              <Link
                href="/admin/images"
                className="flex items-center space-x-2 rounded-xl border border-luxury-800 bg-[#1a1713] px-4 py-2.5 text-xs font-semibold text-cream-200 hover:border-gold-500/40"
              >
                <ImageIcon className="h-4 w-4 text-gold-400" />
                <span>Upload Images</span>
              </Link>
            </div>
          </div>

          {/* Interactive Live Website Preview Box matching blueprint */}
          <div className="rounded-3xl border border-gold-500/30 bg-[#14120f] p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-serif text-sm font-bold text-cream-50">
                Website Preview
              </span>
              <a
                href="/menu"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-[11px] text-gold-400 hover:underline"
              >
                <span>Open Full Website</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-gold-500/20 bg-luxury-950 p-3 text-left">
              <div className="flex items-center space-x-1 border-b border-luxury-800 pb-2 mb-2">
                <Cake className="h-3.5 w-3.5 text-gold-400" />
                <span className="font-serif text-[11px] font-bold text-cream-100">Sweet Delights</span>
              </div>
              <p className="font-serif text-xs font-bold text-cream-50 leading-tight">
                Every Celebration Deserves a <span className="text-gold-400">Perfect Cake ♡</span>
              </p>
              <div className="mt-2 grid grid-cols-3 gap-1.5">
                {recentCakes.slice(0, 3).map((c, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-luxury-800">
                    <Image src={c.coverImage} alt={c.name} fill sizes="80px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Image Library Sample Row + Quick WhatsApp Settings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sample Image Library Row */}
        <div className="lg:col-span-7 rounded-3xl border border-gold-500/20 bg-[#14120f] p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-sm font-bold text-cream-50 uppercase tracking-wider">
              Image Library (Sample)
            </h2>
            <Link href="/admin/images" className="text-xs text-gold-400 hover:underline">
              View All Images
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5">
            {sampleImages.map((img) => (
              <div
                key={img.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-luxury-800 bg-luxury-950 hover:border-gold-500 transition-colors"
              >
                <Image src={img.url} alt={img.filename} fill sizes="100px" className="object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Quick WhatsApp Settings Widget */}
        <div className="lg:col-span-5 rounded-3xl border border-gold-500/20 bg-[#14120f] p-5 shadow-xl space-y-3">
          <h2 className="font-serif text-sm font-bold text-cream-50 uppercase tracking-wider">
            WhatsApp Settings
          </h2>

          <div className="space-y-1.5">
            <label className="block text-[11px] text-luxury-400">WhatsApp Number</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
              />
              <button
                onClick={handleSaveWa}
                disabled={savingWa}
                className="shrink-0 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-luxury-950 shadow-gold-sm"
              >
                {savedWa ? "Saved!" : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust Bar matching blueprint */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 border-t border-luxury-800 pt-6 text-center text-xs text-luxury-400">
        <div className="space-y-1">
          <Clock className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">No Order System</span>
          <span className="text-[10px]">Simple menu showcase</span>
        </div>

        <div className="space-y-1">
          <Sliders className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">Easy to Manage</span>
          <span className="text-[10px]">Update cakes anytime</span>
        </div>

        <div className="space-y-1">
          <Zap className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">Lightning Fast</span>
          <span className="text-[10px]">Optimized for speed</span>
        </div>

        <div className="space-y-1">
          <Smartphone className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">Mobile Friendly</span>
          <span className="text-[10px]">Works on all devices</span>
        </div>

        <div className="space-y-1 col-span-2 sm:col-span-1">
          <ShieldCheck className="mx-auto h-4 w-4 text-gold-400" />
          <span className="block font-bold text-cream-200">Secure & Reliable</span>
          <span className="text-[10px]">Your data is safe</span>
        </div>
      </div>
    </div>
  );
}
