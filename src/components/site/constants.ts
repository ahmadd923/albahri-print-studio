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
