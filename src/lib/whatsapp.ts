export interface WhatsAppMessageParams {
  cakeName: string;
  slug?: string;
  weight?: string;
  price?: number | string;
  restaurantName?: string;
  template?: string;
  whatsappNumber?: string;
  customMessage?: string;
  flavour?: string | null;
  customizationInfo?: string | null;
  occasion?: string | null;
  imageUrl?: string | null;
  cakeUrl?: string | null;
}

export const SEPARATOR = "━━━━━━━━━━━━━━━━━━";
export const PRODUCTION_APP_URL = "https://ramansweetbakery.vercel.app";

/**
 * Formats a price number or string into Indian currency notation (e.g. 1499 -> "1,499")
 */
export function formatIndianPrice(amount: number | string): string {
  if (amount === undefined || amount === null || amount === "") return "";
  const num =
    typeof amount === "number"
      ? amount
      : parseFloat(String(amount).replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return String(amount).trim();
  return num.toLocaleString("en-IN");
}

/**
 * Normalizes weight display (e.g. "1kg" -> "1 kg", "0.5kg" -> "0.5 kg")
 */
export function normalizeWeight(rawWeight?: string | null): string {
  if (!rawWeight || typeof rawWeight !== "string") return "";
  const trimmed = rawWeight.trim();
  return trimmed.replace(/^([\d.]+)\s*(kg|g|gm|gms|pound|pounds|lbs?)$/i, "$1 $2");
}

/**
 * Cleans user-entered custom message (normalizes whitespace, limits length, trims)
 */
export function sanitizeCustomMessage(rawMsg?: string | null): string {
  if (!rawMsg || typeof rawMsg !== "string") return "";
  const normalized = rawMsg.trim().replace(/\s+/g, " ");
  // Disallow placeholder or null strings
  if (
    normalized === "null" ||
    normalized === "undefined" ||
    normalized.toLowerCase() === "n/a"
  ) {
    return "";
  }
  return normalized.slice(0, 100);
}

/**
 * Checks if a template is one of the legacy unstyled defaults
 */
function isLegacyTemplate(tmpl?: string | null): boolean {
  if (!tmpl || typeof tmpl !== "string") return true;
  const trimmed = tmpl.trim();
  if (trimmed.includes("🎂 NEW CAKE ENQUIRY")) return false;
  return (
    trimmed.startsWith("Hello") &&
    (trimmed.includes("I would like to enquire about:") ||
      trimmed.includes("I would like to order / enquire about:"))
  );
}

/**
 * Builds the premium, scannable WhatsApp cake enquiry message.
 * Strict rule: Never show fields with no real value (no undefined, null, empty strings, or placeholder data).
 */
export function buildCakeEnquiryMessage(params: WhatsAppMessageParams): string {
  const brandName = (params.restaurantName || "Raman Sweet Bakery").trim();
  const cakeName = (params.cakeName || "Artisanal Cake").trim();
  const weight = normalizeWeight(params.weight);
  const formattedPrice =
    params.price !== undefined && params.price !== null
      ? formatIndianPrice(params.price)
      : "";

  const sections: string[] = [];

  // 1. Header block
  sections.push(
    `🎂 NEW CAKE ENQUIRY\n\n${SEPARATOR}\n\n${brandName}\n100% Eggless • Pure Vegetarian`
  );

  // 2. Cake
  if (cakeName && cakeName !== "null" && cakeName !== "undefined") {
    sections.push(`🍰 Cake\n${cakeName}`);
  }

  // 3. Selected Weight
  if (weight && weight !== "null" && weight !== "undefined") {
    sections.push(`⚖️ Selected Weight\n${weight}`);
  }

  // 4. Price
  if (formattedPrice) {
    sections.push(`💰 Price\n₹${formattedPrice}`);
  }

  // 5. Custom Message (optional)
  const customMessage = sanitizeCustomMessage(params.customMessage);
  if (customMessage) {
    sections.push(`📝 Custom Message\n${customMessage}`);
  }

  // 6. Customization (optional)
  const customization = params.customizationInfo?.trim();
  if (
    customization &&
    customization !== "null" &&
    customization !== "undefined" &&
    customization.toLowerCase() !== "n/a"
  ) {
    sections.push(`✨ Customization\n${customization}`);
  }

  // 7. Occasion (optional)
  const occasion = params.occasion?.trim();
  if (
    occasion &&
    occasion !== "null" &&
    occasion !== "undefined" &&
    occasion.toLowerCase() !== "n/a"
  ) {
    sections.push(`📅 Occasion\n${occasion}`);
  }

  // 8. Cake Photo (optional public production URL)
  let photoUrl = params.imageUrl?.trim();
  if (photoUrl && photoUrl !== "null" && photoUrl !== "undefined") {
    if (photoUrl.startsWith("/")) {
      photoUrl = `${PRODUCTION_APP_URL}${photoUrl}`;
    }
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      // Normalize any localhost or sweetdelights domain to production domain
      photoUrl = photoUrl
        .replace(/https?:\/\/localhost(:\d+)?/g, PRODUCTION_APP_URL)
        .replace(/https?:\/\/(www\.)?sweetdelights\.com/g, PRODUCTION_APP_URL);

      sections.push(`🖼️ Cake Photo\n${photoUrl}`);
    }
  }

  // 9. Cake Details URL (optional production URL)
  let cakeUrl = params.cakeUrl?.trim();
  if (!cakeUrl && params.slug) {
    cakeUrl = `${PRODUCTION_APP_URL}/menu/cake/${encodeURIComponent(params.slug.trim())}`;
  }
  if (cakeUrl && cakeUrl !== "null" && cakeUrl !== "undefined") {
    // Normalize any localhost or sweetdelights domain to production domain
    cakeUrl = cakeUrl
      .replace(/https?:\/\/localhost(:\d+)?/g, PRODUCTION_APP_URL)
      .replace(/https?:\/\/(www\.)?sweetdelights\.com/g, PRODUCTION_APP_URL);

    sections.push(`🔗 Cake Details\n${cakeUrl}`);
  }

  // 10. Footer block
  return `${sections.join("\n\n")}\n\n${SEPARATOR}\n\nPlease confirm availability and order details.`;
}

