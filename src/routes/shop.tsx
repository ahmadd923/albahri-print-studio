import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Al Bahri Custom Printing" },
      { name: "description", content: "Browse printable products: t-shirts, hoodies, mugs, bags, uniforms, gifts and more." },
    ],
  }),
  component: ShopPage,
});

type Category = { id: string; name: string; slug: string };
type Product = { id: string; name: string; description: string | null; price: number; image_url: string | null; category_id: string | null; stock: number };

function ShopPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: c }, { data: p }] = await Promise.all([
        supabase.from("product_categories").select("id, name, slug").order("sort_order"),
        supabase.from("products").select("id, name, description, price, image_url, category_id, stock").eq("is_active", true).order("created_at", { ascending: false }),
      ]);
      setCats(c ?? []);
      setProducts(p ?? []);
      setLoading(false);
    })();
  }, []);

  const visible = active ? products.filter((p) => p.category_id === active) : products;

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-primary">Shop</h1>
        <p className="text-muted-foreground mt-2">Pick a product, customize, and send the order on WhatsApp.</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        <Button variant={active === null ? "hero" : "outline"} size="sm" onClick={() => setActive(null)}>All</Button>
        {cats.map((c) => (
          <Button key={c.id} variant={active === c.id ? "hero" : "outline"} size="sm" onClick={() => setActive(c.id)}>
            {c.name}
          </Button>
        ))}
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-72 rounded-xl" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="text-muted-foreground">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((p) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="group rounded-2xl border bg-card overflow-hidden shadow-soft hover:shadow-elegant transition">
              <div className="aspect-square bg-secondary/40 overflow-hidden">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-primary">{p.name}</h3>
                  <span className="font-display font-bold text-gold whitespace-nowrap">{Number(p.price).toFixed(2)} ILS</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{p.description}</p>
                {p.stock <= 0 && <Badge variant="destructive" className="mt-2">Out of stock</Badge>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}