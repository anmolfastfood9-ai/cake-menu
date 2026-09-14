export type BudgetFilterId =
  | "all"
  | "under-700"
  | "under-1000"
  | "1000-1500"
  | "premium";

export const BUDGET_OPTIONS: { id: BudgetFilterId; label: string }[] = [
  { id: "all", label: "All Prices" },
  { id: "under-700", label: "Under ₹700" },
  { id: "under-1000", label: "Under ₹1000" },
  { id: "1000-1500", label: "₹1000–₹1500" },
  { id: "premium", label: "Premium" },
];

/**
 * Returns the true minimum available price tier for a cake (Starting Price).
 */
export function getCakeStartingPrice(cake: any): number {
  const valid = (cake.prices || []).filter(
    (p: any) => typeof p.price === "number" && !isNaN(p.price) && p.price > 0
  );
  if (valid.length === 0) return 999;
  return Math.min(...valid.map((p: any) => p.price));
}

/**
 * Evaluates whether a cake falls into the given budget bucket based on Starting Price.
 * Exact rules:
 * - under-700: starting price < 700
 * - under-1000: starting price >= 700 AND < 1000
 * - 1000-1500: starting price >= 1000 AND <= 1500
 * - premium: starting price > 1500
 */
export function matchesBudget(cake: any, budget: BudgetFilterId): boolean {
  if (budget === "all") return true;
  const valid = (cake.prices || []).filter(
    (p: any) => typeof p.price === "number" && !isNaN(p.price) && p.price > 0
  );
  if (valid.length === 0) return false;
  const startingPrice = Math.min(...valid.map((p: any) => p.price));
  if (budget === "under-700") return startingPrice < 700;
  if (budget === "under-1000") return startingPrice >= 700 && startingPrice < 1000;
  if (budget === "1000-1500") return startingPrice >= 1000 && startingPrice <= 1500;
  if (budget === "premium") return startingPrice > 1500;
  return true;
}

/**
 * Normalizes weight terms and spacing for accurate search comparison.
 * e.g. "1 kilograms" -> "1 kg", "1kg" -> "1 kg", "250g" -> "250 g", "250 grams" -> "250 g"
 */
export function normalizeSearchTerm(str: string): string {
  return (str || "")
    .toLowerCase()
    .replace(/kilograms?/g, "kg")
    .replace(/grams?/g, "g")
    .replace(/gms?/g, "g")
    .replace(/(\d+)\s*(kg|g)/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Smart search matching supporting:
 * - Cake name
 * - Description
 * - Category name
 * - Weight tiers (e.g. "1 kg", "1kg", "250 g", "250g", "0.5 kg")
 * - Flavour terms present in name / description (e.g. "chocolate", "red velvet", "pineapple", "biscoff", "vanilla")
 */
export function matchesSmartSearch(cake: any, rawQuery: string): boolean {
  const q = rawQuery.toLowerCase().trim();
  if (!q) return true;

  const normQuery = normalizeSearchTerm(q);
  const nameNorm = normalizeSearchTerm(cake.name);
  const descNorm = normalizeSearchTerm(cake.description || "");
  const catNorm = normalizeSearchTerm(cake.category?.name || "");

  // 1. Direct text match on cake name, description, or category
  if (
    nameNorm.includes(normQuery) ||
    descNorm.includes(normQuery) ||
    catNorm.includes(normQuery)
  ) {
    return true;
  }

  // 2. Weight tier matching
  const prices = cake.prices || [];
  const matchesWeight = prices.some((p: any) => {
    const wNorm = normalizeSearchTerm(p.weight || "");
    return (
      wNorm === normQuery ||
      wNorm.includes(normQuery) ||
      normQuery.includes(wNorm)
    );
  });
  if (matchesWeight) return true;

  // 3. Multi-word token matching (all tokens must match either text or weight)
  const tokens = normQuery.split(" ").filter(Boolean);
  if (tokens.length > 1) {
    const fullText = `${nameNorm} ${descNorm} ${catNorm}`;
    const allTokensMatch = tokens.every((token) => {
      const inText = fullText.includes(token);
      const inWeights = prices.some((p: any) =>
        normalizeSearchTerm(p.weight || "").includes(token)
      );
      return inText || inWeights;
    });
    if (allTokensMatch) return true;
  }

  return false;
}
