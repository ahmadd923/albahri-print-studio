import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-products.jpg";
import { waLink } from "./constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: "radial-gradient(circle at 20% 20%, white 0, transparent 40%), radial-gradient(circle at 80% 70%, white 0, transparent 40%)"
      }} />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/5 px-3 py-1 text-xs font-medium text-gold backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Local Custom Printing in Palestine
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight">
            Custom Printing <span className="text-gold">Made Easy</span>
          </h1>
          <p className="mt-5 text-lg text-primary-foreground/80 max-w-xl leading-relaxed">
            Print your logo, name, or design on shirts, cups, bags, gifts, and more.
            Fast turnaround, premium finish, friendly local service.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="xl" variant="hero">
              <a href={waLink()} target="_blank" rel="noreferrer">
                <MessageCircle className="h-5 w-5" /> Order on WhatsApp
              </a>
            </Button>
            <Button asChild size="xl" variant="outlineLight">
              <Link to="/services">View Services <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-primary-foreground/70">
            <div><span className="block text-2xl font-bold text-gold font-display">500+</span>Happy Clients</div>
            <div className="h-10 w-px bg-white/20" />
            <div><span className="block text-2xl font-bold text-gold font-display">48h</span>Fast Delivery</div>
            <div className="h-10 w-px bg-white/20" />
            <div><span className="block text-2xl font-bold text-gold font-display">100%</span>Custom</div>
          </div>
        </div>
        <div className="relative animate-fade-up" style={{ animationDelay: "0.15s" }}>
          <div className="absolute -inset-4 bg-gradient-gold rounded-3xl blur-2xl opacity-25" />
          <img
            src={heroImg}
            alt="Custom printed shirts, mugs, bags and hoodies by Al Bahri"
            width={1600}
            height={1100}
            className="relative rounded-2xl shadow-elegant w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
}
