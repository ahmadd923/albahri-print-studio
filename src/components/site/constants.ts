export const BUSINESS = {
  name: "Al Bahri",
  tagline: "Custom Printing Services",
  phoneDisplay: "+970 59 000 0000",
  whatsappNumber: "970590000000",
  email: "info@albahri-printing.com",
  location: "Palestine",
};

export const waLink = (msg = "Hello Al Bahri, I'd like to place a custom printing order.") =>
  `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(msg)}`;
