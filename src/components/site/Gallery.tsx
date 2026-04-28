import shirts from "@/assets/gallery-shirts.jpg";
import mugs from "@/assets/gallery-mugs.jpg";
import bags from "@/assets/gallery-bags.jpg";
import hoodies from "@/assets/gallery-hoodies.jpg";
import gifts from "@/assets/gallery-gifts.jpg";
import uniforms from "@/assets/gallery-uniforms.jpg";
import printing from "@/assets/gallery-printing.jpg";
import hero from "@/assets/hero-products.jpg";

const items = [
  { src: shirts, label: "Printed T-Shirts" },
  { src: mugs, label: "Custom Mugs" },
  { src: bags, label: "Tote Bags" },
  { src: hoodies, label: "Branded Hoodies" },
  { src: uniforms, label: "Work Uniforms" },
  { src: gifts, label: "Promotional Gifts" },
  { src: printing, label: "Logo Printing" },
  { src: hero, label: "Brand Merchandise" },
];

export function Gallery({ heading = true }: { heading?: boolean }) {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {heading && (
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold uppercase tracking-widest text-gold">Our work</span>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-primary">Gallery</h2>
            <p className="mt-3 text-muted-foreground">A glimpse of recent custom prints we've delivered.</p>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <figure key={it.label} className="group relative overflow-hidden rounded-2xl bg-card shadow-soft">
              <img
                src={it.src}
                alt={it.label}
                loading="lazy"
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/90 to-transparent p-4 text-sm font-medium text-primary-foreground translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition">
                {it.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
