"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Cake,
  FolderTree,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Sparkles,
  ShieldAlert,
  User,
  Calendar,
  QrCode,
  ChefHat,
  Plus,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!isLoginPage) {
      fetch("/api/auth/me")
        .then((res) => {
          if (!res.ok) {
            router.push("/admin/login");
          } else {
            return res.json();
          }
        })
        .then((data) => {
          if (data?.user) setAdminUser(data.user);
        })
        .catch(() => router.push("/admin/login"));
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Cakes Catalog", href: "/admin/cakes", icon: Cake },
    { label: "Categories", href: "/admin/categories", icon: FolderTree },
    { label: "Festivals & Occasions", href: "/admin/occasions", icon: Calendar },
    { label: "Media Library", href: "/admin/images", icon: ImageIcon },
    { label: "Website Settings", href: "/admin/settings", icon: Settings },
    { label: "WhatsApp Template", href: "/admin/whatsapp", icon: WhatsAppIcon },
    { label: "QR Code Generator", href: "/admin/qr", icon: QrCode },
    { label: "Admin Profile", href: "/admin/profile", icon: User },
  ];

  return (
    <div className="admin-scope min-h-screen bg-[#090807] text-[#FBF7EE] flex flex-col md:flex-row font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-gold-500/15 bg-[#12100e] p-5 shrink-0">
        <div className="space-y-6">
          {/* Brand Header */}
          <Link href="/admin" className="flex items-center space-x-3.5 px-2 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#181511] text-[#E5C378] border border-gold-500/30 shadow-gold-sm group-hover:border-gold-500/60 group-hover:scale-105 transition-all shrink-0">
              <svg
                className="h-6 w-6 text-[#E5C378]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 13.5V15a0.8 0.8 0 0 0 0.8 0.8h10.4a0.8 0.8 0 0 0 0.8-0.8v-1.5" />
                <path d="M7.5 17.8a9 9 0 0 0 9 0" />
                <path d="M6 13.5A3.8 3.8 0 0 1 3.5 10a3.8 3.8 0 0 1 4.5-3.8 4.2 4.2 0 0 1 8 0 3.8 3.8 0 0 1 4.5 3.8 3.8 3.8 0 0 1-2.5 3.5" />
              </svg>
            </div>
            <div className="flex items-center overflow-visible">
              <span
                className="inline-block font-script text-[38px] text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF8] via-[#F3E5CA] to-[#E5C378] pl-2 pr-3 py-1.5 -ml-1 leading-normal tracking-wide drop-shadow-[0_2px_12px_rgba(212,175,55,0.25)] select-none group-hover:brightness-110 transition-all overflow-visible"
                style={{ fontFamily: 'var(--font-script), "Great Vibes", "Alex Brush", cursive' }}
              >
                Raman
              </span>
            </div>
          </Link>

          {/* User Profile Pill */}
          {adminUser && (
            <Link
              href="/admin/profile"
              className="flex items-center space-x-2.5 rounded-xl border border-luxury-800 bg-[#161411] px-3 py-2 text-xs hover:border-gold-500/40 transition-colors"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-500/20 text-gold-400 font-bold text-xs shrink-0">
                {adminUser.name ? adminUser.name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="overflow-hidden min-w-0 flex-1">
                <div className="flex items-center space-x-1.5">
                  <span className="font-semibold text-cream-100 block truncate text-[11.5px] leading-tight">
                    {adminUser.name && adminUser.name.length > 20 ? "Raman (Admin)" : (adminUser.name || "Chef Admin")}
                  </span>
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" title="Online" />
                </div>
                <span className="text-[9.5px] text-luxury-400 truncate block mt-0.5">
                  {adminUser.email}
                </span>
              </div>
            </Link>
          )}

          {/* Navigation */}
          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gold-gradient text-luxury-950 shadow-gold-sm font-bold"
                      : "text-luxury-300 hover:bg-luxury-800 hover:text-cream-100"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-4 border-t border-luxury-800">
          <Link
            href="/menu"
            target="_blank"
            className="flex items-center justify-between rounded-xl border border-gold-500/30 bg-gold-500/10 px-3.5 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950 transition-colors"
          >
            <span>Live Digital Menu</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center space-x-2 rounded-xl px-3.5 py-2 text-xs font-medium text-luxury-400 hover:bg-red-950/40 hover:text-red-400 transition-colors"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header Bar */}
      <header className="flex md:hidden items-center justify-between border-b border-gold-500/15 bg-[#12100e] px-4 py-2.5">
        <Link href="/admin" className="flex items-center space-x-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#181511] text-[#E5C378] border border-gold-500/30 shrink-0">
            <svg
              className="h-4.5 w-4.5 text-[#E5C378]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 13.5V15a0.8 0.8 0 0 0 0.8 0.8h10.4a0.8 0.8 0 0 0 0.8-0.8v-1.5" />
              <path d="M7.5 17.8a9 9 0 0 0 9 0" />
              <path d="M6 13.5A3.8 3.8 0 0 1 3.5 10a3.8 3.8 0 0 1 4.5-3.8 4.2 4.2 0 0 1 8 0 3.8 3.8 0 0 1 4.5 3.8 3.8 3.8 0 0 1-2.5 3.5" />
            </svg>
          </div>
          <span
            className="inline-block font-script text-[30px] text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF8] via-[#F3E5CA] to-[#E5C378] pl-1.5 pr-2.5 py-1 leading-normal tracking-wide overflow-visible"
            style={{ fontFamily: 'var(--font-script), "Great Vibes", "Alex Brush", cursive' }}
          >
            Raman
          </span>
        </Link>

        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="rounded-xl border border-luxury-700 bg-luxury-900 p-2 text-luxury-300 hover:text-cream-100"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="border-b border-luxury-800 bg-[#12100e] p-4 md:hidden animate-fadeIn">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className={`flex items-center space-x-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold ${
                    isActive ? "bg-gold-gradient text-luxury-950 font-bold" : "text-luxury-300"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 flex flex-col space-y-2 border-t border-luxury-800 mt-2">
              <Link
                href="/menu"
                target="_blank"
                className="flex items-center justify-center space-x-1.5 rounded-xl bg-gold-500/10 py-2 text-xs font-semibold text-gold-300 border border-gold-500/30"
              >
                <span>Preview Live Menu</span>
                <ExternalLink className="h-3 w-3" />
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center space-x-2 rounded-xl py-2 text-xs font-medium text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* Main Admin Content View */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090807] pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Admin Bottom Navigation Dock */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#12100e]/95 backdrop-blur-xl border-t border-gold-500/20 px-3 py-1.5 flex items-center justify-around shadow-2xl">
        <Link
          href="/admin"
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
            pathname === "/admin" ? "text-gold-400 font-bold" : "text-luxury-400 hover:text-cream-100"
          }`}
        >
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Dashboard</span>
        </Link>

        <Link
          href="/admin/cakes"
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
            pathname === "/admin/cakes" ? "text-gold-400 font-bold" : "text-luxury-400 hover:text-cream-100"
          }`}
        >
          <Cake className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Cakes</span>
        </Link>

        {/* Central Prominent Add Cake Button */}
        <Link
          href="/admin/cakes/new"
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-gradient text-luxury-950 shadow-gold-md border-2 border-[#12100e] active:scale-95 transition-transform">
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-bold text-gold-300 mt-0.5">Add</span>
        </Link>

        <Link
          href="/admin/qr"
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
            pathname === "/admin/qr" ? "text-gold-400 font-bold" : "text-luxury-400 hover:text-cream-100"
          }`}
        >
          <QrCode className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">Table QR</span>
        </Link>

        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-colors ${
            mobileNavOpen ? "text-gold-400 font-bold" : "text-luxury-400 hover:text-cream-100"
          }`}
        >
          <MenuIcon className="h-5 w-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>
    </div>
  );
}
