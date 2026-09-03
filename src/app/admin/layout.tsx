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
  MessageCircle,
  LogOut,
  ExternalLink,
  Menu as MenuIcon,
  X,
  Sparkles,
  ShieldAlert,
  User,
  Calendar,
} from "lucide-react";

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
    { label: "WhatsApp Template", href: "/admin/whatsapp", icon: MessageCircle },
    { label: "Admin Profile", href: "/admin/profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#090807] text-[#FBF7EE] flex flex-col md:flex-row">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-gold-500/15 bg-[#12100e] p-5 shrink-0">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center space-x-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="font-serif text-base font-bold text-cream-50 block">Sweet Delights</span>
              <span className="text-[10px] uppercase tracking-widest text-gold-400 font-semibold">CMS Panel</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1 pt-2">
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
        <div className="space-y-3 pt-6 border-t border-luxury-800">
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
      <header className="flex md:hidden items-center justify-between border-b border-gold-500/15 bg-[#12100e] px-4 py-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-gold-400" />
          <span className="font-serif text-base font-bold text-cream-50">Sweet Delights Admin</span>
        </div>

        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="rounded-lg border border-luxury-700 bg-luxury-900 p-1.5 text-luxury-300"
        >
          {mobileNavOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileNavOpen && (
        <div className="border-b border-luxury-800 bg-[#12100e] p-4 md:hidden">
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
            <div className="pt-3 flex flex-col space-y-2">
              <Link
                href="/menu"
                target="_blank"
                className="flex items-center justify-center space-x-1.5 rounded-xl bg-gold-500/10 py-2 text-xs font-semibold text-gold-300 border border-gold-500/30"
              >
                <span>Preview Website</span>
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
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#090807]">
        {children}
      </main>
    </div>
  );
}
