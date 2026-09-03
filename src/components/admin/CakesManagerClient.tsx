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
      const matchName = cake.name.toLowerCase().includes(q);
      const matchDesc = cake.description?.toLowerCase().includes(q);
      const matchCat = cake.category?.name.toLowerCase().includes(q);
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
          <h1 className="font-serif text-2xl font-bold text-cream-50 sm:text-3xl mt-1">
            Cakes & Dynamic Weights ({cakes.length})
          </h1>
          <p className="text-xs text-luxury-400">
            Add new cake creations, update weight-wise prices, and toggle menu visibility.
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
            placeholder="Search by cake name or ingredients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-luxury-700 bg-luxury-950/80 py-2 pl-10 pr-4 text-xs text-cream-100 placeholder-luxury-500 focus:border-gold-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-200 focus:border-gold-500 focus:outline-none"
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
            className="rounded-xl border border-luxury-700 bg-luxury-950 px-3 py-2 text-xs text-cream-200 focus:border-gold-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
          </select>
        </div>
      </div>

      {/* Cakes Table */}
      <div className="overflow-hidden rounded-2xl border border-gold-500/20 bg-luxury-900/80 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-luxury-800 bg-luxury-950/60 text-luxury-400">
                <th className="py-3.5 px-4 font-semibold">Cake Details</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Weight Pricing Tiers</th>
                <th className="py-3.5 px-4 font-semibold">Badges & Spotlight</th>
                <th className="py-3.5 px-4 font-semibold">Visibility</th>
                <th className="py-3.5 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-luxury-800/60">
              {filteredCakes.length > 0 ? (
                filteredCakes.map((cake) => {
                  const sorted = [...(cake.prices || [])].sort((a, b) => a.price - b.price);
                  return (
                    <tr key={cake.id} className="hover:bg-luxury-800/40 transition-colors">
                      {/* Name & Photo */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gold-500/30 bg-luxury-950">
                            <Image
                              src={cake.coverImage}
                              alt={cake.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-serif text-sm font-bold text-cream-100">
                                {cake.name}
                              </span>
                              <Link
                                href={`/menu/cake/${cake.slug}`}
                                target="_blank"
                                className="text-luxury-500 hover:text-gold-400"
                                title="View on Customer Menu"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Link>
                            </div>
                            <span className="text-[11px] text-luxury-400 line-clamp-1">
                              {cake.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="rounded-md bg-luxury-950 border border-luxury-700 px-2 py-1 text-[11px] font-medium text-gold-300">
                          {cake.category?.name || "Unassigned"}
                        </span>
                      </td>

                      {/* Weight Pricing */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="font-bold text-gold-400">
                            ₹{sorted[0]?.price?.toLocaleString("en-IN") || 0}
                            {sorted.length > 1 && ` - ₹${sorted[sorted.length - 1]?.price?.toLocaleString("en-IN")}`}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {sorted.map((p, idx) => (
                              <span
                                key={idx}
                                className="rounded border border-luxury-700 bg-luxury-950 px-1 py-0.2 text-[9px] text-luxury-300"
                              >
                                {p.weight}: ₹{p.price}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>

                      {/* Badges Toggles */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {/* Bestseller Toggle */}
                          <button
                            onClick={() => handleToggleFlag(cake.id, "bestseller", cake.bestseller)}
                            className={`flex items-center space-x-1 rounded px-2 py-0.5 text-[10px] font-semibold transition-all ${
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
                            className={`flex items-center space-x-1 rounded px-2 py-0.5 text-[10px] font-semibold transition-all ${
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
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all ${
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
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4 text-right">
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
    </div>
  );
}
