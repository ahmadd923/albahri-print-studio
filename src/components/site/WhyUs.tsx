import { Award, Zap, Tag, Palette, Building, Heart } from "lucide-react";

const points = [
  { icon: Award, title: "High-Quality Printing", desc: "Crisp, durable prints that don't fade or crack." },
  { icon: Zap, title: "Fast Service", desc: "Quick turnaround without compromising quality." },
  { icon: Tag, title: "Affordable Prices", desc: "Honest local pricing for any budget." },
  { icon: Palette, title: "Custom Designs", desc: "Bring any idea to life — we'll print it." },
  { icon: Building, title: "Personal & Business", desc: "Perfect for individuals, schools and companies." },
  { icon: Heart, title: "Friendly Local Service", desc: "Real people who care about every order." },
];

export function WhyUs() {
  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Why choose us</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold">Why Choose Al Bahri</h2>
          <p className="mt-3 text-primary-foreground/70">A local printing partner you can rely on.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <div key={p.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:border-gold/40 hover:bg-white/10 transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-gold text-primary mb-4">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-semibold">{p.title}</h3>
              <p className="mt-1.5 text-sm text-primary-foreground/75">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
