"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  Sparkles,
  Check,
  AlertCircle,
  ExternalLink,
  HelpCircle,
  Smartphone,
} from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { generateWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppSettingsClientProps {
  initialSetting?: any;
  restaurantName?: string;
}

export default function WhatsAppSettingsClient({
  initialSetting,
  restaurantName = "Raman Sweet Cake",
}: WhatsAppSettingsClientProps) {
  const router = useRouter();

  const [whatsappNumber, setWhatsappNumber] = useState(
    initialSetting?.whatsappNumber || "919876543210"
  );
  const [callNumber, setCallNumber] = useState(initialSetting?.callNumber || "+91 98765 43210");
  const [template, setTemplate] = useState(
    initialSetting?.defaultMessageTemplate ||
      "Hello Raman Sweet Cake, I would like to enquire about:\n\n🍰 *Cake:* {cake_name}\n⚖️ *Weight:* {weight}\n💰 *Price:* ₹{price}\n\nPlease confirm availability and preparation time."
  );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulated live preview message
  const previewMessage = template
    .replace(/{cake_name}/g, "24K Royal Belgian Chocolate Truffle")
    .replace(/{weight}/g, "1 kg")
    .replace(/{price}/g, "2,399")
    .replace(/{restaurant_name}/g, restaurantName);

  const testWaLink = generateWhatsAppLink({
    cakeName: "24K Royal Belgian Chocolate Truffle",
    weight: "1 kg",
    price: 2399,
    restaurantName,
    template,
    whatsappNumber,
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/whatsapp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whatsappNumber,
          callNumber,
          defaultMessageTemplate: template,
          isEnabled: true,
        }),
      });

      if (!res.ok) throw new Error("Failed to save WhatsApp settings");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to update WhatsApp settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-32 sm:pb-12">
      {/* Header */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          Enquiry & Conversion Channels
        </span>
        <h1 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl">
          WhatsApp & Phone Configuration
        </h1>
        <p className="text-xs text-luxury-400">
          This digital menu directs all customer orders to your official WhatsApp number with automatic cake details.
        </p>
      </div>

      {success && (
        <div className="flex items-center space-x-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-4 text-xs font-semibold text-emerald-400">
          <Check className="h-4 w-4 shrink-0" />
          <span>WhatsApp settings & message template updated successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 rounded-2xl border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Form: Configuration */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSave} className="space-y-6 rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-6 sm:p-8 shadow-xl">
            <h2 className="font-sans text-base font-bold text-cream-100 flex items-center space-x-2 border-b border-luxury-800 pb-3">
              <WhatsAppIcon className="h-4 w-4 text-emerald-400" />
              <span>Contact Numbers & Messaging Template</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-cream-200">
                  Official WhatsApp Number <span className="text-gold-400">*</span>
                </label>
                <div className="relative">
                  <WhatsAppIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 919876543210 (Country code + Phone number)"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 py-2.5 pl-10 pr-4 text-xs text-cream-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-luxury-400">
                  Enter with country code (e.g. 91 for India, 1 for US) without + or spaces.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-cream-200">
                  Call Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gold-400" />
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={callNumber}
                    onChange={(e) => setCallNumber(e.target.value)}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 py-2.5 pl-10 pr-4 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-cream-200">
                    Pre-filled WhatsApp Message Template
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setTemplate(
                        "Hello Raman Sweet Cake, I would like to enquire about:\n\n🍰 *Cake:* {cake_name}\n⚖️ *Weight:* {weight}\n💰 *Price:* ₹{price}\n\nPlease confirm availability and preparation time."
                      );
                    }}
                    className="text-[10px] text-gold-400 hover:underline"
                  >
                    Reset to Default
                  </button>
                </div>

                {/* 1-Tap Emoji & Formatting Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[10px] text-luxury-500 font-medium shrink-0">Quick Insert:</span>
                  {["🍰", "🎂", "✨", "⚖️", "💰", "🎉", "📍", "⏳"].map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setTemplate((prev: string) => `${prev}${emoji}`)}
                      className="h-7 w-7 rounded-lg border border-luxury-800 bg-luxury-950 text-xs hover:border-gold-500/50 hover:scale-110 active:scale-95 transition-all shrink-0 flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <textarea
                  rows={6}
                  required
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 p-3 text-xs font-mono text-cream-100 focus:border-gold-500 focus:outline-none"
                />

                {/* Interactive Variable Chips */}
                <div className="rounded-xl border border-luxury-800 bg-luxury-950/80 p-3 text-[11px] space-y-2">
                  <span className="font-semibold text-gold-400 block">
                    Tap to Insert Dynamic Placeholders:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { tag: "{cake_name}", label: "Cake Title" },
                      { tag: "{weight}", label: "Selected Weight" },
                      { tag: "{price}", label: "Dynamic Price" },
                      { tag: "{restaurant_name}", label: "Bakery Name" },
                    ].map((item) => (
                      <button
                        key={item.tag}
                        type="button"
                        onClick={() => setTemplate((prev: string) => `${prev} ${item.tag}`)}
                        className="inline-flex items-center gap-1 rounded-lg border border-gold-500/30 bg-gold-500/10 px-2.5 py-1 text-[10px] font-mono font-semibold text-gold-300 hover:bg-gold-500/20 active:scale-95 transition-all"
                        title={`Click to insert ${item.tag}`}
                      >
                        <span className="text-gold-400 font-bold">+</span>
                        <span>{item.tag}</span>
                        <span className="text-luxury-400 font-sans text-[9px]">({item.label})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-luxury-800">
              <a
                href={testWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start space-x-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-1"
              >
                <span>Test Live WhatsApp Message</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 rounded-xl bg-gold-gradient px-7 py-3 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity"
                >
                  {saving ? (
                    <Sparkles className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Save Template & Numbers</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Phone Simulator Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-3xl border border-gold-500/20 bg-luxury-900/80 p-6 shadow-xl text-center">
            <div className="flex items-center justify-center space-x-2 text-xs font-bold uppercase tracking-wider text-gold-400 mb-4">
              <Smartphone className="h-4 w-4" />
              <span>Customer WhatsApp Preview</span>
            </div>

            {/* Mock Phone Frame */}
            <div className="mx-auto max-w-xs rounded-3xl border-4 border-luxury-800 bg-[#0b141a] p-3 text-left shadow-2xl">
              {/* WhatsApp Mock Header */}
              <div className="flex items-center space-x-2.5 border-b border-white/10 pb-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
                  R
                </div>
                <div>
                  <span className="block text-xs font-bold text-white truncate max-w-[150px]">
                    {restaurantName}
                  </span>
                  <span className="block text-[9px] text-emerald-400">Online • Fresh Bakes</span>
                </div>
              </div>

              {/* Chat Bubble Area */}
              <div className="my-4 space-y-2">
                <div className="ml-auto max-w-[90%] rounded-2xl rounded-tr-none bg-[#005c4b] p-3 text-[11px] text-white shadow leading-relaxed whitespace-pre-line">
                  {previewMessage}
                  <span className="block text-[8px] text-white/50 text-right mt-1.5">
                    12:30 PM ✓✓
                  </span>
                </div>
              </div>

              {/* Input Area Mock */}
              <div className="rounded-full bg-[#1f2c34] px-3 py-1.5 text-[10px] text-white/40">
                Type a reply...
              </div>
            </div>

            <p className="mt-4 text-[11px] text-luxury-400">
              When a customer clicks <strong>&quot;Order on WhatsApp&quot;</strong> on any cake, this message is automatically pre-filled in their chat.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
