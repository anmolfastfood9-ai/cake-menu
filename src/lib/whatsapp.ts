export interface WhatsAppMessageParams {
  cakeName: string;
  weight?: string;
  price?: number;
  restaurantName?: string;
  template?: string;
  whatsappNumber?: string;
  customMessage?: string;
}

export function generateWhatsAppLink({
  cakeName,
  weight,
  price,
  restaurantName = "Raman Sweet Cake",
  template,
  whatsappNumber = "919876543210",
  customMessage,
}: WhatsAppMessageParams): string {
  // Clean phone number (remove +, spaces, hyphens)
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");

  const customMsgLine = customMessage && customMessage.trim() ? `\n*Message on Cake:* "${customMessage.trim()}"` : "";

  let message = "";
  if (template) {
    message = template
      .replace(/{cake_name}/g, cakeName || "Artisanal Cake")
      .replace(/{weight}/g, weight || "1 kg")
      .replace(/{price}/g, price ? price.toLocaleString("en-IN") : "Enquire")
      .replace(/{restaurant_name}/g, restaurantName);
    if (customMsgLine) {
      message += `\n${customMsgLine}`;
    }
  } else {
    message = `Hello ${restaurantName},\n\n🍰 I would like to order / enquire about:\n*Cake:* ${cakeName}\n*Weight:* ${weight || "1 kg"}\n*Price:* ₹${price ? price.toLocaleString("en-IN") : "Enquire"}${customMsgLine}\n\n*100% Pure Vegetarian / Eggless*\nPlease confirm availability & delivery time.`;
  }

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
}

export function generateGeneralWhatsAppLink(whatsappNumber: string = "919876543210", restaurantName: string = "Raman Sweet Cake"): string {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
  const message = `Hello ${restaurantName}, I am browsing your Digital Cake Menu and would like to enquire about your cakes.`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}
