import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

interface CacheStore {
  categories: { data: any; timestamp: number } | null;
  cakes: { data: any; timestamp: number } | null;
  featuredCakes: { data: any; timestamp: number } | null;
  settings: { data: any; timestamp: number } | null;
  whatsappSetting: { data: any; timestamp: number } | null;
  cakeBySlug: Map<string, { data: any; timestamp: number }>;
  occasionBySlug: Map<string, { data: any; timestamp: number }>;
  apiQueryCache: Map<string, { data: any; timestamp: number }>;
}

const globalForCache = global as unknown as {
  appMemoryStore?: CacheStore;
};

if (!globalForCache.appMemoryStore) {
  globalForCache.appMemoryStore = {
    categories: null,
    cakes: null,
    featuredCakes: null,
    settings: null,
    whatsappSetting: null,
    cakeBySlug: new Map(),
    occasionBySlug: new Map(),
    apiQueryCache: new Map(),
  };
}

const memoryStore = globalForCache.appMemoryStore;

const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes in-memory TTL

const pendingCakes = new Map<string, Promise<any>>();
const pendingOccasions = new Map<string, Promise<any>>();

/**
 * Purges all cached server data immediately and triggers Next.js revalidation
 */
export function invalidateAppCache() {
  memoryStore.categories = null;
  memoryStore.cakes = null;
  memoryStore.featuredCakes = null;
  memoryStore.settings = null;
  memoryStore.whatsappSetting = null;
  memoryStore.cakeBySlug.clear();
  memoryStore.occasionBySlug.clear();
  memoryStore.apiQueryCache.clear();
  pendingCakes.clear();
  pendingOccasions.clear();

  try {
    revalidatePath("/menu");
    revalidatePath("/menu/cakes");
    revalidatePath("/menu/cake/[slug]", "page");
    revalidatePath("/menu/occasion/[slug]", "page");
    revalidatePath("/admin");
    revalidatePath("/admin/settings");
    revalidatePath("/admin/cakes");
  } catch (e) {
    // Ignore outside request context
  }
}

/**
 * Generic in-memory cache helper for API routes & custom queries (bounded with finite TTL)
 */
export async function getCachedApiQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlMs = DEFAULT_TTL_MS
): Promise<T> {
  const now = Date.now();
  const cached = memoryStore.apiQueryCache.get(key);
  if (cached && now - cached.timestamp < ttlMs) {
    return cached.data as T;
  }

  // Security guard: Bound cache size to max 100 entries to prevent memory exhaustion
  if (memoryStore.apiQueryCache.size >= 100) {
    memoryStore.apiQueryCache.forEach((v, k) => {
      if (now - v.timestamp >= ttlMs) {
        memoryStore.apiQueryCache.delete(k);
      }
    });
    if (memoryStore.apiQueryCache.size >= 100) {
      let evicted = 0;
      memoryStore.apiQueryCache.forEach((_, k) => {
        if (evicted < 20) {
          memoryStore.apiQueryCache.delete(k);
          evicted++;
        }
      });
    }
  }

  const data = await fetcher();
  memoryStore.apiQueryCache.set(key, { data, timestamp: now });
  return data;
}

/**
 * Superfast in-memory cached categories
 */
export async function getCachedCategories() {
  const now = Date.now();
  if (memoryStore.categories && now - memoryStore.categories.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.categories.data;
  }
  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { displayOrder: "asc" },
  });
  memoryStore.categories = { data: categories, timestamp: now };
  return categories;
}

/**
 * Superfast in-memory cached top featured cakes (for homepage)
 */
export async function getCachedFeaturedCakes() {
  const now = Date.now();
  if (memoryStore.featuredCakes && now - memoryStore.featuredCakes.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.featuredCakes.data;
  }
  const cakes = await prisma.cake.findMany({
    where: {
      available: true,
      productType: "CAKE",
      NOT: [
        { slug: { contains: "test", mode: "insensitive" } },
        { name: { contains: "test", mode: "insensitive" } },
      ],
    },
    include: {
      category: true,
      prices: {
        orderBy: { price: "asc" },
      },
    },
    orderBy: [{ featured: "desc" }, { bestseller: "desc" }, { createdAt: "desc" }],
    take: 6,
  });
  memoryStore.featuredCakes = { data: cakes, timestamp: now };
  return cakes;
}

/**
 * Superfast in-memory cached all available cakes (Normal Cake Menu)
 */
