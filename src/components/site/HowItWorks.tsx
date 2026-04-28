import { Upload, Package, CheckCircle2, Truck } from "lucide-react";

const steps = [
  { icon: Upload, title: "Send Your Design", desc: "Share your logo or design through WhatsApp." },
  { icon: Package, title: "Choose the Product", desc: "Pick shirts, mugs, bags, hoodies and more." },
  { icon: CheckCircle2, title: "Confirm Details", desc: "We confirm quantity, colors and final preview." },
  { icon: Truck, title: "Receive Your Order", desc: "We print and deliver — quick and clean." },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">Simple process</span>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary">How It Works</h2>
          <p className="mt-3 text-muted-foreground">From idea to printed product in four easy steps.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-4 relative">
          {steps.map((s, i) => (
            <div key={s.title} className="relative text-center">
              <div className="mx-auto relative flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-elegant">
                <s.icon className="h-8 w-8" />
                <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-primary text-sm font-bold font-display">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-primary">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
