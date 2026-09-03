import prisma from "@/lib/db";
import { defaultCalendarProvider } from "./calendarProvider";
import { Occasion, FestivalOccurrence, Cake, CakePrice } from "@prisma/client";

export type CakeWithPrices = Cake & {
  prices: CakePrice[];
  occasionName?: string;
  occasionBadge?: string | null;
};

export interface ActiveOccasionResult {
  occasion: Occasion;
  occurrence?: FestivalOccurrence;
  cakes: CakeWithPrices[];
  isMerged?: boolean;
  mergedOccasions?: {
    id: string;
    name: string;
    slug: string;
    badgeText?: string | null;
    accentColor?: string | null;
  }[];
}

// In-memory cache for getActiveOccasion results (1 hour TTL)
interface CacheEntry {
  timestamp: number;
  result: ActiveOccasionResult | null;
}

const memoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

const ensuredYears = new Set<number>();

export function clearOccasionCache() {
  memoryCache.clear();
  ensuredYears.clear();
}

/**
 * Ensures that festival occurrence dates for the specified year are calculated
 * via the Calendar Provider and stored in the database cache layer.
 */
export async function ensureOccurrencesForYear(year: number): Promise<void> {
  if (ensuredYears.has(year)) {
    return;
  }

  try {
    const occasions = await prisma.occasion.findMany({
      where: { active: true },
      include: {
        occurrences: {
          where: { year },
        },
      },
    });

    for (const occasion of occasions) {
      if (occasion.occurrences.length === 0) {
        // Resolve occurrence for this year using the calendar provider
        const resolution = defaultCalendarProvider.resolveOccurrence(
          occasion.calendarKey,
          year
        );

        if (resolution) {
          const eventTime = resolution.eventDate.getTime();
          const displayStart =
            resolution.displayStartOverride ||
            new Date(
              eventTime - occasion.daysBefore * 24 * 60 * 60 * 1000
            );

          // Ends at 23:59:59 IST (18:29:59 UTC) of (eventDate + daysAfter)
          const displayEnd =
            resolution.displayEndOverride ||
            new Date(
              eventTime +
                occasion.daysAfter * 24 * 60 * 60 * 1000 +
                (18 * 60 + 29) * 60 * 1000 +
                59 * 1000
            );

          await prisma.festivalOccurrence.upsert({
            where: {
              occasionId_year: {
                occasionId: occasion.id,
                year,
              },
            },
            update: {
              eventDate: resolution.eventDate,
              displayStart,
              displayEnd,
            },
            create: {
              occasionId: occasion.id,
              year,
              eventDate: resolution.eventDate,
              displayStart,
              displayEnd,
              source:
                resolution.confidence === "OBSERVATION_DEPENDENT"
                  ? "OBSERVATION_DEPENDENT"
                  : "CALENDAR_ENGINE",
            },
          });
        }
      }
    }
    ensuredYears.add(year);
  } catch (err) {
    console.error(`[OccasionEngine] Error ensuring occurrences for year ${year}:`, err);
  }
}

/**
 * Automatically resolves the active festival(s) for the given date.
 * If 2 or more festivals are active simultaneously (e.g. Janmashtami + Teachers' Day),
 * it intelligently MERGES them into a combined festive celebration showcase!
 */
