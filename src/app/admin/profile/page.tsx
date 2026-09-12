"use client";

import { useState, useEffect } from "react";
import { User, Lock, Mail, Check, AlertCircle, Sparkles, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setName(data.user.name || "");
          setEmail(data.user.email || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-luxury-400">
        Loading profile details...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 pb-32 sm:pb-12">
      <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-luxury-800 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Security & Credentials
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 mt-1">
              Admin Profile
            </h1>
            <p className="text-xs text-luxury-400 mt-1">
              Update your administrative credentials, display name, and login password.
            </p>
          </div>
          <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/30 bg-gold-500/10 text-gold-400 font-serif text-lg font-bold shadow-gold-sm">
            {name ? name.charAt(0).toUpperCase() : "R"}
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center space-x-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-center space-x-2 rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-3.5 text-xs text-emerald-400">
            <Check className="h-4 w-4 shrink-0" />
            <span>Profile and credentials updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-cream-200">
                Display Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 py-2.5 pl-10 pr-4 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-cream-200">
                Login Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 py-2.5 pl-10 pr-4 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-luxury-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-cream-100">
                Change Password (Leave blank to keep unchanged)
              </h3>
              <ShieldCheck className="h-4 w-4 text-gold-400" />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-cream-200">
                Current Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-400" />
                <input
                  type={showCurrentPw ? "text" : "password"}
                  placeholder="Enter current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 py-2.5 pl-10 pr-10 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPw(!showCurrentPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-400 hover:text-cream-100 p-1"
                >
                  {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-cream-200">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 py-2.5 pl-3.5 pr-10 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-400 hover:text-cream-100 p-1"
                  >
                    {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-cream-200">
                    Confirm New Password
                  </label>
                  {newPassword && confirmPassword && (
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-1 ${
                        newPassword === confirmPassword ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      {newPassword === confirmPassword ? "✓ Match" : "✕ Do not match"}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showConfirmPw ? "text" : "password"}
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-luxury-950 py-2.5 pl-3.5 pr-10 text-xs text-cream-100 focus:outline-none ${
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-amber-500/60 focus:border-amber-500"
                        : "border-luxury-700 focus:border-gold-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-luxury-400 hover:text-cream-100 p-1"
                  >
                    {showConfirmPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-luxury-800">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gold-gradient px-7 py-3 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 disabled:opacity-50 transition-opacity"
            >
              {saving ? (
                <Sparkles className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  <span>Update Profile Credentials</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
