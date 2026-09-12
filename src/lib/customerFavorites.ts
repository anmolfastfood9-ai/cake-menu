"use client";

import { useState, useEffect, useCallback } from "react";

/*
 * ============================================================
 * GUEST FAVORITES STORAGE (localStorage)
 * Single stable key: touchqr_favorite_cakes
 * Strictly client-side, zero customer login/auth required
 * ============================================================
 */
export const FAVORITES_STORAGE_KEY = "touchqr_favorite_cakes";
export const FAVORITES_UPDATE_EVENT = "touchqr_favorites_updated";

/**
 * Safely reads favorite cake IDs from localStorage
 */
export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return Array.from(
        new Set(
          parsed.filter(
            (id): id is string => typeof id === "string" && id.trim().length > 0
          )
        )
      );
    }
    return [];
  } catch (err) {
    console.warn("Failed to read favorites from localStorage:", err);
    return [];
  }
}

/**
 * Dispatches an event to synchronize favorites across all components
 */
function notifyFavoritesChange(favorites: string[]): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(
      new CustomEvent(FAVORITES_UPDATE_EVENT, { detail: favorites })
    );
  } catch {
    const ev = document.createEvent("Event");
    ev.initEvent(FAVORITES_UPDATE_EVENT, true, true);
    window.dispatchEvent(ev);
  }
}

/**
 * Checks if a specific cake ID is favorited
 */
export function isFavorite(cakeId: string): boolean {
  if (!cakeId || typeof window === "undefined") return false;
  const list = getFavorites();
  return list.includes(cakeId);
}

/**
 * Adds a cake ID to favorites in localStorage
 */
export function addFavorite(cakeId: string): void {
  if (!cakeId || typeof window === "undefined") return;
  try {
    const list = getFavorites();
    if (!list.includes(cakeId)) {
      const updated = [...list, cakeId];
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(updated)
      );
      notifyFavoritesChange(updated);
    }
  } catch (err) {
    console.warn("Failed to add favorite to localStorage:", err);
  }
}

/**
 * Removes a cake ID from favorites in localStorage
 */
export function removeFavorite(cakeId: string): void {
  if (!cakeId || typeof window === "undefined") return;
  try {
    const list = getFavorites();
    const updated = list.filter((id) => id !== cakeId);
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(updated)
    );
    notifyFavoritesChange(updated);
  } catch (err) {
    console.warn("Failed to remove favorite from localStorage:", err);
  }
}

/**
 * Toggles a cake ID in favorites, returning the new favorite state
 */
export function toggleFavorite(cakeId: string): boolean {
  if (!cakeId || typeof window === "undefined") return false;
  const list = getFavorites();
  const exists = list.includes(cakeId);
  if (exists) {
    removeFavorite(cakeId);
    return false;
  } else {
    addFavorite(cakeId);
    return true;
  }
}

/**
 * Gracefully removes stale IDs that no longer exist in live cake list
 */
export function cleanupStaleFavorites(validCakeIds: string[]): void {
  if (!validCakeIds || validCakeIds.length === 0 || typeof window === "undefined")
    return;
  try {
    const list = getFavorites();
    if (list.length === 0) return;
    const validSet = new Set(validCakeIds);
    const cleaned = list.filter((id) => validSet.has(id));
    if (cleaned.length !== list.length) {
      window.localStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(cleaned)
      );
      notifyFavoritesChange(cleaned);
    }
  } catch (err) {
    console.warn("Failed to cleanup stale favorites:", err);
  }
}

/**
 * React hook for a single cake's favorite state (SSR-safe, instant tap toggle)
 */
export function useCakeFavorite(cakeId: string) {
  const [fav, setFav] = useState<boolean>(false);

  useEffect(() => {
    if (!cakeId) return;

    // Read initial state after hydration
    setFav(isFavorite(cakeId));

    const handleUpdate = () => {
      setFav(isFavorite(cakeId));
    };

    window.addEventListener(FAVORITES_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(FAVORITES_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [cakeId]);

  const toggle = useCallback(
    (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!cakeId) return;
      const nextState = toggleFavorite(cakeId);
      setFav(nextState);
    },
    [cakeId]
  );

  return {
    isFavorite: fav,
    toggleFavorite: toggle,
  };
}

/**
 * React hook for list of all favorite cake IDs
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setFavorites(getFavorites());
    setIsHydrated(true);

    const handleUpdate = () => {
      setFavorites(getFavorites());
    };

    window.addEventListener(FAVORITES_UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener(FAVORITES_UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return {
    favorites,
    isHydrated,
    isFavorite: (id: string) => favorites.includes(id),
    toggleFavorite,
    addFavorite,
    removeFavorite,
  };
}
