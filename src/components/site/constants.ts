export const BUSINESS = {
  name: "Al Bahri",
  tagline: "Custom Printing Services",
  phoneDisplay: "+970 56 955 5252",
  whatsappNumber: "970569555252",
  email: "info@albahri-printing.com",
  location: "Palestine",
};

export const waLink = (msg = "Hello Al Bahri, I'd like to place a custom printing order.") =>
  `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(msg)}`;