export async function getCachedAllCakes() {
  const now = Date.now();
  if (memoryStore.cakes && now - memoryStore.cakes.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.cakes.data;
  }
  const cakes = await prisma.cake.findMany({
    where: {
      available: true,
      productType: "CAKE",
      NOT: [
        { slug: { contains: "test", mode: "insensitive" } },
        { name: { contains: "test", mode: "insensitive" } },
      ],
    },
    include: {
      category: true,
      prices: {
        orderBy: { price: "asc" },
      },
    },
    orderBy: [{ featured: "desc" }, { bestseller: "desc" }, { createdAt: "desc" }],
  });
  memoryStore.cakes = { data: cakes, timestamp: now };
  // Pre-populate individual cake lookups so single cake detail navigation is instant
  for (const cake of cakes) {
    if (cake.slug) {
      memoryStore.cakeBySlug.set(cake.slug, { data: cake, timestamp: now });
      memoryStore.cakeBySlug.set(cake.slug.toLowerCase(), { data: cake, timestamp: now });
    }
    if (cake.id) {
      memoryStore.cakeBySlug.set(cake.id, { data: cake, timestamp: now });
    }
  }
  return cakes;
}

/**
 * Authoritative database website settings cached in global memory
 */
export async function getCachedWebsiteSettings() {
  const now = Date.now();
  if (memoryStore.settings && now - memoryStore.settings.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.settings.data;
  }
  let settings = await prisma.websiteSetting.findUnique({
    where: { id: "default" },
  });
  if (!settings) {
    settings = await prisma.websiteSetting.create({
      data: { id: "default" },
    });
  }
  memoryStore.settings = { data: settings, timestamp: now };
  return settings;
}

/**
 * Authoritative database whatsapp settings cached in global memory
 */
export async function getCachedWhatsAppSetting() {
  const now = Date.now();
  if (memoryStore.whatsappSetting && now - memoryStore.whatsappSetting.timestamp < DEFAULT_TTL_MS) {
    return memoryStore.whatsappSetting.data;
  }
  let whatsappSetting = await prisma.whatsAppSetting.findUnique({
    where: { id: "default" },
  });
  if (!whatsappSetting) {
    whatsappSetting = await prisma.whatsAppSetting.create({
      data: { id: "default" },
    });
  }
  memoryStore.whatsappSetting = { data: whatsappSetting, timestamp: now };
  return whatsappSetting;
}

/**
 * Superfast in-memory cached single cake by slug or ID
 */
export async function getCachedCake(slugOrId: string) {
  if (!slugOrId) return null;
  const now = Date.now();
  const rawKey = slugOrId.trim();
  const lowerKey = rawKey.toLowerCase();

  // 1. Check direct hit in cakeBySlug
  const cached = memoryStore.cakeBySlug.get(rawKey) || memoryStore.cakeBySlug.get(lowerKey);
  if (cached && now - cached.timestamp < DEFAULT_TTL_MS) {
    return cached.data;
  }

  // 2. Check if cakes are already cached in memory
  if (memoryStore.cakes && now - memoryStore.cakes.timestamp < DEFAULT_TTL_MS) {
    const found = memoryStore.cakes.data.find(
      (c: any) => c.slug === rawKey || c.slug?.toLowerCase() === lowerKey || c.id === rawKey
    );
    if (found) {
      memoryStore.cakeBySlug.set(rawKey, { data: found, timestamp: now });
      if (found.slug) memoryStore.cakeBySlug.set(found.slug, { data: found, timestamp: now });
      if (found.id) memoryStore.cakeBySlug.set(found.id, { data: found, timestamp: now });
      return found;
    }
  }

  // 3. Deduplicate parallel requests (generateMetadata + Page)
  if (pendingCakes.has(lowerKey)) {
    return pendingCakes.get(lowerKey);
  }

  const promise = (async () => {
    try {
      const cake = await prisma.cake.findFirst({
        where: {
          OR: [{ slug: rawKey }, { id: rawKey }, { slug: lowerKey }],
          available: true,
          productType: "CAKE",
          NOT: [
            { slug: { contains: "test", mode: "insensitive" } },
            { name: { contains: "test", mode: "insensitive" } },
          ],
        },
        include: {
          category: true,
          prices: { orderBy: { price: "asc" } },
        },
      });
      if (cake) {
        memoryStore.cakeBySlug.set(cake.slug, { data: cake, timestamp: Date.now() });
        memoryStore.cakeBySlug.set(cake.slug.toLowerCase(), { data: cake, timestamp: Date.now() });
        memoryStore.cakeBySlug.set(cake.id, { data: cake, timestamp: Date.now() });
      }
      return cake;
    } finally {
      pendingCakes.delete(lowerKey);
    }
  })();

  pendingCakes.set(lowerKey, promise);
  return promise;
}

