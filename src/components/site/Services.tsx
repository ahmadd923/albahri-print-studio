import { Shirt, Coffee, ShoppingBag, Briefcase, Gift, Building2, Users, Sparkles } from "lucide-react";

const services = [
  { icon: Shirt, title: "T-Shirt Printing", desc: "Vibrant prints on premium cotton tees in any size or color." },
  { icon: Coffee, title: "Cup & Mug Printing", desc: "Personalized mugs that turn coffee into a memory." },
  { icon: ShoppingBag, title: "Bag Printing", desc: "Tote bags, backpacks and pouches with your custom design." },
  { icon: Sparkles, title: "Hoodie Printing", desc: "Cozy hoodies with crisp logos for teams and crews." },
  { icon: Briefcase, title: "Uniform Printing", desc: "Professional uniforms branded for your business." },
  { icon: Gift, title: "Gift Printing", desc: "Thoughtful personalized gifts for any occasion." },
  { icon: Building2, title: "Business Logo Printing", desc: "Elevate your brand across promotional products." },
  { icon: Users, title: "Event & Team Printing", desc: "Matching merch for events, schools and sports teams." },
];

export function Services({ heading = true }: { heading?: boolean }) {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {heading && (
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">What we offer</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary">Our Printing Services</h2>
            <p className="mt-3 text-muted-foreground">Quality custom printing on everything you can imagine.</p>
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div
              key={s.title}
              className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-elegant hover:border-gold/40"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-gold shadow-gold mb-4 group-hover:scale-110 transition">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-primary">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
