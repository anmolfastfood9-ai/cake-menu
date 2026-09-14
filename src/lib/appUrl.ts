/**
 * Authoritative customer-facing production domain and URL helper.
 * Eliminates all legacy fallback domain references across SEO, sitemaps, robots, and OpenGraph.
 */

export const PRODUCTION_APP_URL = "https://ramansweetbakery.vercel.app";

/**
 * Resolves the application base URL with trailing slash stripped.
 * Prefers process.env.NEXT_PUBLIC_APP_URL if defined, otherwise falls back
 * safely to the canonical production domain: https://ramansweetbakery.vercel.app.
 */
export function getAppUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim()) {
    return envUrl.trim().replace(/\/$/, "");
  }
  return PRODUCTION_APP_URL;
}
