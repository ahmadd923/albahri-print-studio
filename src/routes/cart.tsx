import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Al Bahri" }] }),
  component: CartPage,
});

function CartPage() {
  const { items, remove, update, total, clear } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
        <h1 className="font-display text-2xl font-bold text-primary">Your cart is empty</h1>
        <p className="text-muted-foreground mt-2">Browse our products and start building your order.</p>
        <Button asChild variant="hero" size="lg" className="mt-6">
          <Link to="/shop">Go to shop</Link>
        </Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-primary mb-6">Your order</h1>
      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        <ul className="space-y-3">
          {items.map((it) => (
            <li key={it.id} className="rounded-xl border bg-card p-4 flex gap-4">
              <div className="h-20 w-20 rounded-md bg-secondary/40 overflow-hidden shrink-0">
                {it.image_url && <img src={it.image_url} alt={it.product_name} className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-primary">{it.product_name}</h3>
                  <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {[it.size, it.color, it.printing_details].filter(Boolean).join(" · ") || "—"}
                </p>
                {it.design_url && (
                  <a href={it.design_url} target="_blank" rel="noreferrer" className="text-xs text-gold hover:underline">View uploaded design</a>
                )}
                <div className="flex items-center justify-between mt-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Qty</span>
                    <Input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => update(it.id, { quantity: Math.max(1, Number(e.target.value)) })}
                      className="h-8 w-20"
                    />
                  </div>
                  <div className="font-display font-bold text-gold">{(it.unit_price * it.quantity).toFixed(2)} ILS</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="rounded-2xl border bg-card p-6 h-fit shadow-soft space-y-4">
          <h2 className="font-display text-lg font-bold text-primary">Summary</h2>
          <div className="flex justify-between text-sm"><span>Items</span><span>{items.length}</span></div>
          <div className="flex justify-between font-display text-xl font-bold text-primary border-t pt-3">
            <span>Total</span><span className="text-gold">{total.toFixed(2)} ILS</span>
          </div>
          <Button variant="hero" size="lg" className="w-full" onClick={() => navigate({ to: "/checkout" })}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="w-full" onClick={clear}>Clear cart</Button>
          <p className="text-xs text-muted-foreground text-center">Final price confirmed by Al Bahri after review.</p>
        </aside>
      </div>
    </section>
  );
}