export async function getActiveOccasion(
  currentDate?: Date
): Promise<ActiveOccasionResult | null> {
  const target = currentDate || new Date();
  const cacheKey = target.toISOString().split("T")[0]; // YYYY-MM-DD

  // Check cache only in non-mocked runtime
  if (!currentDate) {
    const cached = memoryCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.result;
    }
  }

  try {
    const year = target.getUTCFullYear();
    const month = target.getUTCMonth();

    // Ensure occurrences exist for current year
    await ensureOccurrencesForYear(year);

    // Cross-year buffer for year transitions (Dec & Jan)
    if (month === 11) {
      await ensureOccurrencesForYear(year + 1);
    } else if (month === 0) {
      await ensureOccurrencesForYear(year - 1);
    }

    // Query active occurrences whose display window covers target date
    const candidates = await prisma.festivalOccurrence.findMany({
      where: {
        displayStart: { lte: target },
        displayEnd: { gte: target },
        occasion: { active: true },
      },
      include: {
        occasion: {
          include: {
            cakes: {
              where: { cake: { available: true } },
              include: {
                cake: {
                  include: {
                    prices: { orderBy: { price: "asc" } },
                  },
                },
              },
              take: 4,
            },
          },
        },
      },
      orderBy: {
        occasion: {
          priority: "desc",
        },
      },
    });

    // Filter candidates that have at least 1 available cake
    const validCandidates = candidates.filter(
      (c) => c.occasion.cakes && c.occasion.cakes.length > 0
    );

    if (validCandidates.length === 0) {
      if (!currentDate) memoryCache.set(cacheKey, { timestamp: Date.now(), result: null });
      return null;
    }

    // CASE 1: Exactly 1 festival is active
    if (validCandidates.length === 1) {
      const single = validCandidates[0];
      const cakes = single.occasion.cakes.map((co) => ({
        ...co.cake,
        occasionName: single.occasion.name,
        occasionBadge: single.occasion.badgeText,
      }));

      const finalResult: ActiveOccasionResult = {
        occasion: single.occasion,
        occurrence: single,
        cakes,
        isMerged: false,
      };

      if (!currentDate) memoryCache.set(cacheKey, { timestamp: Date.now(), result: finalResult });
      return finalResult;
    }

    // CASE 2: 2 or more festivals are active simultaneously -> SMART MERGE!
    const mergedOccasions = validCandidates.map((c) => ({
      id: c.occasion.id,
      name: c.occasion.name,
      slug: c.occasion.slug,
      badgeText: c.occasion.badgeText,
      accentColor: c.occasion.accentColor,
    }));

    // Interleave top cakes from all active festivals
    const mergedCakesMap = new Map<string, CakeWithPrices>();
    for (const candidate of validCandidates) {
      for (const co of candidate.occasion.cakes.slice(0, 2)) {
        if (!mergedCakesMap.has(co.cake.id)) {
          mergedCakesMap.set(co.cake.id, {
            ...co.cake,
            occasionName: candidate.occasion.name,
            occasionBadge: candidate.occasion.badgeText,
          });
        }
      }
    }
    const mergedCakes = Array.from(mergedCakesMap.values()).slice(0, 4);

    const primary = validCandidates[0].occasion;
    const combinedName = validCandidates.map((c) => c.occasion.name).join(" & ");
    const combinedBadges = validCandidates
      .map((c) => c.occasion.badgeText || c.occasion.name.toUpperCase())
      .join(" • ");

    const mergedOccasion: Occasion = {
      ...primary,
      id: "merged-festivals",
      name: combinedName,
      badgeText: `✨ FESTIVE SPECIAL: ${combinedBadges}`,
      description: `Celebrate ${validCandidates.map((c) => c.occasion.name).join(" & ")} with our handcrafted eggless festive cake collections.`,
      accentColor: "#D4AF37", // Royal Gold theme for merged celebrations
    };

    const finalResult: ActiveOccasionResult = {
      occasion: mergedOccasion,
      occurrence: validCandidates[0],
      cakes: mergedCakes,
      isMerged: true,
      mergedOccasions,
    };

    if (!currentDate) memoryCache.set(cacheKey, { timestamp: Date.now(), result: finalResult });
    return finalResult;
  } catch (err) {
    console.error("[OccasionEngine] Error resolving active occasion:", err);
    return null;
  }
}

/**
 * Retrieves a single occasion by slug along with all available cakes for the collection page
 */
export async function getOccasionBySlug(slug: string) {
  try {
    const occasion = await prisma.occasion.findUnique({
      where: { slug },
      include: {
        cakes: {
          where: {
            cake: { available: true },
          },
          include: {
            cake: {
              include: {
                prices: {
                  orderBy: { price: "asc" },
                },
                category: true,
              },
            },
          },
        },
      },
    });

    if (!occasion || !occasion.active) return null;

    const cakes = occasion.cakes.map((co) => co.cake);
    return {
      occasion,
      cakes,
    };
  } catch (err) {
    console.error(`[OccasionEngine] Error fetching occasion "${slug}":`, err);
    return null;
  }
}
