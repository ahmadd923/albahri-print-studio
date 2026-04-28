import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { buildOrderMessage, buildOrderWaLink } from "@/lib/order-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { MessageCircle } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Al Bahri" }] }),
  component: CheckoutPage,
});

const schema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  customer_phone: z.string().trim().min(6).max(30),
  notes: z.string().trim().max(1000).optional().default(""),
});

function CheckoutPage() {
  const { user, profile, loading } = useAuth();
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  if (!loading && !user) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold text-primary">Sign in to place your order</h1>
        <p className="text-muted-foreground mt-2">Your cart is saved. Sign in or create an account to continue.</p>
        <div className="mt-5 flex gap-2 justify-center">
          <Button asChild variant="hero"><Link to="/login">Sign in</Link></Button>
          <Button asChild variant="outline"><Link to="/signup">Create account</Link></Button>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="mx-auto max-w-md px-4 py-16 text-center">
        <p className="text-muted-foreground">Your cart is empty.</p>
        <Button asChild variant="hero" className="mt-4"><Link to="/shop">Go to shop</Link></Button>
      </section>
    );
  }

  const currentOrderMessage = buildOrderMessage({
    customerName: name,
    customerPhone: phone,
    items,
    notes,
    total,
  });

  const saveOrder = async (data: z.infer<typeof schema>) => {
    if (!user) return;
    const parsed = schema.safeParse({ customer_name: name, customer_phone: phone, notes });
    setSubmitting(true);

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        notes: data.notes || null,
        total_estimated: total,
        status: "new",
      })
      .select("id")
      .single();

    if (error || !order) {
      setSubmitting(false);
      return toast.error(error?.message ?? "Failed to save order");
    }

    const itemRows = items.map((it) => ({
      order_id: order.id,
      product_id: it.product_id,
      product_name: it.product_name,
      unit_price: it.unit_price,
      quantity: it.quantity,
      size: it.size ?? null,
      color: it.color ?? null,
      printing_details: it.printing_details ?? null,
      design_url: it.design_url ?? null,
    }));
    const { error: itemsErr } = await supabase.from("order_items").insert(itemRows);
    if (itemsErr) {
      setSubmitting(false);
      return toast.error(itemsErr.message);
    }

    // Save profile name/phone too
    await supabase.from("profiles").update({ full_name: data.customer_name, phone: data.customer_phone }).eq("id", user.id);

    clear();
    toast.success("Order saved and WhatsApp opened.");
    navigate({ to: "/account" });
  };

  const onWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!user || submitting) {
      e.preventDefault();
      return;
    }
    const parsed = schema.safeParse({ customer_name: name, customer_phone: phone, notes });
    if (!parsed.success) {
      e.preventDefault();
      toast.error(parsed.error.issues[0].message);
      return;
    }
    toast.success("Opening WhatsApp and saving your order…");
    void saveOrder(parsed.data);
  };

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-primary mb-6">Order summary</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4 rounded-2xl border bg-card p-6 shadow-soft">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Your name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={80} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required maxLength={30} placeholder="+970…" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea id="notes" rows={3} maxLength={1000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Deadline, delivery preferences…" />
          </div>
          <Button asChild variant="whatsapp" size="lg" className="w-full" aria-disabled={submitting}>
            <a href={buildOrderWaLink(currentOrderMessage)} target="_blank" rel="noopener noreferrer" onClick={onWhatsAppClick}>
              <MessageCircle className="h-5 w-5" /> {submitting ? "Sending…" : "Send Order on WhatsApp"}
            </a>
          </Button>
          <p className="text-xs text-muted-foreground text-center">Your order is saved in your account before sending.</p>
        </form>
        <aside className="rounded-2xl border bg-card p-6 h-fit shadow-soft space-y-3">
          <h2 className="font-display text-lg font-bold text-primary">Items</h2>
          <ul className="space-y-2 text-sm">
            {items.map((it) => (
              <li key={it.id} className="flex justify-between gap-2">
                <span className="truncate">{it.quantity}× {it.product_name}{it.size ? ` (${it.size})` : ""}{it.color ? ` ${it.color}` : ""}</span>
                <span className="font-medium whitespace-nowrap">{(it.unit_price * it.quantity).toFixed(2)} ILS</span>
              </li>
            ))}
          </ul>
          <div className="border-t pt-3 flex justify-between font-display text-xl font-bold text-primary">
            <span>Total</span><span className="text-gold">{total.toFixed(2)} ILS</span>
          </div>
        </aside>
      </div>
    </section>
  );
}