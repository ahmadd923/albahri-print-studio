import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { useCart } from "@/lib/cart";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My account — Al Bahri" }] }),
  component: AccountPage,
});

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_estimated: number;
  customer_name: string;
  customer_phone: string;
  notes: string | null;
};
type OrderItem = {
  id: string; order_id: string; product_id: string | null; product_name: string;
  unit_price: number; quantity: number; size: string | null; color: string | null;
  printing_details: string | null; design_url: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  new: "New", in_progress: "In Progress", ready: "Ready", delivered: "Delivered", cancelled: "Cancelled",
};

function AccountPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const { add } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/login" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name || "");
      setPhone(profile.phone || "");
    }
  }, [profile]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: o } = await supabase
        .from("orders")
        .select("id, created_at, status, total_estimated, customer_name, customer_phone, notes")
        .order("created_at", { ascending: false });
      setOrders(o ?? []);
      const ids = (o ?? []).map((x) => x.id);
      if (ids.length) {
        const { data: it } = await supabase.from("order_items").select("*").in("order_id", ids);
        setItems((it ?? []) as OrderItem[]);
      }
    })();
  }, [user]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ full_name: name, phone }).eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    await refreshProfile();
    toast.success("Profile updated");
  };

  const reorder = (orderId: string) => {
    const its = items.filter((i) => i.order_id === orderId);
    its.forEach((it) =>
      add({
        product_id: it.product_id ?? "",
        product_name: it.product_name,
        unit_price: Number(it.unit_price),
        quantity: it.quantity,
        size: it.size ?? undefined,
        color: it.color ?? undefined,
        printing_details: it.printing_details ?? undefined,
        design_url: it.design_url ?? undefined,
      })
    );
    toast.success("Items added to cart");
    navigate({ to: "/cart" });
  };

  if (loading || !user) return <div className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">Loading…</div>;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-primary mb-6">My account</h1>
      <Tabs defaultValue="orders">
        <TabsList>
          <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>
        <TabsContent value="orders" className="mt-6">
          {orders.length === 0 ? (
            <p className="text-muted-foreground">No orders yet. <Link to="/shop" className="text-primary hover:underline">Browse the shop</Link>.</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((o) => {
                const its = items.filter((i) => i.order_id === o.id);
                return (
                  <li key={o.id} className="rounded-xl border bg-card p-5 shadow-soft">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">#{o.id.slice(0, 8)}</span>
                          <Badge variant="secondary">{STATUS_LABEL[o.status] ?? o.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{new Date(o.created_at).toLocaleString()}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-lg font-bold text-gold">{Number(o.total_estimated).toFixed(2)} ILS</div>
                        <Button size="sm" variant="outline" className="mt-2" onClick={() => reorder(o.id)}>Reorder</Button>
                      </div>
                    </div>
                    <ul className="mt-3 text-sm text-muted-foreground space-y-1">
                      {its.map((it) => (
                        <li key={it.id}>
                          {it.quantity}× <span className="text-foreground">{it.product_name}</span>
                          {it.size ? ` · ${it.size}` : ""}{it.color ? ` · ${it.color}` : ""}{it.printing_details ? ` · ${it.printing_details}` : ""}
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              })}
            </ul>
          )}
        </TabsContent>
        <TabsContent value="profile" className="mt-6">
          <form onSubmit={saveProfile} className="rounded-2xl border bg-card p-6 shadow-soft space-y-4 max-w-xl">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile?.email ?? user.email ?? ""} disabled />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} maxLength={30} />
            </div>
            <Button type="submit" variant="hero" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
          </form>
        </TabsContent>
      </Tabs>
    </section>
  );
}