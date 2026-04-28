import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Printer, ShoppingCart, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { waLink } from "./constants";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/shop", label: "Shop" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { count } = useCart();
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

        <div className="hidden md:flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link to="/cart" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-primary">
                  {count}
                </span>
              )}
            </Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="ghost" size="sm">
              <Link to="/admin"><LayoutDashboard className="h-4 w-4" /> Admin Dashboard</Link>
            </Button>
          )}
          {user ? (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/account"><UserIcon className="h-4 w-4" /> Account</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                <LogOut className="h-4 w-4" /> Sign out
              </Button>
            </>
          ) : (
            <Button asChild variant="hero" size="sm">
              <Link to="/login">Sign in</Link>
            </Button>
          )}
          <Button asChild variant="whatsapp" size="sm">
            <a href={waLink()} target="_blank" rel="noopener noreferrer">WhatsApp</a>
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
            <Link to="/cart" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
              Cart {count > 0 && <span className="ml-1 text-gold font-bold">({count})</span>}
            </Link>
            {isAdmin && (
              <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                Admin Dashboard
              </Link>
            )}
            {user ? (
              <>
                <Link to="/account" onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary">
                  My Account
                </Link>
                <Button variant="outline" className="mt-2" onClick={() => { signOut(); setOpen(false); }}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button asChild variant="hero" className="mt-2">
                <Link to="/login" onClick={() => setOpen(false)}>Sign in / Sign up</Link>
              </Button>
            )}
            <Button asChild variant="whatsapp" className="mt-2">
              <a href={waLink()} onClick={() => setOpen(false)} target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
