import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waLink } from "./constants";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-gold shadow-gold">
            <Printer className="h-5 w-5 text-primary" />
          </span>
          <span className="font-display text-xl font-bold text-primary tracking-tight">
            Al Bahri
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-semibold" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild variant="whatsapp" size="sm">
            <a href={waLink()} target="_blank" rel="noreferrer">Order on WhatsApp</a>
          </Button>
        </div>

        <button
          className="md:hidden p-2 text-primary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="flex flex-col p-4 gap-1">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {n.label}
              </Link>
            ))}
            <Button asChild variant="whatsapp" className="mt-2">
              <a href={waLink()} target="_blank" rel="noreferrer">Order on WhatsApp</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
