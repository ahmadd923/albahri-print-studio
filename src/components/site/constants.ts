export const BUSINESS = {
  name: "Al Bahri",
  tagline: "Custom Printing Services",
  phoneDisplay: "+970 59 000 0000",
  whatsappNumber: "970590000000",
  email: "info@albahri-printing.com",
  location: "Palestine",
};

export const DEFAULT_WHATSAPP_MESSAGE = "Hello Al Bahri, I want to place an order.";

export const cleanWhatsAppNumber = (phone = BUSINESS.whatsappNumber) => phone.replace(/\D/g, "");

export const waLink = (msg = DEFAULT_WHATSAPP_MESSAGE) =>
  `https://wa.me/${cleanWhatsAppNumber()}?text=${encodeURIComponent(msg)}`;

export const waFallbackLink = (msg = DEFAULT_WHATSAPP_MESSAGE) =>
  `https://api.whatsapp.com/send?phone=${cleanWhatsAppNumber()}&text=${encodeURIComponent(msg)}`;

export function openWhatsApp(msg = DEFAULT_WHATSAPP_MESSAGE) {
  const features = "noopener,noreferrer";
  try {
    const opened = window.open(waLink(msg), "_blank", features);
    if (!opened) window.open(waFallbackLink(msg), "_blank", features);
  } catch {
    window.open(waFallbackLink(msg), "_blank", features);
  }
}
