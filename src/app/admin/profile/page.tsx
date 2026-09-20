"use client";

import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Mail,
  Check,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  BadgeCheck,
  Clock,
  Zap,
} from "lucide-react";

function getPasswordStrength(password: string) {
  if (!password) return { score: 0, label: "", color: "", width: "0%" };
  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 10) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 1, label: "Weak (add numbers/symbols)", color: "bg-red-500", width: "25%" };
  if (score === 2) return { score: 2, label: "Fair (make it longer)", color: "bg-amber-500", width: "50%" };
  if (score === 3) return { score: 3, label: "Good", color: "bg-gold-400", width: "75%" };
  return { score: 4, label: "Strong & Secure", color: "bg-emerald-500", width: "100%" };
}

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

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (newPassword && newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      return;
    }

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

      // Reload page after 1s so session header instantly updates
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-luxury-400 flex flex-col items-center justify-center space-y-2">
        <Sparkles className="h-6 w-6 text-gold-400 animate-spin" />
        <span>Loading profile security details...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-32 sm:pb-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-luxury-800 pb-5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              ACCOUNT SECURITY & ACCESS
            </span>
            <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <BadgeCheck className="h-3 w-3" />
              <span>Super Admin Active</span>
            </span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl mt-1">
            Admin Profile & Credentials
          </h1>
          <p className="text-xs text-luxury-400 mt-1">
            Manage your administrative account name, login email, and secure access password.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Profile Card & Password Form */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-6 sm:p-8 shadow-2xl">
            {/* Avatar Header */}
            <div className="flex items-center space-x-4 border-b border-luxury-800 pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 via-gold-500 to-amber-700 text-luxury-950 font-serif text-2xl font-bold shadow-gold-md shrink-0">
                {name ? name.charAt(0).toUpperCase() : "A"}
              </div>
              <div className="overflow-hidden">
                <h2 className="font-serif text-lg font-bold text-cream-50 truncate">
                  {name || "Raman Sweet Bakery Admin"}
                </h2>
                <p className="text-xs text-luxury-400 truncate mt-0.5">{email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="inline-flex items-center space-x-1 text-[10px] font-semibold text-gold-300 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded-full">
                    <KeyRound className="h-3 w-3 text-gold-400" />
                    <span>Primary Owner Account</span>
                  </span>
                </div>
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
                <span>Profile updated successfully! Refreshing session...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Name & Email Fields */}
              <div className="space-y-4">
                <h3 className="font-serif text-xs font-bold text-cream-100 uppercase tracking-wider text-gold-400">
                  Account Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      Login Email Address
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
              </div>

              {/* Password Section */}
              <div className="pt-5 border-t border-luxury-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xs font-bold text-cream-100 uppercase tracking-wider text-gold-400 flex items-center space-x-2">
                    <ShieldCheck className="h-4 w-4 text-gold-400" />
                    <span>Change Login Password (Optional)</span>
                  </h3>
                  <span className="text-[10px] text-luxury-400">Leave blank to keep current</span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-cream-200">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-400" />
                    <input
                      type={showCurrentPw ? "text" : "password"}
                      placeholder="Enter current password to verify"
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
                        placeholder="At least 8 characters"
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

                    {/* Password Strength Meter */}
                    {newPassword && (
                      <div className="space-y-1 pt-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-luxury-400">Strength:</span>
                          <span className="font-semibold text-cream-100">{passwordStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-luxury-900 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: passwordStrength.width }}
                          />
                        </div>
                      </div>
                    )}
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

              {/* Submit Button */}
              <div className="flex justify-end pt-5 border-t border-luxury-800">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gold-gradient px-8 py-3 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 disabled:opacity-50 transition-opacity cursor-pointer"
                >
                  {saving ? (
                    <Sparkles className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save Profile Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Security Status Overview */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-sm font-bold text-cream-50 flex items-center space-x-2 border-b border-luxury-800 pb-3">
              <ShieldCheck className="h-4 w-4 text-gold-400" />
              <span>Security Telemetry</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl border border-luxury-800 bg-luxury-950">
                <div className="flex items-center space-x-2">
                  <KeyRound className="h-4 w-4 text-gold-400" />
                  <div>
                    <span className="block text-xs font-semibold text-cream-100">Password Encryption</span>
                    <span className="block text-[10px] text-luxury-400">Bcrypt Salt Cost 10</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl border border-luxury-800 bg-luxury-950">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-gold-400" />
                  <div>
                    <span className="block text-xs font-semibold text-cream-100">Rate Limiter</span>
                    <span className="block text-[10px] text-luxury-400">10 Req / 15 Mins</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  Protected
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl border border-luxury-800 bg-luxury-950">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gold-400" />
                  <div>
                    <span className="block text-xs font-semibold text-cream-100">Session Cookie</span>
                    <span className="block text-[10px] text-luxury-400">7-Day HttpOnly JWT</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gold-400 bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 rounded-full">
                  Synced
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
