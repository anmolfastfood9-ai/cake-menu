"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Check,
  X,
  Cake,
  Sliders,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Plus,
  Trash2,
} from "lucide-react";

interface OccasionRecord {
  id: string;
  name: string;
  slug: string;
  type: string;
  description?: string;
  badgeText?: string;
  accentColor?: string;
  priority: number;
  active: boolean;
  calendarKey: string;
  cakeCount: number;
  cakeIds?: string[];
  daysBefore?: number;
  daysAfter?: number;
  status: "ACTIVE" | "UPCOMING" | "PAST" | "INACTIVE";
  currentOccurrence?: {
    eventDate: string;
    displayStart: string;
    displayEnd: string;
  } | null;
}

export default function AdminOccasionsPage() {
  const [occasions, setOccasions] = useState<OccasionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [cakesList, setCakesList] = useState<any[]>([]);

  // Edit Modal State
  const [editingOccasion, setEditingOccasion] = useState<OccasionRecord | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    badgeText: "",
    description: "",
    accentColor: "#D4AF37",
    priority: 50,
    eventDate: "",
    daysBefore: 5,
    daysAfter: 1,
    selectedCakeIds: [] as string[],
  });
  const [saving, setSaving] = useState(false);

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    type: "CUSTOM",
    badgeText: "",
    description: "",
    accentColor: "#D4AF37",
    priority: 75,
    eventDate: new Date().toISOString().slice(0, 10),
    daysBefore: 5,
    daysAfter: 1,
    selectedCakeIds: [] as string[],
    active: true,
  });

  const [error, setError] = useState<string | null>(null);

  const fetchOccasions = async () => {
    try {
      const res = await fetch("/api/occasions");
      const data = await res.json();
      if (data.occasions) {
        setOccasions(data.occasions);
      }
    } catch (err: any) {
      setError("Failed to load occasions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOccasions();
    fetch("/api/cakes")
      .then((res) => res.json())
      .then((data) => {
        if (data.cakes) setCakesList(data.cakes);
      })
      .catch(console.error);
  }, []);

  const handleToggleActive = async (occ: OccasionRecord) => {
    try {
      const res = await fetch(`/api/occasions/${occ.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !occ.active }),
      });
      if (res.ok) {
        setOccasions(
          occasions.map((o) => (o.id === occ.id ? { ...o, active: !occ.active } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEdit = (occ: OccasionRecord) => {
    setEditingOccasion(occ);
    const evDate = occ.currentOccurrence?.eventDate
      ? new Date(occ.currentOccurrence.eventDate).toISOString().slice(0, 10)
      : "";
    setEditForm({
      name: occ.name,
      badgeText: occ.badgeText || "",
      description: occ.description || "",
      accentColor: occ.accentColor || "#D4AF37",
      priority: occ.priority || 50,
      eventDate: evDate,
      daysBefore: occ.daysBefore ?? 5,
      daysAfter: occ.daysAfter ?? 1,
      selectedCakeIds: occ.cakeIds || [],
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOccasion) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/occasions/${editingOccasion.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name,
          badgeText: editForm.badgeText,
          description: editForm.description,
          accentColor: editForm.accentColor,
          priority: editForm.priority,
          eventDate: editForm.eventDate || undefined,
          daysBefore: editForm.daysBefore,
          daysAfter: editForm.daysAfter,
          cakeIds: editForm.selectedCakeIds,
        }),
      });
      if (res.ok) {
        await fetchOccasions();
        setEditingOccasion(null);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update occasion");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating occasion");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.eventDate) {
      alert("Occasion Name and Celebration Date are required");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/occasions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: createForm.name,
          type: createForm.type,
          badgeText: createForm.badgeText,
          description: createForm.description,
          accentColor: createForm.accentColor,
          priority: createForm.priority,
          eventDate: createForm.eventDate,
          daysBefore: createForm.daysBefore,
          daysAfter: createForm.daysAfter,
          active: createForm.active,
          cakeIds: createForm.selectedCakeIds,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create occasion");

      await fetchOccasions();
      setCreateModalOpen(false);
      setCreateForm({
        name: "",
        type: "CUSTOM",
        badgeText: "",
        description: "",
        accentColor: "#D4AF37",
        priority: 75,
        eventDate: new Date().toISOString().slice(0, 10),
        daysBefore: 5,
        daysAfter: 1,
        selectedCakeIds: [],
        active: true,
      });
    } catch (err: any) {
      alert(err.message || "Failed to create occasion");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteOccasion = async (occ: OccasionRecord) => {
    if (!confirm(`Are you sure you want to delete "${occ.name}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/occasions/${occ.id}`, { method: "DELETE" });
      if (res.ok) {
        setOccasions(occasions.filter((o) => o.id !== occ.id));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete occasion");
      }
    } catch (err) {
      alert("Error deleting occasion");
    }
  };

  const activeOccasion = occasions.find((o) => o.status === "ACTIVE" && o.active && o.cakeCount > 0);
  const upcomingOccasions = occasions.filter((o) => o.status === "UPCOMING" && o.active);

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "N/A";
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              AUTOMATIC OCCASION ENGINE
            </span>
            <span className="inline-flex items-center space-x-1 rounded-full bg-gold-500/10 border border-gold-500/30 px-2 py-0.5 text-[10px] font-semibold text-gold-400">
              <Calendar className="h-3 w-3" />
              <span>Year-Aware Almanac</span>
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 mt-1">
            Festivals & Occasions
          </h1>
          <p className="text-xs text-luxury-400 mt-1 max-w-2xl">
            The system automatically calculates annual Indian festival & seasonal dates. You can also manually add custom occasions for special celebrations, anniversaries, or local events.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-gold-gradient px-4 py-2 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 transition-opacity"
          >
            <Plus className="h-4 w-4" />
            <span>+ Add Custom Occasion</span>
          </button>

          <Link
            href="/menu"
            target="_blank"
            className="inline-flex items-center space-x-1.5 rounded-xl border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-xs font-semibold text-gold-300 hover:bg-gold-500 hover:text-luxury-950 transition-colors"
          >
            <span>Preview Menu</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Currently Active Showcase */}
        <div className="rounded-2xl border border-gold-500/30 bg-gradient-to-b from-luxury-900 to-[#14120f] p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-luxury-400">
            <span className="font-semibold uppercase tracking-wider text-gold-400">Live on Customer Menu</span>
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="mt-2.5">
            {activeOccasion ? (
              <>
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  {activeOccasion.name}
                </h3>
                <p className="text-xs text-luxury-300 mt-0.5">
                  {activeOccasion.cakeCount} cake(s) showcased • Priority {activeOccasion.priority}
                </p>
                <div className="mt-3">
                  <Link
                    href={`/menu/occasion/${activeOccasion.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-400 hover:text-gold-300"
                  >
                    <span>View Customer Collection</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-serif text-base font-medium text-luxury-400">
                  No Festival Active Today
                </h3>
                <p className="text-xs text-luxury-500 mt-1">
                  The customer menu is currently displaying standard signature collections.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Upcoming Festival */}
        <div className="rounded-2xl border border-luxury-800 bg-[#14120f] p-5 shadow-lg">
          <div className="flex items-center justify-between text-xs text-luxury-400">
            <span className="font-semibold uppercase tracking-wider text-cream-200">Next Upcoming Occasion</span>
            <Calendar className="h-4 w-4 text-luxury-500" />
          </div>
          <div className="mt-2.5">
            {upcomingOccasions.length > 0 ? (
              <>
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  {upcomingOccasions[0].name}
                </h3>
                <p className="text-xs text-luxury-300 mt-0.5">
                  Window starts: {formatDate(upcomingOccasions[0].currentOccurrence?.displayStart)}
                </p>
                <p className="text-[11px] text-gold-400/80 mt-1">
                  {upcomingOccasions[0].cakeCount} cake(s) currently tagged
                </p>
              </>
            ) : (
              <p className="text-xs text-luxury-500 mt-1">None within immediate calendar</p>
            )}
          </div>
        </div>

        {/* System Almanac Notice */}
        <div className="rounded-2xl border border-luxury-800 bg-[#14120f] p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs text-luxury-400">
              <HelpCircle className="h-3.5 w-3.5 text-gold-400" />
              <span className="font-semibold uppercase tracking-wider text-gold-400">Automatic & Manual</span>
            </div>
            <p className="text-xs text-luxury-300 mt-2 leading-relaxed">
              Standard Indian festivals resolve automatically each year. Custom store events and flash sales can be added manually anytime.
            </p>
          </div>
          <div className="text-[11px] text-luxury-500 pt-2 border-t border-luxury-800/60">
            {occasions.length} total collections configured
          </div>
        </div>
      </div>

      {/* Occasions List */}
      <div className="rounded-3xl border border-gold-500/20 bg-[#14120f] p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-bold text-cream-100">
            All Occasions & Calendar Status ({occasions.length})
          </h2>
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
          >
            + Add New
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs text-gold-400">Loading occasions...</div>
        ) : (
          <div className="space-y-3">
            {occasions.map((occ) => {
              const accent = occ.accentColor || "#D4AF37";
              const occurrence = occ.currentOccurrence;
              const isCustom = occ.type === "CUSTOM" || occ.calendarKey.startsWith("custom_");

              return (
                <div
                  key={occ.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3.5 rounded-2xl border border-luxury-800/80 bg-[#181512] p-4 transition-colors hover:border-gold-500/30"
                >
                  {/* Left: Info */}
                  <div className="space-y-1 sm:max-w-md">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: accent }}
                      />
                      <h3 className="font-serif text-base font-bold text-cream-50">
                        {occ.name}
                      </h3>
                      <span className="rounded-md border border-luxury-700 bg-luxury-900 px-1.5 py-0.5 text-[9.5px] font-semibold text-luxury-300">
                        {occ.type}
                      </span>

                      {/* Status Badge */}
                      {occ.status === "ACTIVE" && occ.active && (
                        <span className="rounded-full border border-emerald-500/40 bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                          Active Now
                        </span>
                      )}
                      {occ.status === "UPCOMING" && occ.active && (
                        <span className="rounded-full border border-gold-500/30 bg-gold-950/40 px-2 py-0.5 text-[10px] font-semibold text-gold-400">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-luxury-400 line-clamp-1">
                      {occ.description || "No promotional description set"}
                    </p>

                    {/* Calculated Dates */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-luxury-500">
                      <span>Event: <strong className="text-luxury-300 font-medium">{formatDate(occurrence?.eventDate)}</strong></span>
                      <span>•</span>
                      <span>Display Window: <span className="text-luxury-300">{formatDate(occurrence?.displayStart)} – {formatDate(occurrence?.displayEnd)}</span></span>
                    </div>
                  </div>

                  {/* Right: Tagged Cakes, Switch & Actions */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-luxury-800">
                    {/* Tagged Cakes */}
                    <div className="text-right">
                      <span className="text-xs font-bold text-cream-100 block">
                        {occ.cakeCount} Cakes
                      </span>
                      <span className="text-[10px] text-luxury-500">Tagged</span>
                    </div>

                    {/* Content Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(occ)}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        occ.active ? "bg-emerald-600" : "bg-luxury-800"
                      }`}
                      title={occ.active ? "Occasion is enabled" : "Occasion is disabled"}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          occ.active ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>

                    {/* Edit Content Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(occ)}
                      className="rounded-xl border border-luxury-700 bg-luxury-900 p-2 text-luxury-300 hover:border-gold-500 hover:text-gold-400 transition-colors"
                      title="Edit Promotional Content"
                    >
                      <Sliders className="h-4 w-4" />
                    </button>

                    {/* Delete Button (Custom Occasions) */}
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => handleDeleteOccasion(occ)}
                        className="rounded-xl border border-luxury-700 bg-luxury-900 p-2 text-luxury-400 hover:border-red-500/60 hover:text-red-400 transition-colors"
                        title="Delete Custom Occasion"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Content Drawer / Modal */}
      {editingOccasion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-gold-500/30 bg-[#14120f] p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sliders className="h-4 w-4 text-gold-400" />
                <h3 className="font-serif text-lg font-bold text-cream-50">
                  Edit {editingOccasion.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingOccasion(null)}
                className="text-luxury-400 hover:text-cream-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Occasion Name */}
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Occasion Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                {/* Priority Score */}
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Display Priority (1-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={editForm.priority}
                    onChange={(e) => setEditForm({ ...editForm, priority: Number(e.target.value) })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Event Date & Pre-Order Window */}
              <div className="rounded-2xl border border-luxury-800 bg-luxury-900/60 p-3.5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Celebration / Event Date
                  </label>
                  <input
                    type="date"
                    value={editForm.eventDate}
                    onChange={(e) => setEditForm({ ...editForm, eventDate: e.target.value })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-luxury-400 mb-1">
                      Pre-Order Days Before
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={editForm.daysBefore}
                      onChange={(e) => setEditForm({ ...editForm, daysBefore: Number(e.target.value) })}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-luxury-400 mb-1">
                      Active Days After
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={editForm.daysAfter}
                      onChange={(e) => setEditForm({ ...editForm, daysAfter: Number(e.target.value) })}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-gold-400/90 font-medium">
                  ℹ️ Window: {editForm.daysBefore} days before event date until {editForm.daysAfter} day(s) after.
                </p>
              </div>

              {/* Homepage Badge Text */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Homepage Badge Text
                </label>
                <input
                  type="text"
                  value={editForm.badgeText}
                  onChange={(e) => setEditForm({ ...editForm, badgeText: e.target.value })}
                  placeholder="e.g. 🪔 DIWALI SPECIAL"
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Promotional Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Promotional Subtitle
                </label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Celebrate the season with our handcrafted eggless collection..."
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Theme Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editForm.accentColor}
                    onChange={(e) => setEditForm({ ...editForm, accentColor: e.target.value })}
                    className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["#D4AF37", "#EC4899", "#10B981", "#3B82F6", "#8B5CF6", "#F97316"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setEditForm({ ...editForm, accentColor: c })}
                        className={`h-6 w-6 rounded-full border-2 transition-transform ${
                          editForm.accentColor === c ? "scale-110 border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Tag Pure Veg Cakes */}
              {cakesList.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-semibold text-cream-200">
                    Tag Pure Veg Cakes ({editForm.selectedCakeIds.length} Selected)
                  </label>
                  <p className="text-[10px] text-luxury-400">
                    Select cakes to showcase in this collection.
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 rounded-xl border border-luxury-800 bg-luxury-950/80 p-2">
                    {cakesList.map((cake) => {
                      const isChecked = editForm.selectedCakeIds.includes(cake.id);
                      return (
                        <label
                          key={cake.id}
                          className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                            isChecked ? "bg-gold-500/15 text-gold-300" : "hover:bg-luxury-900 text-cream-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setEditForm({
                                    ...editForm,
                                    selectedCakeIds: [...editForm.selectedCakeIds, cake.id],
                                  });
                                } else {
                                  setEditForm({
                                    ...editForm,
                                    selectedCakeIds: editForm.selectedCakeIds.filter((id) => id !== cake.id),
                                  });
                                }
                              }}
                              className="rounded border-luxury-700 bg-luxury-900 text-gold-500 focus:ring-0"
                            />
                            {cake.coverImage && (
                              <img src={cake.coverImage} alt={cake.name} className="h-6 w-6 rounded object-cover" />
                            )}
                            <span className="truncate">{cake.name}</span>
                          </div>
                          {cake.category?.name && (
                            <span className="text-[10px] text-luxury-500 shrink-0 ml-2">
                              {cake.category.name}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-luxury-800">
                <button
                  type="button"
                  onClick={() => setEditingOccasion(null)}
                  className="rounded-xl border border-luxury-700 px-4 py-2 text-xs font-semibold text-luxury-300 hover:text-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gold-gradient px-5 py-2 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 disabled:opacity-50"
                >
                  {saving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Custom Occasion Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl border border-gold-500/30 bg-[#14120f] p-6 shadow-2xl space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-luxury-800 pb-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-gold-400" />
                <h2 className="font-serif text-lg font-bold text-cream-50">
                  Add Custom Occasion / Festival
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setCreateModalOpen(false)}
                className="text-luxury-400 hover:text-cream-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Occasion Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Occasion Name <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Store Anniversary Special, Chhath Puja"
                    value={createForm.name}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCreateForm({
                        ...createForm,
                        name: val,
                        badgeText: createForm.badgeText || (val ? `🎉 ${val.toUpperCase()} SPECIAL` : ""),
                      });
                    }}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                {/* Occasion Type */}
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Occasion Type
                  </label>
                  <select
                    value={createForm.type}
                    onChange={(e) => setCreateForm({ ...createForm, type: e.target.value })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  >
                    <option value="CUSTOM">Custom Celebration</option>
                    <option value="FESTIVAL">Cultural Festival</option>
                    <option value="CELEBRATION">Milestone / Special Day</option>
                    <option value="SEASONAL">Seasonal Special</option>
                  </select>
                </div>

                {/* Priority Score */}
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Display Priority (1-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={createForm.priority}
                    onChange={(e) => setCreateForm({ ...createForm, priority: Number(e.target.value) })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Event Date & Pre-Order Window */}
              <div className="rounded-2xl border border-luxury-800 bg-luxury-900/60 p-3.5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-cream-200 mb-1">
                    Celebration / Event Date <span className="text-gold-400">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={createForm.eventDate}
                    onChange={(e) => setCreateForm({ ...createForm, eventDate: e.target.value })}
                    className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-luxury-400 mb-1">
                      Pre-Order Days Before
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={createForm.daysBefore}
                      onChange={(e) => setCreateForm({ ...createForm, daysBefore: Number(e.target.value) })}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-luxury-400 mb-1">
                      Active Days After
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={createForm.daysAfter}
                      onChange={(e) => setCreateForm({ ...createForm, daysAfter: Number(e.target.value) })}
                      className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-100"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-gold-400/90 font-medium">
                  ℹ️ Card will appear on customer menu {createForm.daysBefore} days before celebration date and auto-close {createForm.daysAfter} day(s) after.
                </p>
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Card Badge Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. 🎉 5TH ANNIVERSARY SPECIAL"
                  value={createForm.badgeText}
                  onChange={(e) => setCreateForm({ ...createForm, badgeText: e.target.value })}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Promotional Subtitle
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe this special occasion or celebration..."
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  className="w-full rounded-xl border border-luxury-700 bg-luxury-950 px-3.5 py-2.5 text-xs text-cream-100 focus:border-gold-500 focus:outline-none"
                />
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-xs font-semibold text-cream-200 mb-1">
                  Theme Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={createForm.accentColor}
                    onChange={(e) => setCreateForm({ ...createForm, accentColor: e.target.value })}
                    className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {["#D4AF37", "#EC4899", "#10B981", "#3B82F6", "#8B5CF6", "#F97316"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setCreateForm({ ...createForm, accentColor: c })}
                        className={`h-6 w-6 rounded-full border-2 transition-transform ${
                          createForm.accentColor === c ? "scale-110 border-white" : "border-transparent"
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Tag Curated Cakes */}
              {cakesList.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-semibold text-cream-200">
                    Tag Pure Veg Cakes ({createForm.selectedCakeIds.length} Selected)
                  </label>
                  <p className="text-[10px] text-luxury-400">
                    Select at least 1 cake so this occasion card displays on the customer menu.
                  </p>
                  <div className="max-h-36 overflow-y-auto space-y-1.5 rounded-xl border border-luxury-800 bg-luxury-950/80 p-2">
                    {cakesList.map((cake) => {
                      const isChecked = createForm.selectedCakeIds.includes(cake.id);
                      return (
                        <label
                          key={cake.id}
                          className={`flex items-center justify-between p-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                            isChecked ? "bg-gold-500/15 text-gold-300" : "hover:bg-luxury-900 text-cream-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setCreateForm({
                                    ...createForm,
                                    selectedCakeIds: [...createForm.selectedCakeIds, cake.id],
                                  });
                                } else {
                                  setCreateForm({
                                    ...createForm,
                                    selectedCakeIds: createForm.selectedCakeIds.filter((id) => id !== cake.id),
                                  });
                                }
                              }}
                              className="rounded border-luxury-700 bg-luxury-900 text-gold-500 focus:ring-0"
                            />
                            {cake.coverImage && (
                              <img src={cake.coverImage} alt={cake.name} className="h-6 w-6 rounded object-cover" />
                            )}
                            <span className="truncate">{cake.name}</span>
                          </div>
                          {cake.category?.name && (
                            <span className="text-[10px] text-luxury-500 shrink-0 ml-2">
                              {cake.category.name}
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-luxury-800">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="rounded-xl border border-luxury-700 px-4 py-2 text-xs font-semibold text-luxury-300 hover:text-cream-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-gold-gradient px-5 py-2 text-xs font-bold text-luxury-950 shadow-gold-sm hover:opacity-95 disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Occasion"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
