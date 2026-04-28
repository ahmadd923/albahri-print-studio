import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS, waLink } from "./constants";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.93a8.16 8.16 0 0 0 4.77 1.52V7a4.83 4.83 0 0 1-1.84-.31z"/>
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-gold">
              <Printer className="h-5 w-5 text-primary" />
            </span>
            <span className="font-display text-xl font-bold">{BUSINESS.name}</span>
          </div>
          <p className="text-sm text-primary-foreground/70 leading-relaxed">
            {BUSINESS.tagline}. Quality custom printing for individuals, businesses, schools, and events.
          </p>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold mb-4 text-gold">Quick Links</h4>
          <ul className="space-y-2 text-sm text-primary-foreground/80">
            <li><Link to="/" className="hover:text-gold transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-gold transition">About</Link></li>
            <li><Link to="/services" className="hover:text-gold transition">Services</Link></li>
            <li><Link to="/gallery" className="hover:text-gold transition">Gallery</Link></li>
            <li><Link to="/contact" className="hover:text-gold transition">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold mb-4 text-gold">Contact</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2"><Phone className="h-4 w-4 mt-0.5 text-gold" /> {BUSINESS.phoneDisplay}</li>
            <li className="flex items-start gap-2"><Mail className="h-4 w-4 mt-0.5 text-gold" /> {BUSINESS.email}</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-gold" /> {BUSINESS.location}</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-base font-semibold mb-4 text-gold">Follow Us</h4>
          <div className="flex gap-3 mb-5">
            <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-gold hover:text-primary transition"><Facebook className="h-5 w-5" /></a>
            <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-gold hover:text-primary transition"><Instagram className="h-5 w-5" /></a>
            <a href="#" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-gold hover:text-primary transition"><TikTokIcon className="h-5 w-5" /></a>
          </div>
          <Button asChild variant="whatsapp" className="w-full">
            <a href={waLink()} target="_blank" rel="noreferrer">Order on WhatsApp</a>
          </Button>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
      </div>
    </footer>
  );
}
