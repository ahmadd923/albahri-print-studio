import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import img from "@/assets/gallery-printing.jpg";

const bullets = [
  "Custom printing for individuals & businesses",
  "Schools, teams, events and gifts",
  "Premium materials, lasting prints",
];

export function AboutSection() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative">
          <div className="absolute -inset-3 bg-gradient-gold rounded-3xl blur-2xl opacity-20" />
          <img src={img} alt="Printing in action at Al Bahri" loading="lazy" className="relative rounded-2xl shadow-elegant w-full h-auto" />
        </div>
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">About Al Bahri</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary">Local Printing, Done with Care</h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Al Bahri is a local custom printing shop offering high-quality printing for shirts, cups,
            mugs, bags, hoodies, uniforms, gifts and promotional items. We help individuals, businesses,
            schools, teams and event organizers turn ideas into beautifully printed products.
          </p>
          <ul className="mt-6 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-3 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-gold mt-0.5" /> {b}
              </li>
            ))}
          </ul>
          <Button asChild variant="default" className="mt-8">
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
