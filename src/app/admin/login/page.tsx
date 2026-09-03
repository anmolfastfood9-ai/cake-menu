"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@bakery.com");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      const redirectTarget = searchParams.get("redirect");
      const destination =
        redirectTarget &&
        redirectTarget.startsWith("/admin") &&
        redirectTarget !== "/admin/login"
          ? redirectTarget
          : "/admin";

      router.push(destination);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-luxury-950 px-4 py-12 text-cream-100 selection:bg-gold-500 selection:text-luxury-950">
      {/* Background Glow */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative w-full max-w-md space-y-8 rounded-3xl border border-gold-500/30 bg-luxury-900/90 p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/40 bg-luxury-950 text-gold-400 shadow-gold-sm">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold tracking-wide text-cream-50 sm:text-3xl">
            Bakery Admin Portal
          </h1>
          <p className="text-xs text-luxury-400">
            Sign in to manage cakes, weight prices, categories & branding
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center space-x-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-cream-200">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bakery.com"
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950/80 py-2.5 pl-10 pr-4 text-xs text-cream-100 placeholder-luxury-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-cream-200">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-luxury-700 bg-luxury-950/80 py-2.5 pl-10 pr-4 text-xs text-cream-100 placeholder-luxury-500 focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Hint */}
          <div className="rounded-xl border border-gold-500/15 bg-luxury-950/60 p-3 text-[11px] text-luxury-400">
            <span className="font-semibold text-gold-400">Default Admin Credentials:</span>
            <div className="mt-1 flex items-center justify-between">
              <span>Email: <code className="text-cream-200">admin@bakery.com</code></span>
              <span>Pass: <code className="text-cream-200">admin123</code></span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center space-x-2 rounded-xl bg-gold-gradient py-3 text-xs font-bold text-luxury-950 shadow-gold-sm transition-all hover:opacity-95 disabled:opacity-50"
          >
            {loading ? (
              <Sparkles className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center">
          <Link
            href="/menu"
            className="text-xs text-luxury-400 hover:text-gold-400 transition-colors"
          >
            ← Return to Customer Menu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-luxury-950 flex items-center justify-center text-gold-400 text-xs">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
