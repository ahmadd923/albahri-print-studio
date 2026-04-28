import { MessageCircle } from "lucide-react";
import { openWhatsApp, waLink } from "./constants";

export function StickyWhatsApp() {
  return (
    <a
      href={waLink()}
      onClick={(e) => { e.preventDefault(); openWhatsApp(); }}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-elegant hover:scale-110 transition-transform animate-float"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute inline-flex h-full w-full rounded-full bg-whatsapp opacity-30 animate-ping" />
    </a>
  );
}