/**
 * Normalizes any user-entered phone/WhatsApp number to valid international digits.
 * Automatically handles:
 * - 10-digit Indian numbers (e.g. "9708366583" -> "919708366583")
 * - 11-digit zero-prefixed numbers (e.g. "09708366583" -> "919708366583")
 * - Plus-prefixed numbers (e.g. "+91 97083 66583" -> "919708366583")
 * - International numbers (e.g. "+1 (555) 123-4567" -> "15551234567")
 */
export function normalizeWhatsAppNumber(raw?: string | null): string {
  if (!raw || typeof raw !== "string") return "919876543210";
  let digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return "919876543210";
  // If user entered 10-digit Indian mobile number (e.g. 9876543210)
  if (digits.length === 10 && /^[6-9]/.test(digits)) {
    return `91${digits}`;
  }
  // If user entered 11 digits starting with 0 (e.g. 09876543210)
  if (digits.length === 11 && digits.startsWith("0")) {
    return `91${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Generates the complete wa.me link with encoded prefilled text.
 */
export function generateWhatsAppLink(params: WhatsAppMessageParams): string {
  const cleanNumber = normalizeWhatsAppNumber(params.whatsappNumber);
  const message = buildCakeEnquiryMessage(params);
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function generateGeneralWhatsAppLink(
  whatsappNumber: string = "919876543210",
  restaurantName: string = "Raman Sweet Bakery"
): string {
  const cleanNumber = normalizeWhatsAppNumber(whatsappNumber);
  const message = `Hello ${restaurantName},\n\nI am browsing your Digital Cake Menu and would like to enquire about your cakes.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

