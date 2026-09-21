"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Sparkles,
  ExternalLink,
  Crown,
  Leaf,
  ImageIcon,
} from "lucide-react";

interface CakesManagerClientProps {
  initialCakes: any[];
  categories: any[];
}

export default function CakesManagerClient({
  initialCakes = [],
  categories = [],
}: CakesManagerClientProps) {
  const [cakes, setCakes] = useState(initialCakes);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "disabled">("all");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  // Quick toggle flag helper
  const handleToggleFlag = async (
    cakeId: string,
    field: "available" | "featured" | "bestseller" | "isNew",
    currentValue: boolean
  ) => {
    setLoadingAction(`${cakeId}-${field}`);
    try {
      const res = await fetch(`/api/cakes/${cakeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (res.ok) {
        setCakes((prev) =>
          prev.map((c) => (c.id === cakeId ? { ...c, [field]: !currentValue } : c))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteCake = async (cakeId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    setLoadingAction(`delete-${cakeId}`);
    try {
      const res = await fetch(`/api/cakes/${cakeId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCakes((prev) => prev.filter((c) => c.id !== cakeId));
      } else {
        alert("Failed to delete cake");
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting cake");
    } finally {
      setLoadingAction(null);
    }
  };

  // Filter cakes
  const filteredCakes = cakes.filter((cake) => {
    if (selectedCategory !== "all" && cake.categoryId !== selectedCategory) {
      return false;
    }
    if (statusFilter === "active" && !cake.available) return false;
    if (statusFilter === "disabled" && cake.available) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = (cake.name || "").toLowerCase().includes(q);
      const matchDesc = (cake.description || "").toLowerCase().includes(q);
      const matchCat = (cake.category?.name || "").toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-widest text-gold-400">
              Catalog Management
            </span>
            <span className="inline-flex items-center space-x-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
              <Leaf className="h-3 w-3" />
              <span>100% Eggless</span>
            </span>
          </div>
          <h1 className="font-sans text-2xl font-bold text-cream-50 sm:text-3xl mt-1">
            Cake Catalog ({cakes.length})
          </h1>
          <p className="text-xs text-luxury-400">
            Manage your artisanal 100% eggless cakes, prices, and availability.
          </p>
        </div>

        <Link
          href="/admin/cakes/new"
          className="flex items-center space-x-1.5 rounded-xl bg-gold-gradient px-4 py-2.5 text-xs font-bold text-luxury-950 shadow-gold-sm transition-transform hover:scale-102"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Cake</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-gold-500/20 bg-luxury-900/80 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-400" />
          <input
            type="text"
            placeholder="Search by product name or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-luxury-700 bg-luxury-950/80 py-2 pl-10 pr-4 text-xs text-cream-100 placeholder-luxury-500 focus:border-gold-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-200 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Categories ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full sm:w-auto rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-200 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* Cakes Table (Desktop View) */}
      <div className="hidden md:block overflow-hidden rounded-2xl border border-gold-500/20 bg-luxury-900/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-luxury-800 bg-luxury-950/60 text-luxury-400">
                <th className="py-4 px-4 font-semibold min-w-[240px]">Cake Details</th>
                <th className="py-4 px-4 font-semibold min-w-[170px] w-[180px]">Category</th>
                <th className="py-4 px-4 font-semibold min-w-[200px] w-[210px]">Weight Pricing Tiers</th>
                <th className="py-4 px-4 font-semibold min-w-[170px] w-[180px]">Badges & Spotlight</th>
                <th className="py-4 px-4 font-semibold min-w-[120px] w-[130px]">Visibility</th>
                <th className="py-4 px-4 text-right font-semibold min-w-[100px] w-[110px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-800/60">
              {filteredCakes.length > 0 ? (
                filteredCakes.map((cake) => {
                  const sorted = [...(cake.prices || [])].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
                  return (
                    <tr key={cake.id} className="hover:bg-luxury-800/40 transition-colors">
                      {/* Name & Photo */}
                      <td className="py-4 px-4 min-w-[240px]">
                        <div className="flex items-center space-x-3.5">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gold-500/30 bg-luxury-950 flex items-center justify-center">
                            {cake.coverImage ? (
                              <Image
                                src={cake.coverImage}
                                alt={cake.name}
                                fill
                                sizes="56px"
                                className="object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-luxury-600" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1 space-y-0.5">
                            <div className="flex items-center space-x-2">
                              <span className="font-sans text-sm font-bold text-cream-100 truncate">
                                {cake.name}
                              </span>
                              <Link
                                href={`/menu/cake/${cake.slug}`}
                                target="_blank"
                                className="text-luxury-500 hover:text-gold-400 shrink-0"
                                title="View on Customer Menu"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                            <span className="text-[11px] text-luxury-400 line-clamp-1 leading-relaxed">
                              {cake.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-4 min-w-[170px] w-[180px] align-middle">
                        <span className="inline-block rounded-md bg-luxury-950 border border-luxury-700 px-2.5 py-1 text-[11px] font-medium text-gold-300 leading-normal whitespace-normal">
                          {cake.category?.name || "Unassigned"}
                        </span>
                      </td>

                      {/* Weight Pricing */}
                      <td className="py-4 px-4 min-w-[200px] w-[210px] align-middle">
                        <div className="space-y-1.5">
                          <span className="font-price font-bold text-gold-400 block">
                            {sorted[0]?.price != null
                              ? `₹${sorted[0].price.toLocaleString("en-IN")}`
                              : "Custom Quote"}
                            {sorted.length > 1 && sorted[sorted.length - 1]?.price != null && (
                              ` - ₹${sorted[sorted.length - 1].price!.toLocaleString("en-IN")}`
                            )}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {sorted.map((p, idx) => (
                              <span
                                key={idx}
                                className="rounded border border-luxury-700 bg-luxury-950 px-1.5 py-0.5 text-[9.5px] text-luxury-300 font-mono whitespace-nowrap"
                              >
                                {p.weight}: {p.price != null ? `₹${p.price}` : "Quote"}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Badges Toggles */}
                      <td className="py-4 px-4 min-w-[170px] w-[180px] align-middle">
                        <div className="flex flex-wrap gap-1.5">
                          {/* Bestseller Toggle */}
                          <button
                            onClick={() => handleToggleFlag(cake.id, "bestseller", cake.bestseller)}
                            className={`flex items-center space-x-1 rounded px-2 py-1 text-[10px] font-semibold transition-all ${
                              cake.bestseller
                                ? "bg-gold-500/20 text-gold-300 border border-gold-500/40"
                                : "bg-luxury-950 text-luxury-500 border border-luxury-800 hover:text-cream-200"
                            }`}
                            title="Toggle Bestseller Badge"
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            <span>Bestseller</span>
                          </button>

                          {/* Featured / Signature Toggle */}
                          <button
                            onClick={() => handleToggleFlag(cake.id, "featured", cake.featured)}
                            className={`flex items-center space-x-1 rounded px-2 py-1 text-[10px] font-semibold transition-all ${
                              cake.featured
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                                : "bg-luxury-950 text-luxury-500 border border-luxury-800 hover:text-cream-200"
                            }`}
                            title="Toggle Featured Spotlight"
                          >
                            <Crown className="h-2.5 w-2.5" />
                            <span>Signature</span>
                          </button>

                          {/* New Arrival Toggle */}
                          <button
                            onClick={() => handleToggleFlag(cake.id, "isNew", cake.isNew)}
                            className={`rounded px-1.5 py-1 text-[10px] font-semibold transition-all ${
                              cake.isNew
                                ? "bg-amber-900 text-amber-300 border border-amber-500/40"
                                : "bg-luxury-950 text-luxury-500 border border-luxury-800"
                            }`}
                            title="Toggle New Arrival"
                          >
                            {cake.isNew ? "New" : "Standard"}
                          </button>
                        </div>
                      </td>

                      {/* Active Visibility Switch */}
                      <td className="py-4 px-4 min-w-[120px] w-[130px] align-middle">
                        <button
                          onClick={() => handleToggleFlag(cake.id, "available", cake.available)}
                          className={`flex items-center space-x-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                            cake.available
                              ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                              : "bg-red-950/80 text-red-400 border border-red-500/30"
                          }`}
                        >
                          <div
                            className={`h-1.5 w-1.5 rounded-full ${
                              cake.available ? "bg-emerald-400" : "bg-red-400"
                            }`}
                          />
                          <span>{cake.available ? "Active" : "Hidden"}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right min-w-[100px] w-[110px] align-middle">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/admin/cakes/${cake.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gold-500/30 bg-luxury-800 text-gold-300 hover:bg-gold-500 hover:text-luxury-950"
                            title="Edit Cake"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Link>

                          <button
                            onClick={() => handleDeleteCake(cake.id, cake.name)}
                            disabled={loadingAction === `delete-${cake.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-luxury-700 bg-luxury-950 text-luxury-400 hover:border-red-500/50 hover:text-red-400"
                            title="Delete Cake"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-luxury-400">
                    No cakes found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Touch-Friendly Cake Cards (visible on phones/tablets) */}
      <div className="md:hidden space-y-3.5">
        {filteredCakes.length > 0 ? (
          filteredCakes.map((cake, index) => {
            const sorted = [...(cake.prices || [])].sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
            const isDeleting = loadingAction === `delete-${cake.id}`;
            const isTogglingAvailable = loadingAction === `${cake.id}-available`;

            return (
              <div
                key={cake.id}
                className="rounded-2xl border border-gold-500/20 bg-luxury-900/90 p-4 space-y-3.5 shadow-lg"
              >
                {/* Top: Image, Name, Category & Price */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gold-500/30 bg-luxury-950 flex items-center justify-center">
                      {cake.coverImage ? (
                        <Image
                          src={cake.coverImage}
                          alt={cake.name}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-6 w-6 text-luxury-600" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="rounded bg-gold-500/20 border border-gold-500/30 px-1.5 py-0.5 text-[10px] font-bold text-gold-300 font-mono shrink-0">
                          #{index + 1}
                        </span>
                        <span className="font-sans text-sm font-bold text-cream-100 leading-snug min-w-0 flex-1">
                          {cake.name}
                        </span>
                      </div>
                      <div>
                        <span className="inline-block rounded bg-luxury-950 border border-luxury-700 px-2 py-0.5 text-[10px] font-medium text-gold-300 leading-tight">
                          {cake.category?.name || "Unassigned"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-price text-xs sm:text-sm font-bold text-gold-400 block bg-luxury-950 border border-gold-500/30 px-2 py-1 rounded-lg">
                      {sorted[0]?.price != null
                        ? `₹${sorted[0].price.toLocaleString("en-IN")}`
                        : "Custom Quote"}
                    </span>
                    {sorted.length > 1 && sorted[sorted.length - 1]?.price != null && (
                      <span className="text-[9.5px] text-luxury-400 block mt-0.5">
                        up to ₹{sorted[sorted.length - 1].price!.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Weight Tiers Pills */}
                {sorted.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {sorted.map((p, idx) => (
                      <span
                        key={idx}
                        className="rounded border border-luxury-800 bg-luxury-950 px-2 py-0.5 text-[10px] text-luxury-300"
                      >
                        {p.weight}: {p.price != null ? `₹${p.price}` : "Quote"}
                      </span>
                    ))}
                  </div>
                )}

                {/* Badges Toggles (Bestseller, Signature, New) */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <button
                    onClick={() => handleToggleFlag(cake.id, "bestseller", cake.bestseller)}
                    className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all active:scale-95 ${
                      cake.bestseller
                        ? "bg-gold-500/20 text-gold-300 border border-gold-500/40"
                        : "bg-luxury-950 text-luxury-500 border border-luxury-800"
                    }`}
                  >
                    <Sparkles className="h-3 w-3" />
                    <span>Bestseller</span>
                  </button>

                  <button
                    onClick={() => handleToggleFlag(cake.id, "featured", cake.featured)}
                    className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all active:scale-95 ${
                      cake.featured
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        : "bg-luxury-950 text-luxury-500 border border-luxury-800"
                    }`}
                  >
                    <Crown className="h-3 w-3" />
                    <span>Signature</span>
                  </button>

                  <button
                    onClick={() => handleToggleFlag(cake.id, "isNew", cake.isNew)}
                    className={`rounded-lg px-2.5 py-1 text-[10px] font-semibold transition-all active:scale-95 ${
                      cake.isNew
                        ? "bg-amber-900/60 text-amber-300 border border-amber-500/40"
                        : "bg-luxury-950 text-luxury-500 border border-luxury-800"
                    }`}
                  >
                    {cake.isNew ? "★ New" : "Standard"}
                  </button>
                </div>

                {/* Bottom Row: 1-Tap Active Toggle + Edit / Delete / View */}
                <div className="flex items-center justify-between pt-2.5 border-t border-luxury-800/80">
                  <button
                    onClick={() => handleToggleFlag(cake.id, "available", cake.available)}
                    disabled={isTogglingAvailable}
                    className={`flex items-center space-x-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${
                      cake.available
                        ? "bg-emerald-950/90 text-emerald-400 border border-emerald-500/40 active:bg-emerald-900"
                        : "bg-red-950/90 text-red-400 border border-red-500/40 active:bg-red-900"
                    } ${isTogglingAvailable ? "opacity-50" : ""}`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        cake.available ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    <span>{cake.available ? "Active on Menu" : "Hidden from Menu"}</span>
                  </button>

                  <div className="flex items-center space-x-1.5">
                    <Link
                      href={`/admin/cakes/${cake.id}/edit`}
                      className="flex items-center space-x-1 rounded-xl border border-gold-500/30 bg-luxury-800 px-3 py-1.5 text-xs font-semibold text-gold-300 active:bg-gold-500 active:text-luxury-950"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </Link>

                    <Link
                      href={`/menu/cake/${cake.slug}`}
                      target="_blank"
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-luxury-700 bg-luxury-950 text-luxury-300 active:bg-luxury-800"
                      title="View on Live Menu"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDeleteCake(cake.id, cake.name)}
                      disabled={isDeleting}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-luxury-700 bg-luxury-950 text-red-400 hover:border-red-500 active:bg-red-950"
                      title="Delete Cake"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-luxury-800 bg-luxury-900 p-8 text-center text-xs text-luxury-400">
            No cakes found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