/**
 * Targeted in-memory cached related cakes (same category, max 3, minimal fields)
 */
export async function getCachedRelatedCakes(categoryId: string, excludeCakeId: string) {
  if (!categoryId) return [];
  const cacheKey = `rel_${categoryId}_${excludeCakeId}`;
  return await getCachedApiQuery(
    cacheKey,
    async () => {
      return await prisma.cake.findMany({
        where: {
          categoryId,
          id: { not: excludeCakeId },
          available: true,
          productType: "CAKE",
          NOT: [
            { slug: { contains: "test", mode: "insensitive" } },
            { name: { contains: "test", mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          slug: true,
          name: true,
          coverImage: true,
          prices: {
            select: { price: true },
            orderBy: { price: "asc" },
            take: 1,
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
        orderBy: [{ featured: "desc" }, { bestseller: "desc" }, { createdAt: "desc" }],
        take: 3,
      });
    },
    DEFAULT_TTL_MS
  );
}

/**
 * Superfast in-memory cached occasion by slug
 */
export async function getCachedOccasion(slug: string) {
  if (!slug) return null;
  const now = Date.now();
  const normalizedSlug = slug.toLowerCase().trim();

  // 1. Direct cache hit
  const cached = memoryStore.occasionBySlug.get(normalizedSlug) || memoryStore.occasionBySlug.get(slug);
  if (cached && now - cached.timestamp < DEFAULT_TTL_MS) {
    return cached.data;
  }

  // 2. Deduplicate simultaneous requests (generateMetadata + OccasionPage)
  if (pendingOccasions.has(normalizedSlug)) {
    return pendingOccasions.get(normalizedSlug);
  }

  const promise = (async () => {
    try {
      const occasion = await (prisma as any).occasion.findFirst({
        where: {
          OR: [
            { slug: { equals: normalizedSlug, mode: "insensitive" } },
            { id: slug },
            { calendarKey: { equals: normalizedSlug.replace(/-/g, "_"), mode: "insensitive" } },
          ],
          active: true,
        },
        include: {
          occurrences: true,
          categories: {
            where: { active: true },
            orderBy: { displayOrder: "asc" },
            include: {
              cakes: {
                where: { cake: { available: true } },
                orderBy: { displayOrder: "asc" },
                include: {
                  cake: {
                    include: {
                      category: true,
                      prices: { orderBy: { price: "asc" } },
                    },
                  },
                },
              },
            },
          },
          cakes: {
            where: {
              cake: { available: true, productType: "CAKE" },
            },
            include: {
              cake: {
                include: {
                  category: true,
                  prices: {
                    orderBy: { price: "asc" },
                  },
                },
              },
            },
          },
        },
      });

      if (occasion) {
        const entry = { data: occasion, timestamp: Date.now() };
        memoryStore.occasionBySlug.set(normalizedSlug, entry);
        if (occasion.slug) {
          memoryStore.occasionBySlug.set(occasion.slug, entry);
          memoryStore.occasionBySlug.set(occasion.slug.toLowerCase(), entry);
        }
        if (occasion.id) {
          memoryStore.occasionBySlug.set(occasion.id, entry);
        }
        if (occasion.calendarKey) {
          memoryStore.occasionBySlug.set(occasion.calendarKey.toLowerCase(), entry);
          memoryStore.occasionBySlug.set(occasion.calendarKey.replace(/_/g, "-").toLowerCase(), entry);
        }
      }
      return occasion;
    } finally {
      pendingOccasions.delete(normalizedSlug);
    }
  })();

  pendingOccasions.set(normalizedSlug, promise);
  return promise;
}

/**
 * Asynchronously preloads an active occasion into memory so user navigation has zero delay
 */
export async function warmActiveOccasion(slug?: string) {
  if (!slug) return;
  const normalized = slug.toLowerCase().trim();
  if (memoryStore.occasionBySlug.has(normalized)) return;
  // Non-blocking background fetch
  getCachedOccasion(normalized).catch(() => {});
}
